# Photo-Based Plant Health Checker using AI

**Project Better Tomorrow (CoE Growth Project, Batch C29), Pathway A**

## Problem
Plants in our front yard sometimes miss watering because there is no tracking system. Nobody notices until the plants are already wilted.

## Solution
A web app that:
1. Checks a leaf photo and tells whether the plant is **healthy, yellowing or wilted**.
2. Lets the user **teach the AI** with photos of their own plants (MobileNet + KNN, runs in the browser).
3. Sends **watering reminders** per plant with a "Watered" button and browser notifications.
4. Keeps a **history** of the last 20 checks.

## How it works
- **Colour analysis**: photo is scaled to 100x100, converted to HSV. The share of green, yellow and brown pixels decides the status. Grey, white and black pixels are ignored as background.
- **Transfer learning**: MobileNet converts the photo into 1024 numbers (embedding). A KNN classifier (k = 5) compares it with the user's labelled examples. If confidence is 60% or more the AI result is used, otherwise the colour result.
- **Reminders**: every plant stores its watering interval and last watered time. The app checks every 30 seconds and shows a notification when watering is due.

## Tech
HTML, CSS, JavaScript, TensorFlow.js, MobileNet v2, KNN Classifier. No backend.

## Run
Open `index.html` in Chrome (internet needed once to load the AI model).
Live demo: GitHub Pages link (add here).

## Data storage (no API, no database)
The app has no server, so there are no API endpoints and no database. Data is saved in the browser's localStorage:

| Key | Content |
|---|---|
| `plants` | list of `{ id, name, everyHours, lastWatered, notifiedFor }` |
| `history` | last 20 checks `{ label, source, time }` |
| `knnData` | training examples per label (`healthy`, `yellowing`, `wilted`), each example is 1024 numbers |

## Error handling
| Situation | What the app does |
|---|---|
| File is not an image | Shows a message, app keeps working |
| No leaf pixels found (white or black photo) | Asks for a closer photo in good light |
| AI model cannot load (no internet) | Falls back to colour analysis and shows a status message |
| localStorage is full or blocked | Error is caught, app still works without saving |
| Any other error | Red error banner at the top of the page |

## Unit testing
Open `index.html?test=1`. The page runs 6 tests and prints PASS or FAIL at the bottom:
- green image is Healthy
- yellow image is Yellowing
- brown image is Wilted
- white image gives no leaf
- black image gives no leaf
- `rgbToHsv` gives hue 120 for pure green

## User testing (Review 2)
| Tester | Feedback | Change made |
|---|---|---|
| Tester 1 | | |
| Tester 2 | | |
| Tester 3 | | |

## Status
Review 1 (35%): leaf photo check and colour analysis.
Review 2 (70%): MobileNet + KNN training, watering reminders, history, unit tests, documentation, user testing.
