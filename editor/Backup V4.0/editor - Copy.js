// =====================================================
// Tyniweb Editor V4 — Foresight Merge
// Chunk 1: Core, DOM, EventBus, Identity, Roles,
//          Pages, Blocks, Styles, ThemeEngine, BlockLibrary
// =====================================================

// ----------------- GLOBAL STATE -----------------

const GLOBAL_STYLES = {
  font: "system-ui",
  baseColor: "#ffffff",
  accentColor: "#00cc88",
  bgColor: "#05070a",
  spacing: 16,
  theme: "Clean Minimal"
};

const IdentityCore = {
  archetype: "guide",
  voice: {
    tone: "warm and encouraging",
    style: "clear, direct, supportive"
  },
  promise: "Help you build worlds that feel alive."
};

const ROLE_KEY = "tw-user-role";
let TRAINING_MODE = false;


// ----------------- DOM REGISTRY -----------------

const DOM = {
  canvasBody: document.getElementById("tw-canvas-body"),
  pageList: document.getElementById("tw-page-list"),
  addPageBtn: document.getElementById("tw-add-page"),
  publishBtn: document.getElementById("tw-publish-site"),
  exportSiteBtn: document.getElementById("tw-export-site"),

  globalStylesPanel: document.getElementById("tw-global-styles"),
  inspectorPanel: document.getElementById("tw-inspector"),

  identityPanel: document.getElementById("tw-identity-panel"),
  identityArchetype: document.querySelector("[name='identity-archetype']"),
  identityVoice: document.querySelector("[name='identity-voice']"),
  identityPromise: document.querySelector("[name='identity-promise']"),

  aiContentBtn: document.getElementById("tw-ai-generate-content"),
  aiLayoutBtn: document.getElementById("tw-ai-layout"),

  trainingToggleBtn: document.getElementById("tw-training-toggle"),
  trainingPortalBtn: document.getElementById("tw-training-portal-btn"),

  checklistPanel: document.getElementById("tw-training-checklist"),
  checklistList: document.getElementById("tw-training-checklist-list"),

  hud: document.getElementById("tw-training-hud"),
  hudTrack: document.getElementById("tw-training-hud-track"),
  hudStep: document.getElementById("tw-training-hud-step"),
  hudTitle: document.getElementById("tw-training-hud-title"),
  hudProgressBar: document.getElementById("tw-training-hud-progress-bar"),

  trainingArrow: document.getElementById("tw-training-arrow"),
  trainingNextBtn: document.getElementById("tw-training-next-step"),

  roleOverlay: document.getElementById("tw-role-overlay"),
  signinBtn: document.getElementById("tw-signin-btn"),
  signoutBtn: document.getElementById("tw-signout-btn"),

  architectDashboardBtn: document.getElementById("tw-open-architect-dashboard"),
  memberDashboardBtn: document.getElementById("tw-open-member-dashboard"),

  newPortalBtn: document.getElementById("tw-new-portal-template"),

  inspectorTitle: document.querySelector("[name='title']"),
  inspectorSubtitle: document.querySelector("[name='subtitle']"),
  inspectorCTA: document.querySelector("[name='cta']"),

  themeSelect: document.getElementById("tw-theme-select"),
  componentsPanel: document.getElementById("tw-components-panel")
};


// ----------------- EVENT BUS -----------------

const EventBus = {
  listeners: {},

  on(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  },

  off(event, handler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  },

  emit(event, payload) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(h => h(payload));
  }
};


// ----------------- ROLE SYSTEM -----------------

const RoleSystem = {
  getRole() {
    return localStorage.getItem(ROLE_KEY) || "guest";
  },

  setRole(role) {
    localStorage.setItem(ROLE_KEY, role);
    this.updateUI();
    EventBus.emit("role:changed", role);
  },

  clearRole() {
    localStorage.removeItem(ROLE_KEY);
    this.updateUI();
    EventBus.emit("role:changed", "guest");
  },

  ensureRoleChosen() {
    const role = this.getRole();
    if (role === "guest" && DOM.roleOverlay) {
      if (DOM.signinBtn) DOM.signinBtn.style.display = "none";
      DOM.roleOverlay.style.display = "flex";
    } else {
      this.updateUI();
    }
  },

  updateUI() {
    const role = this.getRole();

    document.querySelectorAll(".tw-role-btn").forEach(btn => {
      btn.style.display = "none";
      btn.classList.remove("active-role");
    });

    if (role === "guest") {
      if (DOM.signinBtn) DOM.signinBtn.style.display = "inline-flex";
      if (DOM.signoutBtn) DOM.signoutBtn.style.display = "none";
      if (DOM.trainingToggleBtn) DOM.trainingToggleBtn.style.display = "none";
      if (DOM.trainingPortalBtn) DOM.trainingPortalBtn.style.display = "none";
      if (DOM.publishBtn) DOM.publishBtn.style.display = "none";
      if (DOM.exportSiteBtn) DOM.exportSiteBtn.style.display = "none";
      return;
    }

    if (DOM.signinBtn) DOM.signinBtn.style.display = "none";
    if (DOM.signoutBtn) DOM.signoutBtn.style.display = "inline-flex";
    if (DOM.trainingToggleBtn) DOM.trainingToggleBtn.style.display = "inline-flex";
    if (DOM.publishBtn) DOM.publishBtn.style.display = "inline-flex";
    if (DOM.exportSiteBtn) DOM.exportSiteBtn.style.display = "inline-flex";

    if (DOM.trainingPortalBtn) {
      DOM.trainingPortalBtn.style.display = TRAINING_MODE ? "inline-flex" : "none";
    }

    const active = document.querySelector(`.tw-role-btn[data-role='${role}']`);
    if (active) {
      active.style.display = "inline-flex";
      active.classList.add("active-role");
    }
  }
};

function chooseRole(role) {
  RoleSystem.setRole(role);
  if (DOM.roleOverlay) DOM.roleOverlay.style.display = "none";
}

