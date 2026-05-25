const STORAGE_KEY = 'lineforge-studio-v1';

const state = {
  activeTab: 'mission',
  mission: null,
  saved: [],
  checklist: {},
  deferredInstallPrompt: null,
  canvas: {
    ctx: null,
    drawing: false,
    last: null,
    undo: [],
    grid: false,
    guide: true,
    initialized: false
  }
};

const banks = {
  subjects: [
    'a cup', 'a sleepy lamp', 'a tiny dragon', 'a running shoe', 'a houseplant',
    'a nervous cloud', 'a moon-shaped chair', 'a heroic spoon', 'a shy robot',
    'a fox mask', 'a teapot', 'a backpack', 'a whale balloon', 'a magical key',
    'a mushroom cottage', 'a confused star', 'a paper airplane', 'a cozy ghost'
  ],
  skills: [
    {
      label: 'Silhouette clarity',
      tip: 'Make the outside shape recognizable before adding inside details.',
      steps: ['Draw three tiny thumbnails first.', 'Choose the clearest outer shape.', 'Remove one detail that weakens the silhouette.']
    },
    {
      label: 'Shape language',
      tip: 'Choose circles, squares, or triangles to make the drawing feel intentional.',
      steps: ['Pick one dominant shape family.', 'Repeat it in at least three places.', 'Use one contrasting shape as the twist.']
    },
    {
      label: 'Expression through pose',
      tip: 'Tilt, squash, stretch, or bend the subject to show emotion.',
      steps: ['Draw the neutral version.', 'Push the pose 30% further.', 'Make the gesture readable without facial details.']
    },
    {
      label: 'Simple perspective',
      tip: 'Use a top ellipse, side planes, or overlap to give the object depth.',
      steps: ['Mark the front, side, and top.', 'Keep parallel edges consistent.', 'Add one cast shadow to ground it.']
    },
    {
      label: 'Logo simplification',
      tip: 'Reduce the subject to a bold icon that still reads small.',
      steps: ['Combine details into larger shapes.', 'Use no more than two interior marks.', 'Check the design at thumbnail size.']
    },
    {
      label: 'Value grouping',
      tip: 'Group lights and darks so the drawing reads before color does.',
      steps: ['Separate light, middle, and dark zones.', 'Keep the focal point highest contrast.', 'Avoid sprinkling tiny shadows everywhere.']
    }
  ],
  constraints: [
    'Use only 3 colors.',
    'Use one continuous line for the first version.',
    'Build it from circles and rectangles.',
    'No outlines: only filled shapes.',
    'Draw it in under 5 minutes.',
    'Use only thick chunky shapes.',
    'Make every line slightly curved.',
    'Use one color plus shadows.',
    'Make it readable at postage-stamp size.',
    'Draw it without erasing.'
  ],
  moods: [
    'hopeful', 'confused', 'dramatic', 'gentle', 'mischievous', 'ancient',
    'brave', 'lonely', 'sparkly', 'awkward', 'peaceful', 'overexcited'
  ],
  upgrades: [
    'Turn it into a sticker.',
    'Turn it into a clean logo.',
    'Draw a dramatic version too.',
    'Make a tiny mascot version.',
    'Make a pattern tile from it.',
    'Redraw it as a book cover icon.',
    'Create a before/after version.',
    'Simplify it until it works as an app icon.'
  ]
};

