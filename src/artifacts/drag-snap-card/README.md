# Drag Snap Card

Drag the card anywhere within its bounds — mouse or touch — and release.
GSAP animates it back to center with an elastic ease.

## What this validates

- **Unified pointer input.** Pointer Events (`pointerdown`/`pointermove`/
  `pointerup`) handle mouse and touch through one code path — no
  separate `touchstart`/`mousedown` branches. `touch-action: none` on the
  card stops the browser from also trying to scroll the page while
  dragging on a touchscreen.
- **GSAP lifecycle.** All tweens are created inside a `gsap.context()`
  scoped to the artifact's container. On unmount, `ctx.revert()` kills
  any in-flight tween (including the elastic snap-back) and reverts the
  inline transform GSAP applied — the card doesn't leak a running tween
  into a detached DOM node.
- **Repeated mount/unmount safety.** Because `PreviewFrame` unmounts this
  artifact whenever it scrolls off-screen, this exact cleanup path runs
  constantly during normal browsing — not just once when the tab closes.

## Configuration

| Key     | Type  | Default   |
| ------- | ----- | --------- |
| `color` | color | `#c2935f` |