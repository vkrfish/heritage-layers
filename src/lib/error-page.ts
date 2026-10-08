export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load — 9 Stories & Co.</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 16px/1.5 "Chathura", system-ui, sans-serif; background: #F5E9D7; color: #4A2C20; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #FBF7F0; border-radius: 12px; border: 1px solid rgba(74, 44, 32, 0.15); }
      h1 { font-size: 1.75rem; margin: 0 0 0.5rem; color: #4A2C20; }
      p { color: rgba(74, 44, 32, 0.8); margin: 0 0 1.5rem; font-weight: bold; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.75rem 1.5rem; border-radius: 8px; font: inherit; font-weight: bold; cursor: pointer; text-decoration: none; border: 1px solid transparent; text-transform: uppercase; }
      .primary { background: #4A2C20; color: #FFFFFF; }
      .secondary { background: transparent; color: #4A2C20; border-color: #4A2C20; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
