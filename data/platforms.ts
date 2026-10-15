export const platformMarks = {
  windows: { label: 'PC', name: 'Windows PC', asset: 'windows.svg' },
  mac: { label: 'Mac', name: 'Mac with Apple silicon', asset: 'apple.svg' },
  ps5: { label: 'PS5', name: 'PlayStation 5', asset: 'playstation.svg' },
  xbox: { label: 'Xbox X/S', name: 'Xbox Series X/S', asset: 'xbox.png' },
  ios: { label: 'iOS', name: 'iOS / iPadOS', asset: 'apple.svg' },
  android: { label: 'Android', name: 'Android', asset: 'android.svg' },
  googleplay: { label: 'PC¹', name: 'Windows PC via Google Play Games; availability varies by region', asset: 'windows.svg' },
} as const

export type GamePlatform = keyof typeof platformMarks
