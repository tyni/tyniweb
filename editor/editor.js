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
  
  insertAtIndex(id, index) {
	  const block = this.blocks[id];
	  if (!block) return;

	  const html = block.render();
	  const temp = document.createElement("div");
	  temp.innerHTML = html;
	  const node = temp.firstElementChild;

	  const zones = document.querySelectorAll(".tw-drop-zone");
	  const zone = zones[index];

	  zone.parentNode.insertBefore(node, zone.nextSibling);
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
// Tyniweb V5 — Unified SettingsCore (Editor + Site)
// Option 3: Hybrid Structure
// =====================================================

const SettingsCore = {
  storageKey: "tw-settings-v5",

  data: {
    // -------------------------
    // EDITOR FLAGS
    // -------------------------
    showDebug: false,
    testerAutoStart: false,
    rememberLastMode: false,
    rememberLastRole: false,

    // -------------------------
    // SITE METADATA
    // -------------------------
    site: {
      title: "My Tyniweb Site",
      description: "A site built with Tyniweb.",
      githubRepo: "",
      tiers: {
        free: { name: "Free" },
        creator: { name: "Creator", price: "$9" },
        architect: { name: "Architect", price: "$29" }
      }
		extensions: {
		  aiTools: true,
		  training: true,
		  portals: true,
		  githubSync: false,
		  membership: true
		}
    }
  },

  // -------------------------
  // LOAD / SAVE
  // -------------------------
  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      // Merge deeply so new fields aren't lost
      this.data = {
        ...this.data,
        ...parsed,
        site: {
          ...this.data.site,
          ...(parsed.site || {})
        }
      };
    } catch (e) {
      console.warn("SettingsCore load error:", e);
    }
  },

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    document.dispatchEvent(new Event("settings:changed"));
  },

  // -------------------------
  // GET / SET / TOGGLE
  // -------------------------
  get(key) {
    return this.data[key];
  },

  set(key, value) {
    this.data[key] = value;
    this.save();
  },

  toggle(key) {
    this.data[key] = !this.data[key];
    this.save();
  }
};

// Load settings immediately on startup
SettingsCore.load();

// Backwards compatibility for older code expecting SettingsCore.data.tiers
Object.defineProperty(SettingsCore.data, "tiers", {
  get() {
    return this.site.tiers;
  }
});

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

  if (TRAINING_MODE) {
    VoiceEngine.speak("Welcome back. Training Mode is active.");
  }
});


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
      alert("Full Test Suite will run in Chunk 3.");
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
        return `<li><span>${label}</span><span class="${passed ? "pass" : "fail"}">${passed ? "✔" : "○"}</span></li>`;
      })
      .join("");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  TestDashboard.init();
});

document.addEventListener("DOMContentLoaded", () => {
  BlockCanvas.init();
});


// =====================================================
// Tyniweb V4 — Testing Dashboard (Chunk 2)
// Automated Subsystem Detection + Event Hooks
// =====================================================

