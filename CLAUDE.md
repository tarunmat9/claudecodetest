# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Game rules

- The **computer always starts first** (plays O on the opening move of every game).
- The human player is always X.

## Architecture

This is a **single-file static web app**. All HTML, CSS, and JavaScript live inlined in `index.html` — there is no build step, no bundler, no package manager, and no separate asset files. Preserve this structure when making changes: do not split CSS into `styles.css` or JS into `game.js` unless explicitly asked.

Core game module inside `index.html` `<script>`:
- `board` — flat 9-element array indexed 0–8 (row-major) holding `'X'`, `'O'`, or `''`.
- `checkWinner(b)` / `WIN_LINES` — returns `{ winner, line }` or `null`; `'D'` denotes a draw.
- `pickComputerMove()` — dispatches on the `#difficulty` select: random (easy), win-then-block-then-random heuristic (medium), or full `minimax` (hard, unbeatable).
- `resetGame()` — triggers the computer's opening move via `setTimeout(computerMove, 500)` to honor the "computer starts first" rule. Any change to turn order must go through `resetGame` so both new-game and difficulty-change paths stay consistent.
- Turn gating uses the `humanTurn` and `gameOver` flags plus the `.disabled` class on cells; clicks are ignored unless `humanTurn && !gameOver`.

## Running & sharing

- Local: open `index.html` directly in a browser (no server needed).
- Hosted preview: `https://raw.githack.com/tarunmat9/claudecodetest/<branch>/index.html` serves the file from GitHub with a correct Content-Type.

## Branch convention

Development happens on `claude/tic-tac-toe-game-3A8Cy`. Commit and push there; do not push to `main` without explicit instruction.
