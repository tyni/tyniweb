// =====================================================
// Tyniweb Editor — Full Engine Recovery (Chunk 1)
// Global State, DOM References, Page Engine
// =====================================================

// ----------------- GLOBAL STATE -----------------

const GLOBAL_STYLES = {
  font: "system-ui",
  baseColor: "#ffffff",
  accentColor: "#00cc88",
  bgColor: "#05070a",
  spacing: 16
};

const IdentityCore = {
  archetype: "guide",
  voice: {
    tone: "warm and encouraging",
    style: "clear, direct, supportive"
  },
  promise: "Help you build worlds that feel alive."
};

// ----------------- DOM REFERENCES -----------------

const canvasBody = document.getElementById("tw-canvas-body");
const pageList = document.getElementById("tw-page-list");
const addPageBtn = document.getElementById("tw-add-page");
const publishBtn = document.getElementById("tw-publish-site");
const exportSiteBtn = document.getElementById("tw-export-site");
const globalStylesPanel = document.getElementById("tw-global-styles");
const inspectorPanel = document.getElementById("tw-inspector");
const inspectorTitle = inspectorPanel?.querySelector("[name='title']");
const inspectorSubtitle = inspectorPanel?.querySelector("[name='subtitle']");
const inspectorCTA = inspectorPanel?.querySelector("[name='cta']");
const identityPanel = document.getElementById("tw-identity-panel");
const identityArchetype = identityPanel?.querySelector("[name='identity-archetype']");
const identityVoice = identityPanel?.querySelector("[name='identity-voice']");
const identityPromise = identityPanel?.querySelector("[name='identity-promise']");
const newPortalBtn = document.getElementById("tw-new-portal-template");
const aiContentBtn = document.getElementById("tw-ai-generate-content");
const aiLayoutBtn = document.getElementById("tw-ai-layout");
const trainingToggleBtn = document.getElementById("tw-training-toggle");
const checklistPanel = document.getElementById("tw-training-checklist");
const checklistList = document.getElementById("tw-training-checklist-list");
const trainingArrow = document.getElementById("tw-training-arrow");
const hud = document.getElementById("tw-training-hud");
const hudTrack = document.getElementById("tw-training-hud-track");
const hudStep = document.getElementById("tw-training-hud-step");
const hudTitle = document.getElementById("tw-training-hud-title");
const hudProgressBar = document.getElementById("tw-training-hud-progress-bar");
const trainingNextBtn = document.getElementById("tw-training-next-step");

// ----------------- PAGE ENGINE -----------------

const PageEngine = {
  pages: [],
  currentPage: null,
  storageKey: "tw-pages",

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.pages = [{ name: "Home", blocks: [] }];
      this.currentPage = this.pages[0];
      this.save();
      return;
    }
    this.pages = JSON.parse(raw);
    this.currentPage = this.pages[0] || null;
  },

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.pages));
  },

  addPage(name) {
    const page = { name, blocks: [] };
    this.pages.push(page);
    this.save();
    this.renderPageList();
    this.switchPage(name);
  },

  switchPage(name) {
    const page = this.pages.find(p => p.name === name);
    if (!page) return;
    this.currentPage = page;
    this.renderCanvas();
    this.highlightCurrentPage();
    const evt = new Event("tw-page-switched");
    document.dispatchEvent(evt);
  },

  renderPageList() {
    if (!pageList) return;
    pageList.innerHTML = this.pages
      .map(
        p => `<button class="tw-page-item" data-page="${p.name}">${p.name}</button>`
      )
      .join("");

    pageList.querySelectorAll(".tw-page-item").forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchPage(btn.getAttribute("data-page"));
      });
    });
  },

  renderCanvas() {
    if (!canvasBody || !this.currentPage) return;
    canvasBody.innerHTML = "";
    this.currentPage.blocks.forEach(block => {
      const el = document.createElement("div");
      el.className = "tw-block";
      el.dataset.blockId = block.id;
      el.innerHTML = `
        <h2>${block.title || "Title"}</h2>
        <p>${block.subtitle || "Subtitle"}</p>
        <button>${block.cta || "Button"}</button>
      `;
      el.addEventListener("click", () => {
        BlockEngine.selectBlock(block.id);
      });
      canvasBody.appendChild(el);
    });
  },

  highlightCurrentPage() {
    if (!pageList || !this.currentPage) return;
    pageList.querySelectorAll(".tw-page-item").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-page") === this.currentPage.name
      );
    });
  }
};

// Helper for switching pages externally
function switchPage(name) {
  PageEngine.switchPage(name);
}

// =====================================================
// Tyniweb Editor — Full Engine Recovery (Chunk 2)
// Block Engine, Inspector, Styles, Autosave, Export, Publish, AI
// =====================================================

// ----------------- BLOCK / CANVAS ENGINE -----------------