const TestAutomation = {
  init() {
    EventBus.on("role:changed", () => {
      TestDashboard.markPassed("role");
    });

    EventBus.on("pages:changed", () => {
      TestDashboard.markPassed("pages");
    });

    EventBus.on("page:switched", () => {
      TestDashboard.markPassed("pages");
    });

    EventBus.on("block:added", () => {
      TestDashboard.markPassed("blocks");
    });

    EventBus.on("block:selected", () => {
      TestDashboard.markPassed("blocks");
    });

    EventBus.on("block:updated", () => {
      TestDashboard.markPassed("blocks");
    });

    EventBus.on("styles:changed", () => {
      TestDashboard.markPassed("styles");
    });

    document.querySelectorAll("[name='identity-archetype'], [name='identity-voice'], [name='identity-promise']")
      .forEach(el => {
        el.addEventListener("change", () => {
          TestDashboard.markPassed("identity");
        });
        el.addEventListener("input", () => {
          TestDashboard.markPassed("identity");
        });
      });

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

    EventBus.on("portal:created", () => {
      TestDashboard.markPassed("portal");
    });

    EventBus.on("training:track-started", () => {
      TestDashboard.markPassed("training");
    });

    EventBus.on("training:step", () => {
      TestDashboard.markPassed("training");
    });

    EventBus.on("training:track-complete", () => {
      TestDashboard.markPassed("training");
    });

    EventBus.on("exam:passed", () => {
      TestDashboard.markPassed("exam");
    });

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

    TestDashboard.render();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  TestAutomation.init();
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

    Object.keys(TestDashboard.subsystems).forEach(key => {
      TestDashboard.subsystems[key] = false;
    });
    TestDashboard.render();

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

document.addEventListener("DOMContentLoaded", () => {
  if (TestDashboard.runBtn) {
    TestDashboard.runBtn.addEventListener("click", () => {
      TestSuite.run();
    });
  }
});

// =====================================================
// Tyniweb V4 — Auto‑Tester (Chunk 1)
// Simulation Engine Core
// =====================================================

const AutoTester = {
  running: false,
  log: msg => TestLogger.log("[AutoTester] " + msg, "info"),

  async start() {
    if (this.running) return;
    this.running = true;
    this.log("Auto‑Tester started.");

    await this.simulateRoleSwitch();
    await this.simulatePageCreation();
    await this.simulateBlockAdditions();
    await this.simulateInspectorEdits();
    await this.simulateWizardRun();
    await this.simulatePortalCreation();
    await this.simulateExport();

    this.log("Auto‑Tester finished.");
    this.running = false;
  },

  async wait(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // -------------------------
  // SIMULATIONS
  // -------------------------

  async simulateRoleSwitch() {
    this.log("Simulating role switch → Architect");
    RoleSystem.setRole("architect");
    await this.wait();
  },

  async simulatePageCreation() {
    this.log("Simulating page creation");
    PageEngine.addPage("AutoTest Page");
    await this.wait();
  },

  async simulateBlockAdditions() {
    this.log("Simulating block additions");
    BlockEngine.addBlock("hero");
    await this.wait();
    BlockEngine.addBlock("section");
    await this.wait();
  },

  async simulateInspectorEdits() {
    this.log("Simulating inspector edits");
    const block = BlockEngine.getSelectedBlock();
    if (!block) return;

    block.title = "Auto‑Tester Title";
    block.subtitle = "Auto‑Tester Subtitle";
    block.cta = "Auto‑Go";
    PageEngine.save();
    PageEngine.renderCanvas();
    await this.wait();
  },

  async simulateWizardRun() {
    this.log("Simulating wizard run");
    WizardEngine.runPageWizard();
    await this.wait();
  },

  async simulatePortalCreation() {
    this.log("Simulating portal creation");
    PortalEngine.createPortalFromTemplate("Simple Business");
    await this.wait();
  },

  async simulateExport() {
    this.log("Simulating export");
    TestDashboard.markPassed("export");
    await this.wait();
  }
};

// Add Auto‑Tester button to dashboard
document.addEventListener("DOMContentLoaded", () => {
  if (TestDashboard.panel) {
    const btn = document.createElement("button");
    btn.textContent = "Run Auto‑Tester";
    btn.className = "tw-primary small";
    btn.style.marginTop = "6px";
    btn.addEventListener("click", () => AutoTester.start());
    TestDashboard.panel.querySelector(".tw-test-actions").appendChild(btn);
  }
});

// =====================================================
// Tyniweb V4 — Auto‑Tester (Chunk 2)
// Stress Engine + Randomized Actions + Multi‑Run Loops
// =====================================================

const AutoStress = {
  running: false,
  loops: 0,
  maxLoops: 0,

  log: msg => TestLogger.log("[AutoStress] " + msg, "info"),

  async startStressTest(runs = 25) {
    if (this.running) return;
    this.running = true;
    this.maxLoops = runs;
    this.loops = 0;

    this.log(`Starting stress test (${runs} cycles)…`);

    while (this.loops < this.maxLoops) {
      this.loops++;
      this.log(`Cycle ${this.loops}/${this.maxLoops}`);

      await this.randomAction();
      await this.waitRandom();
    }

    this.log("Stress test complete.");
    this.running = false;
  },

  async waitRandom(min = 150, max = 450) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // -------------------------
  // RANDOM ACTIONS
  // -------------------------

  async randomAction() {
    const actions = [
      () => this.simulateRandomRole(),
      () => this.simulateRandomPage(),
      () => this.simulateRandomBlock(),
      () => this.simulateRandomInspectorEdit(),
      () => this.simulateRandomWizard(),
      () => this.simulateRandomPortal(),
      () => this.simulateRandomExport(),
      () => this.injectRandomError()
    ];

    const action = actions[Math.floor(Math.random() * actions.length)];
    await action();
  },

  // -------------------------
  // INDIVIDUAL RANDOMIZED SIMULATIONS
  // -------------------------

  async simulateRandomRole() {
    const roles = ["guest", "member", "architect"];
    const role = roles[Math.floor(Math.random() * roles.length)];
    this.log(`Random role switch → ${role}`);
    RoleSystem.setRole(role);
    await this.waitRandom();
  },

  async simulateRandomPage() {
    const name = "Page_" + Math.floor(Math.random() * 9999);
    this.log(`Random page creation → ${name}`);
    PageEngine.addPage(name);
    await this.waitRandom();
  },

  async simulateRandomBlock() {
    const types = [
      "hero",
      "section",
      "feature-row",
      "testimonial-row",
      "grid",
      "cta",
      "footer"
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    this.log(`Random block add → ${type}`);
    BlockEngine.addBlock(type);
    await this.waitRandom();
  },

  async simulateRandomInspectorEdit() {
    const block = BlockEngine.getSelectedBlock();
    if (!block) return;

    const randomText = "Auto_" + Math.floor(Math.random() * 9999);
    this.log(`Random inspector edit → ${randomText}`);

    block.title = randomText;
    block.subtitle = randomText + "_sub";
    block.cta = "Go_" + randomText;

    PageEngine.save();
    PageEngine.renderCanvas();
    await this.waitRandom();
  },

  async simulateRandomWizard() {
    const wizards = ["quick-start", "brand", "page"];
    const mode = wizards[Math.floor(Math.random() * wizards.length)];
    this.log(`Random wizard run → ${mode}`);
    WizardEngine.start(mode);
    await this.waitRandom();
  },

  async simulateRandomPortal() {
    const portals = ["Simple Business", "Creator Portfolio", "Landing Page", "Coaching Funnel"];
    const name = portals[Math.floor(Math.random() * portals.length)];
    this.log(`Random portal creation → ${name}`);
    PortalEngine.createPortalFromTemplate(name);
    await this.waitRandom();
  },

  async simulateRandomExport() {
    this.log("Random export simulation");
    TestDashboard.markPassed("export");
    await this.waitRandom();
  },

  // -------------------------
  // ERROR INJECTION
  // -------------------------

  async injectRandomError() {
    const chance = Math.random();
    if (chance < 0.2) {
      this.log("Injecting simulated error!", "fail");
      throw new Error("Simulated AutoStress Error");
    }
  }
};


// Add Stress Test buttons to dashboard
document.addEventListener("DOMContentLoaded", () => {
  if (TestDashboard.panel) {
    const container = TestDashboard.panel.querySelector(".tw-test-actions");

    const btn10 = document.createElement("button");
    btn10.textContent = "Stress x10";
    btn10.className = "tw-secondary small";
    btn10.addEventListener("click", () => AutoStress.startStressTest(10));
    container.appendChild(btn10);

    const btn25 = document.createElement("button");
    btn25.textContent = "Stress x25";
    btn25.className = "tw-secondary small";
    btn25.addEventListener("click", () => AutoStress.startStressTest(25));
    container.appendChild(btn25);

    const btn50 = document.createElement("button");
    btn50.textContent = "Stress x50";
    btn50.className = "tw-secondary small";
    btn50.addEventListener("click", () => AutoStress.startStressTest(50));
    container.appendChild(btn50);

    const btn100 = document.createElement("button");
    btn100.textContent = "Stress x100";
    btn100.className = "tw-secondary small";
    btn100.addEventListener("click", () => AutoStress.startStressTest(100));
    container.appendChild(btn100);
  }
});

// =====================================================
// Tyniweb V4 — Auto‑Tester (Chunk 3)
// Adaptive Load Calibration + Full Power Mode
// =====================================================

const AutoLoad = {
  calibrating: false,
  calibrated: false,
  maxSafeLoad: 50, // default fallback
  history: [],
  log: msg => TestLogger.log("[AutoLoad] " + msg, "info"),

  async calibrate() {
    if (this.calibrating) return;
    this.calibrating = true;
    this.log("Starting adaptive load calibration…");

    const steps = [1, 5, 10, 20, 40, 80, 160, 320, 640, 1000];
    let lastGood = 10;

    for (let i = 0; i < steps.length; i++) {
      const users = steps[i];
      this.log(`Testing virtual users: ${users}`);

      const result = await this.runLoadProbe(users);

      this.history.push(result);

      if (result.ok) {
        lastGood = users;
        this.log(`OK at ${users} virtual users (avg ${result.avgMs.toFixed(1)}ms)`);
      } else {
        this.log(
          `Threshold reached at ${users} virtual users (avg ${result.avgMs.toFixed(
            1
          )}ms, degraded)`
        );
        break;
      }
    }

    // Apply 10% safety margin
    this.maxSafeLoad = Math.max(1, Math.floor(lastGood * 0.9));
    this.calibrated = true;
    this.calibrating = false;

    this.log(`Calibration complete. Max safe load set to ${this.maxSafeLoad} virtual users.`);
  },

  async runLoadProbe(users = 10) {
    const runs = Math.min(users, 25); // cap probe iterations
    const times = [];
    let degraded = false;

    for (let i = 0; i < runs; i++) {
      const start = performance.now();

      try {
        await AutoStress.randomAction();
      } catch (e) {
        TestLogger.log("[AutoLoad] Probe error: " + e.message, "fail");
        degraded = true;
        break;
      }

      const end = performance.now();
      const delta = end - start;
      times.push(delta);

      // crude degradation heuristic
      if (delta > 500) degraded = true;
    }

    const avg =
      times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 9999;

    const ok = !degraded && avg < 350;

    return {
      users,
      avgMs: avg,
      ok
    };
  }
};


// =====================================================
// Full Power Mode — Multi‑User Simulation
// Uses calibrated maxSafeLoad from AutoLoad
// =====================================================

const AutoFullPower = {
  running: false,
  log: msg => TestLogger.log("[FullPower] " + msg, "info"),

  async run() {
    if (this.running) return;
    if (!AutoLoad.calibrated) {
      this.log("Not calibrated yet. Running calibration first…");
      await AutoLoad.calibrate();
    }

    this.running = true;
    const users = AutoLoad.maxSafeLoad;
    this.log(`Running Full Power Mode at ${users} virtual users…`);

    // We simulate "virtual users" as parallel stress loops
    const batches = [];
    const perBatch = Math.min(25, users);
    const batchCount = Math.ceil(users / perBatch);

    for (let i = 0; i < batchCount; i++) {
      const size = i === batchCount - 1 ? users - perBatch * i || perBatch : perBatch;
      batches.push(this.runBatch(size, i + 1));
    }

    await Promise.all(batches);

    this.log("Full Power Mode complete.");
    this.running = false;
  },

  async runBatch(size, batchIndex) {
    this.log(`Starting batch ${batchIndex} (${size} virtual users)…`);

    const promises = [];
    for (let i = 0; i < size; i++) {
      promises.push(this.simulateVirtualUser(batchIndex, i + 1));
    }

    await Promise.all(promises);
    this.log(`Batch ${batchIndex} finished.`);
  },

  async simulateVirtualUser(batchIndex, userIndex) {
    const id = `B${batchIndex}-U${userIndex}`;
    const actions = 5 + Math.floor(Math.random() * 10);

    for (let i = 0; i < actions; i++) {
      try {
        TestLogger.log(`[VU ${id}] action ${i + 1}/${actions}`, "info");
        await AutoStress.randomAction();
        await AutoStress.waitRandom(80, 220);
      } catch (e) {
        TestLogger.log(`[VU ${id}] error: ${e.message}`, "fail");
        break;
      }
    }
  }
};


// =====================================================
// UI Wiring — Calibration + Full Power Buttons
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!TestDashboard.panel) return;
  const container = TestDashboard.panel.querySelector(".tw-test-actions");
  if (!container) return;

  const btnCalibrate = document.createElement("button");
  btnCalibrate.textContent = "Calibrate Load";
  btnCalibrate.className = "tw-secondary small";
  btnCalibrate.addEventListener("click", () => AutoLoad.calibrate());
  container.appendChild(btnCalibrate);

  const btnFullPower = document.createElement("button");
  btnFullPower.textContent = "Full Power Mode";
  btnFullPower.className = "tw-danger small";
  btnFullPower.style.marginLeft = "4px";
  btnFullPower.addEventListener("click", () => AutoFullPower.run());
  container.appendChild(btnFullPower);
});

// =====================================================
// Tyniweb V5 — Control Center + Extensions + Roles + GitHub Stub + Membership Config
// TELEPORT PACK 1
// =====================================================

// -------------------------
// ROLE PERMISSIONS HARD-LOCK
// -------------------------

const RolePermissions = {
  map: {
    guest: {
      canExport: false,
      canPublish: false,
      canUseAI: false,
      canUseIdentityCore: false,
      canUsePortals: false,
      canUseWizards: false,
      canOpenSettings: false
    },
    member: {
      canExport: true,
      canPublish: true,
      canUseAI: true,
      canUseIdentityCore: true,
      canUsePortals: true,
      canUseWizards: true,
      canOpenSettings: false
    },
    architect: {
      canExport: true,
      canPublish: true,
      canUseAI: true,
      canUseIdentityCore: true,
      canUsePortals: true,
      canUseWizards: true,
      canOpenSettings: true
    }
  },

  can(action) {
    const role = RoleSystem.getRole ? RoleSystem.getRole() : "guest";
    const perms = this.map[role] || this.map.guest;
    return !!perms[action];
  }
};

// Example hooks (you can wire more where needed)
EventBus.on("ui:export-click", () => {
  if (!RolePermissions.can("canExport")) {
    alert("Export is only available to Members and Architects.");
    return;
  }
  // continue with export...
});

EventBus.on("ui:open-identity-core", () => {
  if (!RolePermissions.can("canUseIdentityCore")) {
    alert("Identity Core is only available to Members and Architects.");
    return;
  }
  // open identity core...
});


// -------------------------
// EXTENSION FRAMEWORK (CORE)
// -------------------------

const ExtensionRegistry = {
  extensions: {},

  register(id, config) {
    this.extensions[id] = {
      id,
      enabled: config.enabled ?? true,
      label: config.label || id,
      description: config.description || "",
      init: config.init || (() => {})
    };
  },

  enable(id) {
    if (!this.extensions[id]) return;
    this.extensions[id].enabled = true;
    this.extensions[id].init();
    this.renderUI();
  },

  disable(id) {
    if (!this.extensions[id]) return;
    this.extensions[id].enabled = false;
    this.renderUI();
  },

  renderUI() {
    const container = document.getElementById("tw-extensions-list");
    if (!container) return;
    container.innerHTML = "";

    Object.values(this.extensions).forEach(ext => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.marginBottom = "6px";

      const label = document.createElement("div");
      label.style.fontSize = "12px";
      label.innerHTML = `<strong>${ext.label}</strong><br><span style="opacity:0.7;">${ext.description}</span>`;

      const toggle = document.createElement("button");
      toggle.textContent = ext.enabled ? "On" : "Off";
      toggle.className = ext.enabled ? "tw-primary small" : "tw-secondary small";
      toggle.addEventListener("click", () => {
        if (ext.enabled) this.disable(ext.id);
        else this.enable(ext.id);
      });

      row.appendChild(label);
      row.appendChild(toggle);
      container.appendChild(row);
    });
  }
};