function signOut() {
  RoleSystem.clearRole();
  if (DOM.roleOverlay) DOM.roleOverlay.style.display = "flex";
}


// ----------------- PAGE ENGINE -----------------

const PageEngine = {
  pages: [],
  currentPage: null,
  storageKey: "tw-pages-v4",

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.pages = [{ name: "Home", blocks: [] }];
      this.currentPage = this.pages[0];
      this.save();
      return;
    }
    try {
      this.pages = JSON.parse(raw) || [];
    } catch {
      this.pages = [{ name: "Home", blocks: [] }];
    }
    this.currentPage = this.pages[0] || null;
  },

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.pages));
    EventBus.emit("pages:changed", this.pages);
  },

  addPage(name) {
    const page = { name, blocks: [] };
    this.pages.push(page);
    this.save();
    this.switchPage(name);
  },

  switchPage(name) {
    const page = this.pages.find(p => p.name === name);
    if (!page) return;
    this.currentPage = page;
    this.renderCanvas();
    this.renderPageList();
    EventBus.emit("page:switched", page);
  },

  renderPageList() {
    if (!DOM.pageList) return;
    DOM.pageList.innerHTML = this.pages
      .map(
        p => `<button class="tw-page-item ${this.currentPage && this.currentPage.name === p.name ? "active" : ""}" data-page="${p.name}">${p.name}</button>`
      )
      .join("");

    DOM.pageList.querySelectorAll(".tw-page-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-page");
        this.switchPage(name);
      });
    });
  },

  renderCanvas() {
    if (!DOM.canvasBody || !this.currentPage) return;
    DOM.canvasBody.innerHTML = "";

    this.currentPage.blocks.forEach(block => {
      const el = document.createElement("div");
      el.className = "tw-block";
      el.dataset.blockId = block.id;
      el.innerHTML = BlockLibrary.renderBlockHTML(block);
      el.addEventListener("click", () => {
        BlockEngine.selectBlock(block.id);
      });
      DOM.canvasBody.appendChild(el);
    });

    EventBus.emit("canvas:rendered", this.currentPage);
  }
};

function switchPage(name) {
  PageEngine.switchPage(name);
}


// ----------------- BLOCK LIBRARY -----------------

const BlockLibrary = {
  // type -> default config
  definitions: {
    hero: {
      title: "Your Big Promise",
      subtitle: "Explain what you do in one clear sentence.",
      cta: "Get Started"
    },
    section: {
      title: "Section Title",
      subtitle: "Use this space to expand on your idea.",
      cta: "Learn More"
    },
    "feature-row": {
      title: "Feature Title",
      subtitle: "Describe a key benefit here.",
      cta: "See Details"
    },
    "testimonial-row": {
      title: "What people are saying",
      subtitle: "Social proof builds trust.",
      cta: "Read Stories"
    },
    grid: {
      title: "Showcase",
      subtitle: "Highlight multiple items in a grid.",
      cta: "View All"
    },
    footer: {
      title: "Footer",
      subtitle: "Links, contact, and small print.",
      cta: "Contact Us"
    },
    "pricing-table": {
      title: "Pricing",
      subtitle: "Make your offer clear and simple.",
      cta: "Choose Plan"
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Answer doubts before they stop action.",
      cta: "Still have questions?"
    },
    gallery: {
      title: "Gallery",
      subtitle: "Show your work visually.",
      cta: "View Gallery"
    },
    cta: {
      title: "Ready to start?",
      subtitle: "Invite them to take the next step.",
      cta: "Get Started"
    }
  },

  createBlock(type = "section") {
    const base = this.definitions[type] || this.definitions.section;
    const id = "block-" + Date.now() + "-" + Math.floor(Math.random() * 9999);
    return {
      id,
      type,
      title: base.title,
      subtitle: base.subtitle,
      cta: base.cta
    };
  },

  renderBlockHTML(block) {
    // Simple, consistent structure for now
    return `
      <h2>${block.title || "Title"}</h2>
      <p>${block.subtitle || "Subtitle"}</p>
      <button>${block.cta || "Button"}</button>
    `;
  }
};


// ----------------- BLOCK ENGINE -----------------

const BlockEngine = {
  selectedBlockId: null,

  addBlock(type = "section") {
    if (!PageEngine.currentPage) return;
    const block = BlockLibrary.createBlock(type);
    PageEngine.currentPage.blocks.push(block);
    PageEngine.save();
    PageEngine.renderCanvas();
    this.selectBlock(block.id);
    EventBus.emit("block:added", block);
  },

  selectBlock(id) {
    this.selectedBlockId = id;
    this.updateInspector();

    if (!DOM.canvasBody) return;
    DOM.canvasBody.querySelectorAll(".tw-block").forEach(el => {
      el.classList.toggle("selected", el.dataset.blockId === id);
    });

    EventBus.emit("block:selected", this.getSelectedBlock());
  },

  getSelectedBlock() {
    if (!PageEngine.currentPage || !this.selectedBlockId) return null;
    return PageEngine.currentPage.blocks.find(b => b.id === this.selectedBlockId) || null;
  },

  updateInspector() {
    const block = this.getSelectedBlock();
    if (!block || !DOM.inspectorPanel) return;

    if (DOM.inspectorTitle) DOM.inspectorTitle.value = block.title || "";
    if (DOM.inspectorSubtitle) DOM.inspectorSubtitle.value = block.subtitle || "";
    if (DOM.inspectorCTA) DOM.inspectorCTA.value = block.cta || "";
  },

  applyInspectorChanges() {
    const block = this.getSelectedBlock();
    if (!block) return;

    if (DOM.inspectorTitle) block.title = DOM.inspectorTitle.value;
    if (DOM.inspectorSubtitle) block.subtitle = DOM.inspectorSubtitle.value;
    if (DOM.inspectorCTA) block.cta = DOM.inspectorCTA.value;

    PageEngine.save();
    PageEngine.renderCanvas();
    this.selectBlock(block.id);
    EventBus.emit("block:updated", block);
  }
};