const BlockEngine = {
  selectedBlockId: null,

  addBlock(type = "hero") {
    if (!PageEngine.currentPage) return;
    const id = "block-" + Date.now();
    const block = {
      id,
      type,
      title: "New Block",
      subtitle: "Supporting text",
      cta: "Click me"
    };
    PageEngine.currentPage.blocks.push(block);
    PageEngine.save();
    PageEngine.renderCanvas();
    this.selectBlock(id);

    const evt = new Event("tw-block-added");
    document.dispatchEvent(evt);
  },

  selectBlock(id) {
    this.selectedBlockId = id;
    this.updateInspector();

    if (!canvasBody) return;
    canvasBody.querySelectorAll(".tw-block").forEach(el => {
      el.classList.toggle("selected", el.dataset.blockId === id);
    });
  },

  getSelectedBlock() {
    if (!PageEngine.currentPage || !this.selectedBlockId) return null;
    return PageEngine.currentPage.blocks.find(b => b.id === this.selectedBlockId) || null;
  },

  updateInspector() {
    const block = this.getSelectedBlock();
    if (!block || !inspectorPanel) return;

    if (inspectorTitle) inspectorTitle.value = block.title || "";
    if (inspectorSubtitle) inspectorSubtitle.value = block.subtitle || "";
    if (inspectorCTA) inspectorCTA.value = block.cta || "";
  },

  applyInspectorChanges() {
    const block = this.getSelectedBlock();
    if (!block) return;

    if (inspectorTitle) block.title = inspectorTitle.value;
    if (inspectorSubtitle) block.subtitle = inspectorSubtitle.value;
    if (inspectorCTA) block.cta = inspectorCTA.value;

    PageEngine.save();
    PageEngine.renderCanvas();
    this.selectBlock(block.id);
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
      });
    }

    if (baseColorInput) {
      baseColorInput.value = GLOBAL_STYLES.baseColor;
      baseColorInput.addEventListener("input", () => {
        GLOBAL_STYLES.baseColor = baseColorInput.value;
        this.apply();
      });
    }

    if (accentColorInput) {
      accentColorInput.value = GLOBAL_STYLES.accentColor;
      accentColorInput.addEventListener("input", () => {
        GLOBAL_STYLES.accentColor = accentColorInput.value;
        this.apply();
      });
    }

    if (bgColorInput) {
      bgColorInput.value = GLOBAL_STYLES.bgColor;
      bgColorInput.addEventListener("input", () => {
        GLOBAL_STYLES.bgColor = bgColorInput.value;
        this.apply();
      });
    }

    if (spacingInput) {
      spacingInput.value = GLOBAL_STYLES.spacing;
      spacingInput.addEventListener("input", () => {
        GLOBAL_STYLES.spacing = parseInt(spacingInput.value || "16", 10);
        this.apply();
      });
    }
  }
};

// ----------------- AUTOSAVE ENGINE -----------------

const AutosaveEngine = {
  intervalId: null,

  start() {
    this.stop();
    this.intervalId = setInterval(() => {
      PageEngine.save();
    }, 5000);
  },

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
};

// ----------------- EXPORT / PUBLISH -----------------

const ExportEngine = {
  exportBundle() {
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
  }
};

const PublishEngine = {
  openPreview() {
    const evt = new Event("tw-first-publish");
    document.dispatchEvent(evt);
    // In V3 this will open a real preview modal
  }
};

// ----------------- AI STUBS -----------------

const AIEngine = {
  generateContentForBlock(block) {
    // Placeholder for V3 AI integration
    return {
      title: "AI Generated Title",
      subtitle: "AI generated supporting text that matches your identity.",
      cta: "Get Started"
    };
  }
};

// =====================================================
// ROLE + TRAINING UI STATE MANAGER
// =====================================================

const ROLE_KEY = "tw-user-role";
let TRAINING_MODE = false; // if already defined elsewhere, remove this line

function getCurrentRole() {
  return localStorage.getItem(ROLE_KEY) || null;
}

function ensureRoleChosen() {
  const role = getCurrentRole();
  const signin = document.querySelector("#tw-signin-btn");

  if (!role) {
    if (signin) signin.style.display = "none";
    document.querySelector("#tw-role-overlay").style.display = "flex";
  } else {
    if (signin) signin.style.display = "none";
    updateRoleButtons(role);
  }
}

function chooseRole(role) {
  localStorage.setItem(ROLE_KEY, role);

  const overlay = document.querySelector("#tw-role-overlay");
  if (overlay) overlay.style.display = "none";

  updateRoleButtons(role);
}

function updateRoleButtons(role) {
  const signin = document.querySelector("#tw-signin-btn");
  const signout = document.querySelector("#tw-signout-btn");
  const trainingToggle = document.querySelector("#tw-training-toggle");
  const trainingPortal = document.querySelector("#tw-training-portal-btn");
  const publish = document.querySelector("#tw-publish-site");
  const exportBtn = document.querySelector("#tw-export-site");

  // Hide all role buttons
  document.querySelectorAll(".tw-role-btn").forEach(btn => {
    btn.style.display = "none";
    btn.classList.remove("active-role");
  });

  if (role === "guest") {
    signin.style.display = "inline-flex";
    signout.style.display = "none";
    trainingToggle.style.display = "none";
    trainingPortal.style.display = "none";
    publish.style.display = "none";
    exportBtn.style.display = "none";
    return;
  }

  // Member or Architect
  signin.style.display = "none";
  signout.style.display = "inline-flex";
  trainingToggle.style.display = "inline-flex";
  publish.style.display = "inline-flex";
  exportBtn.style.display = "inline-flex";

  // Training portal only visible when training is ON
  trainingPortal.style.display = TRAINING_MODE ? "inline-flex" : "none";

  // Show the active role button
  const active = document.querySelector(`.tw-role-btn[data-role='${role}']`);
  if (active) {
    active.style.display = "inline-flex";
    active.classList.add("active-role");
  }
}

function signOut() {
  localStorage.removeItem(ROLE_KEY);
  document.querySelector("#tw-signin-btn").style.display = "inline-flex";
  document.querySelector("#tw-signout-btn").style.display = "none";
  document.querySelectorAll(".tw-role-btn").forEach(btn => btn.style.display = "none");
  openRoleOverlay();
}

function openRoleOverlay() {
  const overlay = document.querySelector("#tw-role-overlay");
  if (overlay) overlay.style.display = "flex";
}

// TRAINING TOGGLE + PORTAL VISIBILITY

function updateTrainingUI() {
  const btn = document.querySelector("#tw-training-toggle");
  const portal = document.querySelector("#tw-training-portal-btn");

  if (!btn || !portal) return;

  if (TRAINING_MODE) {
    btn.classList.add("training-on");
    btn.textContent = "Training: ON";
    portal.style.display = "inline-flex";
  } else {
    btn.classList.remove("training-on");
    btn.textContent = "Training: OFF";
    portal.style.display = "none";
  }
}

function toggleTraining() {
  TRAINING_MODE = !TRAINING_MODE;
  updateTrainingUI();
}

// INITIALIZE ON LOAD

window.addEventListener("DOMContentLoaded", () => {
  ensureRoleChosen();
  updateRoleButtons(getCurrentRole());
  updateTrainingUI();
});