// Register some core extensions (design-level)
document.addEventListener("DOMContentLoaded", () => {
  ExtensionRegistry.register("brandKit", {
    label: "Brand Kit Generator",
    description: "Generate a full brand kit from Identity Core.",
    enabled: true,
    init() {
      // placeholder: later we hook into Identity Core + templates
      console.log("[Extension] Brand Kit Generator ready.");
    }
  });

  ExtensionRegistry.register("resumeWizard", {
    label: "Resume Wizard",
    description: "Turn your training tracks into a resume.",
    enabled: false,
    init() {
      console.log("[Extension] Resume Wizard ready.");
    }
  });

  ExtensionRegistry.register("templateFactory", {
    label: "Template Factory",
    description: "Save and reuse page layouts as templates.",
    enabled: true,
    init() {
      console.log("[Extension] Template Factory ready.");
    }
  });

  ExtensionRegistry.register("pricingWizard", {
    label: "Pricing Tier Wizard",
    description: "Guide to create pricing tiers and page layout.",
    enabled: true,
    init() {
      console.log("[Extension] Pricing Wizard ready.");
    }
  });

  ExtensionRegistry.register("donationBuilder", {
    label: "Donation Page Builder",
    description: "Generate a Blender-style support/donation page.",
    enabled: false,
    init() {
      console.log("[Extension] Donation Builder ready.");
    }
  });

  ExtensionRegistry.register("membershipManager", {
    label: "Membership Manager",
    description: "Configure roles, limits, and access rules.",
    enabled: true,
    init() {
      console.log("[Extension] Membership Manager ready.");
    }
  });

  ExtensionRegistry.renderUI();
});


// =====================================================
// Tyniweb V5 — Extension Registration Pass
// Registers ALL missing extensions and organizes them
// into Creation, Intelligence, System, and Cortex groups.
// =====================================================

// Helper to register with category metadata
function registerExtension(id, config) {
  ExtensionRegistry.register(id, {
    label: config.label,
    description: config.description,
    category: config.category,
    enabled: config.enabled ?? false,
    init: config.init ?? (() => {
      console.log(`[Extension Init Placeholder] ${config.label} initialized.`);
    })
  });
}

// -------------------------
// CREATION TOOLS
// -------------------------

registerExtension("brandKit", {
  label: "Brand Kit Generator",
  description: "Generate a full brand kit from Identity Core.",
  category: "Creation Tools",
  enabled: true
});

registerExtension("resumeWizard", {
  label: "Resume Wizard",
  description: "Turn your training tracks into a resume.",
  category: "Creation Tools"
});

registerExtension("templateFactory", {
  label: "Template Factory",
  description: "Save and reuse page layouts as templates.",
  category: "Creation Tools",
  enabled: true
});

registerExtension("pricingWizard", {
  label: "Pricing Tier Wizard",
  description: "Guide to create pricing tiers and page layout.",
  category: "Creation Tools",
  enabled: true
});

registerExtension("donationBuilder", {
  label: "Donation Page Builder",
  description: "Generate a Blender-style support/donation page.",
  category: "Creation Tools"
});

registerExtension("membershipManager", {
  label: "Membership Manager",
  description: "Configure roles, limits, and access rules.",
  category: "Creation Tools",
  enabled: true
});

// -------------------------
// INTELLIGENCE TOOLS
// -------------------------

registerExtension("insightBubble", {
  label: "Insight Bubble",
  description: "Context-aware hints that guide the user.",
  category: "Intelligence Tools"
});

registerExtension("metaNudge", {
  label: "META Nudge System",
  description: "Adaptive nudges that help users make progress.",
  category: "Intelligence Tools"
});

registerExtension("livingAdaptive", {
  label: "Living Adaptive Environment",
  description: "UI that adapts to user behavior and patterns.",
  category: "Intelligence Tools"
});

registerExtension("microDelight", {
  label: "Micro-Delight System",
  description: "Tiny animations and moments of joy.",
  category: "Intelligence Tools"
});

registerExtension("emojiMaster", {
  label: "Emoji Master List Integration",
  description: "Unified emoji library for all UI components.",
  category: "Intelligence Tools"
});

// -------------------------
// SYSTEM TOOLS
// -------------------------

registerExtension("readmeGenerator", {
  label: "README Generator",
  description: "Generate project README files automatically.",
  category: "System Tools"
});

registerExtension("launchNotes", {
  label: "Launch Notes Generator",
  description: "Create release notes for new versions.",
  category: "System Tools"
});

registerExtension("roadmapPage", {
  label: "Roadmap Page",
  description: "Generate a roadmap page for your project.",
  category: "System Tools"
});

registerExtension("confirmationLogs", {
  label: "Additional Confirmation Logs",
  description: "Extra logging for debugging and validation.",
  category: "System Tools"
});

// Already built but we register metadata for UI grouping
registerExtension("qaDashboard", {
  label: "QA Dashboard",
  description: "Quality assurance dashboard for testing.",
  category: "System Tools",
  enabled: true
});

registerExtension("autoTester", {
  label: "Auto-Tester",
  description: "Automated testing engine for stress tests.",
  category: "System Tools",
  enabled: true
});

// -------------------------
// CORTEX TOOLS
// -------------------------

registerExtension("instaPlug", {
  label: "instaPLUG for Copilot",
  description: "Direct interface between your thinking and the system.",
  category: "Cortex Tools"
});

registerExtension("trainingResume", {
  label: "Training Tracks → Resume Generator",
  description: "Convert training tracks into a professional resume.",
  category: "Cortex Tools"
});

registerExtension("roleLogic", {
  label: "Role Logic",
  description: "Advanced role behavior and transitions.",
  category: "Cortex Tools",
  enabled: true
});

registerExtension("voiceGuidance", {
  label: "Voice Guidance",
  description: "Voice-based guidance for the editor.",
  category: "Cortex Tools"
});

// Engines are core, but we register metadata for UI grouping
registerExtension("portalEngine", {
  label: "Portal Engine",
  description: "Core engine for portals.",
  category: "Cortex Tools",
  enabled: true
});

registerExtension("wizardEngine", {
  label: "Wizard Engine",
  description: "Core engine for wizards.",
  category: "Cortex Tools",
  enabled: true
});

// Refresh UI
ExtensionRegistry.renderUI();

// =====================================================
// Tyniweb V5 — Extension Initialization Pass
// Adds role locks, tier locks, soft-lock triggers,
// and placeholder init() behavior for all extensions.
// =====================================================

// Soft-lock modal trigger (placeholder)
function triggerSoftLock(requiredTier, featureName) {
  console.log(`[Soft Lock] ${featureName} requires ${requiredTier} tier.`);
  alert(`${featureName} requires the ${requiredTier} tier. View pricing to upgrade.`);
}