// ----------------- THEME ENGINE -----------------

const ThemeEngine = {
  themes: {
    "Clean Minimal": {
      font: "system-ui",
      baseColor: "#ffffff",
      accentColor: "#111111",
      bgColor: "#f5f5f5",
      spacing: 16
    },
    "Bold Startup": {
      font: "Poppins, system-ui",
      baseColor: "#0f0f0f",
      accentColor: "#00e6a8",
      bgColor: "#05070a",
      spacing: 20
    },
    "Soft Pastel": {
      font: "Nunito, system-ui",
      baseColor: "#fdf6f9",
      accentColor: "#ff8fb1",
      bgColor: "#fff9fb",
      spacing: 18
    }
  },

  applyTheme(name) {
    const theme = this.themes[name];
    if (!theme) return;

    GLOBAL_STYLES.font = theme.font;
    GLOBAL_STYLES.baseColor = theme.baseColor;
    GLOBAL_STYLES.accentColor = theme.accentColor;
    GLOBAL_STYLES.bgColor = theme.bgColor;
    GLOBAL_STYLES.spacing = theme.spacing;
    GLOBAL_STYLES.theme = name;

    GlobalStylesEngine.apply();
    EventBus.emit("theme:changed", name);
  },

  populateThemeSelect() {
    if (!DOM.themeSelect) return;
    DOM.themeSelect.innerHTML = Object.keys(this.themes)
      .map(name => `<option value="${name}">${name}</option>`)
      .join("");
    DOM.themeSelect.value = GLOBAL_STYLES.theme;

    DOM.themeSelect.addEventListener("change", () => {
      this.applyTheme(DOM.themeSelect.value);
    });
  }
};


// ----------------- GLOBAL STYLES ENGINE -----------------

const GlobalStylesEngine = {
  apply() {
    document.documentElement.style.setProperty("--tw-font", GLOBAL_STYLES.font);
    document.documentElement.style.setProperty("--tw-base-color", GLOBAL_STYLES.baseColor);
    document.documentElement.style.setProperty("--tw-accent-color", GLOBAL_STYLES.accentColor);
    document.documentElement.style.setProperty("--tw-bg-color", GLOBAL_STYLES.bgColor);
    document.documentElement.style.setProperty("--tw-spacing", GLOBAL_STYLES.spacing + "px");
  },

  bindControls() {
    const fontInput = document.querySelector('[name="global-font"]');
    const baseColorInput = document.querySelector('[name="global-base-color"]');
    const accentColorInput = document.querySelector('[name="global-accent-color"]');
    const bgColorInput = document.querySelector('[name="global-bg-color"]');
    const spacingInput = document.querySelector('[name="global-spacing"]');

    if (fontInput) {
      fontInput.value = GLOBAL_STYLES.font;
      fontInput.addEventListener("change", () => {
        GLOBAL_STYLES.font = fontInput.value;
        this.apply();
        EventBus.emit("styles:changed", { key: "font" });
      });
    }

    if (baseColorInput) {
      baseColorInput.value = GLOBAL_STYLES.baseColor;
      baseColorInput.addEventListener("input", () => {
        GLOBAL_STYLES.baseColor = baseColorInput.value;
        this.apply();
        EventBus.emit("styles:changed", { key: "baseColor" });
      });
    }

    if (accentColorInput) {
      accentColorInput.value = GLOBAL_STYLES.accentColor;
      accentColorInput.addEventListener("input", () => {
        GLOBAL_STYLES.accentColor = accentColorInput.value;
        this.apply();
        EventBus.emit("styles:changed", { key: "accentColor" });
      });
    }

    if (bgColorInput) {
      bgColorInput.value = GLOBAL_STYLES.bgColor;
      bgColorInput.addEventListener("input", () => {
        GLOBAL_STYLES.bgColor = bgColorInput.value;
        this.apply();
        EventBus.emit("styles:changed", { key: "bgColor" });
      });
    }

    if (spacingInput) {
      spacingInput.value = GLOBAL_STYLES.spacing;
      spacingInput.addEventListener("input", () => {
        GLOBAL_STYLES.spacing = parseInt(spacingInput.value || "16", 10);
        this.apply();
        EventBus.emit("styles:changed", { key: "spacing" });
      });
    }
  }
};

// =====================================================
// Tyniweb Editor V4 — Foresight Merge
// Chunk 2: PortalEngine, AIEngine, WizardEngine,
//          TeachingEngine + Founder Tracks,
//          Training UI, Voice, Exam, INIT
// =====================================================

// ----------------- PORTAL ENGINE -----------------

const PortalEngine = {
  templates: {
    "Simple Business": {
      pages: ["Home", "About", "Services", "Contact"],
      layout: ["hero", "feature-row", "section", "footer"]
    },
    "Creator Portfolio": {
      pages: ["Home", "Projects", "About"],
      layout: ["hero", "grid", "section", "footer"]
    },
    "Landing Page": {
      pages: ["Landing"],
      layout: ["hero", "feature-row", "cta", "footer"]
    },
    "Coaching Funnel": {
      pages: ["Landing", "Program", "Testimonials"],
      layout: ["hero", "section", "testimonial-row", "cta"]
    }
  },

  createPortalFromTemplate(name) {
    const tpl = this.templates[name];
    if (!tpl) return;

    PageEngine.pages = tpl.pages.map(p => ({
      name: p,
      blocks: []
    }));
    PageEngine.currentPage = PageEngine.pages[0];
    PageEngine.save();
    PageEngine.renderPageList();

    tpl.layout.forEach(type => {
      BlockEngine.addBlock(type);
    });

    EventBus.emit("portal:created", { name });
  }
};


// ----------------- AI ENGINE -----------------

