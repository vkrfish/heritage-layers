# Dirtylane Font Directory

Place your custom `Dirtylane.woff2` or `Dirtylane.ttf` font file in this directory (`public/fonts/`).

The `@font-face` rule is configured in `src/styles.css`:
```css
@font-face {
  font-family: 'Dirtylane';
  src: url('/fonts/Dirtylane.woff2') format('woff2'),
       url('/fonts/Dirtylane.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```
Until `Dirtylane.woff2` or `Dirtylane.ttf` is added, the system automatically falls back to `Dancing Script` (loaded from Google Fonts).