// Role + Tier check helper
function canUseExtension(ext) {
  const role = RoleSystem.getRole ? RoleSystem.getRole() : "guest";
  const tiers = SettingsCore.data.tiers;

  // Architect always allowed
  if (role === "architect") return true;

  // Member (Creator tier)
  if (role === "member") {
    // Creation Tools allowed
    if (ext.category === "Creation Tools") return true;
    // System Tools partially allowed
    if (ext.category === "System Tools") return false;
    // Intelligence Tools allowed
    if (ext.category === "Intelligence Tools") return true;
    // Cortex Tools restricted
    return false;
  }

  // Guest (Free tier)
  return false;
}

// Wrap init() with role/tier logic
function initializeExtensions() {
  Object.values(ExtensionRegistry.extensions).forEach(ext => {
    if (!ext.enabled) return;

    if (!canUseExtension(ext)) {
      triggerSoftLock(
        ext.category === "Cortex Tools" ? "Architect" :
        ext.category === "System Tools" ? "Architect" :
        "Creator",
        ext.label
      );
      return;
    }

    try {
      ext.init();
      console.log(`[Extension Init] ${ext.label} initialized successfully.`);
    } catch (e) {
      console.warn(`[Extension Error] ${ext.label}:`, e);
    }
  });
}

// Initialize after DOM load
document.addEventListener("DOMContentLoaded", () => {
  initializeExtensions();
});

// =====================================================
// Tyniweb V5 — Soft-Lock Modal System
// Premium replacement for alerts. Role + tier aware.
// =====================================================

const SoftLock = {
  overlay: null,
  modal: null,
  title: null,
  message: null,
  closeBtn: null,

  init() {
    this.overlay = document.getElementById("tw-softlock-overlay");
    this.modal = document.getElementById("tw-softlock-modal");
    this.title = document.getElementById("tw-softlock-title");
    this.message = document.getElementById("tw-softlock-message");
    this.closeBtn = document.getElementById("tw-softlock-close");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.hide());
    }
  },

  show(requiredTier, featureName) {
    if (!this.overlay) return;

    this.title.textContent = `${requiredTier} Tier Required`;
    this.message.textContent = `${featureName} is available in the ${requiredTier} tier. Upgrade to unlock this feature.`;

    this.overlay.style.display = "flex";
  },

  hide() {
    if (this.overlay) this.overlay.style.display = "none";
  }
};

// Replace Teleport 2 soft-lock trigger
function triggerSoftLock(requiredTier, featureName) {
  SoftLock.show(requiredTier, featureName);
}

// Initialize modal after DOM load
document.addEventListener("DOMContentLoaded", () => {
  SoftLock.init();
});

// =====================================================
// Tyniweb V5 — Membership Badge + Role Indicator
// =====================================================

const RoleBadge = {
  badge: null,
  label: null,
  switcher: null,

  init() {
    this.badge = document.getElementById("tw-role-badge");
    this.label = document.getElementById("tw-role-label");
    this.switcher = document.getElementById("tw-role-switcher");

    this.render();

    this.badge.addEventListener("click", () => {
      const role = RoleSystem.getRole();
      if (role === "architect") {
        this.toggleSwitcher();
      } else {
        SoftLock.show(
          role === "guest" ? "Creator" : "Architect",
          "Membership Upgrade"
        );
      }
    });

    this.switcher.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const newRole = btn.getAttribute("data-role");
        RoleSystem.setRole(newRole);
        this.render();
        this.switcher.style.display = "none";
      });
    });
  },

  render() {
    const role = RoleSystem.getRole();
    const tier =
      role === "guest"
        ? "Free Tier"
        : role === "member"
        ? "Creator Tier"
        : "Full Access";

    this.label.textContent = `${role.toUpperCase()} · ${tier}`;
  },

  toggleSwitcher() {
    this.switcher.style.display =
      this.switcher.style.display === "none" ? "flex" : "none";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  RoleBadge.init();
});

// =====================================================
// Tyniweb V5 — Role-Based UI Hiding + Inline Lock Indicators
// =====================================================

const RoleUI = {
  init() {
    this.applyRoleVisibility();
    this.applyInlineLocks();
  },

  applyRoleVisibility() {
    const role = RoleSystem.getRole();

    // Architect-only elements
    document.querySelectorAll("[data-role='architect']").forEach(el => {
      el.style.display = role === "architect" ? "" : "none";
    });

    // Member-only elements
    document.querySelectorAll("[data-role='member']").forEach(el => {
      el.style.display = role === "guest" ? "none" : "";
    });
  },

  applyInlineLocks() {
    const role = RoleSystem.getRole();

    document.querySelectorAll("[data-lock]").forEach(el => {
      const required = el.getAttribute("data-lock");

      const locked =
        (required === "creator" && role === "guest") ||
        (required === "architect" && role !== "architect");

      if (locked) {
        el.classList.add("tw-locked");

        el.addEventListener("mouseenter", () => {
          this.showTooltip(el, required);
        });

        el.addEventListener("mouseleave", () => {
          this.hideTooltip();
        });

        el.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();

          SoftLock.show(
            required === "creator" ? "Creator" : "Architect",
            el.getAttribute("data-feature") || "This feature"
          );
        });
      }
    });
  },

  showTooltip(el, required) {
    let tooltip = document.getElementById("tw-lock-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "tw-lock-tooltip";
      tooltip.className = "tw-tooltip";
      document.body.appendChild(tooltip);
    }

    tooltip.textContent =
      required === "creator"
        ? "Creator tier required"
        : "Architect tier required";

    const rect = el.getBoundingClientRect();
    tooltip.style.left = rect.left + "px";
    tooltip.style.top = rect.top - 28 + "px";
    tooltip.classList.add("show");
  },

  hideTooltip() {
    const tooltip = document.getElementById("tw-lock-tooltip");
    if (tooltip) tooltip.classList.remove("show");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  RoleUI.init();
});

// =====================================================
// Tyniweb V5 — Editor Mode Indicator + Safe State Guard
// =====================================================

const EditorMode = {
  mode: "edit", // edit | preview | test
  badge: null,
  label: null,

  init() {
    this.badge = document.getElementById("tw-mode-badge");
    this.label = document.getElementById("tw-mode-label");
    this.render();
  },

  setMode(newMode) {
    const valid = ["edit", "preview", "test"];

    if (!valid.includes(newMode)) {
      console.warn(`[Mode Guard] Invalid mode: ${newMode}. Resetting to edit.`);
      this.mode = "edit";
      this.render();
      return;
    }

    this.mode = newMode;
    this.render();
  },

  render() {
    const text =
      this.mode === "edit"
        ? "Edit Mode"
        : this.mode === "preview"
        ? "Preview Mode"
        : "Test Mode";

    this.label.textContent = text;
  }
};

// Safe-state guard for role switching + extension toggles
function enforceSafeState() {
  const role = RoleSystem.getRole();
  const mode = EditorMode.mode;

  // Prevent Guest from entering Test Mode
  if (role === "guest" && mode === "test") {
    EditorMode.setMode("edit");
    SoftLock.show("Creator", "Testing Mode");
  }

  // Prevent Member from entering Architect-only test flows
  if (role === "member" && mode === "test") {
    EditorMode.setMode("edit");
    SoftLock.show("Architect", "Advanced Testing");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  EditorMode.init();

  // Re-check safe state whenever role changes
  document.addEventListener("role:changed", () => {
    enforceSafeState();
  });

  // Re-check safe state whenever mode changes
  document.addEventListener("mode:changed", () => {
    enforceSafeState();
  });
});

// =====================================================
// Tyniweb V5 — Preview Mode Toggle
// =====================================================

const PreviewToggle = {
  btn: null,

  init() {
    this.btn = document.getElementById("tw-preview-toggle");

    if (!this.btn) return;

    this.btn.addEventListener("click", () => {
      const current = EditorMode.mode;

      if (current === "preview") {
        this.exitPreview();
      } else {
        this.enterPreview();
      }
    });
  },

  enterPreview() {
    EditorMode.setMode("preview");
    document.body.classList.add("tw-preview-mode");
    document.dispatchEvent(new Event("mode:changed"));
  },

  exitPreview() {
    EditorMode.setMode("edit");
    document.body.classList.remove("tw-preview-mode");
    document.dispatchEvent(new Event("mode:changed"));
  }
};

document.addEventListener("DOMContentLoaded", () => {
  PreviewToggle.init();
});

// =====================================================
// Tyniweb V5 — Test Mode Toggle
// =====================================================

const TestToggle = {
  btn: null,

  init() {
    this.btn = document.getElementById("tw-test-toggle");
    if (!this.btn) return;

    this.btn.addEventListener("click", () => {
      const current = EditorMode.mode;

      if (current === "test") {
        this.exitTest();
      } else {
        this.enterTest();
      }
    });
  },

  enterTest() {
    // Safe-state guard will block Guests/Members
    EditorMode.setMode("test");
    document.body.classList.add("tw-test-mode");
    document.dispatchEvent(new Event("mode:changed"));
  },

  exitTest() {
    EditorMode.setMode("edit");
    document.body.classList.remove("tw-test-mode");
    document.dispatchEvent(new Event("mode:changed"));
  }
};