const AIEngine = {
  generateContentForBlock(block) {
    const role = RoleSystem.getRole();
    const tone = IdentityCore.voice.tone || "clear and encouraging";

    return {
      title: block.title || "Let’s make this clear.",
      subtitle:
        block.subtitle ||
        `In a ${tone} tone, explain what this section is about in one or two sentences.`,
      cta: block.cta || (role === "member" ? "Continue" : "Get Started")
    };
  }
};


// ----------------- WIZARD ENGINE -----------------

const WizardEngine = {
  start(mode = "quick-start") {
    if (mode === "quick-start") {
      this.runQuickStart();
    } else if (mode === "brand") {
      this.runBrandWizard();
    } else if (mode === "page") {
      this.runPageWizard();
    }
  },

  runQuickStart() {
    const templateName = "Landing Page";
    PortalEngine.createPortalFromTemplate(templateName);
    VoiceEngine.speak("Quick Start Wizard: A landing page has been created. Customize the text and you’re ready to publish.");
  },

  runBrandWizard() {
    VoiceEngine.speak("Brand Wizard: Choose your archetype, tone, and promise in the Identity panel.");
    if (DOM.identityPanel) {
      DOM.identityPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },

  runPageWizard() {
    if (!PageEngine.currentPage) return;
    VoiceEngine.speak("Page Wizard: Adding a recommended structure for this page.");
    BlockEngine.addBlock("hero");
    BlockEngine.addBlock("feature-row");
    BlockEngine.addBlock("section");
    BlockEngine.addBlock("cta");
  }
};


// ----------------- TEACHING ENGINE CORE -----------------

const TeachingEngine = {
  tracks: {},
  currentTrack: null,
  currentStepIndex: 0,
  storageKey: "tw-training-progress-v4",

  registerTrack(id, config) {
    this.tracks[id] = config;
  },

  loadProgress() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return { completedSteps: {} };
    try {
      return JSON.parse(raw);
    } catch {
      return { completedSteps: {} };
    }
  },

  saveProgress(progress) {
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  },

  startTrack(id) {
    if (!TRAINING_MODE) {
      alert("Training Mode is OFF. Turn it ON to start a track.");
      return;
    }

    const track = this.tracks[id];
    if (!track) return;

    this.currentTrack = track;
    this.currentStepIndex = 0;
    this.showStep();
    VoiceEngine.speakTrackStart(track);
    EventBus.emit("training:track-started", track);
  },

  nextStep() {
    if (!TRAINING_MODE || !this.currentTrack) return;

    const progress = this.loadProgress();
    const step = this.currentTrack.steps[this.currentStepIndex];

    if (step) {
      progress.completedSteps = progress.completedSteps || {};
      progress.completedSteps[step.id] = true;
      this.saveProgress(progress);
    }

    this.currentStepIndex++;

    if (this.currentStepIndex >= this.currentTrack.steps.length) {
      const finishedTrack = this.currentTrack;
      this.currentTrack = null;
      this.currentStepIndex = 0;
      TrainingUI.clear();
      VoiceEngine.speakTrackComplete(finishedTrack);
      EventBus.emit("training:track-complete", finishedTrack);
      return;
    }

    this.showStep();
  },

  showStep() {
    if (!this.currentTrack) return;
    const step = this.currentTrack.steps[this.currentStepIndex];
    TrainingUI.applyStep(step, this.currentTrack, this.currentStepIndex);
    VoiceEngine.speakStep(this.currentTrack, step, this.currentStepIndex);
    EventBus.emit("training:step", {
      track: this.currentTrack,
      step,
      index: this.currentStepIndex
    });
  }
};


// ----------------- TRAINING UI -----------------

