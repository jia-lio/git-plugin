#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const CLAUDE_COMMANDS_DIR = path.join(os.homedir(), ".claude", "commands");
const SOURCE_DIR = path.join(__dirname, "commands");

function install() {
  // Ensure ~/.claude/commands/ exists
  fs.mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });

  // Copy all skill files
  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(CLAUDE_COMMANDS_DIR, file);

    // Backup existing file
    if (fs.existsSync(dest)) {
      const backupPath = dest + ".backup";
      fs.copyFileSync(dest, backupPath);
      console.log(`  Backed up existing ${file} → ${file}.backup`);
    }

    fs.copyFileSync(src, dest);
    console.log(`  Installed ${file} → ~/.claude/commands/${file}`);
  }

  console.log("\n@jia-lio/claude-git-skill installed successfully.");
  console.log('Use "/git commit" or "/git push" in Claude Code.');
}

install();
