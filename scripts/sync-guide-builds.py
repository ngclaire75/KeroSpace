"""Refresh KeroSpace's saved builds and team icons: the safety net behind the live data.

Run: python3 scripts/sync-guide-builds.py https://kerospace.vercel.app

Pages show live guide data. When a guide site is down, slow, or its new layout parses into
something wrong, the API shows these saved copies instead. This command refuses anything that
looks broken: a build that fails the API's quality check, loses a section it had, or shrinks
sharply keeps its previous saved copy. It is an explicit maintenance command, never part of
production builds.
"""
import concurrent.futures
import json
from pathlib import Path
import sys
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000').rstrip('/')
GAMES = ['hsr', 'genshin', 'hi3', 'wuwa', 'nte', 'mlbb']
BUILDS = ROOT / 'data/guideBuildSnapshots.json'
ICONS = ROOT / 'data/guideTeamIcons.json'
# A build that keeps less than this share of its previous items is treated as a broken parse.
MIN_KEPT = 0.6


def fetch(url, timeout=90):
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={'User-Agent': 'KeroSpace/1.0'}), timeout=timeout) as response:
                return response.read()
        except Exception as error:
            last = error
    raise last


def api(path, **query):
    return json.loads(fetch(f'{BASE}{path}?{urlencode(query)}'))


def item_count(build):
    return sum(len(group['items']) for group in build['builds'][0]['groups'])


def accept(new, old):
    """Return (build to save, reason the new one was refused or None)."""
    if not new or new.get('status') != 'available' or new.get('provisional') or new.get('rejected') or not new.get('builds'):
        return old, (new or {}).get('rejected') or (new or {}).get('status') or 'no response'
    if old:
        labels = {group['label'] for group in new['builds'][0]['groups']}
        lost = [group['label'] for group in old['builds'][0]['groups'] if group['label'] not in labels]
        if lost:
            return old, f'lost {", ".join(lost)}'
        if item_count(new) < item_count(old) * MIN_KEPT:
            return old, f'shrank from {item_count(old)} to {item_count(new)} items'
    return new, None


def catalogue(game):
    titles, cursor = [], ''
    for _ in range(40):
        query = {'game': game, 'kind': 'characters', **({'cursor': cursor} if cursor else {})}
        result = api('/api/game-catalog', **query)
        if result.get('status') != 'available':
            raise RuntimeError(f'{game}: catalogue unavailable')
        titles += [item['title'] for item in result['items']]
        cursor = result.get('next')
        if not cursor:
            break
    return list(dict.fromkeys(titles))


def main():
    previous = json.loads(BUILDS.read_text()) if BUILDS.exists() else {}
    previous_icons = json.loads(ICONS.read_text()) if ICONS.exists() else {}
    builds, icons, refused = {}, {}, []

    for game in GAMES:
        old_game = previous.get(game, {})
        try:
            titles = catalogue(game)
        except Exception as error:
            print(f'{game}: {error}; keeping all {len(old_game)} saved builds')
            builds[game], icons[game] = old_game, previous_icons.get(game, {})
            continue
        # Characters that left the catalogue keep their saved build: nothing is ever deleted.
        titles = list(dict.fromkeys(titles + list(old_game)))

        def load(title):
            try:
                return title, api('/api/character-build', game=game, title=title, fresh='1')
            except Exception:
                return title, None

        builds[game] = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            for title, new in pool.map(load, titles):
                saved, reason = accept(new, old_game.get(title))
                if saved:
                    builds[game][title] = saved
                if reason and old_game.get(title):
                    refused.append(f'{game} / {title}: kept saved build ({reason})')

        # Role icons for every teammate named in the saved builds.
        names = sorted({option['name'] for build in builds[game].values() for team in build.get('teams') or [] for slot in team['slots'] for option in slot['options']})
        icons[game] = dict(previous_icons.get(game, {}))
        for start in range(0, len(names), 40):
            try:
                result = api('/api/team-icons', game=game, titles='|'.join(names[start:start + 40]), fresh='1')
                icons[game].update({name: value for name, value in result.items() if value})
            except Exception as error:
                print(f'{game}: team icons unavailable for a batch ({error}); keeping saved ones')
        print(f'{game}: {len(builds[game])} builds, {len(icons[game])} teammate icon sets')

    BUILDS.write_text(json.dumps(builds, ensure_ascii=False, separators=(',', ':')) + '\n')
    ICONS.write_text(json.dumps(icons, ensure_ascii=False, separators=(',', ':')) + '\n')
    for line in refused:
        print(line)


if __name__ == '__main__':
    main()
