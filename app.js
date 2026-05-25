const STORAGE_KEY = 'glyphforge-atelier-v1';

const state = {
  activeTab: 'mission',
  preferredFormat: 'mixed',
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

const skillBank = [
  {
    label: 'Silhouette clarity',
    short: 'Make the outer shape readable first.',
    what: 'Silhouette clarity means your drawing can be recognized from its outside shape before any details are added.',
    why: 'Icons and mascots must read quickly. A strong silhouette survives when it is tiny, blurry, or seen from across the room.',
    how: 'Draw three tiny filled-in thumbnails. Choose the one with the clearest outline. Add details only after the big shape works.',
    drill: 'Black out your sketch like a shadow. If you cannot name it in two seconds, simplify the outline.',
    mistakes: 'Tiny details, symmetrical stiffness, or an outline that looks like every other object.',
    steps: ['Draw three postage-stamp silhouettes.', 'Choose the clearest outline.', 'Remove one detail that weakens the read.', 'Add one signature notch, handle, ear, spark, or curve.']
  },
  {
    label: 'Shape language',
    short: 'Use circles, squares, and triangles to control personality.',
    what: 'Shape language is the emotional meaning of basic shapes: circles feel friendly, squares feel stable, triangles feel sharp or energetic.',
    why: 'Mascots and icons need instant personality. Shape choices make the design feel intentional before color or expression arrives.',
    how: 'Pick one dominant shape family, then repeat it in the body, details, and negative spaces. Use one contrasting shape for surprise.',
    drill: 'Draw the same subject three times: round, blocky, and sharp. Label how each version feels.',
    mistakes: 'Mixing every shape equally, which makes the character feel accidental instead of designed.',
    steps: ['Choose a dominant shape family.', 'Repeat it in at least three places.', 'Use one contrast shape as the hook.', 'Compare the mood before adding details.']
  },
  {
    label: 'Icon readability',
    short: 'Design for tiny sizes and fast recognition.',
    what: 'Icon readability is the skill of making a mark recognizable at small sizes, such as an app icon, sticker, button, or logo badge.',
    why: 'A beautiful drawing can fail as an icon if it depends on tiny texture, thin lines, or complicated internal shapes.',
    how: 'Use one bold base shape, one subject cue, and one memorable twist. Check it at thumbnail size before refining.',
    drill: 'Shrink your design to 64px wide. Keep only what still reads.',
    mistakes: 'Text inside the icon, too many colors, thin lines, and detail that disappears when scaled down.',
    steps: ['Draw a clear container shape.', 'Place one large subject cue inside it.', 'Limit interior marks to two or three.', 'Squint or shrink-test the result.']
  },
  {
    label: 'Mascot construction',
    short: 'Build characters from simple body masses.',
    what: 'Mascot construction means building a character from easy forms: head, body, limbs, facial focus, and accessory.',
    why: 'A mascot needs repeatability. You should be able to redraw it from different angles without losing its identity.',
    how: 'Start with a body bean or block, attach a clear head shape, then add one repeating motif such as ears, crest, glasses, scarf, or tail.',
    drill: 'Create a mascot turnaround: front, side, and tiny icon head.',
    mistakes: 'Starting with costume details before the body shape, or making the face too small to carry expression.',
    steps: ['Block in head and body masses.', 'Place the face with a center line.', 'Add limbs as simple tubes or mittens.', 'Add one accessory that tells the story.']
  },
  {
    label: 'Expression through pose',
    short: 'Show emotion with tilt, squash, stretch, and gesture.',
    what: 'Expression through pose means the whole design communicates emotion, not just the eyes or mouth.',
    why: 'Icons and mascots often need to work without detailed faces. A tilted cup, leaning robot, or puffed-up cloud can feel alive.',
    how: 'Draw a gesture line through the subject. Push the lean, squash, stretch, or asymmetry until the mood reads clearly.',
    drill: 'Draw the same mascot happy, confused, brave, and sleepy using only body pose.',
    mistakes: 'Relying only on eyebrows, or keeping the body perfectly upright when the emotion should affect it.',
    steps: ['Draw the neutral version.', 'Add a gesture line.', 'Push the pose 30% further.', 'Check if the mood reads without facial details.']
  },
  {
    label: 'Logo simplification',
    short: 'Reduce an idea to a memorable mark.',
    what: 'Logo simplification is turning a subject into a bold, repeatable symbol without losing the core idea.',
    why: 'A logo must be easy to remember, easy to redraw, and strong in one color.',
    how: 'Find the subject’s most famous feature. Merge smaller details into larger shapes. Test it in black and white.',
    drill: 'Draw your subject using only five shapes. Then redraw it using only three.',
    mistakes: 'Illustrating everything instead of choosing the one feature people remember.',
    steps: ['Name the subject’s strongest feature.', 'Delete secondary details.', 'Merge shapes when possible.', 'Test the mark in one color.']
  },
  {
    label: 'Value grouping',
    short: 'Organize light and dark before color.',
    what: 'Value grouping means arranging light, middle, and dark areas so the design reads even without color.',
    why: 'Color is not enough. Good value structure keeps an icon legible and gives a mascot clear focus.',
    how: 'Choose one main dark shape, one main light shape, and one accent. Keep the face or focal symbol highest contrast.',
    drill: 'Make a three-value version of your drawing: light, mid, dark. No gradients.',
    mistakes: 'Sprinkling tiny shadows everywhere, which creates noise instead of structure.',
    steps: ['Separate light, middle, and dark zones.', 'Keep the focal point highest contrast.', 'Group tiny shadows into bigger shapes.', 'Check the design in grayscale.']
  },
  {
    label: 'Color hierarchy',
    short: 'Use color to guide attention, not decorate everything.',
    what: 'Color hierarchy means assigning jobs to colors: base, shadow, highlight, emotion, and callout.',
    why: 'Icons and mascots get messy when every part competes. A small palette makes the design more professional.',
    how: 'Pick three colors: base, dark, accent. Use the accent only where you want the eye to land.',
    drill: 'Color the same sketch with only three colors, then only two.',
    mistakes: 'Using too many accents, equal saturation everywhere, or colors that have the same value.',
    steps: ['Pick a base color.', 'Pick a darker support color.', 'Pick one accent color.', 'Use the accent on the most important 10%.']
  },
  {
    label: 'Line weight',
    short: 'Control thick and thin lines for focus and charm.',
    what: 'Line weight is the thickness variation of your strokes.',
    why: 'Thicker lines can make icons feel bold and readable. Lighter interior lines can keep mascots expressive without clutter.',
    how: 'Use thicker outer lines and thinner interior detail. Let corners and overlaps get slightly heavier.',
    drill: 'Trace one sketch three times: thin, chunky, and mixed. Choose the clearest version.',
    mistakes: 'Making every line the same weight, or using hairline detail that disappears.',
    steps: ['Use a bold outer contour.', 'Thin down interior lines.', 'Thicken overlaps and shadow edges.', 'Erase lines that do not explain form.']
  },
  {
    label: 'Proportion exaggeration',
    short: 'Change size relationships to create appeal.',
    what: 'Proportion exaggeration means making some parts larger or smaller than reality to create clarity, cuteness, comedy, or power.',
    why: 'Mascots become memorable when proportions are designed, not copied. Icons become clearer when important parts are oversized.',
    how: 'Choose the most important part and enlarge it. Shrink supporting details so they do not compete.',
    drill: 'Make three versions: giant head, giant hands, giant accessory. Pick the best story.',
    mistakes: 'Even proportions everywhere, which can make the design feel generic.',
    steps: ['Choose the story part.', 'Make it noticeably larger.', 'Shrink secondary parts.', 'Check balance and readability.']
  },
  {
    label: 'Negative space',
    short: 'Use empty space as part of the design.',
    what: 'Negative space is the empty space inside or around a design that helps define the shape.',
    why: 'Good negative space makes icons cleaner, logos smarter, and mascots easier to read.',
    how: 'Look for holes, gaps, and cutouts that can become meaningful shapes without adding more lines.',
    drill: 'Create one icon where the important detail is a cutout instead of a drawn line.',
    mistakes: 'Filling every space, leaving tangents, or making tiny holes that disappear.',
    steps: ['Find one useful cutout.', 'Make gaps wide enough to survive shrinking.', 'Avoid shapes barely touching.', 'Use empty space to simplify details.']
  },
  {
    label: 'Gesture lines',
    short: 'Use a simple action line to make designs feel alive.',
    what: 'A gesture line is the invisible flow line through the subject.',
    why: 'Even an object icon can feel more charming when its big shapes follow a clean rhythm.',
    how: 'Draw one sweeping line through the design first. Place major masses along that line.',
    drill: 'Draw a mascot in five poses using only a head, body, and one gesture line.',
    mistakes: 'Stacking shapes stiffly or adding limbs with no clear flow.',
    steps: ['Draw one action curve.', 'Attach the biggest masses to it.', 'Make details support the flow.', 'Redraw with fewer stiff angles.']
  }
];

const banks = {
  iconSubjects: [
    'a cup badge', 'a moon app icon', 'a weather glyph', 'a tiny dragon badge', 'a houseplant icon',
    'a fox mask logo', 'a teapot mark', 'a backpack sticker', 'a whale balloon icon', 'a magical key logo',
    'a mushroom cottage badge', 'a paper airplane icon', 'a sleepy lamp symbol', 'a compass glyph',
    'a cloud badge', 'a star-shaped button', 'a flame sticker', 'a crystal logo'
  ],
  mascotSubjects: [
    'a nervous cloud mascot', 'a brave spoon mascot', 'a shy robot mascot', 'a cozy ghost mascot',
    'a tiny dragon helper', 'a moon cat mascot', 'a mushroom shopkeeper', 'a backpack creature',
    'a teapot mentor', 'a fox courier', 'a sleepy lamp friend', 'a whale balloon companion',
    'a houseplant guardian', 'a star apprentice', 'a paper airplane scout', 'a little flame character'
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
    'Draw it without erasing.',
    'Use only one shape family plus one contrast shape.',
    'Create a black-and-white version first.'
  ],
  moods: [
    'hopeful', 'confused', 'dramatic', 'gentle', 'mischievous', 'ancient',
    'brave', 'lonely', 'sparkly', 'awkward', 'peaceful', 'overexcited',
    'curious', 'protective', 'dreamy', 'tiny-but-mighty'
  ],
  archetypes: [
    'helper', 'guardian', 'scout', 'maker', 'messenger', 'teacher',
    'trickster', 'navigator', 'collector', 'tiny hero'
  ],
  iconUpgrades: [
    'Turn it into an app icon.',
    'Turn it into a clean one-color logo.',
    'Create a rounded-square icon version.',
    'Make a sticker version with one bold outline.',
    'Simplify it until it works at 64px.',
    'Create a badge with a clear container shape.'
  ],
  mascotUpgrades: [
    'Create a mascot head icon.',
    'Draw a front-view full body version.',
    'Make three expression stickers.',
    'Create a tiny sidekick version.',
    'Design one accessory that explains its job.',
    'Turn it into a logo mascot badge.'
  ]
};

const critiqueItems = [
  'The design is recognizable in 2 seconds.',
  'The silhouette works before details are added.',
  'The assigned skill is visible in the drawing.',
  'The icon or mascot still reads when shrunk down.',
  'The mood or personality is visible through shape or pose.',
  'The palette is controlled and not noisy.',
  'There is a second version that improves one design choice.'
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

function getSkill(label) {
  return skillBank.find(skill => skill.label === label) || skillBank[0];
}

function createMission() {
  const format = state.preferredFormat === 'mixed' ? pick(['icon', 'mascot']) : state.preferredFormat;
  const subject = format === 'icon' ? pick(banks.iconSubjects) : pick(banks.mascotSubjects);
  const skill = pick(skillBank);
  const constraint = pick(banks.constraints);
  const mood = pick(banks.moods);
  const archetype = pick(banks.archetypes);
  const upgrade = format === 'icon' ? pick(banks.iconUpgrades) : pick(banks.mascotUpgrades);
  const seed = Math.random().toString(36).slice(2, 7).toUpperCase();
  const construction = buildConstructionTip(subject, mood, skill.label, format, archetype);

  state.mission = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${seed}`,
    seed,
    createdAt: new Date().toISOString(),
    format,
    subject,
    skill: skill.label,
    skillShort: skill.short,
    constraint,
    mood,
    archetype,
    upgrade,
    construction
  };

  state.checklist = {};
  saveState();
  render();
  drawGuideForMission();
  showToast(format === 'icon' ? 'New icon mission forged.' : 'New mascot mission forged.');
}

function buildConstructionTip(subject, mood, skill, format, archetype) {
  const subjectWord = subject.replace(/^a |^an /, '');
  const shape = mood.includes('dramatic') || mood.includes('confused') || mood.includes('mischievous') ? 'triangles, tilted lines, and asymmetry'
    : mood.includes('hopeful') || mood.includes('gentle') || mood.includes('peaceful') || mood.includes('dreamy') ? 'circles and soft arcs'
    : mood.includes('brave') || mood.includes('ancient') || mood.includes('protective') ? 'squares, shields, and heavy blocks'
    : 'one large simple shape';
  if (format === 'icon') {
    return `Start with ${shape}. Make the ${subjectWord} readable inside a strong container, then add one clear detail that proves the mood is ${mood}.`;
  }
  return `Start with ${shape}. Build the ${subjectWord} as a ${archetype}: big readable head/body masses first, then one accessory or pose detail that proves the mood is ${mood}.`;
}

function missionCards() {
  const m = state.mission;
  const rows = [
    ['Format', m.format === 'icon' ? 'Build an icon / logo mark.' : 'Build a character mascot.', 'format'],
    ['Start', `Draw ${m.subject}.`, 'start'],
    ['Skill', `${m.skill}: ${getSkill(m.skill).short}`, 'skill'],
    ['Constraint', m.constraint, 'constraint'],
    ['Personality', `Make it feel ${m.mood}. Role: ${m.archetype}.`, 'feel'],
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

  const m = state.mission;
  const skill = getSkill(m.skill);

  $('#missionSeed').textContent = `Seed: ${m.seed}`;
  $('#missionCards').innerHTML = missionCards();

  $('#skillTitle').textContent = `${skill.label}: what you are practicing`;
  $('#skillExplain').innerHTML = `
    <article class="explain-card"><strong>What it means</strong><p>${escapeHTML(skill.what)}</p></article>
    <article class="explain-card"><strong>Why it matters</strong><p>${escapeHTML(skill.why)}</p></article>
    <article class="explain-card"><strong>How to practice it</strong><p>${escapeHTML(skill.how)}</p></article>
    <article class="explain-card"><strong>Common trap</strong><p>${escapeHTML(skill.mistakes)}</p></article>
  `;

  const formatSteps = m.format === 'icon'
    ? [
      'Choose a container: circle, squircle, badge, diamond, or shield.',
      'Place the largest subject cue first. Do not start with texture.',
      'Shrink-test the icon by stepping back or pinching the canvas view smaller.'
    ]
    : [
      'Block in a head and body shape that match the personality.',
      'Add a pose line: leaning, bouncing, drooping, or standing strong.',
      'Give the mascot one signature accessory, mark, ear, tail, or prop.'
    ];

  const steps = [
    `Warm up with three tiny versions of ${m.subject}. Each one should take less than 30 seconds.`,
    m.construction,
    ...formatSteps,
    `Skill drill: ${skill.drill}`,
    ...skill.steps,
    `Finish by applying this constraint: ${m.constraint}`,
    `Repeat once: ${m.upgrade}`
  ];

  $('#lessonSteps').innerHTML = steps.map(step => `<li>${escapeHTML(step)}</li>`).join('');

  $('#checklist').innerHTML = critiqueItems.map((item, index) => `
    <label class="check-item">
      <input type="checkbox" data-check="${index}" ${state.checklist[index] ? 'checked' : ''} />
      <span>${escapeHTML(item)}</span>
    </label>
  `).join('');

  $('#deskBrief').textContent = m.format === 'icon' ? `Icon: ${m.subject}` : `Mascot: ${m.subject}`;
  $('#deskTip').textContent = `${m.skill}: ${skill.how}`;
  $$('.mode-chip').forEach(button => button.classList.toggle('is-active', button.dataset.format === state.preferredFormat));
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

  if (state.activeTab === 'forge') {
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
      <p class="eyebrow">${escapeHTML(new Date(item.createdAt).toLocaleDateString())} • ${escapeHTML(item.format || 'mission')}</p>
      <h3>Draw ${escapeHTML(item.subject)}</h3>
      <p><strong>Skill:</strong> ${escapeHTML(item.skill)}<br>
      <strong>Constraint:</strong> ${escapeHTML(item.constraint)}<br>
      <strong>Personality:</strong> ${escapeHTML(item.mood)} ${item.archetype ? `• ${escapeHTML(item.archetype)}` : ''}<br>
      <strong>Upgrade:</strong> ${escapeHTML(item.upgrade)}</p>
      <footer>
        <button class="mini-button" data-action="load-saved" data-id="${escapeHTML(item.id)}">Load</button>
        <button class="mini-button" data-action="delete-saved" data-id="${escapeHTML(item.id)}">Delete</button>
      </footer>
    </article>
  `).join('');
}

function renderCodex() {
  const grid = $('#codexGrid');
  grid.innerHTML = skillBank.map(skill => `
    <article class="codex-card">
      <p class="eyebrow">${escapeHTML(skill.label)}</p>
      <h3>${escapeHTML(skill.short)}</h3>
      <p><strong>Meaning:</strong> ${escapeHTML(skill.what)}</p>
      <p><strong>Use it for:</strong> ${escapeHTML(skill.why)}</p>
      <p><strong>Practice:</strong> ${escapeHTML(skill.drill)}</p>
      <button class="mini-button" data-action="practice-skill" data-skill="${escapeHTML(skill.label)}">Practice this skill</button>
    </article>
  `).join('');
}

function render() {
  renderTabs();
  renderMission();
  renderLibrary();
  renderCodex();
  updateOnlineStatus();
}

function saveState() {
  const payload = {
    preferredFormat: state.preferredFormat,
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
    state.preferredFormat = ['mixed', 'icon', 'mascot'].includes(data.preferredFormat) ? data.preferredFormat : 'mixed';
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
  const skill = getSkill(m.skill);
  return [
    `GlyphForge Mission ${m.seed}`,
    `Format: ${m.format === 'icon' ? 'Icon / logo mark' : 'Character mascot'}`,
    `Draw ${m.subject}.`,
    `Skill: ${m.skill}`,
    `Skill meaning: ${skill.what}`,
    `Why it matters: ${skill.why}`,
    `Constraint: ${m.constraint}`,
    `Personality: Make it ${m.mood}. Role: ${m.archetype}.`,
    `Build: ${m.construction}`,
    `Drill: ${skill.drill}`,
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

    if (action === 'set-format') {
      state.preferredFormat = actionEl.dataset.format;
      saveState();
      createMission();
    }

    if (action === 'practice-skill') {
      const skill = getSkill(actionEl.dataset.skill);
      const format = state.preferredFormat === 'mixed' ? pick(['icon', 'mascot']) : state.preferredFormat;
      const subject = format === 'icon' ? pick(banks.iconSubjects) : pick(banks.mascotSubjects);
      const mood = pick(banks.moods);
      const archetype = pick(banks.archetypes);
      const seed = Math.random().toString(36).slice(2, 7).toUpperCase();
      state.mission = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${seed}`,
        seed,
        createdAt: new Date().toISOString(),
        format,
        subject,
        skill: skill.label,
        skillShort: skill.short,
        constraint: pick(banks.constraints),
        mood,
        archetype,
        upgrade: format === 'icon' ? pick(banks.iconUpgrades) : pick(banks.mascotUpgrades),
        construction: buildConstructionTip(subject, mood, skill.label, format, archetype)
      };
      state.checklist = {};
      state.activeTab = 'mission';
      saveState();
      render();
      drawGuideForMission();
      showToast(`${skill.label} mission loaded.`);
    }

    if (action === 'new-mission') createMission();

    if (action === 'save-mission') {
      if (!state.saved.some(item => item.id === state.mission.id)) {
        state.saved.unshift({ ...state.mission });
        state.saved = state.saved.slice(0, 80);
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
      await navigator.share({ title: 'GlyphForge drawing mission', text });
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
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function exportLibrary() {
  const blob = new Blob([JSON.stringify({ saved: state.saved }, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `glyphforge-library-${new Date().toISOString().slice(0,10)}.json`);
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
    downloadBlob(blob, `glyphforge-sketch-${Date.now()}.png`);
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
  const m = state.mission;
  const s = m.subject.toLowerCase();
  let svg = '';

  if (m.format === 'icon') {
    if (s.includes('cup') || s.includes('teapot')) {
      svg = `
        <rect x="18" y="14" width="64" height="64" rx="18"></rect>
        <ellipse cx="48" cy="35" rx="17" ry="7"></ellipse>
        <path d="M31 36 C34 61 38 68 49 69 C61 68 65 61 68 36"></path>
        <path d="M68 45 C82 45 82 60 68 60"></path>`;
    } else if (s.includes('moon') || s.includes('star') || s.includes('weather') || s.includes('cloud')) {
      svg = `
        <circle cx="50" cy="50" r="34"></circle>
        <path d="M58 26 C45 32 42 49 52 61 C42 59 34 50 34 40 C34 30 43 23 58 26z"></path>
        <path d="M31 63 C36 56 45 57 49 63 C54 58 65 59 69 66"></path>`;
    } else if (s.includes('fox') || s.includes('dragon')) {
      svg = `
        <rect x="18" y="16" width="64" height="64" rx="18"></rect>
        <path d="M30 40 L40 23 L50 38 L60 23 L70 40"></path>
        <path d="M31 43 C36 69 64 69 69 43"></path>
        <line x1="41" y1="50" x2="45" y2="50"></line>
        <line x1="55" y1="50" x2="59" y2="50"></line>`;
    } else {
      svg = `
        <rect x="17" y="17" width="66" height="66" rx="20"></rect>
        <circle cx="50" cy="47" r="20"></circle>
        <rect x="36" y="61" width="28" height="13" rx="5"></rect>
        <line x1="50" y1="22" x2="50" y2="78"></line>
        <line x1="24" y1="50" x2="76" y2="50"></line>`;
    }
  } else {
    if (s.includes('robot') || s.includes('lamp')) {
      svg = `
        <rect x="34" y="20" width="32" height="28" rx="8"></rect>
        <rect x="29" y="52" width="42" height="24" rx="10"></rect>
        <line x1="42" y1="33" x2="42" y2="33"></line>
        <line x1="58" y1="33" x2="58" y2="33"></line>
        <path d="M38 77 L32 88 M62 77 L68 88"></path>`;
    } else if (s.includes('dragon') || s.includes('fox') || s.includes('cat')) {
      svg = `
        <circle cx="50" cy="35" r="18"></circle>
        <path d="M35 29 L25 13 L43 24"></path>
        <path d="M65 29 L75 13 L57 24"></path>
        <path d="M35 55 C39 82 61 82 65 55"></path>
        <path d="M37 66 C25 68 22 80 33 83"></path>
        <path d="M63 66 C75 68 78 80 67 83"></path>`;
    } else if (s.includes('ghost') || s.includes('cloud') || s.includes('flame')) {
      svg = `
        <path d="M33 57 C23 42 32 24 50 24 C68 24 77 42 67 57 L67 78 L58 72 L50 80 L42 72 L33 78z"></path>
        <line x1="42" y1="45" x2="44" y2="45"></line>
        <line x1="56" y1="45" x2="58" y2="45"></line>
        <path d="M43 56 C47 60 53 60 57 56"></path>`;
    } else {
      svg = `
        <circle cx="50" cy="34" r="18"></circle>
        <path d="M36 54 C38 79 62 79 64 54"></path>
        <line x1="50" y1="16" x2="50" y2="86"></line>
        <path d="M34 65 C24 68 23 80 32 84"></path>
        <path d="M66 65 C76 68 77 80 68 84"></path>`;
    }
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
    format: 'mascot',
    subject: 'a confused cup mascot',
    skill: 'Shape language',
    skillShort: 'Use circles, squares, and triangles to control personality.',
    constraint: 'Use only 3 colors.',
    mood: 'confused',
    archetype: 'helper',
    upgrade: 'Create a mascot head icon.',
    construction: 'Start with triangles, tilted lines, and asymmetry. Build the confused cup mascot as a helper: big readable head/body masses first, then one accessory or pose detail that proves the mood is confused.'
  };
}
bindEvents();
render();
registerServiceWorker();
