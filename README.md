# @jia-lio/claude-git-skill

Claude Code git skill for game projects. Auto-detects engine and commits changes by category.

## Supported Engines

- **Unity**
- **Cocos Creator 2.x**
- **Cocos Creator 3.x**

## Install

```bash
npm install -g @jia-lio/claude-git-skill
```

Or install from GitHub:

```bash
npm install -g jia-lio/git-plugin
```

## Usage

In Claude Code:

- `/git commit` — Auto-classify and commit (code / UI assets / images / audio)
- `/git push` — Commit and push to remote

Also triggered by: "커밋", "커밋해", "푸쉬해"

## Categories

| Category | Unity | Cocos 3.x | Cocos 2.x |
|----------|-------|-----------|-----------|
| **Code** | `.cs` | `.ts`, `.js` | `.ts`, `.js` |
| **UI Assets** | `.prefab`, `.unity`, `.asset`, `.controller`, `.anim` | `.prefab`, `.scene`, `.anim`, `.animation`, `.mtl`, `.effect`, `.material` | `.prefab`, `.fire`, `.anim`, `.atlas`, `.fnt`, `.bmfont` |
| **Images** | `.png`, `.jpg`, `.psd`, `.svg` | `.png`, `.jpg`, `.psd`, `.svg`, `.webp` | `.png`, `.jpg`, `.psd`, `.svg`, `.webp` |
| **Audio** | `.mp3`, `.ogg`, `.wav`, `.flac` | `.mp3`, `.ogg`, `.wav`, `.flac` | `.mp3`, `.ogg`, `.wav`, `.flac` |

## Uninstall

```bash
npm uninstall -g @jia-lio/claude-git-skill
```

## License

MIT
