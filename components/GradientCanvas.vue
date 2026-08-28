<script setup lang="ts">
/**
 * WebGL animated linear gradient — the "Recent Chats" card backdrop.
 * Angle: 70deg. Palette: Mokoto red  #df2531 -> #ff5a63 -> #7a0f16.
 * Falls back to a static CSS gradient when WebGL is unavailable or the
 * viewer prefers reduced motion.
 */
const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const CSS_FALLBACK =
  'linear-gradient(70deg, #101012 0%, #17181b 52%, #5c0f16 82%, #df2531 100%)'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;

// hash / value noise for a slow organic drift
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec3 ramp(float t){
  vec3 c0 = vec3(0.063, 0.063, 0.071); // #101012  near-black
  vec3 c1 = vec3(0.090, 0.094, 0.106); // #17181b  ink
  vec3 c2 = vec3(0.360, 0.059, 0.086); // #5c0f16  dark red
  vec3 c3 = vec3(0.874, 0.145, 0.192); // #df2531  accent
  t = clamp(t, 0.0, 1.0);
  // black dominates the first ~65%, red only blooms at the far end
  if (t < 0.65) return mix(c0, c1, smoothstep(0.0, 0.65, t));
  if (t < 0.86) return mix(c1, c2, smoothstep(0.65, 0.86, t));
  return mix(c2, c3, smoothstep(0.86, 1.0, t));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);

  // fixed 70deg projection axis
  float a = radians(70.0);
  vec2 dir = normalize(vec2(cos(a), sin(a)));
  float g = dot(vec2(uv.x * aspect, uv.y), dir) / max(aspect, 1.0);

  // animate: slide the ramp + warp it slightly with noise
  float drift = u_time * 0.06;
  float warp = noise(uv * 2.2 + vec2(drift, -drift)) * 0.18;
  float t = fract(g * 1.15 + drift + warp);
  // ping-pong so there is no hard seam
  t = abs(t * 2.0 - 1.0);

  vec3 col = ramp(t);

  // soft travelling ember — subtle, keeps the field mostly black
  vec2 c = vec2(0.32 + 0.30 * sin(u_time * 0.15), 0.30 + 0.12 * cos(u_time * 0.11));
  float hi = smoothstep(0.55, 0.0, distance(uv, c));
  col += hi * 0.06 * vec3(0.87, 0.15, 0.19);

  // gentle vignette to keep card text readable
  col *= 1.0 - 0.28 * distance(uv, vec2(0.5)) ;

  gl_FragColor = vec4(col, 1.0);
}
`

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let raf = 0
let ro: ResizeObserver | null = null
let start = 0
let uRes: WebGLUniformLocation | null = null
let uTime: WebGLUniformLocation | null = null

function compile(ctx: WebGLRenderingContext, type: number, src: string) {
  const sh = ctx.createShader(type)!
  ctx.shaderSource(sh, src)
  ctx.compileShader(sh)
  if (!ctx.getShaderParameter(sh, ctx.COMPILE_STATUS)) {
    console.warn('[GradientCanvas] shader error:', ctx.getShaderInfoLog(sh))
    ctx.deleteShader(sh)
    return null
  }
  return sh
}

function resize() {
  if (!gl || !canvas.value || !host.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const { clientWidth: w, clientHeight: h } = host.value
  canvas.value.width = Math.max(1, Math.round(w * dpr))
  canvas.value.height = Math.max(1, Math.round(h * dpr))
  gl.viewport(0, 0, canvas.value.width, canvas.value.height)
}

function frame(now: number) {
  if (!gl || !program) return
  if (!start) start = now
  resize()
  gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.uniform1f(uTime, (now - start) / 1000)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  raf = requestAnimationFrame(frame)
}

function init() {
  if (!canvas.value) return false
  const ctx =
    canvas.value.getContext('webgl', { antialias: true, alpha: false }) ||
    (canvas.value.getContext(
      'experimental-webgl',
    ) as WebGLRenderingContext | null)
  if (!ctx) return false
  gl = ctx

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return false

  program = gl.createProgram()!
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[GradientCanvas] link error:', gl.getProgramInfoLog(program))
    return false
  }
  gl.useProgram(program)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  // one oversized triangle covering the viewport
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  )
  const loc = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  uRes = gl.getUniformLocation(program, 'u_res')
  uTime = gl.getUniformLocation(program, 'u_time')
  return true
}

onMounted(() => {
  const reduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  if (!init()) {
    if (host.value) host.value.style.background = CSS_FALLBACK
    return
  }

  resize()
  ro = new ResizeObserver(() => {
    if (reduced) {
      // redraw a single static frame at the new size
      resize()
      if (gl && program) {
        gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.uniform1f(uTime, 6.0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
    }
  })
  if (host.value) ro.observe(host.value)

  canvas.value?.addEventListener(
    'webglcontextlost',
    (e) => {
      e.preventDefault()
      cancelAnimationFrame(raf)
    },
    { once: false },
  )

  if (reduced) {
    if (gl && program) {
      gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.uniform1f(uTime, 6.0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
  } else {
    raf = requestAnimationFrame(frame)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  const lose = gl?.getExtension('WEBGL_lose_context')
  lose?.loseContext()
  gl = null
  program = null
})
</script>

<template>
  <div ref="host" class="gradient-canvas" :style="{ background: CSS_FALLBACK }">
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.gradient-canvas,
.gradient-canvas canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
