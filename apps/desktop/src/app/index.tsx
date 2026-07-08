// The app root is the contribution-driven shell: panes, titlebar/statusbar
// items, keybinds, palette commands, routes, and themes all register through
// the contribution registry (src/contrib) — core surfaces use the same calls
// plugins do. The wiring (gateway boot, sessions, streams) lives in
// ./contrib-wiring; pane/layout registration in ./contrib-controller.
export { ContribController as default } from './contrib-controller'