// =====================================================
// Tyniweb Editor — Full Engine Recovery (Chunk 3)
// Teaching Engine + Tracks (Architect, Member, Exam, Onboarding)
// =====================================================

// ----------------- TEACHING ENGINE -----------------

const TeachingEngine = {
  tracks: {},
  currentTrack: null,
  currentStepIndex: 0,
  storageKey: "tw-training-progress",

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
    const track = this.tracks[id];
    if (!track) return;

    this.currentTrack = track;
    this.currentStepIndex = 0;
    this.showStep();
  },

  nextStep() {
    if (!this.currentTrack) return;

    const progress = this.loadProgress();
    const step = this.currentTrack.steps[this.currentStepIndex];

    if (step) {
      progress.completedSteps = progress.completedSteps || {};
      progress.completedSteps[step.id] = true;
      this.saveProgress(progress);
    }

    this.currentStepIndex++;

    if (this.currentStepIndex >= this.currentTrack.steps.length) {
      this.currentTrack = null;
      this.currentStepIndex = 0;
      return;
    }

    this.showStep();
  },

  showStep() {
    const track = this.currentTrack;
    if (!track) return;

    const step = track.steps[this.currentStepIndex];
    applyHighlightForStep(step);
    renderChecklist();
    updateTrainingHUD();
  }
};

// =====================================================
// V3 TRAINING ENGINE CORE — STEP ADVANCEMENT + ACTIONS
// Hybrid: infer from target, override with `action`
// =====================================================

// ------------- CURRENT STEP HELPERS -------------

function getCurrentTrack() {
  return TeachingEngine.currentTrack;
}

function getCurrentStep() {
  const track = getCurrentTrack();
  if (!track) return null;
  return track.steps[TeachingEngine.currentStepIndex] || null;
}

// ------------- MAIN ENTRY: RUN STEP -------------

function runTrainingStep() {
  const step = getCurrentStep();
  if (!step) return;

  // Render HUD / checklist / highlight using existing engine
  TeachingEngine.showStep();

  // Auto-advance intro / informational steps
  if (step.auto === true) {
    // small delay so the user can see it
    setTimeout(() => {
      goToNextTrainingStep();
    }, 600);
    return;
  }

  // Attach listeners for this step
  attachTrainingListenersForStep(step);
}

// ------------- LISTENER MANAGEMENT -------------

let trainingListenerState = {
  active: false,
  handlers: []
};

function clearTrainingListeners() {
  if (!trainingListenerState.active) return;
  trainingListenerState.handlers.forEach(({ type, handler }) => {
    document.removeEventListener(type, handler, true);
  });
  trainingListenerState = { active: false, handlers: [] };
}

function addTrainingListener(type, handler) {
  document.addEventListener(type, handler, true);
  trainingListenerState.handlers.push({ type, handler });
  trainingListenerState.active = true;
}

function attachTrainingListenersForStep(step) {
  clearTrainingListeners();

  const action = step.action || inferActionFromTarget(step);

  // No action defined or inferred → nothing to listen for
  if (!action) return;

  // Explicit custom actions
  if (action.startsWith("custom:")) {
    // You can dispatch these manually from elsewhere in the app
    const eventName = action.slice("custom:".length);
    const handler = (evt) => {
      if (evt.type === eventName) {
        goToNextTrainingStep();
      }
    };
    addTrainingListener(eventName, handler);
    return;
  }

  // Simple DOM-based actions
  const [kind, selector] = action.split(":");
  const normalizedKind = kind || "click";

  if (!selector) {
    // Fallback: treat as global action type
    const handler = () => goToNextTrainingStep();
    addTrainingListener(normalizedKind, handler);
    return;
  }

  const handler = (evt) => {
    const target = evt.target;
    if (!target) return;

    if (target.matches(selector) || target.closest(selector)) {
      goToNextTrainingStep();
    }
  };

  if (normalizedKind === "click") {
    addTrainingListener("click", handler);
  } else if (normalizedKind === "input") {
    addTrainingListener("input", handler);
  } else if (normalizedKind === "change") {
    addTrainingListener("change", handler);
  } else {
    // Fallback to click if unknown
    addTrainingListener("click", handler);
  }
}

// ------------- ACTION INFERENCE -------------

function inferActionFromTarget(step) {
  if (!step || !step.target) return null;

  const el = document.querySelector(step.target);
  if (!el) return null;

  const tag = el.tagName.toLowerCase();
  const type = (el.getAttribute("type") || "").toLowerCase();
  const role = (el.getAttribute("role") || "").toLowerCase();

  // Buttons, clickable things
  if (tag === "button" || role === "button" || el.classList.contains("tw-component-item")) {
    return `click:${step.target}`;
  }

  // Inputs / textareas
  if (tag === "input" || tag === "textarea") {
    // color / range / checkbox / select-like → change
    if (["color", "range", "checkbox", "radio"].includes(type)) {
      return `change:${step.target}`;
    }
    // text-like → input
    return `input:${step.target}`;
  }

  // Selects
  if (tag === "select") {
    return `change:${step.target}`;
  }

  // Panels / lists / canvas → click inside
  if (
    tag === "section" ||
    tag === "aside" ||
    tag === "main" ||
    tag === "div"
  ) {
    return `click:${step.target}`;
  }

  // Fallback
  return `click:${step.target}`;
}

// ------------- OPTIONAL: KEYWORD-BASED AUTO-ADVANCE -------------

