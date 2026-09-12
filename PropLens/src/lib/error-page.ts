export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Server Error</title>
  </head>
  <body>
    <h1>Something went wrong</h1>
    <p>The page could not be rendered. Please try again.</p>
  </body>
</html>`;
}