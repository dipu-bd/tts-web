# Text To Speech (Static Web)

A simple, mobile-friendly Text To Speech website using the Web Speech API. No build step. Deploy on GitHub Pages.

## Features
- Full-screen editor with small mobile text.
- Buttons: **Clear**, **Paste**, **Read**.
- During reading, the editor is disabled and a reader view appears.
- Active paragraph is highlighted. Click any paragraph to continue from there.
- Uses the Web Speech API (`speechSynthesis`).

## Quick Start
Open `index.html` in a modern Chromium-based browser. For clipboard paste to work, use HTTPS or localhost.

## Create a GitHub project and deploy to Pages

```bash
# 1) Create a new repo folder and copy files
REPO=tts-web
mkdir "$REPO" && cd "$REPO"
# Copy project files here, or unzip the provided archive into this folder

# 2) Initialize git
git init
git add .
git commit -m "init: tts-web static app"

# 3) Create GitHub repo and push (requires GitHub CLI: https://cli.github.com/)
gh repo create "$REPO" --public --source=. --remote=origin --push

# 4) Enable Pages via Actions (workflow included). First push triggers deploy.
#    After the workflow completes, visit the Pages URL shown in the Actions logs.
```

## Local testing
Just double-click `index.html` or serve with any static server:
```bash
python3 -m http.server 8000
```

## Notes
- Web Speech API support varies. Chrome and Edge recommended.
- Clipboard API needs HTTPS and user activation.