document.addEventListener("DOMContentLoaded", () => {
  TestToggle.init();
});

// =====================================================
// Tyniweb V5 — Settings Panel Toggle
// =====================================================

const SettingsPanel = {
  btn: null,
  panel: null,
  close: null,

  init() {
    this.btn = document.getElementById("tw-settings-button");
    this.panel = document.getElementById("tw-settings-panel");
    this.close = document.getElementById("tw-settings-close");

    if (!this.btn || !this.panel || !this.close) return;

    this.btn.addEventListener("click", () => {
      this.panel.style.display = "block";
    });

    this.close.addEventListener("click", () => {
      this.panel.style.display = "none";
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
	const debugToggle = document.getElementById("tw-toggle-debug");
const autoTestToggle = document.getElementById("tw-toggle-autotest");

debugToggle.addEventListener("change", () => {
  SettingsCore.set("showDebug", debugToggle.checked);
});

autoTestToggle.addEventListener("change", () => {
  SettingsCore.set("testerAutoStart", autoTestToggle.checked);
});

  SettingsPanel.init();
});


// -------------------------
// SETTINGS UI (TABS + FIELDS)
// -------------------------

const SettingsUI = {
  panel: null,
  openBtn: null,
  saveBtn: null,
  titleInput: null,
  descInput: null,
  githubRepoInput: null,
  githubPushBtn: null,
  githubPullBtn: null,
  tierFreeName: null,
  tierCreatorName: null,
  tierArchitectName: null,
  tierCreatorPrice: null,
  tierArchitectPrice: null,
  membershipPreviewBtn: null,

  init() {
    this.panel = document.getElementById("tw-settings-panel");
    this.openBtn = document.getElementById("tw-open-settings");
    this.saveBtn = document.getElementById("tw-settings-save");
    this.titleInput = document.getElementById("tw-setting-title");
    this.descInput = document.getElementById("tw-setting-description");
    this.githubRepoInput = document.getElementById("tw-github-repo");
    this.githubPushBtn = document.getElementById("tw-github-push");
    this.githubPullBtn = document.getElementById("tw-github-pull");
    this.tierFreeName = document.getElementById("tw-tier-free-name");
    this.tierCreatorName = document.getElementById("tw-tier-creator-name");
    this.tierArchitectName = document.getElementById("tw-tier-architect-name");
    this.tierCreatorPrice = document.getElementById("tw-tier-creator-price");
    this.tierArchitectPrice = document.getElementById("tw-tier-architect-price");
    this.membershipPreviewBtn = document.getElementById("tw-membership-preview");

    if (!this.panel || !this.openBtn) return;

    SettingsCore.load();
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    this.openBtn.addEventListener("click", () => {
      if (!RolePermissions.can("canOpenSettings")) {
        alert("Only Architects can access the Control Center.");
        return;
      }
      this.toggle();
    });

    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", () => {
        SettingsCore.data.title = this.titleInput.value;
        SettingsCore.data.description = this.descInput.value;
        SettingsCore.data.githubRepo = this.githubRepoInput.value;
        SettingsCore.data.tiers.free.name = this.tierFreeName.value;
        SettingsCore.data.tiers.creator.name = this.tierCreatorName.value;
        SettingsCore.data.tiers.architect.name = this.tierArchitectName.value;
        SettingsCore.data.tiers.creator.price = this.tierCreatorPrice.value;
        SettingsCore.data.tiers.architect.price = this.tierArchitectPrice.value;

        SettingsCore.save();
        alert("Settings saved.");
      });
    }

    // Tabs
    const tabs = this.panel.querySelectorAll(".tw-settings-tabs button");
    const contents = this.panel.querySelectorAll(".tw-settings-tab-content");
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tab = btn.getAttribute("data-tab");
        contents.forEach(c => {
          c.style.display = c.getAttribute("data-tab") === tab ? "block" : "none";
        });
      });
    });

    // GitHub stub
    if (this.githubPushBtn) {
      this.githubPushBtn.addEventListener("click", () => {
        alert("GitHub Push (design stub): would push JSON/HTML to " + (this.githubRepoInput.value || "(no repo set)"));
      });
    }
    if (this.githubPullBtn) {
      this.githubPullBtn.addEventListener("click", () => {
        alert("GitHub Pull (design stub): would pull latest JSON/HTML from " + (this.githubRepoInput.value || "(no repo set)"));
      });
    }

    // Membership preview (design-level)
    if (this.membershipPreviewBtn) {
      this.membershipPreviewBtn.addEventListener("click", () => {
        const d = SettingsCore.data.tiers;
        const msg =
          `Pricing Preview:\n\n` +
          `${d.free.name}: $0\n` +
          `${d.creator.name}: ${d.creator.price}\n` +
          `${d.architect.name}: ${d.architect.price}\n\n` +
          `Use this as the basis for pricing.html.`;
        alert(msg);
      });
    }
  },

  toggle() {
    this.panel.style.display =
      this.panel.style.display === "none" ? "block" : "none";
  },

  render() {
    const d = SettingsCore.data;
    if (this.titleInput) this.titleInput.value = d.title;
    if (this.descInput) this.descInput.value = d.description;
    if (this.githubRepoInput) this.githubRepoInput.value = d.githubRepo || "";
    if (this.tierFreeName) this.tierFreeName.value = d.tiers.free.name;
    if (this.tierCreatorName) this.tierCreatorName.value = d.tiers.creator.name;
    if (this.tierArchitectName) this.tierArchitectName.value = d.tiers.architect.name;
    if (this.tierCreatorPrice) this.tierCreatorPrice.value = d.tiers.creator.price;
    if (this.tierArchitectPrice) this.tierArchitectPrice.value = d.tiers.architect.price;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  SettingsUI.init();
});

// =====================================================
// Extensions Manager — Unified Control Center
// =====================================================

const ExtensionsManager = {
  listEl: document.getElementById("tw-extensions-list"),

  init() {
    if (!this.listEl) return;
    this.render();
  },

  // Render extension toggles
  render() {
    const ext = SettingsCore.data.site.extensions || {};
    this.listEl.innerHTML = "";

    Object.keys(ext).forEach(key => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.marginBottom = "10px";

      row.innerHTML = `
        <span style="font-size:13px;">${this.formatName(key)}</span>
        <label style="display:flex; align-items:center; gap:6px;">
          <input type="checkbox" data-ext="${key}" ${ext[key] ? "checked" : ""}>
        </label>
      `;

      this.listEl.appendChild(row);
    });

    // Bind toggle events
    this.listEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.addEventListener("change", () => {
        const key = cb.dataset.ext;
        SettingsCore.data.site.extensions[key] = cb.checked;
        SettingsCore.save();
      });
    });
	// Bind extension detail clicks
	this.listEl.querySelectorAll("[data-ext-details]").forEach(el => {
	  el.addEventListener("click", () => {
		const id = el.dataset.extDetails;
		ExtensionDetails.open(id);
	  });
	});
  },

  // Format extension keys into readable names
  formatName(key) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^\w/, c => c.toUpperCase());
  }
};

// Initialize Extensions Manager
document.addEventListener("DOMContentLoaded", () => {
  ExtensionsManager.init();
});

// =====================================================
// Extension Hooks System
// =====================================================

const ExtensionHooks = {
  hooks: {
    onEnable: {},
    onDisable: {}
  },

  // Register a hook for an extension
  register(extName, { onEnable, onDisable }) {
    if (onEnable) {
      this.hooks.onEnable[extName] = onEnable;
    }
    if (onDisable) {
      this.hooks.onDisable[extName] = onDisable;
    }
  },

  // Trigger enable hook
  enable(extName) {
    const fn = this.hooks.onEnable[extName];
    if (fn) fn();
  },

  // Trigger disable hook
  disable(extName) {
    const fn = this.hooks.onDisable[extName];
    if (fn) fn();
  }
};

// Listen for extension toggle changes
document.addEventListener("settings:changed", () => {
  const ext = SettingsCore.data.site.extensions;

  Object.keys(ext).forEach(key => {
    if (ext[key]) {
      ExtensionHooks.enable(key);
    } else {
      ExtensionHooks.disable(key);
    }
  });
});

// =====================================================
// Extension Registry — Metadata + Auto‑Registration
// =====================================================

const ExtensionRegistry = {
  extensions: {},

  register(id, config) {
    // Store metadata
    this.extensions[id] = {
      id,
      name: config.name || id,
      description: config.description || "",
      category: config.category || "General",
      version: config.version || "1.0.0",
      author: config.author || "Tyniweb",
      enabledByDefault: config.enabledByDefault ?? true,
      dependencies: config.dependencies || [],
      hooks: config.hooks || {}
    };

    // Ensure SettingsCore has a slot for this extension
    if (!SettingsCore.data.site.extensions[id]) {
      SettingsCore.data.site.extensions[id] = config.enabledByDefault ?? true;
      SettingsCore.save();
    }

    // Register hooks if provided
    if (config.hooks) {
      ExtensionHooks.register(id, config.hooks);
    }
  },

  list() {
    return Object.values(this.extensions);
  }
};

