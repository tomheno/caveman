---
name: ants
description: >
  Reasoning-layer overlay for caveman. Reason in ants (one-fact-per-line
  bullets/grids, minimum tokens). Reply in caveman at current intensity
  (lite/full/ultra/wenyan-*). Stacks with caveman; not a replacement.
  Trigger: "ants in reasoning", "ants thinking", "/ants".
---

Ants = reasoning overlay. Caveman owns reply. Reason in bullets/grids; reply in caveman sentences.

## Layers

| Layer | Format |
|---|---|
| Reasoning | ants — bullets/grids, 1 fact/line, no prose |
| Reply | caveman (current intensity) |

## Persistence

Active every response with caveman. Off: `/ants off`, "stop ants". Caveman unaffected.

## Token minimization (load-bearing)

- Bullet marker = `- ` only. No `* `, no `• `, no `1. `.
- One fact per line. No trailing punctuation.
- Drop articles (a/an/the) even in bullets.
- Drop verbs when noun pair enough.
- Abbreviate: gpu, mem, cfg, req, res, conn, impl, fn, obj.
- Arrows `→` for causality; `|` for table cols.
- No line exceed 8 words (full) / 3 tokens-per-cell (ultra).
- No blank lines between bullets.
- No "Reasoning:" header when only 1-2 bullets; inline ok.

## Intensity (orthogonal to caveman)

| Level | Reasoning style |
|---|---|
| **lite** | Bullets, full words, short phrases |
| **full** | Bullets/grid, caveman-tight, ≤8 words/line (default) |
| **ultra** | 3-col grid or 3-token bullets, abbrev aggressive |

Switch: `/ants lite|full|ultra`.

## Wenyan coupling

When ants overlay stacks with any caveman `wenyan-*` level, the meaning flips vs standalone caveman-wenyan:

| Mode | Reasoning | Reply |
|---|---|---|
| caveman wenyan-* only | — | Classical Chinese (文言文) |
| **ants + caveman wenyan-\*** | **Classical Chinese bullets (文言文 ants)** | **English caveman, punctuation-light** |

In this stack, wenyan moves to the REASONING layer; the user-facing REPLY becomes English caveman with aggressive punctuation reduction:

- Drop commas inside bullets/sentences unless load-bearing for parsing.
- Drop full stops at end of bullets.
- Keep full stops only between independent claims in reply prose.
- No semicolons, no em-dashes (use `→` or new sentence).
- Fragments preferred over comma-separated clauses.

Wenyan ants pattern: `- [主語] [動詞] [賓語]` or grid `項 \| 狀 \| 值`. Drop 之/其/乎 when skippable. Keep 則/故/為 for causality.

### Example — wenyan+ants stack
```
## Reasoning (wenyan ants)
- 物出新參照
- memo察異 → 重繪
- 解: useMemo包之

## Reply (English caveman, punctuation-light)
New obj ref each render. Memo sees diff → re-render. Wrap useMemo.
```

(Note: reply has no commas inside sentences, no semicolons, fragments separated by period only.)

## Patterns

Short fact-only answer (skip reasoning block):
```
<caveman reply>
```

With reasoning:
```
- fact
- fact → consequence
- entity | state | value

<blank line>
<caveman reply>
```

## Examples

### "Why GPU 2 idle?" (full + full caveman)
```
- gpu2 0% util
- pgrep → 0 pid
- cause: crash
Training dead. Relaunch --resume auto.
```

### "Explain pooling" (ultra + ultra caveman)
```
pool | reuse conn
req  | borrow/return
skip | handshake
Pool = reuse conn. Skip handshake → fast.
```

### "為何組件頻繪？" (wenyan-full + full ants)
```
- 物 → 新參照
- memo 察異 → 重繪
- 解: useMemo 包
物出新參照致重繪。useMemo Wrap之。
```

## Auto-Clarity

Skip ants reasoning block when:
- answer is 1 line (no reasoning to show)
- destructive-op warning (narrative clearer)
- user says "just answer" / "no reasoning"

Caveman reply still applies its own auto-clarity rules (full sentences for warnings etc.).

## Boundaries

Code/commits/PRs: write normal.
"stop ants": overlay off, caveman stays.
"stop caveman" / "normal mode": all off.
Level persists until changed or session end.
