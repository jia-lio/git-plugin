#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const CLAUDE_COMMANDS_DIR = path.join(os.homedir(), ".claude", "commands");
const SOURCE_DIR = path.join(__dirname, "commands");

function uninstall() {
  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const dest = path.join(CLAUDE_COMMANDS_DIR, file);
    const backupPath = dest + ".backup";

    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
      console.log(`  Removed ~/.claude/commands/${file}`);
    }

    // Restore backup if exists
    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, dest);
      console.log(`  Restored ${file} from backup`);
    }
  }

  console.log("\n@jia-lio/claude-git-skill uninstalled.");
}

uninstall();