function stepMatches(keyword) {
  const step = getCurrentStep();
  if (!step) return false;
  if (!keyword) return false;

  const haystack = [
    step.id,
    step.title,
    step.description
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(String(keyword).toLowerCase());
}

function autoAdvanceIfMatch(keyword) {
  if (stepMatches(keyword)) {
    goToNextTrainingStep();
  }
}

// ------------- HOOK INTO TEACHING ENGINE -------------

// Wrap TeachingEngine.startTrack so it always runs the first step
const _origStartTrack = TeachingEngine.startTrack.bind(TeachingEngine);
TeachingEngine.startTrack = function (id) {
  _origStartTrack(id);
  runTrainingStep();
};

// Wrap TeachingEngine.nextStep to use goToNextTrainingStep if desired
// (You already have goToNextTrainingStep + celebrations; we just ensure
// that when the engine moves, it re-runs the step logic.)

const _origShowStep = TeachingEngine.showStep.bind(TeachingEngine);
TeachingEngine.showStep = function () {
  _origShowStep();
  // Ensure that whenever showStep is called directly, we also
  // re-run the step logic (listeners, auto-advance, etc.)
  const step = getCurrentStep();
  if (step) {
    attachTrainingListenersForStep(step);
  }
};

// ----------------- ARCHITECT MASTER TRACK -----------------

TeachingEngine.registerTrack("architect-master-path", {
  name: "Architect Master Path",
  role: "architect",
  steps: [
    {
      id: "arch-welcome",
      title: "Welcome, Architect",
      description: "Get oriented to the Tyniweb universe and your role.",
      target: "#tw-architect-dashboard",
      highlight: "glow"
    },
    {
      id: "arch-set-identity",
      title: "Set Identity Core",
      description: "Choose archetype, voice, and promise.",
      target: "#tw-identity-panel",
      highlight: "pulse"
    },
    {
      id: "arch-create-portal",
      title: "Create a Portal",
      description: "Use 'New Portal from Template' to spin up a world.",
      target: "#tw-new-portal-template",
      highlight: "pulse"
    },
    {
      id: "arch-add-pages",
      title: "Add Pages",
      description: "Create at least two pages and switch between them.",
      target: ".tw-page-list",
      highlight: "glow"
    },
    {
      id: "arch-add-components",
      title: "Add Components",
      description: "Add a Hero, Section, and Footer to a page.",
      target: ".tw-component-list",
      highlight: "pulse"
    },
    {
      id: "arch-style-theme",
      title: "Style the Theme",
      description: "Adjust font, colors, and spacing in Global Styles.",
      target: "#tw-global-styles",
      highlight: "glow"
    },
    {
      id: "arch-ai-content",
      title: "Use AI Content",
      description: "Generate content for a Hero using AI tools.",
      target: "#tw-ai-generate-content",
      highlight: "pulse"
    },
    {
      id: "arch-export",
      title: "Export Site Bundle",
      description: "Open Export Site and inspect the JSON bundle.",
      target: "#tw-export-site",
      highlight: "glow"
    },
    {
      id: "arch-publish",
      title: "Simulate Publish",
      description: "Open Publish, toggle Preview and Outlines.",
      target: "#tw-publish-site",
      highlight: "pulse"
    },
    {
      id: "arch-review",
      title: "Review & Reflect",
      description: "Open Architect Dashboard and review your progress.",
      target: "#tw-open-architect-dashboard",
      highlight: "glow"
    }
  ]
});

// ----------------- MEMBER CORE TRACK -----------------

TeachingEngine.registerTrack("member-core-path", {
  name: "Member Core Path",
  role: "member",
  steps: [
    {
      id: "mem-welcome",
      title: "Welcome, Member",
      description: "See where you’ll spend most of your time.",
      target: "#tw-canvas",
      highlight: "pulse"
    },
    {
      id: "mem-select-block",
      title: "Select a Block",
      description: "Click a block on the canvas to select it.",
      target: ".tw-block",
      highlight: "glow"
    },
    {
      id: "mem-edit-title",
      title: "Edit a Title",
      description: "Change the title text in the Inspector.",
      target: "[name='title']",
      highlight: "pulse"
    },
    {
      id: "mem-edit-subtitle",
      title: "Edit Supporting Text",
      description: "Update the subtitle/paragraph in the Inspector.",
      target: "[name='subtitle']",
      highlight: "glow"
    },
    {
      id: "mem-edit-cta",
      title: "Edit Button Label",
      description: "Change the button label in the Inspector.",
      target: "[name='cta']",
      highlight: "pulse"
    },
    {
      id: "mem-add-block",
      title: "Add a New Block",
      description: "Add a Section or Hero from the Components panel.",
      target: ".tw-component-list",
      highlight: "pulse"
    },
    {
      id: "mem-ai-help",
      title: "Use AI Help",
      description: "Generate content using the AI tools.",
      target: "#tw-ai-generate-content",
      highlight: "glow"
    },
    {
      id: "mem-preview",
      title: "Preview Your Work",
      description: "Use Publish → Preview to see your page.",
      target: "#tw-publish-site",
      highlight: "pulse"
    },
    {
      id: "mem-celebrate",
      title: "Celebrate Completion",
      description: "Open Member Dashboard to see your progress.",
      target: "#tw-open-member-dashboard",
      highlight: "glow"
    }
  ]
});

// ----------------- ARCHITECT CERTIFICATION EXAM -----------------

TeachingEngine.registerTrack("architect-cert-exam-track", {
  name: "Architect Certification Exam",
  role: "architect",
  steps: [
    {
      id: "exam-identity",
      title: "Set Identity",
      description: "Define archetype, voice, and promise.",
      target: "#tw-identity-panel",
      highlight: "pulse"
    },
    {
      id: "exam-portal",
      title: "Create Portal",
      description: "Create a new portal from template.",
      target: "#tw-new-portal-template",
      highlight: "pulse"
    },
    {
      id: "exam-pages",
      title: "Add Pages",
      description: "Add Home, About, and Services pages.",
      target: ".tw-page-list",
      highlight: "glow"
    },
    {
      id: "exam-components",
      title: "Add Components",
      description: "Add Hero, Feature Row, and Footer.",
      target: ".tw-component-list",
      highlight: "pulse"
    },
    {
      id: "exam-theme",
      title: "Style Theme",
      description: "Apply a cohesive theme in Global Styles.",
      target: "#tw-global-styles",
      highlight: "glow"
    },
    {
      id: "exam-export",
      title: "Export Site",
      description: "Export the site bundle.",
      target: "#tw-export-site",
      highlight: "pulse"
    },
    {
      id: "exam-publish",
      title: "Preview & Publish",
      description: "Open Publish and preview your work.",
      target: "#tw-publish-site",
      highlight: "glow"
    }
  ]
});

// ----------------- MEMBER ONBOARDING TRACK -----------------

TeachingEngine.registerTrack("member-onboarding-voice-track", {
  name: "Member Onboarding",
  role: "member",
  steps: [
    {
      id: "mem-onboard-welcome",
      title: "Welcome",
      description: "Get comfortable with the canvas and your role.",
      target: "#tw-canvas",
      highlight: "pulse"
    },
    {
      id: "mem-onboard-select-block",
      title: "Select a Block",
      description: "Click any block on the canvas.",
      target: ".tw-block",
      highlight: "glow"
    },
    {
      id: "mem-onboard-edit-title",
      title: "Edit Title",
      description: "Change the title text in the Inspector.",
      target: "[name='title']",
      highlight: "pulse"
    },
    {
      id: "mem-onboard-add-block",
      title: "Add a Block",
      description: "Add a Section from the Components panel.",
      target: ".tw-component-list",
      highlight: "pulse"
    },
    {
      id: "mem-onboard-ai-help",
      title: "Use AI Help",
      description: "Use AI to generate content for a block.",
      target: "#tw-ai-generate-content",
      highlight: "glow"
    },
    {
      id: "mem-onboard-preview",
      title: "Preview",
      description: "Open Publish and preview your page.",
      target: "#tw-publish-site",
      highlight: "pulse"
    },
    {
      id: "mem-onboard-celebrate",
      title: "Celebrate",
      description: "Open Member Dashboard to see your progress.",
      target: "#tw-open-member-dashboard",
      highlight: "glow"
    }
  ]
});

// =====================================================
// Tyniweb Editor — Full Engine Recovery (Chunk 4)
// Training Mode Core, Highlights, Checklist, HUD, Arrow, Tooltip
// =====================================================

// ----------------- TRAINING MODE CORE -----------------

//let TRAINING_MODE = false;
let currentHighlightEl = null;

function clearHighlight() {
  if (!currentHighlightEl) return;
  currentHighlightEl.classList.remove("tw-highlight-pulse", "tw-highlight-glow");
  currentHighlightEl = null;
}

function applyHighlightForStep(step) {
  clearHighlight();
  if (!TRAINING_MODE) return;
  if (!step || !step.target) return;

  const el = document.querySelector(step.target);
  if (!el) return;

  currentHighlightEl = el;

  if (step.highlight === "pulse") {
    el.classList.add("tw-highlight-pulse");
  } else if (step.highlight === "glow") {
    el.classList.add("tw-highlight-glow");
  }
}

function renderChecklist() {
  if (!TRAINING_MODE || !checklistPanel || !checklistList) {
    if (checklistPanel) checklistPanel.style.display = "none";
    return;
  }

  const track = TeachingEngine.currentTrack;
  if (!track) {
    checklistPanel.style.display = "none";
    return;
  }

  const prog = TeachingEngine.loadProgress();
  checklistPanel.style.display = "block";

  checklistList.innerHTML = track.steps
    .map(step => {
      const done = prog.completedSteps && prog.completedSteps[step.id];
      return `<li class="${done ? "completed" : ""}">${done ? "✓" : "○"} ${step.title}</li>`;
    })
    .join("");
}

function updateTrainingHUD() {
  if (!TRAINING_MODE || !TeachingEngine.currentTrack || !hud) {
    if (hud) hud.style.display = "none";
    return;
  }

  const track = TeachingEngine.currentTrack;
  const idx = TeachingEngine.currentStepIndex;
  const step = track.steps[idx];

  if (!step) {
    hud.style.display = "none";
    return;
  }

  hud.style.display = "block";

  if (hudTrack) hudTrack.textContent = track.name;
  if (hudStep) hudStep.textContent = `Step ${idx + 1} of ${track.steps.length}`;
  if (hudTitle) hudTitle.textContent = step.title;

  if (hudProgressBar) {
    const pct = ((idx + 1) / track.steps.length) * 100;
    hudProgressBar.style.width = pct + "%";
  }
}

// ----------------- TRAINING ARROW -----------------

function hideTrainingArrow() {
  if (!trainingArrow) return;
  trainingArrow.style.display = "none";
}

function showTrainingArrowForStep(step) {
  if (!TRAINING_MODE || !step || !step.target || !trainingArrow) {
    hideTrainingArrow();
    return;
  }

  const el = document.querySelector(step.target);
  if (!el) {
    hideTrainingArrow();
    return;
  }

  const rect = el.getBoundingClientRect();
  const arrowSize = 40;

  const top = rect.top + window.scrollY - arrowSize;
  const left = rect.left + window.scrollX + rect.width / 2;

  trainingArrow.style.top = `${top}px`;
  trainingArrow.style.left = `${left}px`;
  trainingArrow.style.display = "block";
}

// Patch highlight to also move arrow
const _origApplyHighlightForStep_ARROW = applyHighlightForStep;
applyHighlightForStep = function(step) {
  _origApplyHighlightForStep_ARROW(step);
  showTrainingArrowForStep(step);
};

// ----------------- TRAINING TOOLTIP -----------------

let trainingTooltipEl = null;

function ensureTrainingTooltip() {
  if (trainingTooltipEl) return trainingTooltipEl;

  trainingTooltipEl = document.createElement("div");
  trainingTooltipEl.id = "tw-training-tooltip";
  trainingTooltipEl.style.position = "absolute";
  trainingTooltipEl.style.zIndex = "1001";
  trainingTooltipEl.style.maxWidth = "260px";
  trainingTooltipEl.style.fontSize = "12px";
  trainingTooltipEl.style.background = "rgba(10, 12, 16, 0.96)";
  trainingTooltipEl.style.border = "1px solid rgba(255, 255, 255, 0.12)";
  trainingTooltipEl.style.borderRadius = "8px";
  trainingTooltipEl.style.padding = "8px 10px";
  trainingTooltipEl.style.color = "#f5f5f5";
  trainingTooltipEl.style.pointerEvents = "none";
  trainingTooltipEl.style.display = "none";

  document.body.appendChild(trainingTooltipEl);
  return trainingTooltipEl;
}

function hideTrainingTooltip() {
  if (!trainingTooltipEl) return;
  trainingTooltipEl.style.display = "none";
}

function showTrainingTooltipForStep(step) {
  if (!TRAINING_MODE || !step || !step.target) {
    hideTrainingTooltip();
    return;
  }

  const el = document.querySelector(step.target);
  if (!el) {
    hideTrainingTooltip();
    return;
  }

  const tooltip = ensureTrainingTooltip();
  tooltip.innerHTML = `<strong>${step.title}</strong><br/><small>${step.description}</small>`;

  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY - tooltip.offsetHeight - 8;
  const left = rect.left + window.scrollX;

  tooltip.style.top = `${Math.max(8, top)}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.display = "block";
}

// Patch highlight again to also show tooltip
const _origApplyHighlightForStep_ADV = applyHighlightForStep;
applyHighlightForStep = function(step) {
  _origApplyHighlightForStep_ADV(step);
  showTrainingTooltipForStep(step);
};

// ----------------- TRAINING MODE TOGGLE -----------------

if (trainingToggleBtn) {
  trainingToggleBtn.addEventListener("click", () => {
    TRAINING_MODE = !TRAINING_MODE;

    if (TRAINING_MODE) {
      trainingToggleBtn.textContent = "Training: ON";
      trainingToggleBtn.classList.add("training-on");

      renderChecklist();
      updateTrainingHUD();

      const step = TeachingEngine.currentTrack?.steps[TeachingEngine.currentStepIndex];
      applyHighlightForStep(step);
    } else {
      trainingToggleBtn.textContent = "Training: OFF";
      trainingToggleBtn.classList.remove("training-on");

      clearHighlight();
      hideTrainingArrow();
      hideTrainingTooltip();

      if (checklistPanel) checklistPanel.style.display = "none";
      if (hud) hud.style.display = "none";
    }
  });
}

// =====================================================
// Tyniweb Editor — Full Engine Recovery (Chunk 5)
// Auto-Detect, Voice Guidance, Micro-Coaching, Celebrations, Exam Timer
// =====================================================

// ----------------- AUTO-DETECT STEP COMPLETION -----------------

function stepMatches(keyword) {
  if (!TRAINING_MODE || !TeachingEngine.currentTrack) return false;

  const step = TeachingEngine.currentTrack.steps[TeachingEngine.currentStepIndex];
  if (!step) return false;

  return (
    step.id.toLowerCase().includes(keyword) ||
    step.title.toLowerCase().includes(keyword)
  );
}

function autoAdvanceIfMatch(keyword) {
  if (stepMatches(keyword)) {
    goToNextTrainingStep();
  }
}

// Block added
document.addEventListener("tw-block-added", () => {
  autoAdvanceIfMatch("add-block");
  autoAdvanceIfMatch("add-components");
});

// Inspector edits
if (inspectorTitle) {
  inspectorTitle.addEventListener("input", () => {
    BlockEngine.applyInspectorChanges();
    autoAdvanceIfMatch("edit-title");
    autoAdvanceIfMatch("edit-text");
  });
}

if (inspectorSubtitle) {
  inspectorSubtitle.addEventListener("input", () => {
    BlockEngine.applyInspectorChanges();
    autoAdvanceIfMatch("edit-subtitle");
    autoAdvanceIfMatch("edit-text");
  });
}

if (inspectorCTA) {
  inspectorCTA.addEventListener("input", () => {
    BlockEngine.applyInspectorChanges();
    autoAdvanceIfMatch("edit-cta");
    autoAdvanceIfMatch("edit-text");
  });
}

// Page added
if (addPageBtn) {
  addPageBtn.addEventListener("click", () => {
    const name = prompt("Page name?", "New Page");
    if (!name) return;
    PageEngine.addPage(name);
    autoAdvanceIfMatch("add-pages");
  });
}

// Page switched
const _origSwitchPage_AUTO = switchPage;
switchPage = function(name) {
  _origSwitchPage_AUTO(name);
  autoAdvanceIfMatch("switch-page");
  autoAdvanceIfMatch("add-pages");
};

// Publish
if (publishBtn) {
  publishBtn.addEventListener("click", () => {
    PublishEngine.openPreview();
    autoAdvanceIfMatch("publish");
    autoAdvanceIfMatch("preview");
  });
}

// Export
if (exportSiteBtn) {
  exportSiteBtn.addEventListener("click", () => {
    ExportEngine.exportBundle();
    autoAdvanceIfMatch("export");
  });
}

// Global styles
document.querySelector('[name="global-font"]')?.addEventListener("change", () => {
  autoAdvanceIfMatch("style-theme");
});

document.querySelector('[name="global-base-color"]')?.addEventListener("input", () => {
  autoAdvanceIfMatch("style-theme");
});

document.querySelector('[name="global-accent-color"]')?.addEventListener("input", () => {
  autoAdvanceIfMatch("style-theme");
});

document.querySelector('[name="global-bg-color"]')?.addEventListener("input", () => {
  autoAdvanceIfMatch("style-theme");
});

document.querySelector('[name="global-spacing"]')?.addEventListener("input", () => {
  autoAdvanceIfMatch("style-theme");
});

// AI content
if (aiContentBtn) {
  aiContentBtn.addEventListener("click", () => {
    const block = BlockEngine.getSelectedBlock();
    if (!block) return;

    const generated = AIEngine.generateContentForBlock(block);
    block.title = generated.title;
    block.subtitle = generated.subtitle;
    block.cta = generated.cta;

    PageEngine.save();
    PageEngine.renderCanvas();

    autoAdvanceIfMatch("ai");
    autoAdvanceIfMatch("ai-help");
  });
}

// AI layout
if (aiLayoutBtn) {
  aiLayoutBtn.addEventListener("click", () => {
    autoAdvanceIfMatch("ai");
    autoAdvanceIfMatch("ai-help");
  });
}

// Portal created
if (newPortalBtn) {
  newPortalBtn.addEventListener("click", () => {
    const evt = new Event("tw-first-portal");
    document.dispatchEvent(evt);

    autoAdvanceIfMatch("portal");
    autoAdvanceIfMatch("create-portal");
  });
}

// Identity changes
if (identityArchetype) {
  identityArchetype.addEventListener("change", () => {
    IdentityCore.archetype = identityArchetype.value;
    autoAdvanceIfMatch("identity");
    autoAdvanceIfMatch("set-identity");
  });
}

if (identityVoice) {
  identityVoice.addEventListener("input", () => {
    IdentityCore.voice.tone = identityVoice.value;
    autoAdvanceIfMatch("identity");
    autoAdvanceIfMatch("set-identity");
  });
}

if (identityPromise) {
  identityPromise.addEventListener("input", () => {
    IdentityCore.promise = identityPromise.value;
    autoAdvanceIfMatch("identity");
    autoAdvanceIfMatch("set-identity");
  });
}

// ----------------- VOICE-GUIDED TRAINING CORE -----------------

function getVoiceTonePrefix() {
  return IdentityCore?.voice?.tone
    ? `In a ${IdentityCore.voice.tone} tone, `
    : "";
}

function speakTraining(text) {
  if (!TRAINING_MODE) return;
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance();
  utter.text = getVoiceTonePrefix() + text;
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
}

function speakCurrentStep() {
  if (!TRAINING_MODE || !TeachingEngine.currentTrack) return;

  const track = TeachingEngine.currentTrack;
  const idx = TeachingEngine.currentStepIndex;
  const step = track.steps[idx];
  if (!step) return;

  speakTraining(`Step ${idx + 1}. ${step.title}. ${step.description}`);
}

// Patch startTrack for voice
const _origStartTrack_VOICE = TeachingEngine.startTrack.bind(TeachingEngine);
TeachingEngine.startTrack = function(id) {
  if (!TRAINING_MODE) {
    alert("Training Mode is OFF. Turn it ON to start a track.");
    return;
  }

  _origStartTrack_VOICE(id);

  speakTraining(`Starting ${TeachingEngine.currentTrack.name}. Let's begin.`);
  speakCurrentStep();
};

// Patch nextStep for voice
const _origNextStep_VOICE = TeachingEngine.nextStep.bind(TeachingEngine);
TeachingEngine.nextStep = function() {
  if (!TRAINING_MODE) return;

  _origNextStep_VOICE();

  const track = TeachingEngine.currentTrack;
  if (!track) {
    speakTraining("You have completed this training track. Well done.");
    return;
  }

  speakCurrentStep();
};

// Training toggle voice
if (trainingToggleBtn) {
  trainingToggleBtn.addEventListener("click", () => {
    if (TRAINING_MODE) {
      speakTraining("Training Mode activated. Open the Training Portal to begin.");
    } else if (window.speechSynthesis) {
      speechSynthesis.cancel();
    }
  });
}

// ----------------- MICRO-COACHING -----------------

let trainingIdleTimer = null;
const TRAINING_IDLE_MS = 10000;

function resetTrainingIdleTimer() {
  if (!TRAINING_MODE || !TeachingEngine.currentTrack) return;

  clearTimeout(trainingIdleTimer);

  trainingIdleTimer = setTimeout(() => {
    const track = TeachingEngine.currentTrack;
    const idx = TeachingEngine.currentStepIndex;
    const step = track?.steps?.[idx];
    if (!step) return;

    const id = step.id.toLowerCase();

    if (id.includes("add-block") || id.includes("add-components")) {
      speakTraining("If you're unsure, try clicking a block in the Components panel on the left.");
    } else if (id.includes("edit-title") || id.includes("edit-text")) {
      speakTraining("You can click into the title field in the Inspector and start typing.");
    } else if (id.includes("style-theme")) {
      speakTraining("Try adjusting a color or font in Global Styles to move this step forward.");
    } else if (id.includes("publish") || id.includes("preview")) {
      speakTraining("Look for the Publish button, then open Preview to see your work.");
    } else if (id.includes("identity") || id.includes("set-identity")) {
      speakTraining("Choose an archetype and voice that match the personality you want for this project.");
    } else {
      speakTraining("You're doing great. Try interacting with the highlighted area to continue.");
    }
  }, TRAINING_IDLE_MS);
}

["click", "keydown", "input"].forEach(evtName => {
  document.addEventListener(evtName, () => {
    if (!TRAINING_MODE) return;
    resetTrainingIdleTimer();
  });
});

// Patch nextStep to include idle reset
const _origNextStep_MICRO = TeachingEngine.nextStep.bind(TeachingEngine);
TeachingEngine.nextStep = function() {
  if (!TRAINING_MODE) return;

  _origNextStep_MICRO();
  resetTrainingIdleTimer();
  speakCurrentStep();
};

// ----------------- CELEBRATIONS -----------------

function speakCelebration(type = "step") {
  if (!TRAINING_MODE) return;

  const linesStep = [
    "Nice work. That step is complete.",
    "Clean move. Let's keep going.",
    "Beautifully done. You're building momentum.",
    "That was a strong step. Onward."
  ];

  const linesTrack = [
    "You have completed this training track. Impressive work.",
    "Track complete. You're leveling up as an Architect.",
    "You finished the track. That was solid.",
    "Excellent. This training path is now complete."
  ];

  const pool = type === "track" ? linesTrack : linesStep;
  const line = pool[Math.floor(Math.random() * pool.length)];

  speakTraining(line);
}

// ----------------- BASE FUNCTION (must come BEFORE patch) -----------------

function goToNextTrainingStep() {
  if (!TRAINING_MODE) return;

  TeachingEngine.currentStepIndex++;

  // Safety: clamp to last step
  const track = TeachingEngine.currentTrack;
  if (track && TeachingEngine.currentStepIndex >= track.steps.length) {
    TeachingEngine.currentStepIndex = track.steps.length - 1;
  }

  runTrainingStep();
}

// ----------------- CELEBRATION WRAPPER (runs AFTER base function) -----------------

const _origGoToNext_CELEB = goToNextTrainingStep;
goToNextTrainingStep = function() {
  if (!TRAINING_MODE || !TeachingEngine.currentTrack) return;

  const track = TeachingEngine.currentTrack;
  const idx = TeachingEngine.currentStepIndex;

  if (idx >= track.steps.length - 1) {
    _origGoToNext_CELEB();
    speakCelebration("track");
    return;
  }

  _origGoToNext_CELEB();
  speakCelebration("step");
};

// ----------------- FIRST-TIME EVENTS -----------------

document.addEventListener("tw-first-publish", () => {
  speakTraining("You just completed your first publish. That's a big milestone.");
});

document.addEventListener("tw-first-portal", () => {
  speakTraining("Your first portal is live. You're officially shaping universes.");
});


// ----------------- EXAM TIMER -----------------

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

    speakTraining("Architect Certification Exam started. You have fifteen minutes. Follow the steps carefully.");
  },

  stop(passed = true) {
    this.active = false;
    clearInterval(this.timerId);

    if (passed) {
      speakTraining("You have completed the Architect Certification Exam. Congratulations.");
      const evt = new Event("tw-architect-exam-passed");
      document.dispatchEvent(evt);
    } else {
      speakTraining("The exam time has ended. You can try again when you're ready.");
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
        speakTraining(`${minutesLeft} minute${minutesLeft === 1 ? "" : "s"} remaining in the exam.`);
      }
    }, 30000);
  }
};

