// ---------- Leaf Photo Analysis ----------
// Heuristic "AI" classifier: analyzes pixel colors in the uploaded leaf photo.
// Healthy leaves are dominated by green tones; stressed leaves show more
// yellow/brown tones (a common proxy signal used in plant-stress detection
// before a trained CNN/MobileNet model is swapped in).

const photoInput = document.getElementById('photoInput');
const uploadLabel = document.getElementById('uploadLabel');
const preview = document.getElementById('preview');
const canvas = document.getElementById('canvas');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultBox = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultDetail = document.getElementById('resultDetail');
const greenBar = document.getElementById('greenBar');
const stressBar = document.getElementById('stressBar');
const greenPct = document.getElementById('greenPct');
const stressPct = document.getElementById('stressPct');

let currentImage = null;

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    currentImage = new Image();
    currentImage.onload = () => {
      preview.src = ev.target.result;
      preview.hidden = false;
      uploadLabel.textContent = 'Photo selected — tap to change';
      analyzeBtn.disabled = false;
      resultBox.hidden = true;
    };
    currentImage.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

analyzeBtn.addEventListener('click', () => {
  if (!currentImage) return;

  const ctx = canvas.getContext('2d');
  const maxDim = 300; // downscale for fast pixel analysis
  const scale = Math.min(maxDim / currentImage.width, maxDim / currentImage.height, 1);
  canvas.width = currentImage.width * scale;
  canvas.height = currentImage.height * scale;
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let greenish = 0, yellow = 0, brown = 0, darkSpot = 0, total = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 100) continue; // skip transparent
    const brightness = (r + g + b) / 3;
    if (brightness > 240) continue; // skip near-white background

    total++;
    // Healthy green: g clearly dominant over r and b
    if (g > r + 12 && g > b + 12) {
      greenish++;
    }
    // Yellowing: r and g both high, b noticeably low (classic chlorosis/yellowing)
    else if (r > 130 && g > 100 && b < 110 && Math.abs(r - g) < 40) {
      yellow++;
    }
    // Browning/wilting: r clearly dominant over g, mid brightness
    else if (r > g + 10 && brightness > 40) {
      brown++;
    }
    // Dark spots: very dark, non-background pixels (fungal/bacterial spots)
    else if (brightness <= 40 && brightness >= 15) {
      darkSpot++;
    }
  }

  const pct = (n) => total ? Math.round((n / total) * 100) : 0;
  const greenPercent = pct(greenish);
  const yellowPercent = pct(yellow);
  const brownPercent = pct(brown);
  const spotPercent = pct(darkSpot);
  const stressPercent = yellowPercent + brownPercent + spotPercent;

  greenBar.style.width = greenPercent + '%';
  stressBar.style.width = stressPercent + '%';
  greenPct.textContent = greenPercent + '%';
  stressPct.textContent = stressPercent + '%';

  // Decide the dominant issue so the user knows WHAT's wrong, not just THAT something's wrong
  let verdict, detail;
  if (stressPercent < 10) {
    verdict = '✅ Healthy';
    detail = 'Leaf shows strong green coverage with minimal yellowing, browning, or spotting. Keep up the current watering routine.';
  } else {
    const issues = [
      { name: 'yellowing', pct: yellowPercent, cause: 'often linked to overwatering, nutrient deficiency, or too much direct sun' },
      { name: 'browning/wilting', pct: brownPercent, cause: 'usually a sign of underwatering or heat stress' },
      { name: 'dark spots', pct: spotPercent, cause: 'can indicate fungal or bacterial infection, especially if spots have a ring pattern' },
    ].sort((a, b) => b.pct - a.pct);

    const primary = issues[0];
    const severity = stressPercent < 25 ? 'Early signs of' : 'Significant';

    if (primary.pct === 0) {
      verdict = '⚠️ Mixed Stress Signs';
      detail = `${severity} leaf discoloration detected (${stressPercent}% of leaf area), but no single cause dominates. Check soil moisture and look closely for pests or spots.`;
    } else {
      verdict = `⚠️ ${severity} ${primary.name}`;
      detail = `${primary.pct}% of the leaf shows ${primary.name} — this is ${primary.cause}. Check soil moisture first, and inspect closely if it doesn't improve after watering.`;
    }
  }

  resultTitle.textContent = verdict;
  resultDetail.textContent = detail;
  resultBox.hidden = false;
});

// ---------- Watering Reminders ----------
const STORAGE_KEY = 'plantReminders';
const reminderForm = document.getElementById('reminderForm');
const reminderList = document.getElementById('reminderList');

function loadReminders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function daysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function renderReminders() {
  const reminders = loadReminders();
  reminderList.innerHTML = '';
  reminders.forEach((r, idx) => {
    const elapsed = daysSince(r.lastWatered);
    const due = elapsed >= r.frequency;
    const li = document.createElement('li');
    if (due) li.classList.add('due');
    li.innerHTML = `
      <span>${r.name} — every ${r.frequency}d ${due ? `(overdue by ${elapsed - r.frequency + 1}d)` : `(${r.frequency - elapsed}d left)`}</span>
      <button class="remove" data-idx="${idx}" aria-label="Remove">✕</button>
    `;
    reminderList.appendChild(li);
  });
}

reminderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('plantName').value.trim();
  const frequency = parseInt(document.getElementById('frequency').value, 10);
  if (!name) return;

  const reminders = loadReminders();
  reminders.push({ name, frequency, lastWatered: new Date().toISOString() });
  saveReminders(reminders);
  reminderForm.reset();
  renderReminders();
});

reminderList.addEventListener('click', (e) => {
  if (!e.target.classList.contains('remove')) return;
  const idx = parseInt(e.target.dataset.idx, 10);
  const reminders = loadReminders();
  reminders.splice(idx, 1);
  saveReminders(reminders);
  renderReminders();
});

renderReminders();
