#!/bin/bash
# caveman — statusline badge script for Claude Code
# Reads caveman + ants flag files and outputs a colored badge.
#
# Usage in ~/.claude/settings.json:
#   "statusLine": { "type": "command", "command": "bash /path/to/caveman-statusline.sh" }

CAVE_FLAG="$HOME/.claude/.caveman-active"
ANTS_FLAG="$HOME/.claude/.ants-active"

CAVE_ON=0
ANTS_ON=0
CAVE_MODE=""
ANTS_MODE=""

if [ -f "$CAVE_FLAG" ]; then
  CAVE_MODE=$(cat "$CAVE_FLAG" 2>/dev/null)
  [ -n "$CAVE_MODE" ] && CAVE_ON=1
fi
if [ -f "$ANTS_FLAG" ]; then
  ANTS_MODE=$(cat "$ANTS_FLAG" 2>/dev/null)
  [ -n "$ANTS_MODE" ] && ANTS_ON=1
fi

[ "$CAVE_ON" = "0" ] && [ "$ANTS_ON" = "0" ] && exit 0

render_cave() {
  if [ "$CAVE_MODE" = "full" ] || [ -z "$CAVE_MODE" ]; then echo "CAVEMAN"
  else echo "CAVEMAN:$(echo "$CAVE_MODE" | tr '[:lower:]' '[:upper:]')"; fi
}
render_ants() {
  if [ "$ANTS_MODE" = "full" ] || [ -z "$ANTS_MODE" ]; then echo "ANTS"
  else echo "ANTS:$(echo "$ANTS_MODE" | tr '[:lower:]' '[:upper:]')"; fi
}

if [ "$CAVE_ON" = "1" ] && [ "$ANTS_ON" = "1" ]; then
  printf '\033[38;5;172m[%s|%s]\033[0m' "$(render_cave)" "$(render_ants)"
elif [ "$CAVE_ON" = "1" ]; then
  printf '\033[38;5;172m[%s]\033[0m' "$(render_cave)"
else
  printf '\033[38;5;208m[%s]\033[0m' "$(render_ants)"
fi