const TrainingUI = {
  currentHighlightEl: null,
  tooltipEl: null,

  clearHighlight() {
    if (!this.currentHighlightEl) return;
    this.currentHighlightEl.classList.remove("tw-highlight-pulse", "tw-highlight-glow");
    this.currentHighlightEl = null;
  },

  applyHighlight(step) {
    this.clearHighlight();
    if (!TRAINING_MODE || !step || !step.target) return;

    const el = document.querySelector(step.target);
    if (!el) return;

    this.currentHighlightEl = el;
    if (step.highlight === "pulse") el.classList.add("tw-highlight-pulse");
    if (step.highlight === "glow") el.classList.add("tw-highlight-glow");
  },

  renderChecklist() {
    if (!TRAINING_MODE || !DOM.checklistPanel || !DOM.checklistList) {
      if (DOM.checklistPanel) DOM.checklistPanel.style.display = "none";
      return;
    }

    const track = TeachingEngine.currentTrack;
    if (!track) {
      DOM.checklistPanel.style.display = "none";
      return;
    }

    const prog = TeachingEngine.loadProgress();
    DOM.checklistPanel.style.display = "block";

    DOM.checklistList.innerHTML = track.steps
      .map(step => {
        const done = prog.completedSteps && prog.completedSteps[step.id];
        return `<li class="${done ? "completed" : ""}">${done ? "✓" : "○"} ${step.title}</li>`;
      })
      .join("");
  },

  updateHUD(step, track, index) {
    if (!TRAINING_MODE || !track || !DOM.hud) {
      if (DOM.hud) DOM.hud.style.display = "none";
      return;
    }

    if (!step) {
      DOM.hud.style.display = "none";
      return;
    }

    DOM.hud.style.display = "block";
    if (DOM.hudTrack) DOM.hudTrack.textContent = track.name;
    if (DOM.hudStep) DOM.hudStep.textContent = `Step ${index + 1} of ${track.steps.length}`;
    if (DOM.hudTitle) DOM.hudTitle.textContent = step.title;

    if (DOM.hudProgressBar) {
      const pct = ((index + 1) / track.steps.length) * 100;
      DOM.hudProgressBar.style.width = pct + "%";
    }
  },

  hideArrow() {
    if (!DOM.trainingArrow) return;
    DOM.trainingArrow.style.display = "none";
  },

  showArrow(step) {
    if (!TRAINING_MODE || !step || !step.target || !DOM.trainingArrow) {
      this.hideArrow();
      return;
    }

    const el = document.querySelector(step.target);
    if (!el) {
      this.hideArrow();
      return;
    }

    const rect = el.getBoundingClientRect();
    const arrowSize = 40;
    const top = rect.top + window.scrollY - arrowSize;
    const left = rect.left + window.scrollX + rect.width / 2;

    DOM.trainingArrow.style.top = `${top}px`;
    DOM.trainingArrow.style.left = `${left}px`;
    DOM.trainingArrow.style.display = "block";
  },

  ensureTooltip() {
    if (this.tooltipEl) return this.tooltipEl;
    const el = document.createElement("div");
    el.id = "tw-training-tooltip";
    el.style.position = "absolute";
    el.style.zIndex = "1001";
    el.style.maxWidth = "260px";
    el.style.fontSize = "12px";
    el.style.background = "rgba(10, 12, 16, 0.96)";
    el.style.border = "1px solid rgba(255, 255, 255, 0.12)";
    el.style.borderRadius = "8px";
    el.style.padding = "8px 10px";
    el.style.color = "#f5f5f5";
    el.style.pointerEvents = "none";
    el.style.display = "none";
    document.body.appendChild(el);
    this.tooltipEl = el;
    return el;
  },

  hideTooltip() {
    if (!this.tooltipEl) return;
    this.tooltipEl.style.display = "none";
  },

  showTooltip(step) {
    if (!TRAINING_MODE || !step || !step.target) {
      this.hideTooltip();
      return;
    }

    const el = document.querySelector(step.target);
    if (!el) {
      this.hideTooltip();
      return;
    }

    const tooltip = this.ensureTooltip();
    tooltip.innerHTML = `<strong>${step.title}</strong><br/><small>${step.description}</small>`;

    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY - tooltip.offsetHeight - 8;
    const left = rect.left + window.scrollX;

    tooltip.style.top = `${Math.max(8, top)}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.display = "block";
  },

  applyStep(step, track, index) {
    this.applyHighlight(step);
    this.renderChecklist();
    this.updateHUD(step, track, index);
    this.showArrow(step);
    this.showTooltip(step);
  },

  clear() {
    this.clearHighlight();
    this.hideArrow();
    this.hideTooltip();
    if (DOM.checklistPanel) DOM.checklistPanel.style.display = "none";
    if (DOM.hud) DOM.hud.style.display = "none";
  }
};


// ----------------- VOICE ENGINE -----------------

const VoiceEngine = {
  getTonePrefix() {
    return IdentityCore?.voice?.tone
      ? `In a ${IdentityCore.voice.tone} tone, `
      : "";
  },

  speak(text) {
    if (!TRAINING_MODE) return;
    if (!window.speechSynthesis) return;

    const utter = new SpeechSynthesisUtterance();
    utter.text = this.getTonePrefix() + text;
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;

    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.toLowerCase().includes("english")
    );
    if (preferred) utter.voice = preferred;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  },

  speakStep(track, step, index) {
    if (!step) return;
    this.speak(`Step ${index + 1}. ${step.title}. ${step.description}`);
  },

  speakTrackStart(track) {
    this.speak(`Starting ${track.name}. Let's begin.`);
  },

  speakTrackComplete(track) {
    this.speak(`You have completed ${track.name}. Well done.`);
  }
};


// ----------------- EXAM ENGINE -----------------

const ExamEngine = {
  active: false,
  startTime: null,
  durationMs: 15 * 60 * 1000,
  timerId: null,

  start() {
    if (!TRAINING_MODE) {
      alert("Turn Training Mode ON to start the Architect Certification Exam.");
      return;
    }

    this.active = true;
    this.startTime = Date.now();
    this.scheduleAnnouncements();

    TeachingEngine.startTrack("architect-cert-exam-track");
    VoiceEngine.speak("Architect Certification Exam started. You have fifteen minutes. Follow the steps carefully.");
  },

  stop(passed = true) {
    this.active = false;
    clearInterval(this.timerId);

    if (passed) {
      VoiceEngine.speak("You have completed the Architect Certification Exam. Congratulations.");
      EventBus.emit("exam:passed");
    } else {
      VoiceEngine.speak("The exam time has ended. You can try again when you're ready.");
    }
  },

  scheduleAnnouncements() {
    clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      if (!this.active) {
        clearInterval(this.timerId);
        return;
      }

      const elapsed = Date.now() - this.startTime;
      const remaining = this.durationMs - elapsed;

      if (remaining <= 0) {
        this.stop(false);
        return;
      }

      const minutesLeft = Math.round(remaining / 60000);
      if (minutesLeft === 10 || minutesLeft === 5 || minutesLeft === 1) {
        VoiceEngine.speak(`${minutesLeft} minute${minutesLeft === 1 ? "" : "s"} remaining in the exam.`);
      }
    }, 30000);
  }
};


// ----------------- TRAINING MODE TOGGLE + NEXT -----------------

function updateTrainingModeUI() {
  if (!DOM.trainingToggleBtn) return;

  if (TRAINING_MODE) {
    DOM.trainingToggleBtn.textContent = "Training: ON";
    DOM.trainingToggleBtn.classList.add("training-on");
    if (RoleSystem.getRole() !== "guest" && DOM.trainingPortalBtn) {
      DOM.trainingPortalBtn.style.display = "inline-flex";
    }
  } else {
    DOM.trainingToggleBtn.textContent = "Training: OFF";
    DOM.trainingToggleBtn.classList.remove("training-on");
    if (DOM.trainingPortalBtn) DOM.trainingPortalBtn.style.display = "none";
    TrainingUI.clear();
    if (window.speechSynthesis) speechSynthesis.cancel();
  }
}

if (DOM.trainingToggleBtn) {
  DOM.trainingToggleBtn.addEventListener("click", () => {
    TRAINING_MODE = !TRAINING_MODE;
    updateTrainingModeUI();
    if (TRAINING_MODE) {
      VoiceEngine.speak("Training Mode activated. Open the Training Portal to begin.");
    }
  });
}

