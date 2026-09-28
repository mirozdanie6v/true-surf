# TRUE SURF — Telegram Product Catalogue

Research / reconstruction date: 2026-09-28
Purpose: establish a production-grade source of truth for lessons, packages, rentals and promotions before rebuilding the Mini App.

## Source hierarchy

This catalogue separates data by provenance instead of treating every value in the prototype as equally authoritative.

### Tier A — current official/public Telegram evidence
Official channel: https://t.me/truesurf

Current public profile positions TRUE SURF as:
- surfing in Nha Trang, Vietnam;
- “10 years on the peak of the wave” alongside @toni_t_ony;
- “Smart surfing”;
- “gradation and training system”;
- community of TRUE surfers;
- surf camp at Bai Dai;
- kitesurf trips to Phan Rang.

A public forwarded TRUE SURF post also states that a personal lesson gives a dense foundation in practice and theory and works on details from the first lessons for future surfing progress.

### Tier B — Telegram screenshots supplied during the TRUE SURF project
The project history on 2026-08-17 explicitly records that pricing was being taken from TRUE SURF Telegram screenshots / channel material.

Directly reconstructed from those Telegram screenshots:
- Group lesson — $50 / person
- Pair lesson — $60 / person
- Individual lesson — $70
- Just Try — $100
- Base Light — $150
- Base Pro — $230
- Skill Up — $240

These are not generic market prices and were not invented for the prototype.

### Tier C — subsequent TRUE SURF project corrections / preserved product state
On 2026-08-19 the lesson structure was corrected in the working product to:
- Personal 1:1 — $80
- Personal 2:1 — $70 / person
- Personal 3:1 — $60 / person

By the first complete Next.js rebuild on 2026-08-21, the product source already contained the expanded catalogue listed below.

The exact Telegram post/screenshot for every Tier C line is not currently recoverable from the public Telegram web index or saved project files, so these values are preserved project data rather than post-level archived evidence.

## Production catalogue

### Lessons

| Product | Price | Evidence |
|---|---:|---|
| Group lesson | $50 | Telegram screenshot-derived project record (2026-08-17); still present in earliest full app rebuild |
| Personal 1:1 | $80 | project price correction (2026-08-19); present in earliest full app rebuild |
| Personal 2:1 | $70/person | project price correction (2026-08-19); present in earliest full app rebuild |
| Personal 3:1 | $60/person | project price correction (2026-08-19); present in earliest full app rebuild |

Historical note: the first Telegram extraction recorded “individual $70” and “pair $60/person”; these were superseded in the product on 2026-08-19 by the 1:1 / 2:1 / 3:1 structure above.

### Training packages

| Package | Price | Exact package contents recovered? | Evidence |
|---|---:|---|---|
| Just Try | $100 | No | Telegram screenshot-derived price (2026-08-17) |
| Base Light | $150 | No | Telegram screenshot-derived price (2026-08-17) |
| Base Pro | $230 | No | Telegram screenshot-derived price (2026-08-17) |
| Skill Up | $240 | No | Telegram screenshot-derived price (2026-08-17) |
| 2gether 4ever | $400 | No | preserved in full product source by 2026-08-21; exact source post not recovered |

Important: the generic descriptions currently shown by the prototype (“entry package”, “solid base”, etc.) are VIIVERSION interface copy and must not be treated as original TRUE SURF package descriptions.

### Board rental — hourly

| Product | Price | Evidence |
|---|---:|---|
| Board rental — 1 hour | 200k VND | preserved in first full Next.js product source |
| Board rental — 2 hours | 300k VND | preserved in first full Next.js product source |
| Board rental — 3 hours | 400k VND | preserved in service catalogue in first full Next.js product source |

### Rental subscriptions

| Package | Included rental | Price | Evidence |
|---|---|---:|---|
| Rent Base Light | 4 × 2h | 1,000k VND / $40 | preserved in first full Next.js product source |
| Rent Base Pro | 8 × 2h | 1,600k VND / $60 | preserved in first full Next.js product source |
| Rent Terminator | 12 × 2h | 2,400k VND / $90 | preserved in first full Next.js product source |
| Rent No Limits | 1 month | 3,900k VND / $150 | preserved in first full Next.js product source |

### Promotions

| Promotion | Benefit currently preserved in product | Evidence |
|---|---|---|
| Birthday | -15% on a lesson; -50% on rental from 1 day | preserved in first full Next.js product source |
| Group of 4+ | -10% | preserved in first full Next.js product source |
| Bring a friend | 2 hours board rental free | preserved in first full Next.js product source |

## What is NOT yet source-recovered

The following details should not be invented or inferred from the UI:

- exact lesson count inside Just Try;
- exact lesson count inside Base Light;
- exact lesson count inside Base Pro;
- exact lesson count / rental composition inside Skill Up;
- exact composition of 2gether 4ever;
- whether photo/video is included in each product;
- whether transfer is included in any package;
- exact lesson duration per product;
- board / rashguard / water inclusions by product;
- expiry periods for training packages;
- cancellation and rescheduling rules;
- exact conditions of the birthday promotion;
- exact eligibility/limits of group-of-4 and bring-a-friend promotions;
- whether prices above have changed after August 2026.

The current public Telegram web index does not expose the relevant TRUE SURF historical posts reliably, and the original August screenshots are not present in the currently accessible project/library file store. This is a source-recovery gap, not evidence that the information was never published.

## Product interpretation supported by Telegram

TRUE SURF’s own public wording strongly supports building the offer around progression rather than one-off entertainment:

- “Smart surfing”
- “gradation and training system”
- dense foundation in practice and theory;
- attention to details from the first lessons;
- future surfing progression;
- community layer;
- surf camp and kitesurf trips as continuation products.

This makes the natural production hierarchy:

1. First experience / lesson
2. Personal or group lesson
3. Structured progression package
4. Independent practice / board rental
5. Repeat / subscription rental
6. Camp / trip / community continuation

## Production rule

For implementation:
- prices with Telegram/project provenance may be imported into the production catalogue with a provenance field;
- package descriptions currently written by VIIVERSION must remain editable content, not TRUE SURF factual copy;
- unknown package composition must remain unset until the exact TRUE SURF source is recovered;
- the backend should store products and prices as data, not hard-code them into UI components;
- every product should support source/provenance, active/inactive status and updated_at so future price changes do not require code edits.

## Current source pointers

Official/current:
- Telegram: https://t.me/truesurf
- Instagram linked by Telegram: https://www.instagram.com/true.surf.mafia/
- Website linked by Telegram: https://truesurf.ru/

Project code evidence:
- Mini App production base commit: bb184ab90b840fcc507be6ea1a18d6ee483330b8
- First full Next.js rebuild: 616155bdb8ef94eae41810dc2387f73d2a269ca3

Related dossier:
- docs/TRUE_SURF_WEB_DOSSIER.md