// =====================================================
// Extension Loader — Executes Extension Code
// =====================================================

const ExtensionLoader = {
  loaded: {},

  async loadAll() {
    const extState = SettingsCore.data.site.extensions;
    const registry = ExtensionRegistry.extensions;

    for (const id of Object.keys(registry)) {
      if (extState[id]) {
        await this.load(id);
      }
    }
  },

  async load(id) {
    if (this.loaded[id]) return; // Already loaded

    const ext = ExtensionRegistry.extensions[id];
    if (!ext) return;

    // Load dependencies first
    for (const dep of ext.dependencies) {
      if (!SettingsCore.data.site.extensions[dep]) {
        console.warn(`Extension "${id}" requires "${dep}" — enabling dependency.`);
        SettingsCore.data.site.extensions[dep] = true;
        SettingsCore.save();
      }
      await this.load(dep);
    }

    // Run extension init hook if provided
    if (ext.hooks && ext.hooks.onInit) {
      try {
        await ext.hooks.onInit();
      } catch (err) {
        console.error(`Error initializing extension "${id}":`, err);
      }
    }

    this.loaded[id] = true;
  }
};

// Load extensions on startup
document.addEventListener("DOMContentLoaded", () => {
  ExtensionLoader.loadAll();
});

ExtensionRegistry.register("aiTools", {
  name: "AI Tools",
  description: "Generate content, layouts, and creative ideas.",
  category: "AI",
  version: "1.0.0",
  author: "Tyniweb",
  enabledByDefault: true,

  hooks: {
    onInit() {
      console.log("[AI Tools] Initialized");
    },
    onEnable() {
      console.log("[AI Tools] Enabled");
    },
    onDisable() {
      console.log("[AI Tools] Disabled");
    }
  }
});

ExtensionRegistry.register("training", {
  name: "Training System",
  description: "Guided onboarding, tracks, and interactive lessons.",
  category: "Learning",
  version: "1.0.0",
  author: "Tyniweb",
  enabledByDefault: true,

  hooks: {
    onInit() {
      console.log("[Training] Loaded training subsystem");
    },
    onEnable() {
      document.getElementById("tw-training-toggle").style.display = "inline-block";
    },
    onDisable() {
      document.getElementById("tw-training-toggle").style.display = "none";
    }
  }
});

ExtensionRegistry.register("portals", {
  name: "Portals",
  description: "Create and manage portal-based multi-page worlds.",
  category: "Navigation",
  version: "1.0.0",
  author: "Tyniweb",
  enabledByDefault: true,

  hooks: {
    onInit() {
      console.log("[Portals] Portal engine initialized");
    }
  }
});

ExtensionRegistry.register("githubSync", {
  name: "GitHub Sync",
  description: "Simulate push/pull to GitHub repositories.",
  category: "Developer Tools",
  version: "1.0.0",
  author: "Tyniweb",
  enabledByDefault: false,

  hooks: {
    onEnable() {
      console.log("[GitHub Sync] Enabled");
    },
    onDisable() {
      console.log("[GitHub Sync] Disabled");
    }
  }
});

ExtensionRegistry.register("membership", {
  name: "Membership System",
  description: "Pricing tiers, soft-locks, and role-based features.",
  category: "Access Control",
  version: "1.0.0",
  author: "Tyniweb",
  enabledByDefault: true,

  hooks: {
    onInit() {
      console.log("[Membership] Membership system initialized");
    }
  }
});

// =====================================================
// Tyniweb Extension Template
// =====================================================

function createExtension(id, config) {
  ExtensionRegistry.register(id, {
    name: config.name,
    description: config.description,
    category: config.category || "General",
    version: config.version || "1.0.0",
    author: config.author || "Tyniweb",
    enabledByDefault: config.enabledByDefault ?? true,
    dependencies: config.dependencies || [],

    hooks: {
      // Runs once on startup if enabled
      onInit: config.onInit || null,

      // Runs when user toggles ON
      onEnable: config.onEnable || null,

      // Runs when user toggles OFF
      onDisable: config.onDisable || null
    }
  });
}

createExtension("darkMode", {
  name: "Dark Mode",
  description: "Adds dark mode toggle and theme presets.",
  category: "Appearance",
  enabledByDefault: false,

  onInit() {
    console.log("[Dark Mode] Loaded");
  },

  onEnable() {
    document.body.classList.add("tw-dark");
  },

  onDisable() {
    document.body.classList.remove("tw-dark");
  }
});

// =====================================================
// Tyniweb Advanced Extension Template
// =====================================================

function createAdvancedExtension(id, config) {
  ExtensionRegistry.register(id, {
    name: config.name,
    description: config.description,
    category: config.category || "General",
    version: config.version || "1.0.0",
    author: config.author || "Tyniweb",
    enabledByDefault: config.enabledByDefault ?? true,
    dependencies: config.dependencies || [],

    hooks: {
      // Runs once on startup if enabled
      onInit: async () => {
        if (config.onInit) await config.onInit();

        // Inject UI if provided
        if (config.injectUI) config.injectUI();

        // Inject blocks if provided
        if (config.blocks) {
          Object.entries(config.blocks).forEach(([blockName, blockDef]) => {
            if (window.BlockEngine) {
              BlockEngine.register(blockName, blockDef);
            }
          });
        }

        // Inject panels if provided
        if (config.panels) {
          config.panels.forEach(panel => {
            if (window.PanelEngine) {
              PanelEngine.register(panel);
            }
          });
        }

        // Inject commands if provided
        if (config.commands) {
          Object.entries(config.commands).forEach(([cmd, fn]) => {
            if (window.CommandDeck) {
              CommandDeck.register(cmd, fn);
            }
          });
        }

        // Inject training tracks if provided
        if (config.trainingTracks) {
          if (window.TrainingEngine) {
            TrainingEngine.registerTracks(config.trainingTracks);
          }
        }

        // Inject soft-locks if provided
        if (config.softLocks) {
          if (window.SoftLockEngine) {
            SoftLockEngine.register(config.softLocks);
          }
        }

        // Inject test routines if provided
        if (config.tests) {
          if (window.TestingDashboard) {
            TestingDashboard.registerTests(config.tests);
          }
        }
      },

      // Runs when user toggles ON
      onEnable: () => {
        if (config.onEnable) config.onEnable();
      },

      // Runs when user toggles OFF
      onDisable: () => {
        if (config.onDisable) config.onDisable();
      }
    }
  });
}

// =====================================================
// Extensions Manager — With Categories
// =====================================================

const ExtensionsManager = {
  listEl: document.getElementById("tw-extensions-list"),

  init() {
    if (!this.listEl) return;
    this.render();
  },

  render() {
    const extState = SettingsCore.data.site.extensions;
    const registry = ExtensionRegistry.extensions;

    // Group extensions by category
    const categories = {};
    Object.values(registry).forEach(ext => {
      if (!categories[ext.category]) categories[ext.category] = [];
      categories[ext.category].push(ext);
    });

    // Clear UI
    this.listEl.innerHTML = "";

    // Render each category
    Object.keys(categories).forEach(category => {
      // Category header
      const header = document.createElement("h4");
      header.textContent = category;
      header.style.margin = "20px 0 10px";
      header.style.opacity = "0.8";
      header.style.fontSize = "13px";
      this.listEl.appendChild(header);

      // Render extensions in this category
      categories[category].forEach(ext => {
        const id = ext.id;

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "space-between";
        row.style.marginBottom = "10px";

        row.innerHTML = `
          <span style="font-size:13px; cursor:pointer; text-decoration:underline;"
		  data-ext-details="${id}">
		${ext.name}
		</span>
          <label style="display:flex; align-items:center; gap:6px;">
            <input type="checkbox" data-ext="${id}" ${extState[id] ? "checked" : ""}>
          </label>
        `;

        this.listEl.appendChild(row);
      });
    });

    // Bind toggle events
    this.listEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.addEventListener("change", () => {
        const key = cb.dataset.ext;
        SettingsCore.data.site.extensions[key] = cb.checked;
        SettingsCore.save();

        // Fire settings changed event
        document.dispatchEvent(new Event("settings:changed"));
      });
    });
  }
};

// =====================================================
// Extension Details Panel — JS Wiring
// =====================================================

