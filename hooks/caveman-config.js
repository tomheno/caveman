#!/usr/bin/env node
// caveman — shared configuration resolver
//
// Resolution order for default mode:
//   1. CAVEMAN_DEFAULT_MODE environment variable
//   2. Config file defaultMode field:
//      - $XDG_CONFIG_HOME/caveman/config.json (any platform, if set)
//      - ~/.config/caveman/config.json (macOS / Linux fallback)
//      - %APPDATA%\caveman\config.json (Windows fallback)
//   3. 'full'

const fs = require('fs');
const path = require('path');
const os = require('os');

const VALID_MODES = [
  'off', 'lite', 'full', 'ultra',
  'wenyan-lite', 'wenyan', 'wenyan-full', 'wenyan-ultra',
  'ants-lite', 'ants', 'ants-full', 'ants-ultra',
  'commit', 'review', 'compress'
];

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, 'caveman');
  }
  if (process.platform === 'win32') {
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'caveman'
    );
  }
  return path.join(os.homedir(), '.config', 'caveman');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getDefaultMode() {
  // 1. Environment variable (highest priority)
  const envMode = process.env.CAVEMAN_DEFAULT_MODE;
  if (envMode && VALID_MODES.includes(envMode.toLowerCase())) {
    return envMode.toLowerCase();
  }

  // 2. Config file
  try {
    const configPath = getConfigPath();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.defaultMode && VALID_MODES.includes(config.defaultMode.toLowerCase())) {
      return config.defaultMode.toLowerCase();
    }
  } catch (e) {
    // Config file doesn't exist or is invalid — fall through
  }

  // 3. Default
  return 'full';
}

const ANTS_LEVELS = new Set(['lite', 'full', 'ultra']);

function getAntsDefault() {
  // 1. Env var
  const envAnts = process.env.ANTS_DEFAULT;
  if (envAnts && (ANTS_LEVELS.has(envAnts.toLowerCase()) || envAnts.toLowerCase() === 'off')) {
    return envAnts.toLowerCase();
  }
  // 2. Config file antsDefault field
  try {
    const config = JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
    if (config.antsDefault) {
      const v = String(config.antsDefault).toLowerCase();
      if (ANTS_LEVELS.has(v) || v === 'off') return v;
    }
  } catch (e) { /* no file or invalid */ }
  // 3. Default: off (no overlay unless user opts in)
  return 'off';
}

module.exports = { getDefaultMode, getAntsDefault, getConfigDir, getConfigPath, VALID_MODES, ANTS_LEVELS };
