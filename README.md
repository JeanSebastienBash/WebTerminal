# Ghost Terminal

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Terminal](https://img.shields.io/badge/Type-Web%20Terminal-orange.svg)

A real Linux terminal in your browser. Full bash profile, aliases, and environment variables loaded. Hostname and username masked for screencasts and demos.

## Features

- **Real bash shell** — Interactive PTY via `node-pty`
- **Full profile loading** — `.bashrc`, `.bash_profile`, `.bash_aliases` loaded automatically
- **Identity masking** — Fake username and hostname in prompt for privacy
- **xterm.js UI** — Modern, responsive terminal emulator
- **WebSocket** — Real-time bidirectional communication
- **Configurable** — Environment variables for customization

## Installation

```bash
git clone https://github.com/yourusername/ghost-terminal.git
cd ghost-terminal
npm install
```

## Configuration

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
FAKE_USERNAME=dev
FAKE_HOSTNAME=workstation
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Open your browser to `http://localhost:3000`

## How It Works

1. Browser connects via WebSocket
2. Server spawns a bash PTY with your home directory
3. Your bash profile is sourced (`.bashrc`, `.bash_profile`, `.bash_aliases`)
4. Prompt is overridden with masked identity
5. All commands execute in your real shell with full access to your environment

## Requirements

- Node.js >= 18.0.0
- Linux/macOS (for `node-pty` support)
- Bash shell

## Security Notes

⚠️ **This runs commands on your actual system.** Use with caution:
- Only run on trusted networks
- Consider adding authentication for production use
- Never expose publicly without security measures

## Project Structure

```
ghost-terminal/
├── src/
│   └── server.js          # Express + WebSocket server
├── public/
│   ├── lib/               # xterm.js bundles
│   └── index.html         # Terminal UI
├── .env.example          # Configuration template
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## License

MIT License — see [LICENSE](LICENSE) file