// =====================================================
// Tyniweb Editor — Full Engine Recovery (Chunk 6)
// Role Switching, Training Portal, Scroll/Resize Sync, INIT
// =====================================================

// ----------------- ROLE SWITCHING -----------------

document.querySelectorAll("[data-role]").forEach(btn => {
  btn.addEventListener("click", () => {
    const role = btn.getAttribute("data-role");
    chooseRole(role);

    if (TRAINING_MODE && role === "member") {
      maybeStartMemberOnboarding();
    }

    if (TRAINING_MODE && role === "architect" && !TeachingEngine.currentTrack) {
      speakTraining("Architect mode activated. Open the Training Portal to begin.");
    }
  });
});

// ----------------- TRAINING PORTAL -----------------

const openTrainingPortalBtn = document.getElementById("tw-training-portal-btn");

if (openTrainingPortalBtn) {
  openTrainingPortalBtn.addEventListener("click", () => {
    const portal = document.getElementById("tw-training-portal");
    if (!portal) return;

    const archList = document.getElementById("tw-training-architect-list");
    const memList = document.getElementById("tw-training-member-list");

    function renderList(container, role) {
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
          speakTraining(`Starting ${TeachingEngine.tracks[id].name}.`);
          portal.style.display = "none";
        });
      });
    }

    renderList(archList, "architect");
    renderList(memList, "member");

    portal.style.display = "flex";
  });
}

