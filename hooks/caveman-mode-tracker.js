#!/usr/bin/env node
// caveman — UserPromptSubmit hook to track which caveman mode is active
// Inspects user input for /caveman + /ants commands and writes flag files.
//
// Two flag files maintained:
//   ~/.claude/.caveman-active  -> caveman intensity level
//   ~/.claude/.ants-active     -> ants reasoning-overlay level (or absent)

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getDefaultMode } = require('./caveman-config');

const claudeDir = path.join(os.homedir(), '.claude');
const cavemanFlag = path.join(claudeDir, '.caveman-active');
const antsFlag = path.join(claudeDir, '.ants-active');

const ANTS_LEVELS = new Set(['lite', 'full', 'ultra']);

function writeFlag(p, value) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, value);
}
function removeFlag(p) { try { fs.unlinkSync(p); } catch (e) {} }

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').trim().toLowerCase();

    // --- /caveman commands (existing behavior) ---
    if (prompt.startsWith('/caveman')) {
      const parts = prompt.split(/\s+/);
      const cmd = parts[0];
      const arg = parts[1] || '';

      let mode = null;
      if (cmd === '/caveman-commit') mode = 'commit';
      else if (cmd === '/caveman-review') mode = 'review';
      else if (cmd === '/caveman-compress' || cmd === '/caveman:caveman-compress') mode = 'compress';
      else if (cmd === '/caveman' || cmd === '/caveman:caveman') {
        if (arg === 'lite') mode = 'lite';
        else if (arg === 'ultra') mode = 'ultra';
        else if (arg === 'wenyan-lite') mode = 'wenyan-lite';
        else if (arg === 'wenyan' || arg === 'wenyan-full') mode = 'wenyan';
        else if (arg === 'wenyan-ultra') mode = 'wenyan-ultra';
        else mode = getDefaultMode();
      }

      if (mode && mode !== 'off') writeFlag(cavemanFlag, mode);
      else if (mode === 'off') removeFlag(cavemanFlag);
    }

    // --- /ants commands (reasoning overlay) ---
    if (prompt.startsWith('/ants')) {
      const parts = prompt.split(/\s+/);
      const arg = parts[1] || '';
      if (arg === 'off') {
        removeFlag(antsFlag);
      } else if (ANTS_LEVELS.has(arg)) {
        writeFlag(antsFlag, arg);
      } else {
        // bare /ants → default full
        writeFlag(antsFlag, 'full');
      }
    }

    // --- "ants in reasoning" / "ants thinking" natural-language triggers ---
    if (/\b(ants in reasoning|ants thinking|think in ants|ants mode)\b/i.test(prompt)) {
      writeFlag(antsFlag, 'full');
    }

    // --- Deactivators ---
    if (/\bstop ants\b/i.test(prompt)) {
      removeFlag(antsFlag);
    }
    if (/\b(stop caveman|normal mode)\b/i.test(prompt)) {
      removeFlag(cavemanFlag);
      removeFlag(antsFlag);
    }
  } catch (e) {
    // Silent fail
  }
});