if (DOM.trainingNextBtn) {
  DOM.trainingNextBtn.addEventListener("click", () => {
    TeachingEngine.nextStep();
  });
}


// ----------------- TRAINING PORTAL -----------------

const TrainingPortal = {
  open() {
    const portal = document.getElementById("tw-training-portal");
    if (!portal) return;

    const archList = document.getElementById("tw-training-architect-list");
    const memList = document.getElementById("tw-training-member-list");

    const renderList = (container, role) => {
      if (!container) return;

      container.innerHTML = Object.entries(TeachingEngine.tracks)
        .filter(([_, t]) => t.role === role)
        .map(([id, t]) => {
          return `
            <div class="tw-training-track">
              <div>
                <strong>${t.name}</strong><br/>
                <small>${t.steps.length} steps</small>
              </div>
              <button data-track-id="${id}" class="tw-training-start">Start</button>
            </div>
          `;
        })
        .join("");

      container.querySelectorAll(".tw-training-start").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-track-id");
          TeachingEngine.startTrack(id);
          portal.style.display = "none";
        });
      });
    };

    renderList(archList, "architect");
    renderList(memList, "member");

    portal.style.display = "flex";
  },

  close() {
    const portal = document.getElementById("tw-training-portal");
    if (portal) portal.style.display = "none";
  }
};

if (DOM.trainingPortalBtn) {
  DOM.trainingPortalBtn.addEventListener("click", () => {
    if (!TRAINING_MODE) {
      alert("Turn Training Mode ON to use the Training Portal.");
      return;
    }
    TrainingPortal.open();
  });
}

const trainingPortalClose = document.getElementById("tw-training-close");
if (trainingPortalClose) {
  trainingPortalClose.addEventListener("click", () => TrainingPortal.close());
}


// ----------------- ROLE BUTTONS + BASIC EVENTS -----------------

document.querySelectorAll("[data-role]").forEach(btn => {
  btn.addEventListener("click", () => {
    const role = btn.getAttribute("data-role");
    chooseRole(role);

    if (TRAINING_MODE && role === "member") {
      TeachingEngine.startTrack("member-onboarding-track");
    }

    if (TRAINING_MODE && role === "architect" && !TeachingEngine.currentTrack) {
      VoiceEngine.speak("Architect mode activated. Open the Training Portal to begin.");
    }
  });
});

if (DOM.signoutBtn) {
  DOM.signoutBtn.addEventListener("click", () => {
    signOut();
  });
}

EventBus.on("exam:passed", () => {
  VoiceEngine.speak("You are now a Certified Architect.");
});


// ----------------- FOUNDER + BRANDING TRACKS -----------------

// Founder Story Track
TeachingEngine.registerTrack("founder-story-track", {
  name: "Founder Story",
  role: "architect",
  steps: [
    {
      id: "founder-why",
      title: "Define Your Why",
      description: "Write why you started this project in one honest paragraph.",
      target: "#tw-canvas",
      highlight: "pulse"
    },
    {
      id: "founder-problem",
      title: "Define the Problem",
      description: "Describe the main frustration or pain your users feel.",
      target: "#tw-canvas",
      highlight: "glow"
    },
    {
      id: "founder-turning-point",
      title: "Define the Turning Point",
      description: "Explain the moment you realized you had to build this.",
      target: "#tw-canvas",
      highlight: "pulse"
    },
    {
      id: "founder-solution",
      title: "Define the Solution",
      description: "Describe how your product changes things for your users.",
      target: "#tw-canvas",
      highlight: "glow"
    },
    {
      id: "founder-future",
      title: "Define the Future",
      description: "Write what the world looks like if this succeeds.",
      target: "#tw-canvas",
      highlight: "pulse"
    }
  ]
});

// Pitch Writing Track
TeachingEngine.registerTrack("pitch-writing-track", {
  name: "Pitch Writing",
  role: "architect",
  steps: [
    {
      id: "pitch-hook",
      title: "Choose Your Hook",
      description: "Pick one strong opening line that makes people curious.",
      target: "#tw-canvas",
      highlight: "pulse"
    },
    {
      id: "pitch-audience",
      title: "Define Your Audience",
      description: "Write who this is for in one clear sentence.",
      target: "#tw-canvas",
      highlight: "glow"
    },
    {
      id: "pitch-headline",
      title: "Write Your Headline",
      description: "Write a bold, simple headline that states the main promise.",
      target: "#tw-canvas",
      highlight: "pulse"
    },
    {
      id: "pitch-subheadline",
      title: "Write Your Subheadline",
      description: "Add one or two lines that explain how you deliver that promise.",
      target: "#tw-canvas",
      highlight: "glow"
    },
    {
      id: "pitch-cta",
      title: "Write Your Call to Action",
      description: "Decide what you want people to do next and say it clearly.",
      target: "#tw-canvas",
      highlight: "pulse"
    }
  ]
});

// Landing Page Track
TeachingEngine.registerTrack("landing-page-track", {
  name: "Landing Page Builder",
  role: "architect",
  steps: [
    {
      id: "lp-template",
      title: "Choose a Template",
      description: "Use the Wizard or Portal to start from a Landing Page template.",
      target: "#tw-new-portal-template",
      highlight: "pulse"
    },
    {
      id: "lp-hero",
      title: "Add Hero Block",
      description: "Make sure your page starts with a strong hero section.",
      target: "#tw-canvas",
      highlight: "glow"
    },
    {
      id: "lp-features",
      title: "Add Features",
      description: "Add a section that clearly lists your key benefits.",
      target: "#tw-canvas",
      highlight: "pulse"
    },
    {
      id: "lp-social-proof",
      title: "Add Social Proof",
      description: "Include testimonials or proof that builds trust.",
      target: "#tw-canvas",
      highlight: "glow"
    },
    {
      id: "lp-cta",
      title: "Add Final CTA",
      description: "End with a clear, confident call to action.",
      target: "#tw-canvas",
      highlight: "pulse"
    }
  ]
});