const trainingPortalClose = document.getElementById("tw-training-close");
if (trainingPortalClose) {
  trainingPortalClose.addEventListener("click", () => {
    const portal = document.getElementById("tw-training-portal");
    if (portal) portal.style.display = "none";
  });
}

// ----------------- SCROLL / RESIZE SYNC -----------------

window.addEventListener("scroll", () => {
  if (!TRAINING_MODE) return;
  const step = TeachingEngine.currentTrack?.steps[TeachingEngine.currentStepIndex];
  showTrainingArrowForStep(step);
  showTrainingTooltipForStep(step);
});

window.addEventListener("resize", () => {
  if (!TRAINING_MODE) return;
  const step = TeachingEngine.currentTrack?.steps[TeachingEngine.currentStepIndex];
  showTrainingArrowForStep(step);
  showTrainingTooltipForStep(step);
});

// ----------------- MEMBER ONBOARDING AUTO-START -----------------

function maybeStartMemberOnboarding() {
  if (!TRAINING_MODE) return;
  if (getCurrentRole() !== "member") return;

  TeachingEngine.startTrack("member-onboarding-voice-track");
}

// ----------------- TRAINING NEXT BUTTON -----------------

if (trainingNextBtn) {
  trainingNextBtn.addEventListener("click", () => {
    goToNextTrainingStep();
  });
}

