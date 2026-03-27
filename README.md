# Fake Screen Saver

A Chrome extension that displays a full-screen fake screen saver with a fake password lock screen. For developers who want to grab a coffee without locking their screen, but still need to look compliant when IT security walks by.

## Features

- **5 Screen Savers**
  - **Floating Text** - Bouncing text with customizable colors
  - **Matrix Rain** - Classic green digital rain with adjustable speed
  - **Fireworks** - Colorful explosive bursts
  - **Starfield** - Flying through space
  - **DVD Logo** - Bouncing logo that changes color on corner hits

- **Fake Lock Screen** - When you move the mouse or press a key, a realistic-looking password prompt appears. Any password unlocks it.

- **True Full-Screen** - Hides the entire browser UI for an authentic screen saver experience.

## Installation

### From Chrome Web Store

*Coming soon*

### Manual Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/omrico/fake-screen-saver.git
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable **Developer mode** (toggle in the top-right corner)

4. Click **Load unpacked**

5. Select the `fake-screen-saver` folder

6. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. Select a screen saver from the list
3. Configure options (text, colors, speed) if available
4. Toggle the fake password prompt on/off
5. Click **Activate Screen Saver**
6. Click anywhere on the start screen to enter full-screen mode
7. Move your mouse or press any key to trigger the lock screen (or exit)
8. Press `ESC` to exit full-screen

### macOS Tip

On macOS, the menu bar may appear when you move your mouse to the top of the screen. To hide it completely:

1. Open **System Settings** > **Desktop & Dock**
2. Set **"Automatically hide and show the menu bar"** to **"Always"**

## Contributing

Contributions are welcome! Whether it's adding new screen savers, fixing bugs, or improving the UI.

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/omrico/fake-screen-saver.git
   cd fake-screen-saver
   ```

2. Load the extension in Chrome:
   - Go to `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the project folder

3. Make your changes. The extension uses vanilla HTML, CSS, and JavaScript with no build step required.

4. To see your changes:
   - For popup changes: Close and reopen the popup
   - For screen saver changes: Click the reload button on `chrome://extensions`

### Adding a New Screen Saver

1. Create a new file in `content/savers/` (e.g., `my-saver.js`)
2. Follow the existing pattern: export an object with `init(canvas, ctx, config)` and `draw(ctx, canvas)` functions
3. Register it in `window.FakeScreenSaverModules`
4. Add a `<script>` tag in `screensaver.html`
5. Add a radio option in `popup/popup.html`

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin my-new-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