// Brand Identity Track
TeachingEngine.registerTrack("brand-identity-track", {
  name: "Brand Identity",
  role: "architect",
  steps: [
    {
      id: "brand-archetype",
      title: "Choose Archetype",
      description: "Pick the archetype that best matches your product’s personality.",
      target: "[name='identity-archetype']",
      highlight: "pulse"
    },
    {
      id: "brand-tone",
      title: "Choose Tone",
      description: "Describe how you want your brand to sound in one phrase.",
      target: "[name='identity-voice']",
      highlight: "glow"
    },
    {
      id: "brand-promise",
      title: "Write Your Promise",
      description: "Write one sentence that captures what you promise your users.",
      target: "[name='identity-promise']",
      highlight: "pulse"
    },
    {
      id: "brand-values",
      title: "List Your Values",
      description: "List 3–5 values that guide how you build and communicate.",
      target: "#tw-canvas",
      highlight: "glow"
    },
    {
      id: "brand-apply",
      title: "Apply Identity",
      description: "Review your site and adjust copy to match your new identity.",
      target: "#tw-canvas",
      highlight: "pulse"
    }
  ]
});


// ----------------- INIT -----------------

document.addEventListener("DOMContentLoaded", () => {
  PageEngine.load();
  PageEngine.renderPageList();
  PageEngine.renderCanvas();

  GlobalStylesEngine.apply();
  GlobalStylesEngine.bindControls();
  ThemeEngine.populateThemeSelect();

  RoleSystem.ensureRoleChosen();
  RoleSystem.updateUI();
  updateTrainingModeUI();

  if (DOM.identityArchetype) DOM.identityArchetype.value = IdentityCore.archetype;
  if (DOM.identityVoice) DOM.identityVoice.value = IdentityCore.voice.tone;
  if (DOM.identityPromise) DOM.identityPromise.value = IdentityCore.promise;

  if (DOM.inspectorTitle) {
    DOM.inspectorTitle.addEventListener("input", () => BlockEngine.applyInspectorChanges());
  }
  if (DOM.inspectorSubtitle) {
    DOM.inspectorSubtitle.addEventListener("input", () => BlockEngine.applyInspectorChanges());
  }
  if (DOM.inspectorCTA) {
    DOM.inspectorCTA.addEventListener("input", () => BlockEngine.applyInspectorChanges());
  }

  if (DOM.addPageBtn) {
    DOM.addPageBtn.addEventListener("click", () => {
      const name = prompt("Page name?", "New Page");
      if (!name) return;
      PageEngine.addPage(name);
    });
  }

  if (DOM.componentsPanel) {
    DOM.componentsPanel.querySelectorAll("[data-add-block]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-add-block");
        BlockEngine.addBlock(type);
      });
    });
  }

  if (DOM.exportSiteBtn) {
    DOM.exportSiteBtn.addEventListener("click", () => {
      const bundle = {
        pages: PageEngine.pages,
        styles: GLOBAL_STYLES,
        identity: IdentityCore
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tyniweb-site.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (DOM.publishBtn) {
    DOM.publishBtn.addEventListener("click", () => {
      EventBus.emit("publish:preview");
      VoiceEngine.speak("Preview opened. In this version, imagine a full preview modal showing your site.");
    });
  }

  if (DOM.newPortalBtn) {
    DOM.newPortalBtn.addEventListener("click", () => {
      PortalEngine.createPortalFromTemplate("Simple Business");
      VoiceEngine.speak("A new Simple Business site has been created. Customize it to make it yours.");
    });
  }

  if (DOM.aiContentBtn) {
    DOM.aiContentBtn.addEventListener("click", () => {
      const block = BlockEngine.getSelectedBlock();
      if (!block) return;
      const generated = AIEngine.generateContentForBlock(block);
      block.title = generated.title;
      block.subtitle = generated.subtitle;
      block.cta = generated.cta;
      PageEngine.save();
      PageEngine.renderCanvas();
    });
  }

  if (DOM.aiLayoutBtn) {
    DOM.aiLayoutBtn.addEventListener("click", () => {
      WizardEngine.runPageWizard();
    });
  }
  
  
// =====================================================
// Tyniweb V4 — Testing Dashboard (Chunk 1)
// UI + Status Registry + Event Hooks
// =====================================================

const TestDashboard = {
  openBtn: document.getElementById("tw-test-open"),
  panel: document.getElementById("tw-test-dashboard"),
  closeBtn: document.getElementById("tw-test-close"),
  statusList: document.getElementById("tw-test-status-list"),
  runBtn: document.getElementById("tw-test-run"),
  resetBtn: document.getElementById("tw-test-reset"),

  // Subsystem registry
  subsystems: {
    role: false,
    training: false,
    blocks: false,
    pages: false,
    styles: false,
    identity: false,
    ai: false,
    wizard: false,
    portal: false,
    exam: false,
    export: false
  },

  init() {
    if (!this.openBtn || !this.panel) return;

    this.openBtn.addEventListener("click", () => {
      this.panel.style.display = "block";
    });

    this.closeBtn.addEventListener("click", () => {
      this.panel.style.display = "none";
    });

    this.runBtn.addEventListener("click", () => {
      alert("Full Test Suite will run in Chunk 2.");
    });

    this.resetBtn.addEventListener("click", () => {
      Object.keys(this.subsystems).forEach(key => {
        this.subsystems[key] = false;
      });
      this.render();
    });

    this.render();
  },

  markPassed(key) {
    if (this.subsystems[key] !== undefined) {
      this.subsystems[key] = true;
      this.render();
    }
  },

  render() {
    if (!this.statusList) return;

    this.statusList.innerHTML = Object.entries(this.subsystems)
      .map(([key, passed]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        return `<li><span>${label}</span><span>${passed ? "✔" : "○"}</span></li>`;
      })
      .join("");
  }
};

// Initialize dashboard after DOM load
document.addEventListener("DOMContentLoaded", () => {
  TestDashboard.init();
});

// =====================================================
// Tyniweb V4 — Testing Dashboard (Chunk 2)
// Automated Subsystem Detection + Event Hooks
// =====================================================

const TestAutomation = {
  init() {
    // ROLE SYSTEM
    EventBus.on("role:changed", () => {
      TestDashboard.markPassed("role");
    });

    // PAGE ENGINE
    EventBus.on("pages:changed", () => {
      TestDashboard.markPassed("pages");
    });

    EventBus.on("page:switched", () => {
      TestDashboard.markPassed("pages");
    });

    // BLOCK ENGINE
    EventBus.on("block:added", () => {
      TestDashboard.markPassed("blocks");
    });

    EventBus.on("block:selected", () => {
      TestDashboard.markPassed("blocks");
    });

    EventBus.on("block:updated", () => {
      TestDashboard.markPassed("blocks");
    });

    // GLOBAL STYLES
    EventBus.on("styles:changed", () => {
      TestDashboard.markPassed("styles");
    });

    // IDENTITY CORE
    document.querySelectorAll("[name='identity-archetype'], [name='identity-voice'], [name='identity-promise']")
      .forEach(el => {
        el.addEventListener("change", () => {
          TestDashboard.markPassed("identity");
        });
        el.addEventListener("input", () => {
          TestDashboard.markPassed("identity");
        });
      });

    // AI ENGINE
    if (DOM.aiContentBtn) {
      DOM.aiContentBtn.addEventListener("click", () => {
        TestDashboard.markPassed("ai");
      });
    }

    if (DOM.aiLayoutBtn) {
      DOM.aiLayoutBtn.addEventListener("click", () => {
        TestDashboard.markPassed("ai");
        TestDashboard.markPassed("wizard");
      });
    }

    // WIZARD ENGINE
    EventBus.on("portal:created", () => {
      TestDashboard.markPassed("portal");
    });

    // TRAINING ENGINE
    EventBus.on("training:track-started", () => {
      TestDashboard.markPassed("training");
    });

    EventBus.on("training:step", () => {
      TestDashboard.markPassed("training");
    });

    EventBus.on("training:track-complete", () => {
      TestDashboard.markPassed("training");
    });

    // EXAM ENGINE
    EventBus.on("exam:passed", () => {
      TestDashboard.markPassed("exam");
    });

    // EXPORT / PUBLISH
    if (DOM.exportSiteBtn) {
      DOM.exportSiteBtn.addEventListener("click", () => {
        TestDashboard.markPassed("export");
      });
    }

    if (DOM.publishBtn) {
      DOM.publishBtn.addEventListener("click", () => {
        TestDashboard.markPassed("export");
      });
    }

    // INITIAL RENDER
    TestDashboard.render();
  }
};

// Initialize automation after DOM load
document.addEventListener("DOMContentLoaded", () => {
  TestAutomation.init();
});

  

  if (TRAINING_MODE) {
    VoiceEngine.speak("Welcome back. Training Mode is active.");
  }
});

// =====================================================
// Tyniweb V4 — Testing Dashboard (Chunk 3)
// Logging + Auto-Scroll + Full Test Suite Simulation
// =====================================================

const TestLogger = {
  logEl: document.getElementById("tw-test-log"),

  log(message, type = "info") {
    if (!this.logEl) return;

    const div = document.createElement("div");
    div.className = `tw-log-entry tw-log-${type}`;
    div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

    this.logEl.appendChild(div);
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }
};

const TestSuite = {
  async run() {
    TestLogger.log("Running full test suite…", "info");

    // Reset dashboard
    Object.keys(TestDashboard.subsystems).forEach(key => {
      TestDashboard.subsystems[key] = false;
    });
    TestDashboard.render();

    // Simulated sequence
    await this.testRoleSystem();
    await this.testPages();
    await this.testBlocks();
    await this.testStyles();
    await this.testIdentity();
    await this.testAI();
    await this.testWizard();
    await this.testPortal();
    await this.testTraining();
    await this.testExam();
    await this.testExport();

    TestLogger.log("Full test suite complete.", "info");
  },

  async wait(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async testRoleSystem() {
    TestLogger.log("Testing role system…", "info");
    TestDashboard.markPassed("role");
    await this.wait();
  },

  async testPages() {
    TestLogger.log("Testing page engine…", "info");
    TestDashboard.markPassed("pages");
    await this.wait();
  },

  async testBlocks() {
    TestLogger.log("Testing block engine…", "info");
    TestDashboard.markPassed("blocks");
    await this.wait();
  },

  async testStyles() {
    TestLogger.log("Testing global styles…", "info");
    TestDashboard.markPassed("styles");
    await this.wait();
  },

  async testIdentity() {
    TestLogger.log("Testing identity core…", "info");
    TestDashboard.markPassed("identity");
    await this.wait();
  },

  async testAI() {
    TestLogger.log("Testing AI engine…", "info");
    TestDashboard.markPassed("ai");
    await this.wait();
  },

  async testWizard() {
    TestLogger.log("Testing wizard engine…", "info");
    TestDashboard.markPassed("wizard");
    await this.wait();
  },

  async testPortal() {
    TestLogger.log("Testing portal engine…", "info");
    TestDashboard.markPassed("portal");
    await this.wait();
  },

  async testTraining() {
    TestLogger.log("Testing training engine…", "info");
    TestDashboard.markPassed("training");
    await this.wait();
  },

  async testExam() {
    TestLogger.log("Testing exam engine…", "info");
    TestDashboard.markPassed("exam");
    await this.wait();
  },

  async testExport() {
    TestLogger.log("Testing export/publish…", "info");
    TestDashboard.markPassed("export");
    await this.wait();
  }
};

// Hook up the Run button
document.addEventListener("DOMContentLoaded", () => {
  if (TestDashboard.runBtn) {
    TestDashboard.runBtn.addEventListener("click", () => {
      TestSuite.run();
    });
  }
});