// ----------------- INIT -----------------

document.addEventListener("DOMContentLoaded", () => {
  PageEngine.load();
  PageEngine.renderPageList();
  PageEngine.renderCanvas();
  PageEngine.highlightCurrentPage();

  GlobalStylesEngine.apply();
  GlobalStylesEngine.bindControls();

  AutosaveEngine.start();

  if (identityArchetype) identityArchetype.value = IdentityCore.archetype;
  if (identityVoice) identityVoice.value = IdentityCore.voice.tone;
  if (identityPromise) identityPromise.value = IdentityCore.promise;

  if (inspectorTitle) inspectorTitle.addEventListener("input", () => BlockEngine.applyInspectorChanges());
  if (inspectorSubtitle) inspectorSubtitle.addEventListener("input", () => BlockEngine.applyInspectorChanges());
  if (inspectorCTA) inspectorCTA.addEventListener("input", () => BlockEngine.applyInspectorChanges());

  // FIX: Add Page button must be wired AFTER DOM loads
  if (addPageBtn) {
    addPageBtn.addEventListener("click", () => {
      const name = prompt("Page name?", "New Page");
      if (!name) return;
      PageEngine.addPage(name);
      autoAdvanceIfMatch("add-pages");
    });
  }

  document.querySelectorAll("[data-add-block]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-add-block");
      BlockEngine.addBlock(type);
    });
  });

  if (exportSiteBtn) {
    exportSiteBtn.addEventListener("click", () => {
      ExportEngine.exportBundle();
    });
  }

  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      PublishEngine.openPreview();
    });
  }

  if (newPortalBtn) {
    newPortalBtn.addEventListener("click", () => {
      const evt = new Event("tw-first-portal");
      document.dispatchEvent(evt);
    });
  }

  if (aiContentBtn) {
    aiContentBtn.addEventListener("click", () => {
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

  if (aiLayoutBtn) {
    aiLayoutBtn.addEventListener("click", () => {
      speakTraining("Layout suggestions will be available in V3.");
    });
  }

  if (TRAINING_MODE) {
    speakTraining("Welcome back. Training Mode is active.");
  }
});

