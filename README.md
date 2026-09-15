# 🌿 Plant Health Checker

Photo-based plant health checker built for the **AI Immersion Programme** (Task 01) and continued as **Project Better Tomorrow** (Pathway A — Continuation Track), Batch C29.

## Problem Statement

Plants at home sometimes miss watering because there's no tracking system. Family members intend to water twice daily but sometimes forget — and nothing catches a missed watering until visible wilting has already set in.

## Solution

A lightweight web app that:
1. **Analyzes a leaf photo** — detects stress signs (yellowing, browning) using a color-ratio heuristic, as a first prototype ahead of a full CNN/MobileNet image classifier.
2. **Tracks watering reminders** — lets you log each plant's watering frequency and flags when it's overdue.

## How It Works (Current Prototype)

The leaf analyzer downsamples the uploaded photo and classifies pixels into:
- **Green (healthy)** — chlorophyll-dominant pixels
- **Yellow/Brown (stress)** — pixels consistent with wilting, nutrient stress, or dehydration

This gives a fast, no-training-data-needed baseline. The next iteration (see Roadmap) swaps this heuristic for a trained MobileNet classifier fine-tuned on labeled leaf images.

## Getting Started

No build step needed — it's plain HTML/CSS/JS.

```bash
git clone <your-repo-url>
cd plant-health-checker
# open index.html in a browser, or serve locally:
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project Files

| File | Purpose |
|---|---|
| `index.html` | App structure and layout |
| `style.css` | Styling |
| `script.js` | Leaf color analysis + watering reminder logic |

## Roadmap

- [ ] Replace color-heuristic classifier with a trained MobileNet/CNN model
- [ ] Add photo history per plant to track health trends over time
- [ ] Push-notification support for overdue watering
- [ ] Multi-plant photo library with species-specific stress baselines

## Background

- **Stakeholder interviewed:** family member who waters the front-yard plants
- **AI tools used:** Claude (research/ideation), Gamma AI (slide deck), Napkin AI (block diagram), Lovable AI (UI prototyping)

## Validation

_(To be filled in as part of the Prototype & Validation Report — feedback from testers goes here.)_

| Tester | Feedback | Change Made |
|---|---|---|
| | | |
| | | |
| | | |

## License

MIT