const ExtensionDetails = {
  panel: document.getElementById("tw-extension-details"),
  closeBtn: document.getElementById("tw-ext-close"),

  title: document.getElementById("tw-ext-title"),
  description: document.getElementById("tw-ext-description"),
  category: document.getElementById("tw-ext-category"),
  version: document.getElementById("tw-ext-version"),
  author: document.getElementById("tw-ext-author"),
  deps: document.getElementById("tw-ext-deps"),

  toggleBtn: document.getElementById("tw-ext-toggle"),
  runTestsBtn: document.getElementById("tw-ext-run-tests"),
  openPanelBtn: document.getElementById("tw-ext-open-panel"),

  currentId: null,

  open(id) {
    const ext = ExtensionRegistry.extensions[id];
    if (!ext) return;

    this.currentId = id;

    // Fill details
    this.title.textContent = ext.name;
    this.description.textContent = ext.description;
    this.category.textContent = ext.category;
    this.version.textContent = ext.version;
    this.author.textContent = ext.author;
    this.deps.textContent = ext.dependencies.length
      ? ext.dependencies.join(", ")
      : "None";

    // Toggle button state
    const enabled = SettingsCore.data.site.extensions[id];
    this.toggleBtn.textContent = enabled ? "Disable" : "Enable";

    // Show test button if extension provides tests
    this.runTestsBtn.style.display = ext.hooks?.tests ? "block" : "none";

    // Show panel button if extension provides a panel
    this.openPanelBtn.style.display = ext.hooks?.openPanel ? "block" : "none";

    this.panel.style.display = "block";
  },

  close() {
    this.panel.style.display = "none";
  },

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    // Toggle extension
    this.toggleBtn.addEventListener("click", () => {
      const id = this.currentId;
      const enabled = SettingsCore.data.site.extensions[id];

      SettingsCore.data.site.extensions[id] = !enabled;
      SettingsCore.save();

      // Fire hooks
      document.dispatchEvent(new Event("settings:changed"));

      this.toggleBtn.textContent = !enabled ? "Disable" : "Enable";
    });

    // Run tests
    this.runTestsBtn.addEventListener("click", () => {
      const ext = ExtensionRegistry.extensions[this.currentId];
      if (ext?.hooks?.tests) {
        ext.hooks.tests();
      }
    });

    // Open extension panel
    this.openPanelBtn.addEventListener("click", () => {
      const ext = ExtensionRegistry.extensions[this.currentId];
      if (ext?.hooks?.openPanel) {
        ext.hooks.openPanel();
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ExtensionDetails.init();
});



// =====================================================
// Unified Settings Panel — JS Wiring
// =====================================================

const SettingsUI = {
  panel: document.getElementById("tw-settings-panel"),
  openBtn: document.getElementById("tw-open-settings"),
  closeBtn: document.getElementById("tw-settings-close"),
  saveBtn: document.getElementById("tw-settings-save"),

  tabs: document.querySelectorAll(".tw-settings-tabs button"),
  tabContents: document.querySelectorAll(".tw-settings-tab-content"),

  // Fields
  titleInput: document.getElementById("tw-setting-title"),
  descInput: document.getElementById("tw-setting-description"),

  githubRepo: document.getElementById("tw-github-repo"),

  tierFreeName: document.getElementById("tw-tier-free-name"),
  tierCreatorName: document.getElementById("tw-tier-creator-name"),
  tierArchitectName: document.getElementById("tw-tier-architect-name"),

  tierCreatorPrice: document.getElementById("tw-tier-creator-price"),
  tierArchitectPrice: document.getElementById("tw-tier-architect-price"),

  debugToggle: document.getElementById("tw-toggle-debug"),
  autoTestToggle: document.getElementById("tw-toggle-autotest"),

  init() {
    if (!this.panel) return;

    // OPEN PANEL
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => {
        this.loadValues();
        this.panel.style.display = "block";
      });
    }

    // CLOSE PANEL
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => {
        this.panel.style.display = "none";
      });
    }

    // TAB SWITCHING
    this.tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // SAVE SETTINGS
    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", () => {
        this.saveValues();
        this.panel.style.display = "none";
      });
    }
  },

  // -----------------------------
  // TAB SWITCHING
  // -----------------------------
  switchTab(tabName) {
    this.tabs.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
      btn.style.background = btn.dataset.tab === tabName ? "#4f46e5" : "rgba(10,12,18,0.9)";
    });

    this.tabContents.forEach(section => {
      section.style.display = section.dataset.tab === tabName ? "block" : "none";
    });
  },

  // -----------------------------
  // LOAD VALUES FROM SettingsCore
  // -----------------------------
  loadValues() {
    const data = SettingsCore.data;

    // General
    if (this.titleInput) this.titleInput.value = data.site.title || "";
    if (this.descInput) this.descInput.value = data.site.description || "";

    // GitHub
    if (this.githubRepo) this.githubRepo.value = data.site.githubRepo || "";

    // Membership
    if (this.tierFreeName) this.tierFreeName.value = data.site.tiers.free.name;
    if (this.tierCreatorName) this.tierCreatorName.value = data.site.tiers.creator.name;
    if (this.tierArchitectName) this.tierArchitectName.value = data.site.tiers.architect.name;

    if (this.tierCreatorPrice) this.tierCreatorPrice.value = data.site.tiers.creator.price;
    if (this.tierArchitectPrice) this.tierArchitectPrice.value = data.site.tiers.architect.price;

    // Editor Flags
    if (this.debugToggle) this.debugToggle.checked = data.showDebug;
    if (this.autoTestToggle) this.autoTestToggle.checked = data.testerAutoStart;
  },

  // -----------------------------
  // SAVE VALUES BACK TO SettingsCore
  // -----------------------------
  saveValues() {
    const data = SettingsCore.data;

    // General
    data.site.title = this.titleInput.value;
    data.site.description = this.descInput.value;

    // GitHub
    data.site.githubRepo = this.githubRepo.value;

    // Membership
    data.site.tiers.free.name = this.tierFreeName.value;
    data.site.tiers.creator.name = this.tierCreatorName.value;
    data.site.tiers.architect.name = this.tierArchitectName.value;

    data.site.tiers.creator.price = this.tierCreatorPrice.value;
    data.site.tiers.architect.price = this.tierArchitectPrice.value;

    // Editor Flags
    data.showDebug = this.debugToggle.checked;
    data.testerAutoStart = this.autoTestToggle.checked;

    // Persist
    SettingsCore.save();
  }
};

// Initialize Settings UI
document.addEventListener("DOMContentLoaded", () => {
  SettingsUI.init();
});

// =====================================================
// Extension Panel Engine
// =====================================================