const critiqueItems = [
  'The subject is recognizable in 2 seconds.',
  'The assigned mood is visible without explaining it.',
  'The constraint is clearly followed.',
  'The biggest shapes were drawn before the details.',
  'There is a second version that improves one choice.',
  'The final version would still read if shrunk down.'
];

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createMission() {
  const subject = pick(banks.subjects);
  const skill = pick(banks.skills);
  const constraint = pick(banks.constraints);
  const mood = pick(banks.moods);
  const upgrade = pick(banks.upgrades);
  const seed = Math.random().toString(36).slice(2, 7).toUpperCase();

  const construction = buildConstructionTip(subject, mood, skill.label);

  state.mission = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${seed}`,
    seed,
    createdAt: new Date().toISOString(),
    subject,
    skill: skill.label,
    skillTip: skill.tip,
    skillSteps: skill.steps,
    constraint,
    mood,
    upgrade,
    construction
  };

  state.checklist = {};
  saveState();
  render();
  drawGuideForMission();
  showToast('New drawing mission forged.');
}

function buildConstructionTip(subject, mood, skill) {
  const subjectWord = subject.replace(/^a |^an /, '');
  const shape = mood.includes('dramatic') || mood.includes('confused') ? 'triangles and tilted lines'
    : mood.includes('hopeful') || mood.includes('gentle') || mood.includes('peaceful') ? 'circles and soft arcs'
    : mood.includes('brave') || mood.includes('ancient') ? 'squares and heavy blocks'
    : 'one large simple shape';
  return `Start with ${shape}. Make the ${subjectWord} readable as a silhouette, then add one small detail that proves the mood is ${mood}.`;
}

function missionCards() {
  const m = state.mission;
  const rows = [
    ['Start', `Draw ${m.subject}.`, 'start'],
    ['Skill', m.skill, 'skill'],
    ['Constraint', m.constraint, 'constraint'],
    ['Feel', `Make it feel ${m.mood}.`, 'feel'],
    ['Build', m.construction, 'build'],
    ['Evolve', m.upgrade, 'evolve']
  ];

  return rows.map(([label, value, cls], index) => `
    <article class="mission-card ${cls}" style="animation-delay:${index * 45}ms">
      <span class="label">${escapeHTML(label)}</span>
      <div class="value">${escapeHTML(value)}</div>
    </article>
  `).join('');
}

function renderMission() {
  if (!state.mission) createMission();

  $('#missionSeed').textContent = `Seed: ${state.mission.seed}`;
  $('#missionCards').innerHTML = missionCards();

  const steps = [
    `Warm up with three tiny versions of ${state.mission.subject}. Do not chase details yet.`,
    state.mission.construction,
    state.mission.skillTip,
    ...state.mission.skillSteps,
    `Finish by applying this constraint: ${state.mission.constraint}`,
    `Repeat once: ${state.mission.upgrade}`
  ];

  $('#lessonSteps').innerHTML = steps.map(step => `<li>${escapeHTML(step)}</li>`).join('');

  $('#checklist').innerHTML = critiqueItems.map((item, index) => `
    <label class="check-item">
      <input type="checkbox" data-check="${index}" ${state.checklist[index] ? 'checked' : ''} />
      <span>${escapeHTML(item)}</span>
    </label>
  `).join('');
}

function renderTabs() {
  $$('.tab').forEach(tab => {
    const active = tab.dataset.tab === state.activeTab;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-current', active ? 'page' : 'false');
  });

  $$('[data-panel]').forEach(panel => {
    panel.hidden = panel.dataset.panel !== state.activeTab;
  });

  if (state.activeTab === 'studio') {
    requestAnimationFrame(initCanvas);
  }
}

function renderLibrary() {
  const list = $('#libraryList');
  if (!state.saved.length) {
    list.innerHTML = '<div class="empty-state">No saved missions yet. Forge one, save it, then return here.</div>';
    return;
  }

  list.innerHTML = state.saved.map(item => `
    <article class="saved-card">
      <p class="eyebrow">${escapeHTML(new Date(item.createdAt).toLocaleDateString())}</p>
      <h3>Draw ${escapeHTML(item.subject)}</h3>
      <p><strong>Skill:</strong> ${escapeHTML(item.skill)}<br>
      <strong>Constraint:</strong> ${escapeHTML(item.constraint)}<br>
      <strong>Feel:</strong> ${escapeHTML(item.mood)}<br>
      <strong>Upgrade:</strong> ${escapeHTML(item.upgrade)}</p>
      <footer>
        <button class="mini-button" data-action="load-saved" data-id="${escapeHTML(item.id)}">Load</button>
        <button class="mini-button" data-action="delete-saved" data-id="${escapeHTML(item.id)}">Delete</button>
      </footer>
    </article>
  `).join('');
}

function render() {
  renderTabs();
  renderMission();
  renderLibrary();
  updateOnlineStatus();
}

function saveState() {
  const payload = {
    mission: state.mission,
    saved: state.saved,
    checklist: state.checklist
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.mission = data.mission || null;
    state.saved = Array.isArray(data.saved) ? data.saved : [];
    state.checklist = data.checklist && typeof data.checklist === 'object' ? data.checklist : {};
  } catch (error) {
    console.warn('Could not load saved state', error);
  }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function missionText(m = state.mission) {
  return [
    `LineForge Mission ${m.seed}`,
    `Draw ${m.subject}.`,
    `Skill: ${m.skill}`,
    `Constraint: ${m.constraint}`,
    `Feel: Make it ${m.mood}.`,
    `Build: ${m.construction}`,
    `Evolve: ${m.upgrade}`
  ].join('\n');
}

function bindEvents() {
  document.addEventListener('click', async event => {
    const tab = event.target.closest('[data-tab]');
    if (tab) {
      state.activeTab = tab.dataset.tab;
      renderTabs();
      return;
    }

    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'new-mission') createMission();

    if (action === 'save-mission') {
      if (!state.saved.some(item => item.id === state.mission.id)) {
        state.saved.unshift({ ...state.mission });
        state.saved = state.saved.slice(0, 60);
        saveState();
        renderLibrary();
        showToast('Mission saved to your practice archive.');
      } else {
        showToast('This mission is already saved.');
      }
    }

    if (action === 'share-mission') shareMission();
    if (action === 'speak-lesson') speakLesson();
    if (action === 'reset-checklist') {
      state.checklist = {};
      saveState();
      renderMission();
    }

    if (action === 'load-saved') {
      const found = state.saved.find(item => item.id === actionEl.dataset.id);
      if (found) {
        state.mission = { ...found };
        state.checklist = {};
        state.activeTab = 'mission';
        saveState();
        render();
        drawGuideForMission();
        showToast('Saved mission loaded.');
      }
    }

    if (action === 'delete-saved') {
      state.saved = state.saved.filter(item => item.id !== actionEl.dataset.id);
      saveState();
      renderLibrary();
      showToast('Mission deleted.');
    }

    if (action === 'export-library') exportLibrary();
    if (action === 'undo') undoCanvas();
    if (action === 'toggle-grid') toggleGrid();
    if (action === 'toggle-guide') toggleGuide();
    if (action === 'clear-canvas') clearCanvas();
    if (action === 'export-png') exportPNG();
  });

  document.addEventListener('change', event => {
    const check = event.target.closest('[data-check]');
    if (!check) return;
    state.checklist[check.dataset.check] = check.checked;
    saveState();
  });

  $('#installButton').addEventListener('click', async () => {
    if (!state.deferredInstallPrompt) return;
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    $('#installButton').hidden = true;
  });

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    $('#installButton').hidden = false;
  });

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  window.addEventListener('resize', () => {
    if (state.canvas.initialized) resizeCanvas(true);
  });

  document.addEventListener('keydown', event => {
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      undoCanvas();
    }
    if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const target = document.activeElement?.tagName;
      if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(target)) createMission();
    }
  });
}

async function shareMission() {
  const text = missionText();
  try {
    if (navigator.share) {
      await navigator.share({ title: 'LineForge drawing mission', text });
      return;
    }
    await navigator.clipboard.writeText(text);
    showToast('Mission copied to clipboard.');
  } catch (error) {
    if (error.name !== 'AbortError') showToast('Sharing was not completed.');
  }
}

function speakLesson() {
  if (!('speechSynthesis' in window)) {
    showToast('Speech playback is not supported here.');
    return;
  }
  const text = missionText().replace(/\n/g, '. ');
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function exportLibrary() {
  const blob = new Blob([JSON.stringify({ saved: state.saved }, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `lineforge-library-${new Date().toISOString().slice(0,10)}.json`);
  showToast('Library JSON exported.');
}

function updateOnlineStatus() {
  $('#offlineStatus').textContent = navigator.onLine ? 'Online' : 'Offline';
}

function initCanvas() {
  if (state.canvas.initialized) return;
  const canvas = $('#drawingCanvas');
  state.canvas.ctx = canvas.getContext('2d', { willReadFrequently: true });
  state.canvas.initialized = true;
  resizeCanvas(false);

  canvas.addEventListener('pointerdown', startStroke);
  canvas.addEventListener('pointermove', moveStroke);
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);
  drawGuideForMission();
}

function resizeCanvas(preserve) {
  const canvas = $('#drawingCanvas');
  const ctx = state.canvas.ctx;
  if (!ctx) return;

  let snapshot = null;
  if (preserve && canvas.width && canvas.height) {
    snapshot = document.createElement('canvas');
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext('2d').drawImage(canvas, 0, 0);
  }

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (snapshot) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(snapshot, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

function getPoint(event) {
  const canvas = $('#drawingCanvas');
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    pressure: event.pressure || 0.55
  };
}

function startStroke(event) {
  event.preventDefault();
  const canvas = $('#drawingCanvas');
  canvas.setPointerCapture(event.pointerId);
  saveUndoSnapshot();
  state.canvas.drawing = true;
  state.canvas.last = getPoint(event);
  $('#canvasStatus').textContent = 'Drawing';
}

function moveStroke(event) {
  if (!state.canvas.drawing) return;
  event.preventDefault();

  const ctx = state.canvas.ctx;
  const point = getPoint(event);
  const last = state.canvas.last;
  const size = Number($('#brushSize').value);
  const pressureSize = Math.max(1.5, size * (0.45 + point.pressure));

  ctx.strokeStyle = $('#brushColor').value;
  ctx.lineWidth = pressureSize;
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  const midX = (last.x + point.x) / 2;
  const midY = (last.y + point.y) / 2;
  ctx.quadraticCurveTo(last.x, last.y, midX, midY);
  ctx.stroke();

  state.canvas.last = point;
}

function endStroke() {
  state.canvas.drawing = false;
  state.canvas.last = null;
  $('#canvasStatus').textContent = 'Ready';
}

function saveUndoSnapshot() {
  const canvas = $('#drawingCanvas');
  if (!canvas.width || !canvas.height) return;
  try {
    state.canvas.undo.push(canvas.toDataURL('image/png'));
    state.canvas.undo = state.canvas.undo.slice(-12);
  } catch (error) {
    console.warn('Undo snapshot failed', error);
  }
}

function undoCanvas() {
  const canvas = $('#drawingCanvas');
  const ctx = state.canvas.ctx;
  const url = state.canvas.undo.pop();
  if (!url || !ctx) {
    showToast('Nothing to undo yet.');
    return;
  }
  const image = new Image();
  image.onload = () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  };
  image.src = url;
}

function clearCanvas() {
  if (!state.canvas.ctx) return;
  saveUndoSnapshot();
  const canvas = $('#drawingCanvas');
  state.canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
  showToast('Canvas cleared.');
}

function toggleGrid() {
  state.canvas.grid = !state.canvas.grid;
  $('.canvas-wrap').classList.toggle('has-grid', state.canvas.grid);
}

function toggleGuide() {
  state.canvas.guide = !state.canvas.guide;
  $('.canvas-wrap').classList.toggle('show-guide', state.canvas.guide);
}

function exportPNG() {
  const canvas = $('#drawingCanvas');
  canvas.toBlob(blob => {
    if (!blob) {
      showToast('Export failed.');
      return;
    }
    downloadBlob(blob, `lineforge-sketch-${Date.now()}.png`);
    showToast('Sketch exported as PNG.');
  }, 'image/png');
}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function drawGuideForMission() {
  const overlay = $('#guideOverlay');
  if (!overlay || !state.mission) return;
  const s = state.mission.subject.toLowerCase();
  let svg = '';

  if (s.includes('cup') || s.includes('teapot')) {
    svg = `
      <ellipse cx="50" cy="28" rx="19" ry="8"></ellipse>
      <path d="M31 29 C34 62 38 73 50 74 C62 73 66 62 69 29"></path>
      <ellipse cx="50" cy="73" rx="12" ry="5"></ellipse>
      <path d="M69 40 C88 39 88 62 69 61"></path>
      <line x1="26" y1="83" x2="74" y2="83"></line>`;
  } else if (s.includes('dragon') || s.includes('fox') || s.includes('ghost')) {
    svg = `
      <circle cx="50" cy="38" r="18"></circle>
      <path d="M35 31 L25 17 L43 25"></path>
      <path d="M65 31 L75 17 L57 25"></path>
      <path d="M34 55 C38 78 62 78 66 55"></path>
      <line x1="41" y1="40" x2="45" y2="40"></line>
      <line x1="55" y1="40" x2="59" y2="40"></line>`;
  } else if (s.includes('shoe') || s.includes('airplane') || s.includes('key')) {
    svg = `
      <path d="M20 58 C38 42 56 36 77 47 C82 50 82 61 74 64 L23 66 C18 65 16 62 20 58z"></path>
      <line x1="34" y1="53" x2="45" y2="46"></line>
      <line x1="45" y1="51" x2="56" y2="44"></line>`;
  } else if (s.includes('plant') || s.includes('mushroom') || s.includes('cloud')) {
    svg = `
      <path d="M50 76 C49 56 49 44 50 29"></path>
      <ellipse cx="37" cy="42" rx="15" ry="8" transform="rotate(-32 37 42)"></ellipse>
      <ellipse cx="62" cy="39" rx="16" ry="8" transform="rotate(28 62 39)"></ellipse>
      <rect x="34" y="70" width="32" height="14" rx="4"></rect>`;
  } else if (s.includes('robot') || s.includes('lamp') || s.includes('chair') || s.includes('backpack')) {
    svg = `
      <rect x="34" y="24" width="32" height="30" rx="7"></rect>
      <rect x="28" y="57" width="44" height="22" rx="8"></rect>
      <line x1="42" y1="34" x2="42" y2="34"></line>
      <line x1="58" y1="34" x2="58" y2="34"></line>
      <line x1="40" y1="84" x2="60" y2="84"></line>`;
  } else {
    svg = `
      <circle cx="50" cy="42" r="20"></circle>
      <rect x="35" y="57" width="30" height="20" rx="6"></rect>
      <line x1="25" y1="82" x2="75" y2="82"></line>
      <line x1="50" y1="16" x2="50" y2="88"></line>`;
  }

  overlay.innerHTML = svg;
  $('.canvas-wrap')?.classList.toggle('show-guide', state.canvas.guide);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(error => console.warn('Service worker registration failed:', error));
  });
}

loadState();
if (!state.mission) {
  state.mission = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    seed: 'WARM1',
    createdAt: new Date().toISOString(),
    subject: 'a cup',
    skill: 'Shape language',
    skillTip: 'Choose circles, squares, or triangles to make the drawing feel intentional.',
    skillSteps: ['Pick one dominant shape family.', 'Repeat it in at least three places.', 'Use one contrasting shape as the twist.'],
    constraint: 'Use only 3 colors.',
    mood: 'confused',
    upgrade: 'Draw a dramatic version too.',
    construction: 'Start with a tilted oval and a lopsided handle. Keep the cup readable, then add one small detail that proves the mood is confused.'
  };
}
bindEvents();
render();
registerServiceWorker();
