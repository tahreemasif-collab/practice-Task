# Scanline — QR Code Generator

Turn any line of text or a URL into a scannable QR code, right in the browser — no server, no external API calls.

Built with plain **HTML, CSS, and JavaScript**, plus a small **self-contained QR encoding library** (`qrcode-lib.js`) included in this project.

## Features

- Generate a QR code from any text or URL
- Adjustable output size (200px–500px)
- Custom foreground and background colors
- Download the generated code as a PNG
- Works fully offline — the QR encoding happens in your browser, not on a server

## Screenshot

![QR Code Generator](screenshots/qr-generated.png)

*A QR code generated for `https://github.com` — scannable with any phone camera.*

## How to run

No build step or install needed — it's plain HTML/CSS/JS.

1. Download/unzip this folder.
2. Open `index.html` directly in any modern browser.
3. Type a link or text, choose a size/colors, and click **Generate QR code**.
4. Click **Download PNG** to save the image.

## File structure

```
04-qr-code-generator/
├── index.html         # Page structure, form, QR preview panel
├── style.css            # All styling (indigo/violet theme)
├── script.js             # Wires the form to the QR library, handles download
├── qrcode-lib.js          # Self-contained QR code encoder (draws to <canvas>)
└── screenshots/           # Preview image used in this README
```

## Notes

- **Why a bundled library instead of a CDN link?** Most QR tutorials pull in a QR library from a CDN. This version bundles its own small QR encoder (`qrcode-lib.js`) so the project works **completely offline** with no external requests — useful for local demos, restricted networks, or just understanding how QR encoding works under the hood.
- The encoder implements the real QR algorithm (Reed–Solomon error correction, byte-mode encoding, automatic version/size selection) — it was verified by generating codes and decoding them back with a QR reader to confirm correctness, not just visually checked.
- Error correction level is set to **M** (Medium, ~15% damage tolerance) by default. This can be changed in `script.js` (`QRErrorCorrectLevel.M` → `.L`, `.Q`, or `.H`) if you need a different tolerance/density trade-off.