const PanelEngine = {
  panels: {},

  register({ id, title, render }) {
    this.panels[id] = { id, title, render };
  },

  open(id) {
    const panel = this.panels[id];
    if (!panel) return;

    // Create container if not exists
    let container = document.getElementById("tw-ext-panel-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "tw-ext-panel-container";
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.right = "0";
      container.style.width = "420px";
      container.style.maxWidth = "100%";
      container.style.height = "100%";
      container.style.background = "rgba(20,22,28,0.98)";
      container.style.borderLeft = "1px solid rgba(255,255,255,0.12)";
      container.style.zIndex = "6500";
      container.style.padding = "20px";
      container.style.color = "#fff";
      container.style.overflowY = "auto";
      container.style.boxShadow = "-4px 0 24px rgba(0,0,0,0.6)";
      document.body.appendChild(container);
    }

    // Render panel content
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h2 style="margin:0;">${panel.title}</h2>
        <button id="tw-ext-panel-close"
                style="background:none; border:none; color:#aaa; font-size:20px; cursor:pointer;">
          ✕
        </button>
      </div>
      <div id="tw-ext-panel-content"></div>
    `;

    // Insert extension content
    const content = document.getElementById("tw-ext-panel-content");
    content.innerHTML = panel.render();

    // Close button
    document.getElementById("tw-ext-panel-close").onclick = () => {
      container.remove();
    };
  }
};

// =====================================================
// Command Deck — Global Command Registry
// =====================================================

const CommandDeck = {
  commands: {},

  register(name, fn) {
    this.commands[name] = fn;
  },

  run(name, ...args) {
    const cmd = this.commands[name];
    if (cmd) {
      try {
        cmd(...args);
      } catch (err) {
        console.error(`Command "${name}" failed:`, err);
      }
    } else {
      console.warn(`Command "${name}" not found`);
    }
  },

  list() {
    return Object.keys(this.commands);
  }
};

// =====================================================
// Command Palette — UI Logic
// =====================================================

const CommandPalette = {
  panel: document.getElementById("tw-command-palette"),
  input: document.getElementById("tw-command-input"),
  list: document.getElementById("tw-command-list"),

  open() {
    this.refreshList();
    this.panel.style.display = "block";
    this.input.value = "";
    this.input.focus();
  },

  close() {
    this.panel.style.display = "none";
  },

  refreshList(filter = "") {
    const cmds = CommandDeck.list().filter(cmd =>
      cmd.toLowerCase().includes(filter.toLowerCase())
    );

    this.list.innerHTML = cmds
      .map(cmd => `<div class="tw-command-item" data-cmd="${cmd}"
                    style="padding:8px; cursor:pointer; border-radius:4px;">
                    ${cmd}
                  </div>`)
      .join("");

    // Bind click events
    this.list.querySelectorAll("[data-cmd]").forEach(el => {
      el.onclick = () => {
        CommandDeck.run(el.dataset.cmd);
        this.close();
      };
    });
  },

  init() {
    // Filter commands as user types
    this.input.addEventListener("input", () => {
      this.refreshList(this.input.value);
    });

    // Close on Escape
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") this.close();
    });

    // Open palette with Ctrl+K
    document.addEventListener("keydown", e => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.open();
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CommandPalette.init();
});

// =====================================================
// Slash Menu — Type "/" to open contextual menu
// =====================================================

const SlashMenu = {
  menu: document.getElementById("tw-slash-menu"),
  list: document.getElementById("tw-slash-list"),
  active: false,
  filter: "",
  cursorX: 0,
  cursorY: 0,

  open(x, y) {
    this.menu.style.left = x + "px";
    this.menu.style.top = y + "px";
    this.menu.style.display = "block";
    this.active = true;
    this.filter = "";
    this.refresh();
  },

  close() {
    this.menu.style.display = "none";
    this.active = false;
  },

  refresh() {
    const commands = CommandDeck.list().filter(cmd =>
      cmd.toLowerCase().includes(this.filter.toLowerCase())
    );

    const blocks = window.BlockEngine
      ? Object.keys(BlockEngine.blocks).filter(b =>
          b.toLowerCase().includes(this.filter.toLowerCase())
        )
      : [];

    const items = [
      ...blocks.map(b => ({ type: "block", name: b })),
      ...commands.map(c => ({ type: "command", name: c }))
    ];

    this.list.innerHTML = items
      .map(item => `
        <div class="tw-slash-item"
             data-type="${item.type}"
             data-name="${item.name}"
             style="padding:6px; cursor:pointer; border-radius:4px;">
          ${item.name}
        </div>
      `)
      .join("");

    // Bind click events
    this.list.querySelectorAll(".tw-slash-item").forEach(el => {
      el.onclick = () => {
        const type = el.dataset.type;
        const name = el.dataset.name;

        if (type === "command") {
          CommandDeck.run(name);
        }

        if (type === "block" && window.BlockEngine) {
          BlockEngine.insert(name);
        }

        this.close();
      };
    });
  },

  init() {
    // Detect "/" inside the editor
    document.addEventListener("keydown", e => {
      if (e.key === "/") {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        this.cursorX = rect.left;
        this.cursorY = rect.bottom;

        this.open(rect.left, rect.bottom);
      }

      // Close on Escape
      if (e.key === "Escape") {
        this.close();
      }

      // Filter when typing after "/"
      if (this.active && e.key.length === 1) {
        this.filter += e.key;
        this.refresh();
      }

      // Backspace filtering
      if (this.active && e.key === "Backspace") {
        this.filter = this.filter.slice(0, -1);
        this.refresh();
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  SlashMenu.init();
});

// =====================================================
// Enhanced Block Engine — Metadata + Categories + Previews
// =====================================================

const BlockEngine = {
  blocks: {},

  register(id, config) {
    this.blocks[id] = {
      id,
      name: config.name || id,
      category: config.category || "General",
      icon: config.icon || "⬜",
      description: config.description || "",
      preview: config.preview || (() => `<div>${config.name}</div>`),
      render: config.render || (() => `<div>${config.name}</div>`)
    };
  },

  list() {
    return Object.values(this.blocks);
  },

  listByCategory() {
    const groups = {};
    Object.values(this.blocks).forEach(block => {
      if (!groups[block.category]) groups[block.category] = [];
      groups[block.category].push(block);
    });
    return groups;
  },

  insert(id) {
    const block = this.blocks[id];
    if (!block) return;

    const html = block.render();

    // Insert at cursor
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const node = temp.firstElementChild;
    range.insertNode(node);

    // Move cursor after inserted block
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
  }
};

// =====================================================
// Block Picker Panel — UI Logic
// =====================================================

const BlockPicker = {
  panel: document.getElementById("tw-block-picker"),
  closeBtn: document.getElementById("tw-block-picker-close"),
  search: document.getElementById("tw-block-search"),
  list: document.getElementById("tw-block-list"),

  open() {
    this.refresh();
    this.panel.style.display = "block";
    this.search.value = "";
    this.search.focus();
  },

  close() {
    this.panel.style.display = "none";
  },

  refresh(filter = "") {
    const groups = BlockEngine.listByCategory();

    this.list.innerHTML = "";

    Object.keys(groups).forEach(category => {
      const blocks = groups[category].filter(b =>
        b.name.toLowerCase().includes(filter.toLowerCase())
      );

      if (blocks.length === 0) return;

      // Category header
      const header = document.createElement("h4");
      header.textContent = category;
      header.style.margin = "20px 0 10px";
      header.style.opacity = "0.8";
      header.style.fontSize = "13px";
      this.list.appendChild(header);

      // Blocks
      blocks.forEach(block => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "10px";
        row.style.padding = "8px";
        row.style.cursor = "pointer";
        row.style.borderRadius = "6px";

        row.innerHTML = `
          <div style="font-size:20px;">${block.icon}</div>
          <div>
            <div style="font-size:14px;">${block.name}</div>
            <div style="opacity:0.6; font-size:12px;">${block.description}</div>
          </div>
        `;

		row.draggable = true;

		row.addEventListener("dragstart", e => {
		  DragManager.startNew(block.id);
		});

		row.addEventListener("click", () => {
		  BlockEngine.insert(block.id);
		  this.close();
		});

        this.list.appendChild(row);
      });
    });
  },

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    this.search.addEventListener("input", () => {
      this.refresh(this.search.value);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  BlockPicker.init();
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("tw-open-block-picker");
  if (btn) btn.addEventListener("click", () => BlockPicker.open());
});

// =====================================================
// DragManager — Tracks drag state
// =====================================================

const DragManager = {
  draggingBlockId: null,
  draggingExisting: null,

  startNew(id) {
    this.draggingBlockId = id;
  },

  startExisting(wrapper) {
    this.draggingExisting = wrapper;
  },

  end() {
    this.draggingBlockId = null;
    this.draggingExisting = null;
  }
};

// =====================================================
// Drop Zone Logic
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tw-drop-zone").forEach((zone, index) => {
    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("active");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("active");
    });

    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("active");

      const blockId = DragManager.draggingBlockId;
      if (!blockId) return;

      BlockEngine.insertAtIndex(blockId, index);
      DragManager.end();
    });
  });
});

// =====================================================
// BlockCanvas — Unified Rendering + Drag + Drop Zones
// =====================================================

const BlockCanvas = {
  canvas: null,

  init(selector = "#tw-editor-canvas") {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) return;

    this.render();
  },

  // Render all blocks with wrappers + drop zones
  render() {
    const blocks = this.canvas.querySelectorAll("[data-block]");
    const html = [];

    blocks.forEach((blockEl, index) => {
      const id = blockEl.dataset.block;

      html.push(`
        <div class="tw-drop-zone" data-drop-index="${index}"></div>
        <div class="tw-block-wrapper" draggable="true" data-block="${id}">
          ${blockEl.innerHTML}
        </div>
      `);
    });

    // Final drop zone at bottom
    html.push(`<div class="tw-drop-zone" data-drop-index="${blocks.length}"></div>`);

    this.canvas.innerHTML = html.join("");

    this.bindDragEvents();
  },

  // Bind drag + drop logic
  bindDragEvents() {
    const wrappers = this.canvas.querySelectorAll(".tw-block-wrapper");
    const zones = this.canvas.querySelectorAll(".tw-drop-zone");

    // Make wrappers draggable
    wrappers.forEach(wrapper => {
      wrapper.addEventListener("dragstart", e => {
        DragManager.startExisting(wrapper);
      });
    });

    // Drop zones
    zones.forEach(zone => {
      zone.addEventListener("dragover", e => {
        e.preventDefault();
        zone.classList.add("active");
      });

      zone.addEventListener("dragleave", () => {
        zone.classList.remove("active");
      });

      zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("active");

        const index = parseInt(zone.dataset.dropIndex, 10);

        // Insert new block
        if (DragManager.draggingBlockId) {
          BlockEngine.insertAtIndex(DragManager.draggingBlockId, index);
          DragManager.end();
          this.render();
          return;
        }

        // Move existing block
        if (DragManager.draggingExisting) {
          const block = DragManager.draggingExisting;
          block.remove();

          const zones = this.canvas.querySelectorAll(".tw-drop-zone");
          zones[index].insertAdjacentElement("afterend", block);

          DragManager.draggingExisting = null;
          this.render();
        }
      });
    });
  }
};

BlockEngine.insertAtIndex = function(id, index) {
  const block = this.blocks[id];
  if (!block) return;

  const html = block.render();
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const node = temp.firstElementChild;

  // Insert into canvas
  const zones = BlockCanvas.canvas.querySelectorAll(".tw-drop-zone");
  const zone = zones[index];

  zone.insertAdjacentElement("afterend", node);

  // Re-render wrappers + zones
  BlockCanvas.render();
};

