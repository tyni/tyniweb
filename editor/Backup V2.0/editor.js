// =====================================================
// Tyniweb Editor — Master Script
// =====================================================
// Table of Contents
// -----------------------------------------------------
// Phase 01: Global Styles Config
// Phase 02: Component Templates
// Phase 03: Variant Templates
// Phase 04: Expanded Component Templates
// Phase 05: Multi-Page System (Core)
// Phase 06: Block Enhancement & IDs
// Phase 07: Drag & Drop (Blocks + Components)
// Phase 08: History System (Undo / Redo)
// Phase 09: JSON Save / Load
// Phase 10: Export HTML / CSS
// Phase 11: Component Registry
// Phase 12: Selection & Block Controls
// Phase 13: Inspector (Load + Live Editing + Variants)
// Phase 14: Page List (Switch, Add, Rename)
// Phase 15: Global Styles (Live Theme)
// -----------------------------------------------------
// Future Phases (Scaffolded Only)
// -----------------------------------------------------
// Phase 16: Page Reordering (Placeholder)
// Phase 17: Page Duplication / Deletion (Placeholder)
// Phase 18: HTML Import (Placeholder)
// Phase 19: Multi-Page Export (Placeholder)
// Phase 20: Theme Presets (Placeholder)
// Phase 21: Component Presets (Placeholder)
// Phase 22: AI Content (Placeholder)
// Phase 23: AI Layout (Placeholder)
// Phase 24: Autosave (Placeholder)
// Phase 25: Collaboration Hooks (Placeholder)
// Phase 26: Publishing Pipeline (Placeholder)
// =====================================================



// -----------------------------------------------------
// Phase 01: Global Styles Config
// -----------------------------------------------------
const GLOBAL_STYLES = {
  fontFamily: "system-ui",
  baseColor: "#f5f5f5",
  accentColor: "#00cc88",
  backgroundColor: "#0b0c10",
  spacing: 20
};


// -----------------------------------------------------
// Warp 21 Teaching Engine (Upgrade)
// -----------------------------------------------------
const TeachingEngine = {
  storageKey: "tw-teaching-progress",

  tracks: {},
  currentTrack: null,
  currentStepIndex: 0,

  registerTrack(id, config) {
    this.tracks[id] = config;
    console.log("[TeachingEngine] Registered track:", id);
  },

  loadProgress() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : { completedSteps: {}, lastTrack: null };
    } catch {
      return { completedSteps: {}, lastTrack: null };
    }
  },

  saveProgress(progress) {
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  },

  markStep(stepId) {
    const progress = this.loadProgress();
    progress.completedSteps[stepId] = true;
    this.saveProgress(progress);

    if (typeof FollowThroughAssistant !== "undefined") {
      FollowThroughAssistant.setStep(stepId);
    }
  },

  startTrack(id) {
    const track = this.tracks[id];
    if (!track) {
      console.warn("[TeachingEngine] Tried to start unknown track:", id);
      return;
    }

    this.currentTrack = track;
    this.currentStepIndex = 0;

    const progress = this.loadProgress();
    progress.lastTrack = id;
    this.saveProgress(progress);

    console.log("[TeachingEngine] Starting track:", id);
    this.showStep();
  },

  showStep() {
    if (!this.currentTrack) return;

    const step = this.currentTrack.steps[this.currentStepIndex];
    if (!step) {
      console.log("[TeachingEngine] Track complete:", this.currentTrack.name);
      return;
    }

    console.log("[TeachingEngine] Showing step:", step.id);

    if (step.target) {
      const el = document.querySelector(step.target);
      if (el) {
        const cls = "tw-highlight-" + (step.highlight || "pulse");
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 2000);
      }
    }

    if (typeof FollowThroughAssistant !== "undefined") {
      FollowThroughAssistant.setStep(step.id);
    }
  },

  completeStep() {
    if (!this.currentTrack) return;

    const step = this.currentTrack.steps[this.currentStepIndex];
    if (step) this.markStep(step.id);

    this.currentStepIndex++;
    this.showStep();
  },

  init() {
    console.log("[TeachingEngine] Initialized.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  TeachingEngine.init();
});

// -----------------------------------------------------
// Architect & Member Badge Systems
// -----------------------------------------------------
const ArchitectBadges = {
  storageKey: "tw-architect-badges",

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(badges) {
    localStorage.setItem(this.storageKey, JSON.stringify(badges));
  },

  award(name) {
    const badges = this.load();
    if (!badges.includes(name)) {
      badges.push(name);
      this.save(badges);
      console.log("[Badges] Awarded:", name);
    }
  },

  getAll() {
    return this.load();
  }
};

// -----------------------------------------------------
// Architect Dashboard & Graduation
// -----------------------------------------------------
const dash = document.getElementById("tw-architect-dashboard");
const dashClose = document.getElementById("tw-architect-dashboard-close");

function showArchitectDashboard() {
  if (!dash) return;

  const prog = TeachingEngine.loadProgress();
  const track = TeachingEngine.tracks["architect-track"];
  const total = track ? track.steps.length : 0;
  const completed = Object.keys(prog.completedSteps).length;

  const progEl = document.getElementById("tw-architect-progress");
  if (progEl) progEl.textContent = `${completed} of ${total} steps completed`;

  const badgeEl = document.getElementById("tw-architect-badges");
  if (badgeEl) {
    badgeEl.innerHTML = (ArchitectBadges.getAll() || [])
      .map(b => `<span class="tw-badge">${b}</span>`)
      .join("");
  }

  dash.style.display = "flex";
}

if (dashClose) {
  dashClose.addEventListener("click", () => {
    dash.style.display = "none";
  });
}

const grad = document.getElementById("tw-architect-graduation");
const gradClose = document.getElementById("tw-graduation-close");

function showGraduationCeremony() {
  if (!grad) return;
  grad.style.display = "flex";
}

if (gradClose) {
  gradClose.addEventListener("click", () => {
    grad.style.display = "none";
  });
}

function onArchitectExamPassed() {
  ArchitectBadges.award("Certified Architect");
  showGraduationCeremony();
}

// -----------------------------------------------------
// Member Dashboard & Celebration
// -----------------------------------------------------
const memberDash = document.getElementById("tw-member-dashboard");
const memberDashClose = document.getElementById("tw-member-dashboard-close");

function showMemberDashboard() {
  if (!memberDash) return;

  const prog = TeachingEngine.loadProgress();
  const track = TeachingEngine.tracks["member-onboarding"] || TeachingEngine.tracks["member-track"];
  const total = track ? track.steps.length : 0;
  const completed = Object.keys(prog.completedSteps).length;

  const progEl = document.getElementById("tw-member-progress");
  if (progEl) progEl.textContent = `${completed} of ${total} steps completed`;

  const badgeEl = document.getElementById("tw-member-badges");
  if (badgeEl) {
    badgeEl.innerHTML = (MemberBadges.getAll() || [])
      .map(b => `<span class="tw-badge">${b}</span>`)
      .join("");
  }

  memberDash.style.display = "flex";
}

if (memberDashClose) {
  memberDashClose.addEventListener("click", () => {
    memberDash.style.display = "none";
  });
}

const memCele = document.getElementById("tw-member-celebration");
const memCeleClose = document.getElementById("tw-member-celebration-close");

function showMemberCelebration() {
  if (!memCele) return;
  memCele.style.display = "flex";
}

if (memCeleClose) {
  memCeleClose.addEventListener("click", () => {
    memCele.style.display = "none";
  });
}

function onMemberTrainingComplete() {
  MemberBadges.award("Member Training Complete");
  showMemberCelebration();
}

// -----------------------------------------------------
// Training Tracks (Architect, Member, Member Onboarding)
// -----------------------------------------------------
TeachingEngine.registerTrack("architect-track", {
  name: "Architect Training",
  role: "architect",
  steps: [
    { id: "universe-model",   title: "Understand the Universe Model", description: "Universe → Projects → Portals → Pages → Blocks.", target: "#tw-logo", highlight: "pulse" },
    { id: "set-identity",     title: "Set Identity",                  description: "Choose archetype, voice tone, and promise.",       target: "#tw-identity-archetype", highlight: "glow" },
    { id: "create-portal",    title: "Create a Portal",               description: "Use the Portal menu to create a new portal.",     target: "button[data-menu='portal']", highlight: "pulse" },
    { id: "add-pages",        title: "Add Pages",                     description: "Add at least two pages.",                         target: "#tw-add-page", highlight: "glow" },
    { id: "add-components",   title: "Add Smart Components",          description: "Drag a Hero and Section onto the canvas.",         target: ".tw-component-list", highlight: "pulse" },
    { id: "generate-content", title: "Generate AI Content",           description: "Use AI Tools to generate content.",                target: "#tw-ai-generate-content", highlight: "glow" },
    { id: "apply-theme",      title: "Apply a Theme Preset",          description: "Choose a theme preset in Global Styles.",          target: "select[name='global-theme-preset']", highlight: "pulse" },
    { id: "run-checklist",    title: "Run Publish Checklist",         description: "Open Publish and review warnings.",                target: "#tw-publish-site", highlight: "glow" },
    { id: "simulate-publish", title: "Simulate Publish",              description: "Click Publish → Preview.",                         target: "#tw-publish-site", highlight: "pulse" },
    { id: "review-history",   title: "Review History",                description: "Open the History panel.",                          target: "#tw-history-toggle", highlight: "glow" }
  ]
});

TeachingEngine.registerTrack("member-track", {
  name: "Member Training",
  role: "member",
  steps: [
    { id: "member-canvas",      title: "Understand the Canvas", description: "This is where you edit content.",              target: "#tw-canvas", highlight: "pulse" },
    { id: "member-edit-content",title: "Edit Content",          description: "Use the Inspector to edit text and images.",   target: ".tw-inspector-section", highlight: "glow" },
    { id: "member-add-blocks",  title: "Add Blocks",            description: "Add a Section or Hero to the page.",           target: ".tw-component-list", highlight: "pulse" },
    { id: "member-ai-tools",    title: "Use AI Tools",          description: "Generate content using AI.",                   target: "#tw-ai-generate-content", highlight: "glow" },
    { id: "member-preview",     title: "Preview Your Work",     description: "Use Publish → Preview to see your page.",      target: "#tw-publish-site", highlight: "pulse" }
  ]
});

TeachingEngine.registerTrack("member-onboarding", {
  name: "Member Onboarding",
  role: "member",
  steps: [
    { id: "welcome",    title: "Welcome to Tyniweb",  description: "Let’s get you comfortable editing your site.", target: "#tw-canvas", highlight: "pulse" },
    { id: "edit-text",  title: "Edit Text",           description: "Click any text block and edit it in the Inspector.", target: ".tw-inspector-section", highlight: "glow" },
    { id: "add-block",  title: "Add a Block",         description: "Add a Section or Hero from the Components panel.", target: ".tw-component-list", highlight: "pulse" },
    { id: "ai-help",    title: "Use AI Help",         description: "Generate content using the AI Tools.", target: "#tw-ai-generate-content", highlight: "glow" },
    { id: "preview",    title: "Preview Your Work",   description: "Use Publish → Preview to see your page.", target: "#tw-publish-site", highlight: "pulse" }
  ]
});

// -----------------------------------------------------
// Help / Training / Dashboard Buttons
// -----------------------------------------------------
document.getElementById("tw-start-training")
  ?.addEventListener("click", () => {
    const role = RoleSystem.getRole();
    if (role === "architect") TeachingEngine.startTrack("architect-track");
    if (role === "member") TeachingEngine.startTrack("member-onboarding");
  });

document.getElementById("tw-open-architect-dashboard")
  ?.addEventListener("click", showArchitectDashboard);

document.getElementById("tw-open-member-dashboard")
  ?.addEventListener("click", showMemberDashboard);


// -----------------------------------------------------
// Theme Preset Designer
// -----------------------------------------------------
const ThemeDesigner = {
  storageKey: "tw-theme-presets",

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  save(presets) {
    localStorage.setItem(this.storageKey, JSON.stringify(presets));
  },

  savePreset(name, data) {
    const presets = this.load();
    presets[name] = data;
    this.save(presets);
    console.log("[ThemeDesigner] Saved preset:", name);
  },

  applyPreset(name) {
    const presets = this.load();
    const preset = presets[name];
    if (!preset) return;

    Object.entries(preset).forEach(([key, value]) => {
      GLOBAL_STYLES[key] = value;
    });

    CanvasEngine.refresh();
    console.log("[ThemeDesigner] Applied preset:", name);
  }
};

document.getElementById("tw-save-theme-preset")
  ?.addEventListener("click", () => {
    ThemeDesigner.savePreset("Custom", {
      baseColor: GLOBAL_STYLES.baseColor,
      accentColor: GLOBAL_STYLES.accentColor,
      bgColor: GLOBAL_STYLES.bgColor,
      spacing: GLOBAL_STYLES.spacing
    });
  });

// -----------------------------------------------------
// Register Architect Training Track
// -----------------------------------------------------
TeachingEngine.registerTrack("architect-track", {
  name: "Architect Training",
  role: "architect",
  steps: [

    {
      id: "universe-model",
      title: "Understand the Universe Model",
      description: "Universe → Projects → Portals → Pages → Blocks.",
      target: "#tw-logo",
      highlight: "pulse"
    },

    {
      id: "set-identity",
      title: "Set Identity",
      description: "Choose archetype, voice tone, and promise.",
      target: "#tw-identity-archetype",
      highlight: "glow"
    },

    {
      id: "create-portal",
      title: "Create a Portal",
      description: "Use the Portal menu to create a new portal.",
      target: "button[data-menu='portal']",
      highlight: "pulse"
    },

    {
      id: "add-pages",
      title: "Add Pages",
      description: "Add at least two pages.",
      target: "#tw-add-page",
      highlight: "glow"
    },

    {
      id: "add-components",
      title: "Add Smart Components",
      description: "Drag a Hero and Section onto the canvas.",
      target: ".tw-component-list",
      highlight: "pulse"
    },

    {
      id: "generate-content",
      title: "Generate AI Content",
      description: "Use AI Tools to generate content.",
      target: "#tw-ai-generate-content",
      highlight: "glow"
    },

    {
      id: "apply-theme",
      title: "Apply a Theme Preset",
      description: "Choose a theme preset in Global Styles.",
      target: "select[name='global-theme-preset']",
      highlight: "pulse"
    },

    {
      id: "run-checklist",
      title: "Run Publish Checklist",
      description: "Open Publish and review warnings.",
      target: "#tw-publish-site",
      highlight: "glow"
    },

    {
      id: "simulate-publish",
      title: "Simulate Publish",
      description: "Click Publish → Preview.",
      target: "#tw-publish-site",
      highlight: "pulse"
    },

    {
      id: "review-history",
      title: "Review History",
      description: "Open the History panel.",
      target: "#tw-history-toggle",
      highlight: "glow"
    }

  ]
});

// -----------------------------------------------------
// Register Member Training Track
// -----------------------------------------------------
TeachingEngine.registerTrack("member-track", {
  name: "Member Training",
  role: "member",
  steps: [

    {
      id: "member-canvas",
      title: "Understand the Canvas",
      description: "This is where you edit content.",
      target: "#tw-canvas",
      highlight: "pulse"
    },

    {
      id: "member-edit-content",
      title: "Edit Content",
      description: "Use the Inspector to edit text and images.",
      target: ".tw-inspector-section",
      highlight: "glow"
    },

    {
      id: "member-add-blocks",
      title: "Add Blocks",
      description: "Add a Section or Hero to the page.",
      target: ".tw-component-list",
      highlight: "pulse"
    },

    {
      id: "member-ai-tools",
      title: "Use AI Tools",
      description: "Generate content using AI.",
      target: "#tw-ai-generate-content",
      highlight: "glow"
    },

    {
      id: "member-preview",
      title: "Preview Your Work",
      description: "Use Publish → Preview to see your page.",
      target: "#tw-publish-site",
      highlight: "pulse"
    }

  ]
});



// -----------------------------------------------------
// Identity Core (Warp 1)
// -----------------------------------------------------
const IdentityCore = {
  archetype: "Guided Creator (Sage-infused)",
  voice: {
    tone: "Warm, encouraging, insightful, collaborative",
    pacing: "Clear and steady",
    emotionalColor: "Optimistic and supportive"
  },
  values: [
    "Collaboration",
    "Growth",
    "Clarity",
    "Empowerment",
    "Creativity",
    "Kindness",
    "Foresight"
  ],
  audience: [
    "Curious learners",
    "Creators",
    "Founders",
    "Beginners",
    "Experts",
    "Dreamers"
  ],
  promise: "You will grow — and you won’t grow alone."
};

// Helper: return IdentityCore for AI modules
function getIdentityProfile() {
  return JSON.parse(JSON.stringify(IdentityCore));
}

// -----------------------------------------------------
// Warp 2: Narrative Engine
// -----------------------------------------------------
const NarrativeEngine = {
  getStoryArc() {
    return {
      invitation: "You’re welcome here.",
      orientation: "Here’s what we’ll explore together.",
      transformation: IdentityCore.promise,
      coCreation: "We build this together — human and AI.",
      empowerment: "You leave stronger than you arrived."
    };
  },

  getPageRole(pageName) {
    const roles = {
      "Home": "Invitation + Promise",
      "About": "Origin + Values",
      "Features": "Transformation + Clarity",
      "Pricing": "Empowerment + Choice",
      "Contact": "Connection + Support"
    };
    return roles[pageName] || "General Information";
  },

  getBlockNarrative(type) {
    const beats = {
      "hero": "Introduce the world and set the emotional tone.",
      "section": "Explain or expand on a key idea.",
      "feature-row": "Show a transformation or benefit.",
      "testimonial": "Provide social proof and reassurance.",
      "callout": "Highlight something important.",
      "footer": "Guide the user to their next step."
    };
    return beats[type] || "General supporting content.";
  }
};

function getNarrativeProfile(pageName, blockType) {
  return {
    identity: getIdentityProfile(),
    arc: NarrativeEngine.getStoryArc(),
    pageRole: NarrativeEngine.getPageRole(pageName),
    blockBeat: NarrativeEngine.getBlockNarrative(blockType)
  };
}

// -----------------------------------------------------
// Warp 3: Flow Engine
// -----------------------------------------------------
const FlowEngine = {
  // Simple in-memory graph of page flows
  graph: {
    Home: ["Features", "Pricing", "About"],
    Features: ["Pricing", "Contact"],
    Pricing: ["Contact"],
    About: ["Contact"],
    Contact: []
  },

  getNextPages(fromPage) {
    return this.graph[fromPage] || [];
  },

  setFlow(fromPage, toPages) {
    this.graph[fromPage] = Array.from(new Set(toPages));
  }
};

function getFlowProfile(pageName) {
  return {
    current: pageName,
    next: FlowEngine.getNextPages(pageName)
  };
}

// -----------------------------------------------------
// Warp 4: Adaptive Engine
// -----------------------------------------------------
const AdaptiveEngine = {
  getContext() {
    const ua = navigator.userAgent || "";
    const isMobile = /Mobi|Android/i.test(ua);
    const hour = new Date().getHours();

    return {
      device: isMobile ? "mobile" : "desktop",
      timeOfDay: hour < 6 ? "night" :
                 hour < 12 ? "morning" :
                 hour < 18 ? "afternoon" : "evening",
      // placeholder for future: visitorType, campaign, etc.
      visitorType: "general"
    };
  }
};

function getAdaptiveProfile(pageName) {
  return {
    context: AdaptiveEngine.getContext(),
    flow: getFlowProfile(pageName),
    narrative: NarrativeEngine.getPageRole(pageName)
  };
}

// -----------------------------------------------------
// Warp 5: Intelligence Engine
// -----------------------------------------------------
const IntelligenceEngine = {
  rewriteForTone(text, identity) {
    // placeholder: call out to AI with identity.voice
    console.log("[Intelligence] Rewrite for tone:", identity.voice.tone);
    return text;
  },

  rewriteForClarity(text) {
    console.log("[Intelligence] Rewrite for clarity");
    return text;
  },

  rewriteForEmotion(text, identity) {
    console.log("[Intelligence] Rewrite for emotion:", identity.voice.emotionalColor);
    return text;
  },

  suggestLayout(pageName, narrativeProfile, flowProfile) {
    console.log("[Intelligence] Suggest layout for:", pageName, narrativeProfile, flowProfile);
    // placeholder: return ordered block types
    return ["hero", "section", "feature-row", "testimonial", "callout", "footer"];
  }
};

// -----------------------------------------------------
// Warp 6: Continuity Engine
// -----------------------------------------------------
const ContinuityEngine = {
  decisions: [],
  styles: [],
  contentSnapshots: [],
  layouts: [],

  logDecision(type, payload) {
    this.decisions.push({
      type,
      payload,
      time: new Date().toISOString()
    });
  },

  logStyleChange(payload) {
    this.styles.push({
      payload,
      time: new Date().toISOString()
    });
  },

  logContentSnapshot(pageName, html) {
    this.contentSnapshots.push({
      pageName,
      html,
      time: new Date().toISOString()
    });
  },

  logLayout(pageName, layout) {
    this.layouts.push({
      pageName,
      layout,
      time: new Date().toISOString()
    });
  }
};

// convenience helpers
function logEditorDecision(type, payload) {
  ContinuityEngine.logDecision(type, payload);
}

// -----------------------------------------------------
// Warp 8: Teaching Layer
// -----------------------------------------------------

const TeachingLayer = {
  steps: [
    {
      id: "canvas",
      selector: "#tw-canvas",
      title: "This is your canvas",
      text: "This is where you build your page. Click blocks to edit them."
    },
    {
      id: "blocks",
      selector: "#tw-blocks-panel",
      title: "Add blocks",
      text: "Use this panel to add new sections, heroes, features, and more."
    },
    {
      id: "inspector",
      selector: "#tw-inspector",
      title: "Customize everything",
      text: "Change colors, text, spacing, and settings here."
    },
    {
      id: "pages",
      selector: "#tw-pages-panel",
      title: "Manage pages",
      text: "Add, rename, and switch between pages in your site."
    },
    {
      id: "ai",
      selector: "#tw-ai-panel",
      title: "AI can help",
      text: "Use AI to generate content or layouts based on your identity."
    },
    {
      id: "theme",
      selector: "#tw-theme-panel",
      title: "Theme controls",
      text: "Change your site's colors, fonts, and global styles."
    },
    {
      id: "identity",
      selector: "#tw-identity-panel",
      title: "Identity settings",
      text: "Your site's personality lives here. Adjust tone and archetype."
    },
    {
      id: "save",
      selector: "#tw-save-button",
      title: "Save your work",
      text: "Your site autosaves, but you can save manually anytime."
    }
  ],

  currentStep: 0,

  start() {
    this.currentStep = 0;
    this.showStep();
  },

  next() {
    this.currentStep++;
    if (this.currentStep < this.steps.length) {
      this.showStep();
    } else {
      this.end();
    }
  },

  end() {
    this.hideOverlay();
  },

  showStep() {
    const step = this.steps[this.currentStep];
    const el = document.querySelector(step.selector);
    if (!el) return;

    this.showOverlay(el, step.title, step.text);
  },

  showOverlay(target, title, text) {
    this.hideOverlay();

    const overlay = document.createElement("div");
    overlay.id = "tw-teaching-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = 9999;

    const bubble = document.createElement("div");
    bubble.id = "tw-teaching-bubble";
    bubble.style.position = "absolute";
    bubble.style.background = "#fff";
    bubble.style.padding = "16px";
    bubble.style.borderRadius = "8px";
    bubble.style.maxWidth = "300px";
    bubble.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
    bubble.innerHTML = `
      <h3>${title}</h3>
      <p>${text}</p>
      <button id="tw-teaching-next">Next</button>
      <button id="tw-teaching-skip">Skip</button>
    `;

    overlay.appendChild(bubble);
    document.body.appendChild(overlay);

    const rect = target.getBoundingClientRect();
    bubble.style.top = `${rect.bottom + 10}px`;
    bubble.style.left = `${rect.left}px`;

    document.getElementById("tw-teaching-next").onclick = () => this.next();
    document.getElementById("tw-teaching-skip").onclick = () => this.end();
  },

  hideOverlay() {
    const existing = document.getElementById("tw-teaching-overlay");
    if (existing) existing.remove();
  }
};

document.getElementById("tw-show-tutorial").addEventListener("click", () => {
  TeachingLayer.start();
});

// -----------------------------------------------------
// Warp 9: Command Deck
// -----------------------------------------------------

const CommandDeck = {
  init() {
    document.querySelectorAll(".tw-menu-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const menu = btn.dataset.menu;
        console.log("[CommandDeck] Menu clicked:", menu);
        // stubs for future: open dropdowns, modals, etc.
      });
    });

    const helpBtn = document.getElementById("tw-help-btn");
    if (helpBtn) {
      helpBtn.addEventListener("click", () => {
        UserGuide.open();
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CommandDeck.init();
});

// -----------------------------------------------------
// User Guide (Searchable Help)
// -----------------------------------------------------
const UserGuide = {
  topics: [
    { id: "getting-started", title: "Getting Started", keywords: ["start", "begin", "first"], content: "Learn the basics of the canvas, blocks, and pages." },
    { id: "blocks", title: "Working with Blocks", keywords: ["block", "section", "content"], content: "Add, move, and edit blocks on your page." },
    { id: "ai", title: "Using AI", keywords: ["ai", "generate", "content", "layout"], content: "Use AI to help write and design your pages." },
    { id: "themes", title: "Themes & Styles", keywords: ["theme", "color", "font"], content: "Change your site's look with global styles." },
    { id: "identity", title: "Identity Settings", keywords: ["identity", "voice", "archetype"], content: "Control your site's personality and tone." }
  ],

  open() {
    this.render();
  },

  search(query) {
    const q = query.toLowerCase();
    return this.topics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.keywords.some(k => k.includes(q))
    );
  },

  render() {
    const existing = document.getElementById("tw-user-guide");
    if (existing) existing.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "tw-user-guide";
    wrapper.style.position = "fixed";
    wrapper.style.top = "64px";
    wrapper.style.right = "16px";
    wrapper.style.width = "320px";
    wrapper.style.maxHeight = "70vh";
    wrapper.style.background = "#0b1120";
    wrapper.style.color = "#e5e7eb";
    wrapper.style.borderRadius = "8px";
    wrapper.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";
    wrapper.style.padding = "12px";
    wrapper.style.zIndex = 9998;
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";
    wrapper.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>User Guide</strong>
        <button id="tw-user-guide-close" style="background:transparent;border:none;color:#9ca3af;cursor:pointer;">✕</button>
      </div>
      <input id="tw-user-guide-search" placeholder="Search help..." style="padding:6px 8px;border-radius:4px;border:1px solid #1f2937;background:#020617;color:#e5e7eb;font-size:13px;">
      <div id="tw-user-guide-results" style="overflow:auto;font-size:13px;"></div>
    `;

    document.body.appendChild(wrapper);

    const searchInput = document.getElementById("tw-user-guide-search");
    const resultsEl = document.getElementById("tw-user-guide-results");
    const closeBtn = document.getElementById("tw-user-guide-close");

    const renderResults = (items) => {
      resultsEl.innerHTML = items.map(t => `
        <div style="padding:6px 4px;border-bottom:1px solid rgba(148,163,184,0.2);">
          <div style="font-weight:600;">${t.title}</div>
          <div style="opacity:0.8;">${t.content}</div>
        </div>
      `).join("") || `<div style="opacity:0.7;">No results yet. Try another search.</div>`;
    };

    renderResults(this.topics);

    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim();
      renderResults(q ? this.search(q) : this.topics);
    });

    closeBtn.addEventListener("click", () => wrapper.remove());
  }
};

// -----------------------------------------------------
// Architect Quick-Start Guide Toggle
// -----------------------------------------------------
const architectGuide = document.getElementById("tw-architect-guide");
const architectGuideClose = document.getElementById("tw-architect-guide-close");

function showArchitectGuide() {
  if (architectGuide) architectGuide.style.display = "flex";
}

if (architectGuideClose) {
  architectGuideClose.addEventListener("click", () => {
    architectGuide.style.display = "none";
  });
}

// -----------------------------------------------------
// Reset Controls (Warp 9.5)
// -----------------------------------------------------

const ResetControls = {
  init(userRole) {
    const architectPanel = document.getElementById("tw-learning-architect-controls");
    const memberPanel = document.getElementById("tw-learning-member-controls");

    if (userRole === "architect") {
      architectPanel.style.display = "block";
      this.renderStepResetButtons();
      this.bindArchitectActions();
    } else {
      memberPanel.style.display = "block";
      this.bindMemberActions();
    }
  },

  renderStepResetButtons() {
    const container = document.getElementById("tw-reset-steps");
    const steps = Assistant.defaultState.steps;

    container.innerHTML = Object.keys(steps).map(stepId => `
      <button class="tw-reset-btn" data-reset-step="${stepId}">
        Reset ${stepId.charAt(0).toUpperCase() + stepId.slice(1)}
      </button>
    `).join("");
  },

  bindArchitectActions() {
    document.querySelectorAll(".tw-reset-btn").forEach(btn => {
      const type = btn.dataset.reset;
      const step = btn.dataset.resetStep;

      if (type) {
        btn.addEventListener("click", () => this.reset(type));
      }

      if (step) {
        btn.addEventListener("click", () => this.resetStep(step));
      }
    });
  },

  bindMemberActions() {
    const replayBtn = document.getElementById("tw-replay-tutorial");
    replayBtn.addEventListener("click", () => Assistant.startGuidedPath());
  },

  reset(type) {
    const state = Assistant.getState();

    switch (type) {
      case "all":
        localStorage.removeItem(Assistant.storageKey);
        break;

      case "badges":
        state.badges = [];
        Assistant.saveState(state);
        break;

      case "welcome":
        // Force welcome popup to show again
        state.steps = structuredClone(Assistant.defaultState.steps);
        Assistant.saveState(state);
        break;

      case "teaching":
        TeachingLayer.hideOverlay();
        break;
    }

    alert("Reset complete.");
  },

  resetStep(stepId) {
    const state = Assistant.getState();
    state.steps[stepId] = false;
    Assistant.saveState(state);
    alert(`Step "${stepId}" reset.`);
  }
};


// -----------------------------------------------------
// Warp 10: Follow-Through Assistant
// -----------------------------------------------------
const Assistant = {
  storageKey: "tw-learning-progress",

  defaultState: {
    steps: {
      canvas: false,
      blocks: false,
      inspector: false,
      pages: false,
      theme: false,
      ai: false,
      identity: false,
      publish: false
    },
    badges: []
  },

  getState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultState);
    } catch {
      return structuredClone(this.defaultState);
    }
  },

  saveState(state) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  },

  markStepComplete(stepId) {
    const state = this.getState();
    if (state.steps[stepId] !== undefined) {
      state.steps[stepId] = true;
      this.updateBadges(state);
      this.saveState(state);
    }
  },

  updateBadges(state) {
    const steps = state.steps;
    const badges = new Set(state.badges);

    if (Object.values(steps).filter(Boolean).length >= 3) badges.add("Explorer");
    if (steps.blocks && steps.canvas) badges.add("Builder");
    if (steps.ai) badges.add("Creator");
    if (steps.theme) badges.add("Designer");
    if (Object.values(steps).every(Boolean)) badges.add("Architect");

    state.badges = Array.from(badges);
  },

  showWelcome() {
    const state = this.getState();
    const completedCount = Object.values(state.steps).filter(Boolean).length;

    const existing = document.getElementById("tw-assistant-welcome");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "tw-assistant-welcome";
    box.style.position = "fixed";
    box.style.bottom = "16px";
    box.style.right = "16px";
    box.style.width = "280px";
    box.style.background = "#020617";
    box.style.color = "#e5e7eb";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)";
    box.style.padding = "12px";
    box.style.fontSize = "13px";
    box.style.zIndex = 9997;

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <strong>Welcome to tyniweb</strong>
        <button id="tw-assistant-close" style="background:transparent;border:none;color:#9ca3af;cursor:pointer;">✕</button>
      </div>
      <div style="margin-bottom:8px;">
        ${completedCount === 0
          ? "Want a quick guided tour of how everything works?"
          : "Continue your learning journey where you left off?"}
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button id="tw-assistant-later" style="background:transparent;border:1px solid #374151;color:#9ca3af;border-radius:4px;padding:4px 8px;cursor:pointer;">Later</button>
        <button id="tw-assistant-start" style="background:#4f46e5;border:none;color:white;border-radius:4px;padding:4px 8px;cursor:pointer;">Start</button>
      </div>
      ${state.badges.length ? `
        <div style="margin-top:8px;font-size:12px;opacity:0.8;">
          Badges: ${state.badges.join(", ")}
        </div>` : ""}
    `;

    document.body.appendChild(box);

    document.getElementById("tw-assistant-close").onclick = () => box.remove();
    document.getElementById("tw-assistant-later").onclick = () => box.remove();
    document.getElementById("tw-assistant-start").onclick = () => {
      box.remove();
      this.startGuidedPath();
    };
  },

  startGuidedPath() {
    // tie into TeachingLayer, but add checkboxes
    this.runStepSequence([
      { id: "canvas", label: "Understand the canvas", selector: "#tw-canvas" },
      { id: "blocks", label: "Add and edit blocks", selector: "#tw-blocks-panel" },
      { id: "inspector", label: "Use the inspector", selector: "#tw-inspector" },
      { id: "pages", label: "Manage pages", selector: "#tw-pages-panel" },
      { id: "theme", label: "Change theme & styles", selector: "#tw-theme-panel" },
      { id: "ai", label: "Use AI tools", selector: "#tw-ai-panel" },
      { id: "identity", label: "Adjust identity", selector: "#tw-identity-panel" },
      { id: "publish", label: "Save & publish", selector: "#tw-save-button" }
    ]);
  },

  runStepSequence(steps) {
    let index = 0;

    const showStep = () => {
      if (index >= steps.length) {
        this.showCompletion();
        return;
      }

      const step = steps[index];
      const target = document.querySelector(step.selector);
      if (!target) {
        index++;
        showStep();
        return;
      }

      const existing = document.getElementById("tw-assistant-step");
      if (existing) existing.remove();

      const bubble = document.createElement("div");
      bubble.id = "tw-assistant-step";
      bubble.style.position = "absolute";
      bubble.style.background = "#f9fafb";
      bubble.style.color = "#111827";
      bubble.style.padding = "12px";
      bubble.style.borderRadius = "8px";
      bubble.style.boxShadow = "0 8px 30px rgba(0,0,0,0.25)";
      bubble.style.fontSize = "13px";
      bubble.style.zIndex = 9996;

      const rect = target.getBoundingClientRect();
      bubble.style.top = `${rect.bottom + 10}px`;
      bubble.style.left = `${rect.left}px`;

      bubble.innerHTML = `
        <div style="font-weight:600;margin-bottom:4px;">${step.label}</div>
        <div style="margin-bottom:8px;">Interact with this area, then check the box to continue.</div>
        <label style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:12px;">
          <input type="checkbox" id="tw-assistant-step-check">
          I’ve done this step
        </label>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
          <button id="tw-assistant-step-skip" style="background:transparent;border:none;color:#6b7280;cursor:pointer;">Skip</button>
          <button id="tw-assistant-step-next" style="background:#4f46e5;border:none;color:white;border-radius:4px;padding:4px 8px;cursor:pointer;">Next</button>
        </div>
      `;

      document.body.appendChild(bubble);

      const checkbox = document.getElementById("tw-assistant-step-check");
      const nextBtn = document.getElementById("tw-assistant-step-next");
      const skipBtn = document.getElementById("tw-assistant-step-skip");

      nextBtn.onclick = () => {
        if (!checkbox.checked) return;
        this.markStepComplete(step.id);
        bubble.remove();
        index++;
        showStep();
      };

      skipBtn.onclick = () => {
        bubble.remove();
        index++;
        showStep();
      };
    };

    showStep();
  },

  showCompletion() {
    const state = this.getState();
    const existing = document.getElementById("tw-assistant-complete");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "tw-assistant-complete";
    box.style.position = "fixed";
    box.style.bottom = "16px";
    box.style.right = "16px";
    box.style.width = "280px";
    box.style.background = "#022c22";
    box.style.color = "#ecfdf5";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)";
    box.style.padding = "12px";
    box.style.fontSize = "13px";
    box.style.zIndex = 9997;

    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:4px;">You did it.</div>
      <div style="margin-bottom:8px;">
        You’ve completed the core training for this editor.
        You’re now officially a <strong>${state.badges.includes("Architect") ? "Tyniweb Architect" : "Tyniweb Builder"}</strong>.
      </div>
      ${state.badges.length ? `
        <div style="margin-bottom:8px;font-size:12px;">
          Badges earned: ${state.badges.join(", ")}
        </div>` : ""}
      <div style="display:flex;justify-content:flex-end;">
        <button id="tw-assistant-complete-close" style="background:#10b981;border:none;color:white;border-radius:4px;padding:4px 8px;cursor:pointer;">Nice!</button>
      </div>
    `;

    document.body.appendChild(box);
    document.getElementById("tw-assistant-complete-close").onclick = () => box.remove();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Assistant.showWelcome();
});

document.getElementById("tw-open-training-portal")
  ?.addEventListener("click", () => {
    PortalEngine.loadPortal("Tyniweb Academy", "Architect Training Portal");
  });


// -----------------------------------------------------
// Warp 11: Role System (Architect / Member / Guest)
// -----------------------------------------------------

const RoleSystem = {
  storageKey: "tw-user-role",
  roles: ["architect", "member", "guest"],

  // 11.1 Get Current Role
  getRole() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored && this.roles.includes(stored)) return stored;
    } catch (e) {
      console.warn("[RoleSystem] Unable to read stored role.", e);
    }
    return "architect"; // default for now
  },

  // 11.2 Set Current Role
  setRole(role) {
    if (!this.roles.includes(role)) {
      console.warn("[RoleSystem] Invalid role:", role);
      return;
    }
    try {
      localStorage.setItem(this.storageKey, role);
    } catch (e) {
      console.warn("[RoleSystem] Unable to store role.", e);
    }
    this.applyRoleUI(role);
  },

  // 11.3 Check Role
  is(role) {
    return this.getRole() === role;
  },

  // 11.4 Permission Map
  permissions: {
    architect: {
      resetAll: true,
      resetSteps: true,
      useAI: true,
      publish: true,
      exportSite: true,
      changeIdentity: true,
      changeTheme: true,
      managePortals: true
    },
    member: {
      resetAll: false,
      resetSteps: false, // can be toggled later
      useAI: true,
      publish: false,
      exportSite: false,
      changeIdentity: false,
      changeTheme: true,
      managePortals: false
    },
    guest: {
      resetAll: false,
      resetSteps: false,
      useAI: false,
      publish: false,
      exportSite: false,
      changeIdentity: false,
      changeTheme: false,
      managePortals: false
    }
  },

  // 11.5 Can Perform Action?
  can(action) {
    const role = this.getRole();
    const perms = this.permissions[role] || {};
    return !!perms[action];
  },

  // 11.6 Guard Helper
  guard(action, fn) {
    if (!this.can(action)) {
      alert("This action is not available for your current role.");
      return;
    }
    fn();
  },

  // 11.7 Apply Role to UI
  applyRoleUI(role) {
    // Architect / Member learning controls (if present)
    const architectPanel = document.getElementById("tw-learning-architect-controls");
    const memberPanel = document.getElementById("tw-learning-member-controls");

    if (architectPanel) architectPanel.style.display = role === "architect" ? "block" : "none";
    if (memberPanel) memberPanel.style.display = role === "member" ? "block" : "none";

    // Export / Publish buttons
    const exportBtn = document.getElementById("tw-export-site");
    const publishBtn = document.getElementById("tw-publish-site");

    if (exportBtn) exportBtn.style.display = this.can("exportSite") ? "inline-block" : "none";
    if (publishBtn) publishBtn.style.display = this.can("publish") ? "inline-block" : "none";

    // AI buttons
    const aiContentBtn = document.getElementById("tw-ai-generate-content");
    const aiLayoutBtn = document.getElementById("tw-ai-generate-layout");

    const aiAllowed = this.can("useAI");
    if (aiContentBtn) aiContentBtn.disabled = !aiAllowed;
    if (aiLayoutBtn) aiLayoutBtn.disabled = !aiAllowed;

    // Identity controls
    const identityPanel = document.getElementById("tw-identity-panel") || document.getElementById("tw-identity-archetype")?.closest(".tw-inspector-section");
    const canChangeIdentity = this.can("changeIdentity");
    if (identityPanel) identityPanel.style.opacity = canChangeIdentity ? "1" : "0.5";

    // Theme controls
    const themePresetSelect = document.querySelector('[name="global-theme-preset"]');
    const themeInputs = document.querySelectorAll('[name="global-font"], [name="global-base-color"], [name="global-accent-color"], [name="global-bg-color"], [name="global-spacing"]');
    const canChangeTheme = this.can("changeTheme");

    if (themePresetSelect) themePresetSelect.disabled = !canChangeTheme;
    themeInputs.forEach(el => el.disabled = !canChangeTheme);

    console.log("[RoleSystem] Applied role:", role);
  },

  // 11.8 Simple Role Switcher (Temporary via Settings)
  attachRoleSwitcher() {
    const settingsBtn = document.getElementById("tw-settings-btn");
    if (!settingsBtn) return;

    settingsBtn.addEventListener("click", () => {
      const current = this.getRole();
      const next = prompt(
        `Set role (current: ${current})\nOptions: architect, member, guest`,
        current
      );
      if (!next) return;
      this.setRole(next.trim().toLowerCase());
    });
  }
};

// 11.9 Initialize Role System on Load
document.addEventListener("DOMContentLoaded", () => {
  const role = RoleSystem.getRole();
  RoleSystem.applyRoleUI(role);
  RoleSystem.attachRoleSwitcher();

  // If ResetControls exists, initialize it with current role
  if (typeof ResetControls !== "undefined" && ResetControls && typeof ResetControls.init === "function") {
    ResetControls.init(role);
  }
});

// -----------------------------------------------------
// Auto-trigger training based on role
// -----------------------------------------------------
if (typeof RoleSystem !== "undefined") {
  const role = RoleSystem.getRole();
  if (role === "architect") TeachingEngine.startTrack("architect-track");
  if (role === "member") TeachingEngine.startTrack("member-onboarding");
}

document.getElementById("tw-start-architect-training")
  ?.addEventListener("click", () => {
    TeachingEngine.startTrack("architect-track");
  });


TeachingEngine.registerTrack("architect-track", {
  name: "Architect Training",
  role: "architect",
  steps: [

    {
      id: "universe-model",
      title: "Understand the Universe Model",
      description: "Tyniweb is built on a simple hierarchy: Universe → Projects → Portals → Pages → Blocks.",
      target: "#tw-logo",
      highlight: "pulse",
      onComplete: () => true,
      nextHint: "Now let’s set the identity for your project."
    },

    {
      id: "set-identity",
      title: "Set Identity",
      description: "Choose an archetype, voice tone, and promise. Identity drives content, themes, and structure.",
      target: "#tw-identity-archetype",
      highlight: "glow",
      onComplete: () => {
        const a = document.getElementById("tw-identity-archetype").value;
        const v = document.getElementById("tw-identity-voice").value.trim();
        const p = document.getElementById("tw-identity-promise").value.trim();
        return a && v && p;
      },
      nextHint: "Identity set. Now create your first portal."
    },

    {
      id: "create-portal",
      title: "Create a Portal",
      description: "Use the Portal menu to create a new portal inside your project.",
      target: "button[data-menu='portal']",
      highlight: "pulse",
      onComplete: () => PortalEngine.currentPortal !== null,
      nextHint: "Great. Now add some pages."
    },

    {
      id: "add-pages",
      title: "Add Pages",
      description: "Use the Pages panel to add at least two pages.",
      target: "#tw-add-page",
      highlight: "glow",
      onComplete: () => Object.keys(PAGES).length >= 2,
      nextHint: "Now let’s build your first page."
    },

    {
      id: "add-components",
      title: "Add Smart Components",
      description: "Drag a Hero and a Section onto the canvas.",
      target: ".tw-component-list",
      highlight: "pulse",
      onComplete: () => {
        const count = document.querySelectorAll(".tw-block").length;
        return count >= 2;
      },
      nextHint: "Now generate content for your components."
    },

    {
      id: "generate-content",
      title: "Generate AI Content",
      description: "Use the AI Tools section to generate content for your blocks.",
      target: "#tw-ai-generate-content",
      highlight: "glow",
      onComplete: () => {
        const anyText = document.querySelector(".tw-block [name='title']");
        return anyText && anyText.value.trim().length > 0;
      },
      nextHint: "Now apply a theme that matches your identity."
    },

    {
      id: "apply-theme",
      title: "Apply a Theme Preset",
      description: "Choose a theme preset in Global Styles.",
      target: "select[name='global-theme-preset']",
      highlight: "pulse",
      onComplete: () => {
        const preset = document.querySelector("select[name='global-theme-preset']").value;
        return preset !== "";
      },
      nextHint: "Let’s check your work before publishing."
    },

    {
      id: "run-checklist",
      title: "Run the Publish Checklist",
      description: "Open the Publish modal and review any warnings.",
      target: "#tw-publish-site",
      highlight: "glow",
      onComplete: () => {
        return PublishEngine.lastChecklist && PublishEngine.lastChecklist.length > 0;
      },
      nextHint: "Almost done. Time to simulate a publish."
    },

    {
      id: "simulate-publish",
      title: "Simulate a Publish",
      description: "Click Publish → Preview to simulate a publish.",
      target: "#tw-publish-site",
      highlight: "pulse",
      onComplete: () => PublishEngine.lastBundle !== null,
      nextHint: "One last step — review your history."
    },

    {
      id: "review-history",
      title: "Review History",
      description: "Open the History panel to see your recent actions.",
      target: "#tw-history-toggle",
      highlight: "glow",
      onComplete: () => {
        const panel = document.getElementById("tw-history-panel");
        return panel && panel.style.display !== "none";
      },
      nextHint: "You’ve completed the Architect Training Path!"
    }

  ]
});

CertificationEngine = {
  evaluateTheory(answers) {
    const correct = {
      q1: "B",
      q2: "B",
      q3: "B",
      q4: "B",
      q5: "C"
    };
    let score = 0;
    for (let q in correct) {
      if (answers[q] === correct[q]) score++;
    }
    return score;
  },

  evaluatePractical() {
    return {
      identitySet: IdentityEngine.isComplete(),
      pages: Object.keys(PAGES).length >= 3,
      components: document.querySelectorAll(".tw-block").length >= 4,
      themeApplied: GLOBAL_STYLES.themePreset !== "",
      checklistRun: PublishEngine.lastChecklist !== null,
      publishSimulated: PublishEngine.lastBundle !== null
    };
  }
};



// -----------------------------------------------------
// Warp 12: Portal Engine (Multi‑Universe Builder)
// -----------------------------------------------------

const PortalEngine = {
  storageKey: "tw-portals",

  // 12.1 Load all portals from storage
  loadPortals() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("[PortalEngine] Failed to load portals.", e);
      return {};
    }
  },

  // 12.2 Save all portals
  savePortals(portals) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(portals));
    } catch (e) {
      console.warn("[PortalEngine] Failed to save portals.", e);
    }
  },

  // 12.3 Create a new portal
  createPortal(name, template = "blank") {
    const portals = this.loadPortals();

    if (portals[name]) {
      alert("A portal with that name already exists.");
      return null;
    }

    portals[name] = {
      name,
      createdAt: new Date().toISOString(),
      identity: getIdentityProfile(),
      theme: { ...GLOBAL_STYLES },
      pages: this.generateTemplatePages(template),
      lastOpened: new Date().toISOString()
    };

    this.savePortals(portals);
    return portals[name];
  },

  // 12.4 Duplicate an existing portal
  duplicatePortal(name) {
    const portals = this.loadPortals();
    const original = portals[name];
    if (!original) return null;

    let copyName = name + " Copy";
    let counter = 2;
    while (portals[copyName]) {
      copyName = `${name} Copy ${counter++}`;
    }

    portals[copyName] = JSON.parse(JSON.stringify(original));
    portals[copyName].name = copyName;
    portals[copyName].createdAt = new Date().toISOString();
    portals[copyName].lastOpened = new Date().toISOString();

    this.savePortals(portals);
    return portals[copyName];
  },

  // 12.5 Delete a portal
  deletePortal(name) {
    const portals = this.loadPortals();
    if (!portals[name]) return;

    const confirmDelete = confirm(`Delete portal "${name}"? This cannot be undone.`);
    if (!confirmDelete) return;

    delete portals[name];
    this.savePortals(portals);
  },

  // 12.6 Generate starter pages for a portal template
  generateTemplatePages(template) {
    switch (template) {
      case "saas":
        return {
          Home: "",
          Features: "",
          Pricing: "",
          Contact: ""
        };
      case "personal":
        return {
          Home: "",
          About: "",
          Work: "",
          Contact: ""
        };
      default:
        return { Home: "" };
    }
  },

  // 12.7 Load a portal into the editor
  loadPortal(name) {
    const portals = this.loadPortals();
    const portal = portals[name];
    if (!portal) {
      alert("Portal not found.");
      return;
    }

    // Load identity
    Object.assign(IdentityCore, portal.identity);

    // Load theme
    Object.assign(GLOBAL_STYLES, portal.theme);
    applyGlobalStyles();

    // Load pages
    Object.keys(PAGES).forEach(k => delete PAGES[k]);
    Object.assign(PAGES, portal.pages);

    // Set current page
    currentPage = Object.keys(PAGES)[0] || "Home";

    // Load canvas
    canvasBody.innerHTML = PAGES[currentPage] || "";
    canvasBody.querySelectorAll(".tw-block").forEach(block => {
      enhanceBlock(block);
      makeBlockDraggable(block);
    });

    // Rebuild page list UI
    this.renderPortalPages();

    // Update last opened
    portal.lastOpened = new Date().toISOString();
    this.savePortals(portals);

    console.log("[PortalEngine] Loaded portal:", name);
  },

  // 12.8 Save the currently open portal
  saveCurrentPortal(name) {
    const portals = this.loadPortals();
    const portal = portals[name];
    if (!portal) return;

    // Save identity + theme
    portal.identity = getIdentityProfile();
    portal.theme = { ...GLOBAL_STYLES };

    // Save pages
    PAGES[currentPage] = canvasBody.innerHTML;
    portal.pages = { ...PAGES };

    portal.lastOpened = new Date().toISOString();
    this.savePortals(portals);

    console.log("[PortalEngine] Saved portal:", name);
  },

  // 12.9 Render page list for the active portal
  renderPortalPages() {
    const list = document.querySelector(".tw-page-list");
    const addBtn = document.getElementById("tw-add-page");

    if (!list || !addBtn) return;

    list.querySelectorAll(".tw-page-item").forEach(el => el.remove());

    Object.keys(PAGES).forEach(name => {
      const item = document.createElement("div");
      item.className = "tw-page-item";
      item.dataset.page = name;
      item.innerHTML = `
        <span class="tw-page-name">${name}</span>
        <button class="tw-page-menu">⋮</button>
      `;
      list.insertBefore(item, addBtn);
    });
  },

  // 12.10 Simple Portal Switcher (temporary)
  attachPortalSwitcher() {
    const portalBtn = document.querySelector('[data-menu="portal"]');
    if (!portalBtn) return;

    portalBtn.addEventListener("click", () => {
      const portals = this.loadPortals();
      const names = Object.keys(portals);

      const choice = prompt(
        `Portals:\n${names.join("\n")}\n\nType a portal name to load, or type "new" to create one:`,
        ""
      );

      if (!choice) return;

      if (choice.toLowerCase() === "new") {
        const newName = prompt("Portal name:");
        if (!newName) return;

        const template = prompt("Template: blank, saas, personal", "blank");
        this.createPortal(newName, template);
        this.loadPortal(newName);
        return;
      }

      if (portals[choice]) {
        this.loadPortal(choice);
      } else {
        alert("Portal not found.");
      }
    });
  }
};

// 12.11 Initialize Portal Engine
document.addEventListener("DOMContentLoaded", () => {
  PortalEngine.attachPortalSwitcher();
});

document.getElementById("tw-start-architect-exam")
  ?.addEventListener("click", () => {
    PortalEngine.loadPage("Architect Training Portal", "Certification Exam");
  });


// -----------------------------------------------------
// Warp 13: Identity Core Expansion
// -----------------------------------------------------

const IdentityEngine = {
  storageKey: "tw-identity-expanded",

  // 13.1 Default Identity Profile
  defaultProfile: {
    archetype: "Guided Creator",
    voice: {
      warmth: 0.8,
      clarity: 0.9,
      playfulness: 0.4,
      formality: 0.3,
      energy: 0.6
    },
    emotionalPalette: {
      primary: "optimistic",
      secondary: "grounded"
    },
    brandStory: {
      short: "A platform that grows with you.",
      long: "Tyniweb is a living system designed to help creators, founders, and dreamers build worlds that adapt, evolve, and remember. It is a companion, a guide, and a canvas for transformation."
    },
    audience: ["Creators", "Founders", "Beginners", "Experts"],
    promise: "You will grow — and you won’t grow alone."
  },

  // 13.2 Load Identity
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultProfile);
    } catch (e) {
      console.warn("[IdentityEngine] Failed to load identity.", e);
      return structuredClone(this.defaultProfile);
    }
  },

  // 13.3 Save Identity
  save(profile) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
    } catch (e) {
      console.warn("[IdentityEngine] Failed to save identity.", e);
    }
  },

  // 13.4 Get Current Identity
  getProfile() {
    return this.load();
  },

  // 13.5 Update Identity Field
  update(path, value) {
    const profile = this.load();
    const segments = path.split(".");
    let obj = profile;

    while (segments.length > 1) {
      const key = segments.shift();
      if (!obj[key]) obj[key] = {};
      obj = obj[key];
    }

    obj[segments[0]] = value;
    this.save(profile);
  },

  // 13.6 Merge Identity (for Portal inheritance)
  merge(newData) {
    const profile = this.load();
    const merged = Object.assign({}, profile, newData);
    this.save(merged);
  },

  // 13.7 Export Identity (for AI calls)
  exportForAI() {
    const profile = this.load();
    return {
      archetype: profile.archetype,
      tone: profile.voice,
      emotionalPalette: profile.emotionalPalette,
      brandStory: profile.brandStory,
      audience: profile.audience,
      promise: profile.promise
    };
  },

  // 13.8 Identity Presets
  presets: {
    "Guided Creator": {
      archetype: "Guided Creator",
      voice: { warmth: 0.9, clarity: 0.9, playfulness: 0.4, formality: 0.3, energy: 0.6 },
      emotionalPalette: { primary: "optimistic", secondary: "grounded" },
      brandStory: {
        short: "A guide for creators.",
        long: "You build with clarity, warmth, and purpose. Your world is a place where ideas grow safely."
      },
      audience: ["Creators", "Beginners"],
      promise: "You will grow — and you won’t grow alone."
    },

    "Bold Visionary": {
      archetype: "Visionary",
      voice: { warmth: 0.4, clarity: 0.8, playfulness: 0.2, formality: 0.6, energy: 0.9 },
      emotionalPalette: { primary: "bold", secondary: "electric" },
      brandStory: {
        short: "A future-forward force.",
        long: "You challenge assumptions, break patterns, and lead others into new worlds."
      },
      audience: ["Innovators", "Founders"],
      promise: "The future bends toward your ideas."
    },

    "Quiet Sage": {
      archetype: "Sage",
      voice: { warmth: 0.7, clarity: 1.0, playfulness: 0.1, formality: 0.7, energy: 0.3 },
      emotionalPalette: { primary: "calm", secondary: "wise" },
      brandStory: {
        short: "A calm, wise presence.",
        long: "You bring clarity, depth, and understanding. Your world is a sanctuary for thoughtful growth."
      },
      audience: ["Thinkers", "Learners"],
      promise: "Clarity emerges when you slow down."
    }
  },

  // 13.9 Apply a preset
  applyPreset(name) {
    const preset = this.presets[name];
    if (!preset) {
      console.warn("[IdentityEngine] Unknown preset:", name);
      return;
    }
    this.save(structuredClone(preset));
  },

  // 13.10 Bind UI Controls (if present)
  bindUI() {
    const profile = this.load();

    const archetypeEl = document.getElementById("tw-identity-archetype");
    const voiceEl = document.getElementById("tw-identity-voice");
    const promiseEl = document.getElementById("tw-identity-promise");

    if (archetypeEl) {
      archetypeEl.value = profile.archetype;
      archetypeEl.addEventListener("change", () => {
        this.update("archetype", archetypeEl.value);
      });
    }

    if (voiceEl) {
      voiceEl.value = profile.voice.warmth > 0.5 ? "Warm" : "Neutral";
      voiceEl.addEventListener("input", () => {
        this.update("voice.warmth", voiceEl.value.toLowerCase().includes("warm") ? 0.8 : 0.4);
      });
    }

    if (promiseEl) {
      promiseEl.value = profile.promise;
      promiseEl.addEventListener("input", () => {
        this.update("promise", promiseEl.value);
      });
    }
  }
};

// 13.11 Initialize Identity Engine
document.addEventListener("DOMContentLoaded", () => {
  IdentityEngine.bindUI();
});

// -----------------------------------------------------
// Warp 15: Follow‑Through Assistant Upgrade
// -----------------------------------------------------

const FollowThrough = {
  storageKey: "tw-followthrough-state",

  // 15.1 Default State
  defaultState: {
    lastActive: null,
    suggestionsDismissed: [],
    featureUsage: {},      // e.g. { ai: 3, theme: 1, pages: 5 }
    milestones: {},        // e.g. { firstPublish: true }
    nudgesShown: {}        // prevent repeating nudges
  },

  // 15.2 Load State
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultState);
    } catch {
      return structuredClone(this.defaultState);
    }
  },

  // 15.3 Save State
  save(state) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  },

  // 15.4 Track Feature Usage
  track(feature) {
    const state = this.load();
    state.featureUsage[feature] = (state.featureUsage[feature] || 0) + 1;
    state.lastActive = new Date().toISOString();
    this.save(state);
  },

  // 15.5 Mark Milestone
  markMilestone(name) {
    const state = this.load();
    state.milestones[name] = true;
    this.save(state);
  },

  // 15.6 Should Show Nudge?
  shouldNudge(id) {
    const state = this.load();
    return !state.nudgesShown[id];
  },

  // 15.7 Mark Nudge Shown
  markNudge(id) {
    const state = this.load();
    state.nudgesShown[id] = true;
    this.save(state);
  },

  // 15.8 Generate Smart Suggestions
  getSuggestions() {
    const state = this.load();
    const role = typeof RoleSystem !== "undefined" ? RoleSystem.getRole() : "architect";

    const suggestions = [];

    // Suggest using Themes if never touched
    if (!state.featureUsage.theme && this.shouldNudge("try-theme")) {
      suggestions.push({
        id: "try-theme",
        text: "Try adjusting your theme — it helps your site feel more like you."
      });
    }

    // Suggest AI if never used
    if (!state.featureUsage.ai && this.shouldNudge("try-ai") && RoleSystem.can("useAI")) {
      suggestions.push({
        id: "try-ai",
        text: "Want help writing or structuring your page? Try the AI tools."
      });
    }

    // Suggest publishing if site has multiple pages
    if (Object.keys(PAGES).length >= 3 && this.shouldNudge("try-publish") && RoleSystem.can("publish")) {
      suggestions.push({
        id: "try-publish",
        text: "Your site is taking shape — want to preview a publish?"
      });
    }

    // Suggest identity if untouched
    if (!state.featureUsage.identity && this.shouldNudge("set-identity")) {
      suggestions.push({
        id: "set-identity",
        text: "Set your identity to give your site a consistent voice."
      });
    }

    // Member‑specific suggestion
    if (role === "member" && this.shouldNudge("learn-basics")) {
      suggestions.push({
        id: "learn-basics",
        text: "Want a quick walkthrough of the basics?"
      });
    }

    return suggestions;
  },

  // 15.9 Show Suggestion Bubble
  showSuggestion(suggestion) {
    if (!suggestion) return;

    const box = document.createElement("div");
    box.className = "tw-assistant-suggestion";
    box.style.position = "fixed";
    box.style.bottom = "16px";
    box.style.right = "16px";
    box.style.width = "260px";
    box.style.background = "#1e293b";
    box.style.color = "#e2e8f0";
    box.style.padding = "12px";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)";
    box.style.fontSize = "13px";
    box.style.zIndex = 9998;

    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">Suggestion</div>
      <div style="margin-bottom:10px;">${suggestion.text}</div>
      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button class="tw-suggestion-dismiss" style="background:transparent;border:1px solid #475569;color:#94a3b8;border-radius:4px;padding:4px 8px;cursor:pointer;">Dismiss</button>
        <button class="tw-suggestion-act" style="background:#4f46e5;border:none;color:white;border-radius:4px;padding:4px 8px;cursor:pointer;">Show Me</button>
      </div>
    `;

    document.body.appendChild(box);

    box.querySelector(".tw-suggestion-dismiss").onclick = () => {
      FollowThrough.markNudge(suggestion.id);
      box.remove();
    };

    box.querySelector(".tw-suggestion-act").onclick = () => {
      FollowThrough.markNudge(suggestion.id);
      box.remove();

      // Trigger appropriate action
      switch (suggestion.id) {
        case "try-theme":
          document.querySelector('[name="global-theme-preset"]')?.scrollIntoView({ behavior: "smooth" });
          break;
        case "try-ai":
          document.getElementById("tw-ai-panel")?.scrollIntoView({ behavior: "smooth" });
          break;
        case "try-publish":
          document.getElementById("tw-publish-site")?.click();
          break;
        case "set-identity":
          document.getElementById("tw-identity-panel")?.scrollIntoView({ behavior: "smooth" });
          break;
        case "learn-basics":
          if (typeof TeachingEngine !== "undefined") TeachingEngine.startTrack("basics");
          break;
      }
    };
  },

  // 15.10 Trigger Suggestions on Idle
  triggerIdleSuggestions() {
    const suggestions = this.getSuggestions();
    if (suggestions.length > 0) {
      this.showSuggestion(suggestions[0]);
    }
  },

  // 15.11 Initialize
  init() {
    // Track last active time
    const state = this.load();
    state.lastActive = new Date().toISOString();
    this.save(state);

    // Idle suggestion timer
    setTimeout(() => this.triggerIdleSuggestions(), 4000);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  FollowThrough.init();
});

// -----------------------------------------------------
// Warp 16: Component Intelligence
// -----------------------------------------------------

const ComponentIntelligence = {
  // 16.1 Score a variant based on identity + theme
  scoreVariant(type, variant) {
    const identity = typeof IdentityEngine !== "undefined"
      ? IdentityEngine.getProfile()
      : null;

    if (!identity) return 0;

    const tone = identity.voice || {};
    let score = 0;

    // Example scoring logic (expand later)
    if (variant.includes("alt") && tone.playfulness > 0.5) score += 2;
    if (variant.includes("v2") && tone.energy > 0.6) score += 1;
    if (variant.includes("v1") && tone.formality > 0.5) score += 1;

    return score;
  },

  // 16.2 Choose best variant for a component
  chooseBestVariant(type) {
    const config = COMPONENTS[type];
    if (!config || !config.variants) return "v1";

    let best = "v1";
    let bestScore = -Infinity;

    Object.keys(config.variants).forEach(variant => {
      const score = this.scoreVariant(type, variant);
      if (score > bestScore) {
        bestScore = score;
        best = variant;
      }
    });

    return best;
  },

  // 16.3 Generate identity‑aligned starter content
  generateStarterContent(type) {
    const identity = typeof IdentityEngine !== "undefined"
      ? IdentityEngine.exportForAI()
      : null;

    if (!identity) return {};

    const { archetype, brandStory, promise } = identity;

    switch (type) {
      case "hero":
        return {
          title: promise || "Welcome to your new world",
          subtitle: brandStory?.short || "A space shaped by your ideas.",
          cta: archetype === "Visionary" ? "Explore the Future" : "Get Started"
        };

      case "section":
        return {
          heading: "Why this matters",
          body: brandStory?.long || "This section helps explain your core message."
        };

      case "testimonial":
        return {
          quote: `"This reflects the ${archetype} spirit perfectly."`,
          author: "A Happy Visitor"
        };

      case "pricing":
        return {
          title: "Choose your plan",
          price: "$19/mo",
          features: "Feature one\nFeature two"
        };

      default:
        return {};
    }
  },

  // 16.4 Apply starter content to a block
  applyStarterContent(block, content) {
    const type = block.dataset.type;
    const config = COMPONENTS[type];
    if (!config) return;

    Object.entries(content).forEach(([field, value]) => {
      const slot = config.slots[field];
      const el = block.querySelector(slot);
      if (el) el.textContent = value;
    });
  },

  // 16.5 Build a smart component (variant + content)
  buildSmartComponent(type) {
    const config = COMPONENTS[type];
    if (!config) return null;

    // Choose variant
    const variant = this.chooseBestVariant(type);
    const template = config.variants[variant] || config.variants.v1;

    // Create block
    const wrapper = document.createElement("div");
    wrapper.innerHTML = template;
    const block = wrapper.firstElementChild;

    // Apply starter content
    const starter = this.generateStarterContent(type);
    this.applyStarterContent(block, starter);

    return block;
  },

  // 16.6 Suggest next component based on page structure
  suggestNextComponent() {
    const blocks = [...canvasBody.querySelectorAll(".tw-block")];
    if (blocks.length === 0) return "hero";

    const lastType = blocks[blocks.length - 1].dataset.type;

    const suggestions = {
      hero: "section",
      section: "feature-row",
      "feature-row": "testimonial",
      testimonial: "callout",
      callout: "footer"
    };

    return suggestions[lastType] || "section";
  },

  // 16.7 Show suggestion bubble (non-intrusive)
  showSuggestionBubble() {
    const next = this.suggestNextComponent();
    if (!next) return;

    const box = document.createElement("div");
    box.className = "tw-component-suggestion";
    box.style.position = "fixed";
    box.style.bottom = "16px";
    box.style.left = "16px";
    box.style.width = "260px";
    box.style.background = "#0f172a";
    box.style.color = "#e2e8f0";
    box.style.padding = "12px";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)";
    box.style.fontSize = "13px";
    box.style.zIndex = 9998;

    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">Suggestion</div>
      <div style="margin-bottom:10px;">Consider adding a <strong>${next}</strong> block next.</div>
      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button class="tw-suggest-add" style="background:#4f46e5;border:none;color:white;border-radius:4px;padding:4px 8px;cursor:pointer;">Add</button>
        <button class="tw-suggest-dismiss" style="background:transparent;border:1px solid #475569;color:#94a3b8;border-radius:4px;padding:4px 8px;cursor:pointer;">Dismiss</button>
      </div>
    `;

    document.body.appendChild(box);

    box.querySelector(".tw-suggest-dismiss").onclick = () => box.remove();

    box.querySelector(".tw-suggest-add").onclick = () => {
      const block = this.buildSmartComponent(next);
      if (block) {
        canvasBody.appendChild(block);
        assignBlockId(block);
        enhanceBlock(block);
        makeBlockDraggable(block);
      }
      box.remove();
    };
  },

  // 16.8 Initialize
  init() {
    // Show suggestion after a short delay
    setTimeout(() => this.showSuggestionBubble(), 3000);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ComponentIntelligence.init();
});

// -----------------------------------------------------
// Warp 17: Theme Intelligence
// -----------------------------------------------------

const ThemeIntelligence = {
  storageKey: "tw-theme-intelligence",

  // 17.1 Default Theme Intelligence State
  defaultState: {
    lastPreset: "Default",
    autoAdapt: true,      // adapt theme to identity
    dynamicContext: false // adapt theme to time/device
  },

  // 17.2 Load State
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultState);
    } catch {
      return structuredClone(this.defaultState);
    }
  },

  // 17.3 Save State
  save(state) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  },

  // 17.4 Generate Theme From Identity
  generateThemeFromIdentity() {
    const identity = typeof IdentityEngine !== "undefined"
      ? IdentityEngine.getProfile()
      : null;

    if (!identity) return null;

    const { voice, emotionalPalette, archetype } = identity;

    // Base theme object
    const theme = {
      fontFamily: "system-ui",
      baseColor: "#111111",
      accentColor: "#00cc88",
      backgroundColor: "#ffffff",
      spacing: 20
    };

    // 17.4a Adjust by emotional palette
    if (emotionalPalette.primary === "optimistic") {
      theme.accentColor = "#22c55e"; // green
    }
    if (emotionalPalette.primary === "bold") {
      theme.accentColor = "#ef4444"; // red
    }
    if (emotionalPalette.primary === "calm") {
      theme.accentColor = "#3b82f6"; // blue
    }

    // 17.4b Adjust by voice tone
    if (voice.formality > 0.6) {
      theme.fontFamily = "Georgia, serif";
    }
    if (voice.playfulness > 0.6) {
      theme.fontFamily = "'Comic Neue', system-ui";
    }
    if (voice.energy > 0.7) {
      theme.spacing = 24;
    }

    // 17.4c Adjust by archetype
    if (archetype === "Visionary") {
      theme.backgroundColor = "#0f172a";
      theme.baseColor = "#e2e8f0";
    }
    if (archetype === "Sage") {
      theme.backgroundColor = "#f8fafc";
      theme.baseColor = "#1e293b";
    }

    return theme;
  },

  // 17.5 Apply Theme Object to GLOBAL_STYLES
  applyThemeObject(theme) {
    if (!theme) return;

    GLOBAL_STYLES.fontFamily = theme.fontFamily;
    GLOBAL_STYLES.baseColor = theme.baseColor;
    GLOBAL_STYLES.accentColor = theme.accentColor;
    GLOBAL_STYLES.backgroundColor = theme.backgroundColor;
    GLOBAL_STYLES.spacing = theme.spacing;

    applyGlobalStyles();
  },

  // 17.6 Dynamic Context Adaptation
  applyDynamicContext() {
    const state = this.load();
    if (!state.dynamicContext) return;

    const hour = new Date().getHours();

    // Subtle day/night shift
    if (hour < 6 || hour > 20) {
      document.documentElement.style.setProperty("--tw-bg-color", "#0b0c10");
    } else {
      document.documentElement.style.setProperty("--tw-bg-color", GLOBAL_STYLES.backgroundColor);
    }
  },

  // 17.7 Suggest Theme Based on Identity
  suggestThemePreset() {
    const identity = typeof IdentityEngine !== "undefined"
      ? IdentityEngine.getProfile()
      : null;

    if (!identity) return "Default";

    const { archetype } = identity;

    if (archetype === "Visionary") return "Dark";
    if (archetype === "Sage") return "Light";
    if (archetype === "Guided Creator") return "Playful";

    return "Default";
  },

  // 17.8 Show Suggestion Bubble
  showThemeSuggestion() {
    const preset = this.suggestThemePreset();
    const state = this.load();

    if (state.lastPreset === preset) return;

    const box = document.createElement("div");
    box.className = "tw-theme-suggestion";
    box.style.position = "fixed";
    box.style.bottom = "16px";
    box.style.left = "16px";
    box.style.width = "260px";
    box.style.background = "#1e293b";
    box.style.color = "#e2e8f0";
    box.style.padding = "12px";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)";
    box.style.fontSize = "13px";
    box.style.zIndex = 9998;

    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">Theme Suggestion</div>
      <div style="margin-bottom:10px;">Your identity fits the <strong>${preset}</strong> theme. Want to apply it?</div>
      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button class="tw-theme-dismiss" style="background:transparent;border:1px solid #475569;color:#94a3b8;border-radius:4px;padding:4px 8px;cursor:pointer;">Dismiss</button>
        <button class="tw-theme-apply" style="background:#4f46e5;border:none;color:white;border-radius:4px;padding:4px 8px;cursor:pointer;">Apply</button>
      </div>
    `;

    document.body.appendChild(box);

    box.querySelector(".tw-theme-dismiss").onclick = () => box.remove();

    box.querySelector(".tw-theme-apply").onclick = () => {
      applyThemePreset(preset);
      const state = this.load();
      state.lastPreset = preset;
      this.save(state);
      box.remove();
    };
  },

  // 17.9 Auto‑Adapt Theme to Identity
  autoAdaptTheme() {
    const state = this.load();
    if (!state.autoAdapt) return;

    const theme = this.generateThemeFromIdentity();
    this.applyThemeObject(theme);
  },

  // 17.10 Bind UI Toggles (optional)
  bindUI() {
    const autoToggle = document.getElementById("tw-theme-auto");
    const dynamicToggle = document.getElementById("tw-theme-dynamic");

    const state = this.load();

    if (autoToggle) {
      autoToggle.checked = state.autoAdapt;
      autoToggle.addEventListener("change", () => {
        state.autoAdapt = autoToggle.checked;
        this.save(state);
        if (state.autoAdapt) this.autoAdaptTheme();
      });
    }

    if (dynamicToggle) {
      dynamicToggle.checked = state.dynamicContext;
      dynamicToggle.addEventListener("change", () => {
        state.dynamicContext = dynamicToggle.checked;
        this.save(state);
        this.applyDynamicContext();
      });
    }
  },

  // 17.11 Initialize
  init() {
    this.bindUI();
    this.autoAdaptTheme();
    this.applyDynamicContext();

    // Suggest theme after a short delay
    setTimeout(() => this.showThemeSuggestion(), 3500);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ThemeIntelligence.init();
});

// -----------------------------------------------------
// Settings Panel Toggle
// -----------------------------------------------------
const settingsBtn = document.getElementById("tw-settings-btn");
const settingsPanel = document.getElementById("tw-settings-panel");
const settingsClose = document.getElementById("tw-settings-close");

if (settingsBtn && settingsPanel) {
  settingsBtn.addEventListener("click", () => {
    settingsPanel.style.display = "flex";
  });
}

if (settingsClose && settingsPanel) {
  settingsClose.addEventListener("click", () => {
    settingsPanel.style.display = "none";
  });
}

// -----------------------------------------------------
// Warp 18: Collaboration Engine (Real-Time Ready)
// -----------------------------------------------------

const CollaborationEngine = {
  storageKey: "tw-collab-session",

  // 18.1 Default Session State
  defaultState: {
    sessionId: null,
    userId: null,
    peers: {},        // { userId: { name, color, lastSeen } }
    presenceEnabled: true,
    syncEnabled: false // true when connected to backend
  },

  // 18.2 Load Session
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultState);
    } catch {
      return structuredClone(this.defaultState);
    }
  },

  // 18.3 Save Session
  save(state) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  },

  // 18.4 Start a Collaboration Session
  startSession(sessionId = null) {
    const state = this.load();

    state.sessionId = sessionId || "session-" + Math.random().toString(36).slice(2);
    state.userId = "user-" + Math.random().toString(36).slice(2);
    state.peers = {};
    state.syncEnabled = false;

    this.save(state);

    console.log("[Collab] Session started:", state.sessionId);
    return state;
  },

  // 18.5 Add Peer (local simulation)
  addPeer(userId, name = "Guest") {
    const state = this.load();
    state.peers[userId] = {
      name,
      color: this.randomColor(),
      lastSeen: Date.now()
    };
    this.save(state);
    this.renderPresence();
  },

  // 18.6 Remove Peer
  removePeer(userId) {
    const state = this.load();
    delete state.peers[userId];
    this.save(state);
    this.renderPresence();
  },

  // 18.7 Random Color for Peer Cursors
  randomColor() {
    const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // 18.8 Render Presence Indicators
  renderPresence() {
    const container = document.getElementById("tw-collab-presence");
    if (!container) return;

    const state = this.load();
    container.innerHTML = "";

    Object.entries(state.peers).forEach(([id, peer]) => {
      const dot = document.createElement("div");
      dot.className = "tw-collab-peer";
      dot.style.width = "10px";
      dot.style.height = "10px";
      dot.style.borderRadius = "50%";
      dot.style.background = peer.color;
      dot.style.marginRight = "6px";
      dot.title = peer.name;

      container.appendChild(dot);
    });
  },

  // 18.9 Broadcast Local Change (stub)
  broadcastChange(change) {
    const state = this.load();
    if (!state.syncEnabled) return;

    console.log("[Collab] Broadcast:", change);

    // Future:
    // socket.send(JSON.stringify(change));
  },

  // 18.10 Receive Remote Change (stub)
  receiveChange(change) {
    console.log("[Collab] Received:", change);

    // Example: remote block update
    if (change.type === "block-update") {
      const block = canvasBody.querySelector(`[data-block-id="${change.blockId}"]`);
      if (block) {
        const slot = block.querySelector(change.slot);
        if (slot) slot.textContent = change.value;
      }
    }

    // Example: remote block add
    if (change.type === "block-add") {
      const block = ComponentIntelligence.buildSmartComponent(change.blockType);
      if (block) {
        canvasBody.appendChild(block);
        assignBlockId(block);
        enhanceBlock(block);
        makeBlockDraggable(block);
      }
    }
  },

  // 18.11 Track Cursor Movement (local simulation)
  trackCursor() {
    document.addEventListener("mousemove", e => {
      const state = this.load();
      if (!state.syncEnabled) return;

      this.broadcastChange({
        type: "cursor",
        x: e.clientX,
        y: e.clientY,
        userId: state.userId
      });
    });
  },

  // 18.12 Render Remote Cursors (stub)
  renderRemoteCursor(userId, x, y, color) {
    let cursor = document.querySelector(`.tw-cursor-${userId}`);
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.className = `tw-cursor-${userId}`;
      cursor.style.position = "fixed";
      cursor.style.width = "8px";
      cursor.style.height = "8px";
      cursor.style.borderRadius = "50%";
      cursor.style.background = color;
      cursor.style.zIndex = 9999;
      document.body.appendChild(cursor);
    }

    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
  },

  // 18.13 Simulate Remote Cursor (demo mode)
  simulateRemoteCursor() {
    const state = this.load();
    const peers = Object.entries(state.peers);

    peers.forEach(([id, peer]) => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      this.renderRemoteCursor(id, x, y, peer.color);
    });
  },

  // 18.14 Initialize Collaboration Engine
  init() {
    const state = this.startSession();

    // Optional: add fake peers for demo
    this.addPeer("peer-1", "Alex");
    this.addPeer("peer-2", "Jordan");

    // Render presence
    this.renderPresence();

    // Simulate remote cursor movement
    setInterval(() => this.simulateRemoteCursor(), 1500);

    // Track local cursor (future real-time)
    this.trackCursor();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CollaborationEngine.init();
});

// -----------------------------------------------------
// Warp 19: Publishing Pipeline Evolution
// -----------------------------------------------------

const PublishingEngine = {
  storageKey: "tw-publishing-history",

  // 19.1 Default Publish History
  defaultHistory: {
    versions: [] // { version, timestamp, pages, theme, identity }
  },

  // 19.2 Load Publish History
  loadHistory() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultHistory);
    } catch {
      return structuredClone(this.defaultHistory);
    }
  },

  // 19.3 Save Publish History
  saveHistory(history) {
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  },

  // 19.4 Pre‑Publish Checklist
  runChecklist() {
    const issues = [];

    // Identity check
    if (typeof IdentityEngine !== "undefined") {
      const identity = IdentityEngine.getProfile();
      if (!identity || !identity.promise) {
        issues.push("Identity is incomplete (missing promise).");
      }
    }

    // Page structure check
    if (Object.keys(PAGES).length === 0) {
      issues.push("No pages exist.");
    }

    // Orphan page check (future: detect unlinked pages)
    // issues.push("Some pages are not linked.");

    // Block presence check
    const blocks = canvasBody.querySelectorAll(".tw-block");
    if (blocks.length === 0) {
      issues.push("The current page has no content.");
    }

    return issues;
  },

  // 19.5 Build Publish Bundle (extends your existing buildSiteBundle)
  buildBundle() {
    // Save current page before exporting
    PAGES[currentPage] = canvasBody.innerHTML;

    const pages = Object.entries(PAGES).map(([name, html]) => {
      const temp = document.createElement("div");
      temp.innerHTML = html;

      // Strip editor UI
      temp.querySelectorAll(".tw-block-controls").forEach(el => el.remove());
      temp.querySelectorAll(".tw-block-hoverbar").forEach(el => el.remove());
      temp.querySelectorAll(".tw-block-type").forEach(el => el.remove());

      temp.querySelectorAll(".tw-block").forEach(block => {
        block.removeAttribute("draggable");
        block.removeAttribute("data-block-id");
        block.classList.remove("tw-selected");
      });

      return {
        name,
        html: temp.innerHTML.trim(),
        css: exportCanvasCSS()
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      globalStyles: { ...GLOBAL_STYLES },
      identity: typeof IdentityEngine !== "undefined" ? IdentityEngine.getProfile() : {},
      pages
    };
  },

  // 19.6 Save Version to History
  saveVersion(bundle) {
    const history = this.loadHistory();

    const version = {
      version: "v" + (history.versions.length + 1),
      timestamp: new Date().toISOString(),
      pages: bundle.pages.map(p => p.name),
      theme: bundle.globalStyles,
      identity: bundle.identity
    };

    history.versions.push(version);
    this.saveHistory(history);

    return version;
  },

  // 19.7 Show Publish Modal (guided)
  showPublishModal(bundle, issues) {
    const modal = document.getElementById("tw-publish-modal");
    const output = document.getElementById("tw-publish-output");

    if (!modal || !output) return;

    if (issues.length > 0) {
      output.value = JSON.stringify({
        status: "warning",
        message: "Some issues were found before publishing.",
        issues
      }, null, 2);
    } else {
      const version = this.saveVersion(bundle);

      output.value = JSON.stringify({
        status: "ok",
        message: "Publish successful (simulated).",
        version,
        bundlePreview: {
          generatedAt: bundle.generatedAt,
          pageCount: bundle.pages.length,
          pages: bundle.pages.map(p => p.name)
        }
      }, null, 2);
    }

    modal.style.display = "flex";
  },

  // 19.8 Publish (simulated)
  publish() {
    const issues = this.runChecklist();
    const bundle = this.buildBundle();
    this.showPublishModal(bundle, issues);
  },

  // 19.9 Bind Publish Button
  bindUI() {
    const publishBtn = document.getElementById("tw-publish-site");
    if (!publishBtn) return;

    publishBtn.addEventListener("click", () => {
      if (!RoleSystem.can("publish")) {
        alert("You do not have permission to publish.");
        return;
      }
      this.publish();
    });
  },

  // 19.10 Initialize
  init() {
    this.bindUI();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  PublishingEngine.init();
});

// -----------------------------------------------------
// Warp 20: Universe Engine Expansion
// -----------------------------------------------------

const UniverseEngine = {
  storageKey: "tw-universe",

  // 20.1 Default Universe Structure
  defaultUniverse: {
    projects: {
      // projectName: {
      //   portals: { ... },
      //   identity: { ... },
      //   theme: { ... },
      //   history: [ ... ],
      //   createdAt: "...",
      //   lastOpened: "..."
      // }
    },
    lastProject: null
  },

  // 20.2 Load Universe
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultUniverse);
    } catch {
      return structuredClone(this.defaultUniverse);
    }
  },

  // 20.3 Save Universe
  save(universe) {
    localStorage.setItem(this.storageKey, JSON.stringify(universe));
  },

  // 20.4 Create Project
  createProject(name) {
    const universe = this.load();

    if (universe.projects[name]) {
      alert("A project with that name already exists.");
      return null;
    }

    universe.projects[name] = {
      portals: {},
      identity: typeof IdentityEngine !== "undefined"
        ? IdentityEngine.getProfile()
        : {},
      theme: { ...GLOBAL_STYLES },
      history: [],
      createdAt: new Date().toISOString(),
      lastOpened: new Date().toISOString()
    };

    universe.lastProject = name;
    this.save(universe);

    console.log("[Universe] Created project:", name);
    return universe.projects[name];
  },

  // 20.5 Load Project
  loadProject(name) {
    const universe = this.load();
    const project = universe.projects[name];
    if (!project) {
      alert("Project not found.");
      return;
    }

    // Load identity + theme
    if (typeof IdentityEngine !== "undefined") {
      IdentityEngine.save(project.identity);
    }
    Object.assign(GLOBAL_STYLES, project.theme);
    applyGlobalStyles();

    // Load portals into PortalEngine
    const portals = project.portals;
    localStorage.setItem(PortalEngine.storageKey, JSON.stringify(portals));

    // Load last opened portal
    const firstPortal = Object.keys(portals)[0];
    if (firstPortal) PortalEngine.loadPortal(firstPortal);

    project.lastOpened = new Date().toISOString();
    universe.lastProject = name;
    this.save(universe);

    console.log("[Universe] Loaded project:", name);
  },

  // 20.6 Save Current Project State
  saveCurrentProject() {
    const universe = this.load();
    const name = universe.lastProject;
    if (!name) return;

    const project = universe.projects[name];
    if (!project) return;

    // Save identity + theme
    project.identity = typeof IdentityEngine !== "undefined"
      ? IdentityEngine.getProfile()
      : {};
    project.theme = { ...GLOBAL_STYLES };

    // Save portals
    project.portals = PortalEngine.loadPortals();

    // Save timestamp
    project.lastOpened = new Date().toISOString();

    this.save(universe);
  },

  // 20.7 Add Project History Entry
  addHistoryEntry(label) {
    const universe = this.load();
    const name = universe.lastProject;
    if (!name) return;

    const project = universe.projects[name];
    if (!project) return;

    project.history.unshift({
      label,
      time: new Date().toLocaleString()
    });

    if (project.history.length > 50) project.history.pop();

    this.save(universe);
  },

  // 20.8 Export Entire Universe
  exportUniverse() {
    const universe = this.load();
    return JSON.stringify(universe, null, 2);
  },

  // 20.9 Import Universe
  importUniverse(json) {
    try {
      const parsed = JSON.parse(json);
      localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      console.log("[Universe] Imported universe.");
    } catch (e) {
      console.warn("[Universe] Failed to import universe.", e);
    }
  },

  // 20.10 Project Switcher (temporary)
  attachProjectSwitcher() {
    const projectBtn = document.querySelector('[data-menu="project"]');
    if (!projectBtn) return;

    projectBtn.addEventListener("click", () => {
      const universe = this.load();
      const names = Object.keys(universe.projects);

      const choice = prompt(
        `Projects:\n${names.join("\n")}\n\nType a project name to load, or "new" to create one:`,
        ""
      );

      if (!choice) return;

      if (choice.toLowerCase() === "new") {
        const newName = prompt("Project name:");
        if (!newName) return;
        this.createProject(newName);
        this.loadProject(newName);
        return;
      }

      if (universe.projects[choice]) {
        this.loadProject(choice);
      } else {
        alert("Project not found.");
      }
    });
  },

  // 20.11 Initialize Universe Engine
  init() {
    this.attachProjectSwitcher();

    // Auto-load last project if exists
    const universe = this.load();
    if (universe.lastProject) {
      this.loadProject(universe.lastProject);
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  UniverseEngine.init();
});

// -----------------------------------------------------
// Warp 21: Role Verification & Visual Identity Layer
// -----------------------------------------------------

const RoleModeEngine = {
  storageKey: "tw-role-mode",

  // 21.1 Default Role Mode State
  defaultState: {
    requirePasswordForArchitect: false,
    allowFreeSwitching: true,
    architectPassword: "TYNI-ARCH-2025",
    hasCompletedWelcome: false
  },

  // 21.2 Load / Save
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : structuredClone(this.defaultState);
    } catch {
      return structuredClone(this.defaultState);
    }
  },

  save(state) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  },

  // 21.3 Apply Role Visual Theme
  applyRoleTheme(role) {
    // Base: keep existing GLOBAL_STYLES, only adjust accent
    if (!window.GLOBAL_STYLES) return;

    if (role === "architect") {
      GLOBAL_STYLES.accentColor = "#f97316"; // orange
    } else if (role === "member") {
      GLOBAL_STYLES.accentColor = "#3b82f6"; // light blue
    } else {
      // guest / default: do nothing, keep current accent
    }

    if (typeof applyGlobalStyles === "function") {
      applyGlobalStyles();
    }

    // Also push to CSS variable for any direct usage
    document.documentElement.style.setProperty("--tw-accent-color", GLOBAL_STYLES.accentColor || "#4f46e5");
  },

  // 21.4 Set Role (with theme + RoleSystem)
  setRole(role) {
    if (typeof RoleSystem !== "undefined" && RoleSystem && typeof RoleSystem.setRole === "function") {
      RoleSystem.setRole(role);
    }
    this.applyRoleTheme(role);
  },

  // 21.5 Verify Architect Password (if required)
  async verifyArchitectPassword() {
    const state = this.load();
    if (!state.requirePasswordForArchitect) return true;

    const input = prompt("Enter Architect password:");
    if (input === null) return false;
    if (input === state.architectPassword) return true;

    alert("Incorrect password. You will be set as Member instead.");
    return false;
  },

  // 21.6 Create Welcome Modal DOM
  createWelcomeModal() {
    let modal = document.getElementById("tw-welcome-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "tw-welcome-modal";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.background = "rgba(15,23,42,0.85)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = 9999;

    modal.innerHTML = `
      <div style="
        background:#0f172a;
        color:#e2e8f0;
        padding:24px 28px;
        border-radius:16px;
        max-width:420px;
        width:100%;
        box-shadow:0 24px 80px rgba(0,0,0,0.7);
        font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">
          Welcome to Tyniweb V2
        </h2>
        <p style="font-size:13px;line-height:1.5;color:#cbd5f5;margin-bottom:16px;">
          This workspace runs on the Warp Engine. Before we begin, choose how you’ll be using the editor.
        </p>
        <div style="background:#020617;border-radius:10px;padding:10px 12px;margin-bottom:16px;font-size:12px;color:#94a3b8;">
          <strong style="color:#e5e7eb;">Architect</strong> — designs worlds, sets identity & theme, manages portals, and oversees publishing.<br/>
          <strong style="color:#e5e7eb;">Member</strong> — edits content, builds pages, and follows guided paths.
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px;">
          <button id="tw-welcome-member" style="
            background:#0b1120;
            border:1px solid #334155;
            color:#e2e8f0;
            border-radius:8px;
            padding:8px 12px;
            font-size:13px;
            cursor:pointer;
          ">I am a Member</button>
          <button id="tw-welcome-architect" style="
            background:#f97316;
            border:none;
            color:#0b1120;
            border-radius:8px;
            padding:8px 12px;
            font-size:13px;
            font-weight:600;
            cursor:pointer;
          ">I am an Architect</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  },

  // 21.7 Show Welcome Modal (first-time / reset)
  showWelcomeModal() {
    const modal = this.createWelcomeModal();
    modal.style.display = "flex";

    const state = this.load();

    const memberBtn = document.getElementById("tw-welcome-member");
    const architectBtn = document.getElementById("tw-welcome-architect");

    if (memberBtn) {
      memberBtn.onclick = () => {
        this.setRole("member");
        state.hasCompletedWelcome = true;
        this.save(state);
        modal.style.display = "none";

        if (typeof TeachingEngine !== "undefined") {
          TeachingEngine.startTrack("basics");
        }
      };
    }

    if (architectBtn) {
      architectBtn.onclick = async () => {
        const ok = await this.verifyArchitectPassword();
        if (ok) {
          this.setRole("architect");
        } else {
          this.setRole("member");
        }
		// Launch Architect Quick-Start Guide
		if (typeof showArchitectGuide === "function") {
		  showArchitectGuide();
		}
        state.hasCompletedWelcome = true;
        this.save(state);
        modal.style.display = "none";

        if (typeof TeachingEngine !== "undefined") {
          TeachingEngine.startTrack("power");
        }
      };
    }
  },

  // 21.8 Attach Settings Controls (optional)
  attachSettingsUI() {
    const state = this.load();

    const requirePwEl = document.getElementById("tw-role-require-password");
    const allowSwitchEl = document.getElementById("tw-role-allow-switch");
    const pwInputEl = document.getElementById("tw-role-architect-password");
    const roleSelectEl = document.getElementById("tw-role-current-role");

    if (requirePwEl) {
      requirePwEl.checked = state.requirePasswordForArchitect;
      requirePwEl.addEventListener("change", () => {
        state.requirePasswordForArchitect = requirePwEl.checked;
        this.save(state);
      });
    }

    if (allowSwitchEl) {
      allowSwitchEl.checked = state.allowFreeSwitching;
      allowSwitchEl.addEventListener("change", () => {
        state.allowFreeSwitching = allowSwitchEl.checked;
        this.save(state);
      });
    }

    if (pwInputEl) {
      pwInputEl.value = state.architectPassword;
      pwInputEl.addEventListener("input", () => {
        state.architectPassword = pwInputEl.value || "TYNI-ARCH-2025";
        this.save(state);
      });
    }

    if (roleSelectEl) {
      // Reflect current role
      const currentRole = typeof RoleSystem !== "undefined" ? RoleSystem.getRole() : "architect";
      roleSelectEl.value = currentRole;

      roleSelectEl.addEventListener("change", async () => {
        if (!state.allowFreeSwitching) {
          alert("Role switching is disabled in this mode.");
          roleSelectEl.value = currentRole;
          return;
        }

        const newRole = roleSelectEl.value;

        if (newRole === "architect") {
          const ok = await this.verifyArchitectPassword();
          if (!ok) {
            roleSelectEl.value = "member";
            this.setRole("member");
            return;
          }
        }

        this.setRole(newRole);
      });
    }
  },

  // 21.9 Init
  init() {
    const state = this.load();

    // If no welcome yet, force it
    if (!state.hasCompletedWelcome) {
      this.showWelcomeModal();
    } else {
      // Apply theme for existing role
      const role = typeof RoleSystem !== "undefined" ? RoleSystem.getRole() : "architect";
      this.applyRoleTheme(role);
    }

    this.attachSettingsUI();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  RoleModeEngine.init();
});

// -----------------------------------------------------
// Auto-trigger training based on role
// -----------------------------------------------------
if (typeof TeachingEngine !== "undefined") {
  const role = RoleSystem.getRole();

  if (role === "architect") {
    TeachingEngine.startTrack("architect-track");
  }

  if (role === "member") {
    TeachingEngine.startTrack("member-track");
  }
}

document.getElementById("tw-start-training")
  ?.addEventListener("click", () => {
    const role = RoleSystem.getRole();
    if (role === "architect") TeachingEngine.startTrack("architect-track");
    if (role === "member") TeachingEngine.startTrack("member-track");
  });


// -----------------------------------------------------
// Phase 02: Component Templates (Core)
// -----------------------------------------------------
const templateHero = `
  <section class="tw-block tw-hero" data-type="hero">
    <h1 data-slot="title">Your Hero Title</h1>
    <p data-slot="subtitle">Your subtitle goes here. Make it inspiring.</p>
    <button data-slot="cta">Click Me</button>
  </section>
`;

const templateSection = `
  <section class="tw-block tw-section" data-type="section">
    <h2 data-slot="heading">Section Heading</h2>
    <p data-slot="body">This is a general-purpose section. Add any content you want.</p>
  </section>
`;

const templateText = `
  <div class="tw-block tw-text" data-type="text">
    <p data-slot="text">This is a text block. Edit me in the inspector.</p>
  </div>
`;



// -----------------------------------------------------
// Phase 03: Variant Templates (Hero / Section / Text)
// -----------------------------------------------------
const templateHeroAlt = `
  <section class="tw-block tw-hero tw-hero-alt" data-type="hero" data-variant="v2">
    <p data-slot="subtitle">A bold new subtitle</p>
    <h1 data-slot="title">A striking alternate hero</h1>
    <button data-slot="cta">Learn More</button>
  </section>
`;

const templateSectionAlt = `
  <section class="tw-block tw-section tw-section-alt" data-type="section" data-variant="v2">
    <h2 data-slot="heading">Alternate Section Heading</h2>
    <div data-slot="body">This is an alternate layout with different structure.</div>
  </section>
`;

const templateTextAlt = `
  <div class="tw-block tw-text tw-text-alt" data-type="text" data-variant="v2">
    <blockquote data-slot="text">Alternate text style with emphasis.</blockquote>
  </div>
`;



// -----------------------------------------------------
// Phase 04: Expanded Component Templates (Feature Row, Card, Footer, etc.)
// -----------------------------------------------------
const templateFeatureRow = `
  <section class="tw-block tw-feature-row" data-type="feature-row">
    <div class="tw-feature-text">
      <h2 data-slot="heading">Feature heading</h2>
      <p data-slot="body">Describe your key feature here.</p>
    </div>
    <div class="tw-feature-media">
      <div data-slot="media">Image or illustration</div>
    </div>
  </section>
`;

const templateCard = `
  <div class="tw-block tw-card" data-type="card">
    <h3 data-slot="title">Card title</h3>
    <p data-slot="body">Short supporting text for this card.</p>
  </div>
`;

const templateFooter = `
  <footer class="tw-block tw-footer" data-type="footer">
    <p data-slot="text">© Your Company. All rights reserved.</p>
  </footer>
`;

// Additional components (Phase 17)
const templateNavbar = `
  <nav class="tw-block tw-navbar" data-type="navbar">
    <div class="tw-nav-logo" data-slot="logo">Logo</div>
    <div class="tw-nav-links" data-slot="links">Home · About · Contact</div>
  </nav>
`;

const templateForm = `
  <form class="tw-block tw-form" data-type="form">
    <label>
      <span data-slot="label">Your Email</span>
      <input type="email" placeholder="email@example.com" />
    </label>
    <button data-slot="button">Submit</button>
  </form>
`;

const templateButton = `
  <button class="tw-block tw-button" data-type="button" data-slot="label">
    Click Me
  </button>
`;

const templateMediaBlock = `
  <div class="tw-block tw-media-block" data-type="media-block">
    <div class="tw-media" data-slot="media">Media</div>
    <p data-slot="caption">Caption text here.</p>
  </div>
`;

const templateCallout = `
  <div class="tw-block tw-callout" data-type="callout">
    <strong data-slot="title">Important</strong>
    <p data-slot="body">This is a callout message.</p>
  </div>
`;

const templateTestimonial = `
  <div class="tw-block tw-testimonial" data-type="testimonial">
    <blockquote data-slot="quote">"This product changed my life."</blockquote>
    <p data-slot="author">— Customer Name</p>
  </div>
`;

const templatePricingTable = `
  <div class="tw-block tw-pricing" data-type="pricing">
    <h3 data-slot="title">Basic Plan</h3>
    <p data-slot="price">$19/mo</p>
    <ul data-slot="features">
      <li>Feature one</li>
      <li>Feature two</li>
    </ul>
  </div>
`;



// -----------------------------------------------------
// Phase 05: Multi-Page System (Core)
// -----------------------------------------------------
const PAGES = {
  "Home": "" // default page
};

let currentPage = "Home";



// -----------------------------------------------------
// Phase 06: Block Enhancement & IDs
// -----------------------------------------------------
function enhanceBlock(block) {
  const controls = document.createElement('div');
  controls.className = 'tw-block-controls';
  controls.innerHTML = `
    <button class="tw-control-duplicate">⧉</button>
    <button class="tw-control-delete">✕</button>
    <button class="tw-control-up">↑</button>
    <button class="tw-control-down">↓</button>
  `;

  const hoverbar = document.createElement('div');
  hoverbar.className = 'tw-block-hoverbar';
  hoverbar.innerHTML = `
    <button class="tw-add-above">+ Above</button>
    <button class="tw-add-below">+ Below</button>
  `;

  block.prepend(hoverbar);
  block.prepend(controls);

  const typeBadge = document.createElement('div');
  typeBadge.className = 'tw-block-type';
  typeBadge.textContent = block.dataset.type || 'Block';
  block.prepend(typeBadge);
}

let blockCounter = 0;

function assignBlockId(block) {
  block.dataset.blockId = 'block-' + (++blockCounter);
}



// -----------------------------------------------------
// Phase 07: Drag & Drop (Blocks + Components)
// -----------------------------------------------------
function makeBlockDraggable(block) {
  block.setAttribute('draggable', 'true');

  block.addEventListener('dragstart', e => {
    e.dataTransfer.setData('move-block', block.dataset.blockId);
    block.classList.add('tw-dragging');
  });

  block.addEventListener('dragend', () => {
    block.classList.remove('tw-dragging');
  });
}

// Component buttons draggable
document.querySelectorAll('.tw-component-item').forEach(btn => {
  btn.setAttribute('draggable', 'true');

  btn.addEventListener('dragstart', e => {
    e.dataTransfer.setData('component', btn.textContent.trim());
  });
});

const canvasBody = document.querySelector('.tw-canvas-body');

// Unified dragover handler
canvasBody.addEventListener('dragover', e => {
  e.preventDefault();

  // Reorder blocks
  if (e.dataTransfer.types.includes('move-block')) {
    const dragging = document.querySelector('.tw-dragging');
    if (!dragging) return;

    const blocks = [...canvasBody.querySelectorAll('.tw-block:not(.tw-dragging)')];

    const after = blocks.find(block => {
      const rect = block.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });

    if (after) {
      canvasBody.insertBefore(dragging, after);
    } else {
      canvasBody.appendChild(dragging);
    }

    return;
  }
});

// Drop handler (new components only)
canvasBody.addEventListener('drop', e => {
  e.preventDefault();

  if (e.dataTransfer.types.includes('move-block')) return;

  const component = e.dataTransfer.getData('component');
  if (!component) return;

  const emptyState = canvasBody.querySelector('.tw-canvas-empty');
  if (emptyState) emptyState.remove();

  let html = '';

  switch (component.toLowerCase()) {
    case 'hero':
      html = templateHero;
      break;
    case 'section':
      html = templateSection;
      break;
    case 'text block':
    case 'text':
      html = templateText;
      break;
    case 'feature row':
      html = templateFeatureRow;
      break;
    case 'card':
      html = templateCard;
      break;
    case 'footer':
      html = templateFooter;
      break;
    case 'navbar':
      html = templateNavbar;
      break;
    case 'form':
      html = templateForm;
      break;
    case 'button':
      html = templateButton;
      break;
    case 'media block':
      html = templateMediaBlock;
      break;
    case 'callout':
      html = templateCallout;
      break;
    case 'testimonial':
      html = templateTestimonial;
      break;
    case 'pricing table':
      html = templatePricingTable;
      break;
    default:
      html = `<div class="tw-block">Unknown component: ${component}</div>`;
  }

  canvasBody.insertAdjacentHTML('beforeend', html);

  const newBlock = canvasBody.lastElementChild;
  assignBlockId(newBlock);
  enhanceBlock(newBlock);
  makeBlockDraggable(newBlock);
});



// -----------------------------------------------------
// Phase 08: History System (Undo / Redo)
// -----------------------------------------------------
const history = [];
const future = [];

function saveHistory() {
  history.push(canvasBody.innerHTML);
  future.length = 0;
}

function restoreState(html) {
  canvasBody.innerHTML = html;

  canvasBody.querySelectorAll('.tw-block').forEach(block => {
    enhanceBlock(block);
    makeBlockDraggable(block);
  });
}

function undo() {
  if (history.length === 0) return;
  const current = canvasBody.innerHTML;
  future.push(current);
  const previous = history.pop();
  restoreState(previous);
}

function redo() {
  if (future.length === 0) return;
  const current = canvasBody.innerHTML;
  history.push(current);
  const next = future.pop();
  restoreState(next);
}



// -----------------------------------------------------
// Phase 09: JSON Save / Load
// -----------------------------------------------------
function saveCanvas() {
  const blocks = [...canvasBody.querySelectorAll('.tw-block')];

  const data = blocks.map(block => {
    const type = block.dataset.type;
    const config = COMPONENTS[type];
    const content = {};

    if (config) {
      for (const field of config.inspector) {
        const slotSelector = config.slots[field];
        const el = block.querySelector(slotSelector);
        content[field] = el ? el.textContent : "";
      }
    }

    return { type, content };
  });

  return JSON.stringify(data, null, 2);
}

function loadCanvas(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch (err) {
    alert("Invalid JSON");
    return;
  }

  canvasBody.innerHTML = "";

  data.forEach(item => {
    let html = "";

    switch (item.type) {
      case "hero":
        html = templateHero;
        break;
      case "section":
        html = templateSection;
        break;
      case "text":
        html = templateText;
        break;
      case "feature-row":
        html = templateFeatureRow;
        break;
      case "card":
        html = templateCard;
        break;
      case "footer":
        html = templateFooter;
        break;
      case "navbar":
        html = templateNavbar;
        break;
      case "form":
        html = templateForm;
        break;
      case "button":
        html = templateButton;
        break;
      case "media-block":
        html = templateMediaBlock;
        break;
      case "callout":
        html = templateCallout;
        break;
      case "testimonial":
        html = templateTestimonial;
        break;
      case "pricing":
        html = templatePricingTable;
        break;
      default:
        html = `<div class="tw-block" data-type="${item.type}">Unknown block</div>`;
    }

    canvasBody.insertAdjacentHTML("beforeend", html);
    const block = canvasBody.lastElementChild;

    assignBlockId(block);
    enhanceBlock(block);
    makeBlockDraggable(block);

    const config = COMPONENTS[item.type];
    if (config) {
      for (const field of config.inspector) {
        const slotSelector = config.slots[field];
        const el = block.querySelector(slotSelector);
        if (el) el.textContent = item.content[field] || "";
      }
    }
  });
}



// -----------------------------------------------------
// Phase 10: Export HTML / CSS
// -----------------------------------------------------
function exportCanvasHTML() {
  const clone = canvasBody.cloneNode(true);

  clone.querySelectorAll('.tw-block-controls').forEach(el => el.remove());
  clone.querySelectorAll('.tw-block-hoverbar').forEach(el => el.remove());
  clone.querySelectorAll('.tw-block-type').forEach(el => el.remove());

  clone.querySelectorAll('.tw-block').forEach(block => {
    block.removeAttribute('draggable');
    block.removeAttribute('data-block-id');
    block.classList.remove('tw-selected');
  });

  return clone.innerHTML.trim();
}

// For now: minimal CSS export (placeholder for future full export system)
function exportCanvasCSS() {
  return `
.tw-block {
  padding: 20px;
  margin: 10px 0;
  background: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 6px;
}

.tw-hero {
  padding: 40px;
  background: #eef6ff;
  border-radius: 8px;
}

.tw-section {
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tw-text {
  padding: 20px;
  background: #fff;
  border-left: 4px solid #00cc88;
}
`.trim();
}



// -----------------------------------------------------
// Phase 11: Component Registry
// -----------------------------------------------------
const COMPONENTS = {
  hero: {
    variants: {
      v1: templateHero,
      v2: templateHeroAlt
    },
    slots: {
      title: '[data-slot="title"]',
      subtitle: '[data-slot="subtitle"]',
      cta: '[data-slot="cta"]'
    },
    inspector: ['title', 'subtitle', 'cta']
  },

  section: {
    variants: {
      v1: templateSection,
      v2: templateSectionAlt
    },
    slots: {
      heading: '[data-slot="heading"]',
      body:   '[data-slot="body"]'
    },
    inspector: ['heading', 'body']
  },

  text: {
    variants: {
      v1: templateText,
      v2: templateTextAlt
    },
    slots: {
      text: '[data-slot="text"]'
    },
    inspector: ['text']
  },

  'feature-row': {
    variants: {
      v1: templateFeatureRow
    },
    slots: {
      heading: '[data-slot="heading"]',
      body:    '[data-slot="body"]',
      media:   '[data-slot="media"]'
    },
    inspector: ['heading', 'body', 'media']
  },

  card: {
    variants: {
      v1: templateCard
    },
    slots: {
      title: '[data-slot="title"]',
      body:  '[data-slot="body"]'
    },
    inspector: ['title', 'body']
  },

  navbar: {
    variants: {
      v1: templateNavbar
    },
    slots: {
      logo:  '[data-slot="logo"]',
      links: '[data-slot="links"]'
    },
    inspector: ['logo', 'links']
  },

  form: {
    variants: {
      v1: templateForm
    },
    slots: {
      label:  '[data-slot="label"]',
      button: '[data-slot="button"]'
    },
    inspector: ['label', 'button']
  },

  button: {
    variants: {
      v1: templateButton
    },
    slots: {
      label: '[data-slot="label"]'
    },
    inspector: ['label']
  },

  'media-block': {
    variants: {
      v1: templateMediaBlock
    },
    slots: {
      media:   '[data-slot="media"]',
      caption: '[data-slot="caption"]'
    },
    inspector: ['media', 'caption']
  },

  callout: {
    variants: {
      v1: templateCallout
    },
    slots: {
      title: '[data-slot="title"]',
      body:  '[data-slot="body"]'
    },
    inspector: ['title', 'body']
  },

  testimonial: {
    variants: {
      v1: templateTestimonial
    },
    slots: {
      quote:  '[data-slot="quote"]',
      author: '[data-slot="author"]'
    },
    inspector: ['quote', 'author']
  },

  pricing: {
    variants: {
      v1: templatePricingTable
    },
    slots: {
      title:    '[data-slot="title"]',
      price:    '[data-slot="price"]',
      features: '[data-slot="features"]'
    },
    inspector: ['title', 'price', 'features']
  }
};



// -----------------------------------------------------
// Phase 12: Selection & Block Controls
// -----------------------------------------------------
let selectedBlock = null;

canvasBody.addEventListener('click', e => {
  const block = e.target.closest('.tw-block');
  if (!block) return;

  if (selectedBlock) {
    selectedBlock.classList.remove('tw-selected');
  }

  selectedBlock = block;
  selectedBlock.classList.add('tw-selected');

  loadInspector(selectedBlock);
});

// Block controls
canvasBody.addEventListener('click', e => {

  // DELETE
  if (e.target.classList.contains('tw-control-delete')) {
    saveHistory();
    const block = e.target.closest('.tw-block');
    if (selectedBlock === block) selectedBlock = null;
    block.remove();
    return;
  }

  // MOVE UP
  if (e.target.classList.contains('tw-control-up')) {
    saveHistory();
    const block = e.target.closest('.tw-block');
    const prev = block.previousElementSibling;
    if (prev) canvasBody.insertBefore(block, prev);
    return;
  }

  // MOVE DOWN
  if (e.target.classList.contains('tw-control-down')) {
    saveHistory();
    const block = e.target.closest('.tw-block');
    const next = block.nextElementSibling;
    if (next) canvasBody.insertBefore(next, block);
    return;
  }

  // ADD ABOVE
  if (e.target.classList.contains('tw-add-above')) {
    saveHistory();
    const block = e.target.closest('.tw-block');

    const wrapper = document.createElement('div');
    wrapper.innerHTML = templateText;
    const inserted = wrapper.firstElementChild;

    assignBlockId(inserted);
    enhanceBlock(inserted);
    makeBlockDraggable(inserted);

    canvasBody.insertBefore(inserted, block);
    return;
  }

  // ADD BELOW
  if (e.target.classList.contains('tw-add-below')) {
    saveHistory();
    const block = e.target.closest('.tw-block');

    const wrapper = document.createElement('div');
    wrapper.innerHTML = templateText;
    const inserted = wrapper.firstElementChild;

    assignBlockId(inserted);
    enhanceBlock(inserted);
    makeBlockDraggable(inserted);

    canvasBody.insertBefore(inserted, block.nextElementSibling);
    return;
  }

  // DUPLICATE
  if (e.target.classList.contains('tw-control-duplicate')) {
    saveHistory();
    const block = e.target.closest('.tw-block');

    const clone = block.cloneNode(true);

    assignBlockId(clone);
    enhanceBlock(clone);
    makeBlockDraggable(clone);

    canvasBody.insertBefore(clone, block.nextElementSibling);
    return;
  }
});



// -----------------------------------------------------
// Phase 13: Inspector (Load + Live Editing + Variants)
// -----------------------------------------------------
function loadInspector(block) {
  const type = block.dataset.type;
  const config = COMPONENTS[type];
  if (!config) return;

  // Hide all fields
  document.querySelectorAll('.tw-inspector-section input, .tw-inspector-section textarea, .tw-inspector-section select')
    .forEach(el => {
      const label = el.closest('label');
      if (label) label.style.display = 'none';
    });

  // Show + populate relevant fields
  config.inspector.forEach(field => {
    const input = document.querySelector(`[name="${field}"]`);
    if (input) {
      const label = input.closest('label');
      if (label) label.style.display = 'block';

      const slotSelector = config.slots[field];
      const slotEl = block.querySelector(slotSelector);
      input.value = slotEl ? slotEl.textContent : "";
    }
  });

  // Variant selector
  const variantSelect = document.querySelector('[name="variant"]');
  if (variantSelect) {
    const label = variantSelect.closest('label');
    if (label) label.style.display = 'block';
    variantSelect.value = block.dataset.variant || 'v1';
  }
}

// Live editing
document.querySelectorAll('.tw-inspector-section input, .tw-inspector-section textarea')
  .forEach(input => {
    input.addEventListener('input', e => {
      if (!selectedBlock) return;

      const type = selectedBlock.dataset.type;
      const config = COMPONENTS[type];
      if (!config) return;

      const field = e.target.name;
      const slotSelector = config.slots[field];
      const slotEl = selectedBlock.querySelector(slotSelector);

      if (slotEl) {
        slotEl.textContent = e.target.value;
      }
    });
  });

// Variant change handler
const variantSelect = document.querySelector('[name="variant"]');

if (variantSelect) {
  variantSelect.addEventListener('change', e => {
    if (!selectedBlock) return;

    const type = selectedBlock.dataset.type;
    const variant = e.target.value;
    const config = COMPONENTS[type];

    if (!config || !config.variants || !config.variants[variant]) return;

    const oldContent = {};
    for (const field of config.inspector) {
      const slot = config.slots[field];
      const el = selectedBlock.querySelector(slot);
      oldContent[field] = el ? el.textContent : "";
    }

    selectedBlock.outerHTML = config.variants[variant];

    const newBlock = canvasBody.querySelector(`[data-type="${type}"][data-variant="${variant}"]:last-child`) ||
                     canvasBody.lastElementChild;

    assignBlockId(newBlock);
    enhanceBlock(newBlock);
    makeBlockDraggable(newBlock);

    for (const field of config.inspector) {
      const slot = config.slots[field];
      const el = newBlock.querySelector(slot);
      if (el) el.textContent = oldContent[field];
    }

    selectedBlock = newBlock;
  });
}



// -----------------------------------------------------
// Phase 14: Page List (Switch, Add, Rename)
// -----------------------------------------------------
// Switch Pages + Menu Handling (Corrected)
document.querySelector('.tw-page-list').addEventListener('click', e => {
  const item = e.target.closest('.tw-page-item');
  if (!item) return;

  // Switch pages
  PAGES[currentPage] = canvasBody.innerHTML;
  currentPage = item.dataset.page;

  canvasBody.innerHTML = PAGES[currentPage] || "";

  canvasBody.querySelectorAll('.tw-block').forEach(block => {
    enhanceBlock(block);
    makeBlockDraggable(block);
  });

  document.querySelectorAll('.tw-page-item').forEach(btn => btn.classList.remove('active'));
  item.classList.add('active');
});

// Add New Page (Corrected)
document.getElementById('tw-add-page').addEventListener('click', () => {
  const name = prompt("Page name:");
  if (!name) return;

  if (PAGES[name]) {
    alert("A page with that name already exists.");
    return;
  }

  PAGES[name] = "";

  const item = document.createElement('div');
  item.className = 'tw-page-item';
  item.dataset.page = name;
  item.innerHTML = `
    <span class="tw-page-name">${name}</span>
    <button class="tw-page-menu">⋮</button>
  `;

  const addBtn = document.getElementById('tw-add-page');
  document.querySelector('.tw-page-list').insertBefore(item, addBtn);
});

// Rename Page
function renamePage(oldName) {
  const newName = prompt("Enter a new page name:", oldName);
  if (!newName || newName === oldName) return;

  PAGES[newName] = PAGES[oldName];
  delete PAGES[oldName];

  const pageItem = document.querySelector(`.tw-page-item[data-page="${oldName}"]`);
  if (pageItem) {
    pageItem.dataset.page = newName;
    const nameSpan = pageItem.querySelector('.tw-page-name');
    if (nameSpan) nameSpan.textContent = newName;
  }

  if (currentPage === oldName) {
    currentPage = newName;
  }
}



// -----------------------------------------------------
// Phase 15: Global Styles (Live Theme)
// -----------------------------------------------------
function applyGlobalStyles() {
  const root = document.documentElement;

  root.style.setProperty('--tw-font-family', GLOBAL_STYLES.fontFamily);
  root.style.setProperty('--tw-base-color', GLOBAL_STYLES.baseColor);
  root.style.setProperty('--tw-accent-color', GLOBAL_STYLES.accentColor);
  root.style.setProperty('--tw-bg-color', GLOBAL_STYLES.backgroundColor);
  root.style.setProperty('--tw-spacing', GLOBAL_STYLES.spacing + "px");
}

document.querySelector('[name="global-font"]').addEventListener('change', e => {
  GLOBAL_STYLES.fontFamily = e.target.value;
  applyGlobalStyles();
});

document.querySelector('[name="global-base-color"]').addEventListener('input', e => {
  GLOBAL_STYLES.baseColor = e.target.value;
  applyGlobalStyles();
});

document.querySelector('[name="global-accent-color"]').addEventListener('input', e => {
  GLOBAL_STYLES.accentColor = e.target.value;
  applyGlobalStyles();
});

document.querySelector('[name="global-bg-color"]').addEventListener('input', e => {
  GLOBAL_STYLES.backgroundColor = e.target.value;
  applyGlobalStyles();
});

document.querySelector('[name="global-spacing"]').addEventListener('input', e => {
  GLOBAL_STYLES.spacing = parseInt(e.target.value, 10);
  applyGlobalStyles();
});

applyGlobalStyles();


// -----------------------------------------------------
// Phase 16: Page Reordering (Safe Implementation)
// -----------------------------------------------------
// Simple up/down reordering for pages in the left list.
// (We can upgrade to drag-to-reorder later.)
function movePageUp(pageName) {
  const list = document.querySelector('.tw-page-list');
  const item = list.querySelector(`.tw-page-item[data-page="${pageName}"]`);
  if (!item) return;

  const prev = item.previousElementSibling;
  // Don't move above the header or before the "+ Add Page" button
  if (!prev || prev.id === 'tw-add-page') return;

  list.insertBefore(item, prev);
}

function movePageDown(pageName) {
  const list = document.querySelector('.tw-page-list');
  const item = list.querySelector(`.tw-page-item[data-page="${pageName}"]`);
  if (!item) return;

  const next = item.nextElementSibling;
  if (!next || next.id === 'tw-add-page') return;

  list.insertBefore(next, item);
}

// NOTE: UI hooks (buttons or context menu) for movePageUp/movePageDown
// can be added later. Functions are ready to be wired.


// -----------------------------------------------------
// Phase 17: Page Duplication / Deletion (Safe Implementation)
// -----------------------------------------------------
function duplicatePage(oldName) {
  if (!PAGES[oldName]) return;

  let copyName = oldName + " Copy";
  let counter = 2;
  while (PAGES[copyName]) {
    copyName = `${oldName} Copy ${counter++}`;
  }

  // Duplicate content
  PAGES[copyName] = PAGES[oldName];

  // Create UI element
  const item = document.createElement('div');
  item.className = 'tw-page-item';
  item.dataset.page = copyName;
  item.innerHTML = `
    <span class="tw-page-name">${copyName}</span>
    <button class="tw-page-menu">⋮</button>
  `;

  const addBtn = document.getElementById('tw-add-page');
  document.querySelector('.tw-page-list').insertBefore(item, addBtn);
}

function deletePage(name) {
  // Never allow deleting the last page
  const pageItems = document.querySelectorAll('.tw-page-item');
  if (pageItems.length <= 1) {
    alert("You must have at least one page.");
    return;
  }

  if (!PAGES[name]) return;

  const confirmDelete = confirm(`Delete page "${name}"? This cannot be undone.`);
  if (!confirmDelete) return;

  delete PAGES[name];

  const item = document.querySelector(`.tw-page-item[data-page="${name}"]`);
  if (item) item.remove();

  // If we deleted the current page, switch to the first remaining
  if (currentPage === name) {
    const first = document.querySelector('.tw-page-item');
    if (first) {
      currentPage = first.dataset.page;
      canvasBody.innerHTML = PAGES[currentPage] || "";
      canvasBody.querySelectorAll('.tw-block').forEach(block => {
        enhanceBlock(block);
        makeBlockDraggable(block);
      });
      document.querySelectorAll('.tw-page-item').forEach(btn => btn.classList.remove('active'));
      first.classList.add('active');
    }
  }
}

// NOTE: We can later add a context menu on each page item:
// - Rename Page
// - Duplicate Page
// - Delete Page
// and wire them to renamePage / duplicatePage / deletePage.


// -----------------------------------------------------
// Phase 18: HTML Import (Placeholder / Stub)
// -----------------------------------------------------
// This will eventually:
// - Parse raw HTML
// - Detect known block patterns
// - Map them to COMPONENTS
// - Rebuild the canvas from imported markup
//
// For now, we keep a stub so the architecture is ready.

function importHTML(htmlString) {
  console.warn("[HTML Import] Not implemented yet.");
  // TODO:
  // 1. Create a temporary DOM container
  // 2. Query for known patterns (hero, section, etc.)
  // 3. Build blocks using templates + extracted content
  // 4. Insert into canvasBody
}


// -----------------------------------------------------
// Phase 19: Multi-Page Export (Placeholder / Stub)
// -----------------------------------------------------
// This will eventually:
// - Loop over PAGES
// - For each page, reconstruct a DOM
// - Apply global styles
// - Export a site bundle (HTML + CSS per page or shared)
// For now, we just define the shape.

function exportSiteBundle() {
  console.warn("[Site Export] Not implemented yet.");

  // Example future shape:
  // return {
  //   pages: Object.entries(PAGES).map(([name, html]) => ({
  //     name,
  //     html,
  //     css: exportCanvasCSS(), // or per-page CSS
  //   })),
  //   globalStyles: { ...GLOBAL_STYLES }
  // };
}


// -----------------------------------------------------
// Phase 20: Theme Presets (Safe Implementation)
// -----------------------------------------------------
const THEME_PRESETS = {
  "Default": {
    fontFamily: "system-ui",
    baseColor: "#f5f5f5",
    accentColor: "#00cc88",
    backgroundColor: "#0b0c10",
    spacing: 20
  },
  "Light": {
    fontFamily: "system-ui",
    baseColor: "#111111",
    accentColor: "#2563eb",
    backgroundColor: "#ffffff",
    spacing: 20
  },
  "Dark": {
    fontFamily: "system-ui",
    baseColor: "#f5f5f5",
    accentColor: "#3fe0b5",
    backgroundColor: "#05060a",
    spacing: 24
  },
  "Playful": {
    fontFamily: "system-ui",
    baseColor: "#111827",
    accentColor: "#ec4899",
    backgroundColor: "#fdf2f8",
    spacing: 18
  }
};

// Optional hook: apply a preset by name
function applyThemePreset(name) {
  const preset = THEME_PRESETS[name];
  if (!preset) {
    console.warn(`[Theme Preset] No preset named "${name}"`);
    return;
  }

  GLOBAL_STYLES.fontFamily = preset.fontFamily;
  GLOBAL_STYLES.baseColor = preset.baseColor;
  GLOBAL_STYLES.accentColor = preset.accentColor;
  GLOBAL_STYLES.backgroundColor = preset.backgroundColor;
  GLOBAL_STYLES.spacing = preset.spacing;

  applyGlobalStyles();

  // Optionally sync inspector controls if desired:
  const fontSelect = document.querySelector('[name="global-font"]');
  if (fontSelect) fontSelect.value = preset.fontFamily;

  const baseInput = document.querySelector('[name="global-base-color"]');
  if (baseInput) baseInput.value = preset.baseColor;

  const accentInput = document.querySelector('[name="global-accent-color"]');
  if (accentInput) accentInput.value = preset.accentColor;

  const bgInput = document.querySelector('[name="global-bg-color"]');
  if (bgInput) bgInput.value = preset.backgroundColor;

  const spacingInput = document.querySelector('[name="global-spacing"]');
  if (spacingInput) spacingInput.value = preset.spacing;
}

// -----------------------------------------------------
// Phase 28: Theme Preset UI (Full Implementation)
// -----------------------------------------------------

const themePresetSelect = document.querySelector('[name="global-theme-preset"]');

if (themePresetSelect) {
  themePresetSelect.addEventListener('change', e => {
    const preset = e.target.value;
    if (!preset) return;

    applyThemePreset(preset);

    // Mark autosave dirty
    autosaveDirty = true;
  });
}


// -----------------------------------------------------
// Phase 21: Component Presets (Placeholder / Light Stub)
// -----------------------------------------------------
// Idea:
// - Named presets for specific components (e.g., "Hero: SaaS", "Hero: Personal Brand")
// - Each preset is a content + variant configuration.

const COMPONENT_PRESETS = {
  hero: {
    "SaaS Landing": {
      variant: "v1",
      content: {
        title: "Run your entire workflow in one place",
        subtitle: "Tyniweb gives you a living, adaptive workspace that grows with your ideas.",
        cta: "Start Free"
      }
    },
    "Personal Brand": {
      variant: "v2",
      content: {
        title: "Hi, I’m Tyler — I build living systems.",
        subtitle: "I design platforms that remember, adapt, and grow with you.",
        cta: "Work With Me"
      }
    }
  }
  // More component presets can be added later.
};

// Apply a preset to the currently selected block (if compatible)
function applyComponentPreset(componentType, presetName) {
  if (!selectedBlock) return;

  const type = selectedBlock.dataset.type;
  if (type !== componentType) {
    console.warn(`[Component Preset] Selected block is "${type}", preset is for "${componentType}"`);
    return;
  }

  const presetsForType = COMPONENT_PRESETS[componentType];
  if (!presetsForType) return;

  const preset = presetsForType[presetName];
  if (!preset) return;

  const config = COMPONENTS[componentType];
  if (!config) return;

  // Apply variant if defined
  if (preset.variant && config.variants && config.variants[preset.variant]) {
    // This reuses the variant swap logic via the select
    const variantSelect = document.querySelector('[name="variant"]');
    if (variantSelect) {
      variantSelect.value = preset.variant;
      variantSelect.dispatchEvent(new Event('change'));
    }
  }

  // Apply content
  Object.entries(preset.content).forEach(([field, value]) => {
    const slotSelector = config.slots[field];
    const slotEl = selectedBlock.querySelector(slotSelector);
    if (slotEl) slotEl.textContent = value;

    const input = document.querySelector(`[name="${field}"]`);
    if (input) input.value = value;
  });
}

// NOTE: Later we can add a "Presets" dropdown in the inspector
// that calls applyComponentPreset(type, presetName).


// -----------------------------------------------------
// Phase 22: AI Content (Placeholder / Stub)
// -----------------------------------------------------
// This will eventually:
// - Take context (block type, page type, user tone)
// - Call an AI backend
// - Inject generated copy into the selected block

async function generateAIContentForBlock(block, options = {}) {
  console.warn("[AI Content] Not implemented. Stub only.", { block, options });

  // Example future shape:
  // const response = await fetch("/api/ai/content", { ... });
  // const data = await response.json();
  // apply to block slots...
}

// Convenience wrapper for current selection
async function generateAIContentForSelection(options = {}) {
  if (!selectedBlock) {
    console.warn("[AI Content] No block selected.");
    return;
  }
  await generateAIContentForBlock(selectedBlock, options);
}


// -----------------------------------------------------
// Phase 23: AI Layout (Placeholder / Stub)
// -----------------------------------------------------
// This will eventually:
// - Generate an entire layout for a page
// - Choose components + order
// - Fill with starter content

async function generateAILayoutForPage(pageType = "landing") {
  console.warn("[AI Layout] Not implemented. Stub only.", { pageType });

  // Example future shape:
  // 1. Call backend with pageType + preferences
  // 2. Receive a list of blocks + content
  // 3. Clear canvasBody
  // 4. Build blocks using templates + content
  // 5. Enhance + make draggable
}


// Phase 24: Autosave (Placeholder)
// function setupAutosave() { /* TODO */ }

// Phase 25: Collaboration Hooks (Placeholder)
// function initCollaboration() { /* TODO */ }

// Phase 26: Publishing Pipeline (Placeholder)
// function publishSite() { /* TODO */ }


// -----------------------------------------------------
// Phase 24: Autosave (Safe Implementation)
// -----------------------------------------------------

// LocalStorage keys
const AUTOSAVE_KEY = "tyniweb_autosave_pages";
const AUTOSAVE_GLOBAL_KEY = "tyniweb_autosave_global_styles";
const AUTOSAVE_CURRENT_PAGE_KEY = "tyniweb_autosave_current_page";

// Track whether changes occurred
let autosaveDirty = false;

// Mark editor as dirty on any meaningful change
function markDirty() {
  autosaveDirty = true;
}

// Hook into existing systems
// Block changes
canvasBody.addEventListener("input", markDirty);
canvasBody.addEventListener("drop", markDirty);
canvasBody.addEventListener("click", e => {
  if (e.target.closest(".tw-control-delete") ||
      e.target.closest(".tw-control-duplicate") ||
      e.target.closest(".tw-add-above") ||
      e.target.closest(".tw-add-below") ||
      e.target.closest(".tw-control-up") ||
      e.target.closest(".tw-control-down")) {
    markDirty();
  }
});

// Inspector changes
document.querySelectorAll('.tw-inspector-section input, .tw-inspector-section textarea, .tw-inspector-section select')
  .forEach(el => el.addEventListener("input", markDirty));

// Page switching
document.querySelector('.tw-page-list').addEventListener("click", markDirty);

// Global styles
document.querySelectorAll('[name="global-font"], [name="global-base-color"], [name="global-accent-color"], [name="global-bg-color"], [name="global-spacing"]')
  .forEach(el => el.addEventListener("input", markDirty));


// Perform autosave
function autosaveNow() {
  if (!autosaveDirty) return;

  // Save current page content before writing to storage
  PAGES[currentPage] = canvasBody.innerHTML;

  // Save all pages
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(PAGES));

  // Save global styles
  localStorage.setItem(AUTOSAVE_GLOBAL_KEY, JSON.stringify(GLOBAL_STYLES));

  // Save current page
  localStorage.setItem(AUTOSAVE_CURRENT_PAGE_KEY, currentPage);

  autosaveDirty = false;
  console.log("[Autosave] Saved.");
}

// Autosave interval (every 2 seconds)
setInterval(autosaveNow, 2000);


// Load autosave on startup
function loadAutosave() {
  const savedPages = localStorage.getItem(AUTOSAVE_KEY);
  const savedGlobals = localStorage.getItem(AUTOSAVE_GLOBAL_KEY);
  const savedCurrentPage = localStorage.getItem(AUTOSAVE_CURRENT_PAGE_KEY);

  if (savedPages) {
    const parsed = JSON.parse(savedPages);
    Object.keys(parsed).forEach(name => {
      PAGES[name] = parsed[name];
    });
  }

  if (savedGlobals) {
    const parsed = JSON.parse(savedGlobals);
    Object.assign(GLOBAL_STYLES, parsed);
    applyGlobalStyles();
  }

  if (savedCurrentPage && PAGES[savedCurrentPage]) {
    currentPage = savedCurrentPage;
  }

  // Rebuild page list UI
  const list = document.querySelector('.tw-page-list');
  const addBtn = document.getElementById('tw-add-page');

  // Remove existing items except the add button
  list.querySelectorAll('.tw-page-item').forEach(el => el.remove());

  // Recreate items
  Object.keys(PAGES).forEach(name => {
    const item = document.createElement('div');
    item.className = 'tw-page-item';
    item.dataset.page = name;
    item.innerHTML = `
      <span class="tw-page-name">${name}</span>
      <button class="tw-page-menu">⋮</button>
    `;
    list.insertBefore(item, addBtn);
  });

  // Load current page content
  canvasBody.innerHTML = PAGES[currentPage] || "";

  // Rebuild blocks
  canvasBody.querySelectorAll('.tw-block').forEach(block => {
    enhanceBlock(block);
    makeBlockDraggable(block);
  });

  // Highlight active page
  const active = document.querySelector(`.tw-page-item[data-page="${currentPage}"]`);
  if (active) active.classList.add("active");

  console.log("[Autosave] Loaded.");
}

// Load autosave immediately
loadAutosave();


// -----------------------------------------------------
// Phase 25: Collaboration Hooks (Placeholder / Stub)
// -----------------------------------------------------
// This will eventually:
// - Connect to a real-time backend (WebSockets, WebRTC, etc.)
// - Sync block changes between multiple users
// - Show cursors, selections, presence indicators
// - Handle conflict resolution (CRDT or OT)
// - Provide shared undo/redo
//
// For now, we define the API surface only.

const COLLAB = {
  enabled: false,
  sessionId: null,
  userId: null,
  peers: {},

  init(sessionId) {
    console.warn("[Collaboration] init() called — stub only.", { sessionId });
    this.enabled = true;
    this.sessionId = sessionId;
    this.userId = "user-" + Math.random().toString(36).slice(2);
  },

  broadcastChange(change) {
    if (!this.enabled) return;
    console.warn("[Collaboration] broadcastChange() — stub only.", change);
  },

  receiveChange(change) {
    console.warn("[Collaboration] receiveChange() — stub only.", change);
    // TODO: apply incoming changes to canvas
  },

  disconnect() {
    console.warn("[Collaboration] disconnect() — stub only.");
    this.enabled = false;
  }
};

// Example future usage:
// COLLAB.init("session-123");
// COLLAB.broadcastChange({ type: "block-update", blockId: "block-5" });



// -----------------------------------------------------
// Phase 26: Publishing Pipeline (Placeholder / Stub)
// -----------------------------------------------------
// This will eventually:
// - Bundle all pages
// - Apply global styles
// - Generate a site manifest
// - Upload to hosting (S3, Netlify, Vercel, custom)
// - Provide a preview URL
// - Provide a publish URL
//
// For now, we define the API surface only.

const PUBLISH = {
  async buildSiteBundle() {
    console.warn("[Publish] buildSiteBundle() — stub only.");

    // Example future shape:
    // return {
    //   pages: Object.entries(PAGES).map(([name, html]) => ({
    //     name,
    //     html,
    //     css: exportCanvasCSS(),
    //   })),
    //   globalStyles: { ...GLOBAL_STYLES }
    // };
  },

  async uploadBundle(bundle) {
    console.warn("[Publish] uploadBundle() — stub only.", bundle);
    // TODO: send to backend
  },

  async publish() {
    console.warn("[Publish] publish() — stub only.");

    // Example future flow:
    // const bundle = await this.buildSiteBundle();
    // const result = await this.uploadBundle(bundle);
    // return result;
  }
};

// Example future usage:
// await PUBLISH.publish();

// -----------------------------------------------------
// Phase 27: Page Context Menu (Full Implementation)
// -----------------------------------------------------

// Create a floating context menu element
const pageContextMenu = document.createElement('div');
pageContextMenu.className = 'tw-page-context-menu';
pageContextMenu.style.position = 'absolute';
pageContextMenu.style.display = 'none';
pageContextMenu.style.background = '#1c1f2b';
pageContextMenu.style.border = '1px solid #2a2f40';
pageContextMenu.style.borderRadius = '6px';
pageContextMenu.style.padding = '6px 0';
pageContextMenu.style.zIndex = '9999';
pageContextMenu.style.minWidth = '140px';
pageContextMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
pageContextMenu.innerHTML = `
  <div class="tw-page-menu-item" data-action="rename">Rename</div>
  <div class="tw-page-menu-item" data-action="duplicate">Duplicate</div>
  <div class="tw-page-menu-item" data-action="move-up">Move Up</div>
  <div class="tw-page-menu-item" data-action="move-down">Move Down</div>
  <div class="tw-page-menu-item" data-action="delete" style="color:#ff6b6b;">Delete</div>
`;
document.body.appendChild(pageContextMenu);

// Style menu items
document.querySelectorAll('.tw-page-menu-item').forEach(item => {
  item.style.padding = '6px 12px';
  item.style.cursor = 'pointer';
  item.style.fontSize = '13px';
  item.addEventListener('mouseover', () => {
    item.style.background = '#2a2f40';
  });
  item.addEventListener('mouseout', () => {
    item.style.background = 'transparent';
  });
});

let contextTargetPage = null;

// Show context menu when clicking the ⋮ button
document.querySelector('.tw-page-list').addEventListener('click', e => {
  if (!e.target.classList.contains('tw-page-menu')) return;

  e.stopPropagation();
  e.preventDefault();

  const item = e.target.closest('.tw-page-item');
  if (!item) return;

  contextTargetPage = item.dataset.page;

  const rect = e.target.getBoundingClientRect();
  pageContextMenu.style.left = rect.right + 4 + 'px';
  pageContextMenu.style.top = rect.top + 'px';
  pageContextMenu.style.display = 'block';
});

// Hide menu when clicking anywhere else
document.addEventListener('click', () => {
  pageContextMenu.style.display = 'none';
});

// Handle menu actions
pageContextMenu.addEventListener('click', e => {
  const action = e.target.dataset.action;
  if (!action || !contextTargetPage) return;

  switch (action) {
    case 'rename':
      renamePage(contextTargetPage);
      break;
    case 'duplicate':
      duplicatePage(contextTargetPage);
      break;
    case 'move-up':
      movePageUp(contextTargetPage);
      break;
    case 'move-down':
      movePageDown(contextTargetPage);
      break;
    case 'delete':
      deletePage(contextTargetPage);
      break;
  }

  pageContextMenu.style.display = 'none';
});

// -----------------------------------------------------
// Phase 29: Component Preset UI (Full Implementation)
// -----------------------------------------------------

const presetSelect = document.querySelector('[name="component-preset"]');

// Populate preset dropdown based on selected block
function updatePresetDropdown(block) {
  if (!presetSelect) return;

  const type = block.dataset.type;
  const presets = COMPONENT_PRESETS[type];

  // Clear existing options
  presetSelect.innerHTML = `<option value="">None</option>`;

  if (!presets) {
    presetSelect.disabled = true;
    return;
  }

  presetSelect.disabled = false;

  // Add preset options
  Object.keys(presets).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    presetSelect.appendChild(opt);
  });
}

// When a block is selected, update preset dropdown
canvasBody.addEventListener('click', e => {
  const block = e.target.closest('.tw-block');
  if (!block) return;
  updatePresetDropdown(block);
});

// Apply preset when selected
if (presetSelect) {
  presetSelect.addEventListener('change', e => {
    const presetName = e.target.value;
    if (!presetName || !selectedBlock) return;

    const type = selectedBlock.dataset.type;
    applyComponentPreset(type, presetName);

    autosaveDirty = true;
  });
}

// -----------------------------------------------------
// Phase 30: AI Buttons (UI for AI Stubs)
// -----------------------------------------------------

const aiContentBtn = document.getElementById('tw-ai-generate-content');
const aiLayoutBtn = document.getElementById('tw-ai-generate-layout');

// AI Content for selected block
if (aiContentBtn) {
  aiContentBtn.addEventListener('click', async () => {

    if (!selectedBlock) {
      console.warn("[AI Content] No block selected.");
      return;
    }

    const identity = getIdentityProfile(); // Identity FIRST

    console.log("[AI Content] Generating content for:", selectedBlock.dataset.type);
    await generateAIContentForSelection(identity); // Pass identity in

    autosaveDirty = true;
  });
}

// AI Layout for current page
if (aiLayoutBtn) {
  aiLayoutBtn.addEventListener('click', async () => {

    const identity = getIdentityProfile(); // Identity FIRST

    console.log("[AI Layout] Generating layout for page:", currentPage);
    await generateAILayoutForPage("landing", identity); // Pass identity in

    autosaveDirty = true;
  });
}


// -----------------------------------------------------
// Phase 31: HTML Import (Safe Mode Activation)
// -----------------------------------------------------

const importBtn = document.getElementById('tw-import-html');
const importFileInput = document.getElementById('tw-import-html-file');

// Trigger file picker
if (importBtn && importFileInput) {
  importBtn.addEventListener('click', () => {
    importFileInput.click();
  });
}

// Handle file selection
if (importFileInput) {
  importFileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    safeImportHTML(text);
  });
}

// Safe import function
function safeImportHTML(htmlString) {
  console.log("[HTML Import] Starting safe import...");

  // Confirm overwrite
  const confirmImport = confirm(
    "Importing HTML will replace the current page content. Continue?"
  );
  if (!confirmImport) return;

  // Temporary DOM
  const temp = document.createElement('div');
  temp.innerHTML = htmlString;

  // Clear canvas
  canvasBody.innerHTML = "";

  // Find all known block types
  const knownTypes = Object.keys(COMPONENTS);

  temp.querySelectorAll('.tw-block').forEach(importedBlock => {
    const type = importedBlock.dataset.type;

    if (!knownTypes.includes(type)) {
      console.warn("[HTML Import] Unknown block type:", type);
      return;
    }

    // Use template for this block
    const template = COMPONENTS[type].variants.v1;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    const newBlock = wrapper.firstElementChild;

    // Fill slots
    const config = COMPONENTS[type];
    config.inspector.forEach(field => {
      const slotSelector = config.slots[field];
      const importedSlot = importedBlock.querySelector(slotSelector);
      const newSlot = newBlock.querySelector(slotSelector);

      if (importedSlot && newSlot) {
        newSlot.textContent = importedSlot.textContent;
      }
    });

    // Add to canvas
    canvasBody.appendChild(newBlock);

    // Enhance
    assignBlockId(newBlock);
    enhanceBlock(newBlock);
    makeBlockDraggable(newBlock);
  });

  autosaveDirty = true;

  console.log("[HTML Import] Completed.");
}

// -----------------------------------------------------
// Phase 32: Multi-Page Export Activation (Safe Mode)
// -----------------------------------------------------

const exportSiteBtn = document.getElementById('tw-export-site');
const exportModal = document.getElementById('tw-export-modal');
const exportOutput = document.getElementById('tw-export-output');
const exportClose = document.getElementById('tw-export-close');

if (exportSiteBtn) {
  exportSiteBtn.addEventListener('click', () => {
    const bundle = buildSiteBundle();
    exportOutput.value = JSON.stringify(bundle, null, 2);
    exportModal.style.display = 'flex';
  });
}

if (exportClose) {
  exportClose.addEventListener('click', () => {
    exportModal.style.display = 'none';
  });
}

function buildSiteBundle() {
  // Save current page before exporting
  PAGES[currentPage] = canvasBody.innerHTML;

  const pages = Object.entries(PAGES).map(([name, html]) => {
    // Rebuild DOM to strip editor UI
    const temp = document.createElement('div');
    temp.innerHTML = html;

    temp.querySelectorAll('.tw-block-controls').forEach(el => el.remove());
    temp.querySelectorAll('.tw-block-hoverbar').forEach(el => el.remove());
    temp.querySelectorAll('.tw-block-type').forEach(el => el.remove());

    temp.querySelectorAll('.tw-block').forEach(block => {
      block.removeAttribute('draggable');
      block.removeAttribute('data-block-id');
      block.classList.remove('tw-selected');
    });

    return {
      name,
      html: temp.innerHTML.trim(),
      css: exportCanvasCSS()
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    globalStyles: { ...GLOBAL_STYLES },
    pages
  };
}

// -----------------------------------------------------
// Phase 33: Publishing Pipeline UI (Safe Mode)
// -----------------------------------------------------

const publishBtn = document.getElementById('tw-publish-site');
const publishModal = document.getElementById('tw-publish-modal');
const publishOutput = document.getElementById('tw-publish-output');
const publishClose = document.getElementById('tw-publish-close');

if (publishBtn) {
  publishBtn.addEventListener('click', async () => {
    const bundle = buildSiteBundle(); // reuse from Phase 32
    console.log("[Publish] Simulated publish with bundle:", bundle);

    publishOutput.value = JSON.stringify({
      status: "ok",
      message: "Simulated publish successful.",
      bundlePreview: {
        generatedAt: bundle.generatedAt,
        pageCount: bundle.pages.length,
        pages: bundle.pages.map(p => p.name)
      }
    }, null, 2);

    publishModal.style.display = 'flex';
  });
}

if (publishClose) {
  publishClose.addEventListener('click', () => {
    publishModal.style.display = 'none';
  });
}

// -----------------------------------------------------
// Phase 34: Keyboard Shortcuts
// -----------------------------------------------------

document.addEventListener('keydown', e => {
  const meta = e.metaKey || e.ctrlKey;

  // Undo
  if (meta && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault();
    if (typeof undo === 'function') undo();
    return;
  }

  // Redo
  if ((meta && e.key.toLowerCase() === 'y') || (meta && e.shiftKey && e.key.toLowerCase() === 'z')) {
    e.preventDefault();
    if (typeof redo === 'function') redo();
    return;
  }

  if (!selectedBlock) return;

  // Duplicate block: Cmd/Ctrl + D
  if (meta && e.key.toLowerCase() === 'd') {
    e.preventDefault();
    if (typeof duplicateBlock === 'function') duplicateBlock(selectedBlock);
    autosaveDirty = true;
    return;
  }

  // Delete block: Backspace / Delete
  if (e.key === 'Backspace' || e.key === 'Delete') {
    const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (isInput) return;
    e.preventDefault();
    if (typeof deleteBlock === 'function') deleteBlock(selectedBlock);
    autosaveDirty = true;
    return;
  }

  // Move block up/down: Alt + ArrowUp/ArrowDown
  if (e.altKey && e.key === 'ArrowUp') {
    e.preventDefault();
    if (typeof moveBlockUp === 'function') moveBlockUp(selectedBlock);
    autosaveDirty = true;
    return;
  }

  if (e.altKey && e.key === 'ArrowDown') {
    e.preventDefault();
    if (typeof moveBlockDown === 'function') moveBlockDown(selectedBlock);
    autosaveDirty = true;
    return;
  }
});

// -----------------------------------------------------
// Phase 35: Block Quick-Add Menu
// -----------------------------------------------------

const quickAddMenu = document.createElement('div');
quickAddMenu.className = 'tw-quick-add-menu';
quickAddMenu.style.display = 'none';
document.body.appendChild(quickAddMenu);

let quickAddTarget = null;
let quickAddPosition = 'below'; // 'above' or 'below'

function buildQuickAddMenu() {
  quickAddMenu.innerHTML = '';
  Object.keys(COMPONENTS).forEach(type => {
    const item = document.createElement('div');
    item.className = 'tw-quick-add-item';
    item.dataset.type = type;
    item.textContent = COMPONENTS[type].label || type;
    quickAddMenu.appendChild(item);
  });
}

buildQuickAddMenu();

quickAddMenu.addEventListener('click', e => {
  const type = e.target.dataset.type;
  if (!type || !quickAddTarget) return;

  const config = COMPONENTS[type];
  if (!config) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = config.variants.v1;
  const newBlock = wrapper.firstElementChild;

  if (quickAddPosition === 'above') {
    quickAddTarget.parentNode.insertBefore(newBlock, quickAddTarget);
  } else {
    quickAddTarget.parentNode.insertBefore(newBlock, quickAddTarget.nextSibling);
  }

  assignBlockId(newBlock);
  enhanceBlock(newBlock);
  makeBlockDraggable(newBlock);

  autosaveDirty = true;
  quickAddMenu.style.display = 'none';
});

// Show quick-add when clicking existing add-above/add-below controls
canvasBody.addEventListener('click', e => {
  const addAbove = e.target.closest('.tw-add-above');
  const addBelow = e.target.closest('.tw-add-below');

  if (!addAbove && !addBelow) return;

  const block = e.target.closest('.tw-block');
  if (!block) return;

  quickAddTarget = block;
  quickAddPosition = addAbove ? 'above' : 'below';

  const rect = e.target.getBoundingClientRect();
  quickAddMenu.style.left = rect.left + 'px';
  quickAddMenu.style.top = rect.bottom + 4 + 'px';
  quickAddMenu.style.display = 'block';

  e.stopPropagation();
});

// Hide quick-add on outside click
document.addEventListener('click', () => {
  quickAddMenu.style.display = 'none';
});

// -----------------------------------------------------
// Phase 36: Empty Page Starter Templates
// -----------------------------------------------------

function showEmptyStateIfNeeded() {
  if (canvasBody.children.length > 0) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'tw-empty-state';
  wrapper.innerHTML = `
    <h2>Start this page</h2>
    <p>Choose a starter layout to drop in a ready-made structure.</p>
    <div class="tw-empty-state-buttons">
      <button data-template="saas-landing">SaaS Landing</button>
      <button data-template="personal-brand">Personal Brand</button>
      <button data-template="blank">Blank Page</button>
    </div>
  `;
  canvasBody.appendChild(wrapper);

  wrapper.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const template = btn.dataset.template;
      applyStarterTemplate(template);
    });
  });
}

function applyStarterTemplate(template) {
  canvasBody.innerHTML = "";

  function addBlock(type, variant = 'v1') {
    const config = COMPONENTS[type];
    if (!config) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = config.variants[variant] || config.variants.v1;
    const block = wrapper.firstElementChild;
    canvasBody.appendChild(block);
    assignBlockId(block);
    enhanceBlock(block);
    makeBlockDraggable(block);
  }

  if (template === 'saas-landing') {
    addBlock('hero');
    addBlock('feature-grid');
    addBlock('pricing');
    addBlock('cta');
    addBlock('footer');
  } else if (template === 'personal-brand') {
    addBlock('hero');
    addBlock('about');
    addBlock('testimonials');
    addBlock('cta');
    addBlock('footer');
  } else {
    // blank: do nothing, just leave empty
  }

  autosaveDirty = true;
}

// Call this after page load and after switching pages
showEmptyStateIfNeeded();

// -----------------------------------------------------
// Phase 37: Preview Mode Toggle
// -----------------------------------------------------

const previewToggleBtn = document.getElementById('tw-toggle-preview');
let isPreviewMode = false;

if (previewToggleBtn) {
  previewToggleBtn.addEventListener('click', () => {
    isPreviewMode = !isPreviewMode;

    if (isPreviewMode) {
      document.body.classList.add('tw-preview-mode');
      previewToggleBtn.textContent = 'Exit Preview';
    } else {
      document.body.classList.remove('tw-preview-mode');
      previewToggleBtn.textContent = 'Preview';
    }
  });
}


// -----------------------------------------------------
// Phase 38: Page Thumbnails (Static Previews)
// -----------------------------------------------------

function updatePageThumbnail(pageName) {
  const item = document.querySelector(`.tw-page-item[data-page="${pageName}"]`);
  if (!item) return;

  let thumb = item.querySelector('.tw-page-thumb');
  if (!thumb) {
    thumb = document.createElement('div');
    thumb.className = 'tw-page-thumb';
    thumb.innerHTML = `<div class="tw-page-thumb-inner"></div>`;
    item.appendChild(thumb);
  }

  const inner = thumb.querySelector('.tw-page-thumb-inner');
  if (!inner) return;

  const html = PAGES[pageName] || "";
  inner.innerHTML = html;
}

// Call after autosave
const _autosaveNow = autosaveNow;
autosaveNow = function() {
  _autosaveNow();
  Object.keys(PAGES).forEach(updatePageThumbnail);
};

// Call after loadAutosave finishes rebuilding pages
Object.keys(PAGES).forEach(updatePageThumbnail);

// -----------------------------------------------------
// Phase 39: Canvas Zoom Controls
// -----------------------------------------------------

const zoomInBtn = document.getElementById('tw-zoom-in');
const zoomOutBtn = document.getElementById('tw-zoom-out');
const zoomLevelLabel = document.getElementById('tw-zoom-level');

let twZoomLevel = 1;

function applyZoom() {
  canvasBody.style.transform = `scale(${twZoomLevel})`;
  canvasBody.style.transformOrigin = 'top center';
  if (zoomLevelLabel) {
    zoomLevelLabel.textContent = `${Math.round(twZoomLevel * 100)}%`;
  }
}

if (zoomInBtn) {
  zoomInBtn.addEventListener('click', () => {
    twZoomLevel = Math.min(2, twZoomLevel + 0.1);
    applyZoom();
  });
}

if (zoomOutBtn) {
  zoomOutBtn.addEventListener('click', () => {
    twZoomLevel = Math.max(0.5, twZoomLevel - 0.1);
    applyZoom();
  });
}

// Optional: reset zoom on double‑click label
if (zoomLevelLabel) {
  zoomLevelLabel.addEventListener('dblclick', () => {
    twZoomLevel = 1;
    applyZoom();
  });
}

applyZoom();


// -----------------------------------------------------
// Phase 40: Block Outline Toggle
// -----------------------------------------------------

const outlineToggleBtn = document.getElementById('tw-toggle-outlines');
let outlinesOn = false;

if (outlineToggleBtn) {
  outlineToggleBtn.addEventListener('click', () => {
    outlinesOn = !outlinesOn;
    if (outlinesOn) {
      document.body.classList.add('tw-outline-mode');
      outlineToggleBtn.textContent = 'Outlines On';
    } else {
      document.body.classList.remove('tw-outline-mode');
      outlineToggleBtn.textContent = 'Outlines';
    }
  });
}


// -----------------------------------------------------
// Phase 41: Global History Panel (UI Stub)
// -----------------------------------------------------

const historyPanel = document.getElementById('tw-history-panel');
const historyList = document.getElementById('tw-history-list');
const historyToggle = document.getElementById('tw-history-toggle');
const historyClose = document.getElementById('tw-history-close');

const TW_HISTORY_MAX = 20;
const twHistory = [];

function addHistoryEntry(label) {
  twHistory.unshift({
    label,
    time: new Date().toLocaleTimeString()
  });
  if (twHistory.length > TW_HISTORY_MAX) twHistory.pop();
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = '';
  twHistory.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `[${entry.time}] ${entry.label}`;
    historyList.appendChild(li);
  });
}

if (historyToggle && historyPanel) {
  historyToggle.addEventListener('click', () => {
    historyPanel.style.display = historyPanel.style.display === 'none' ? 'flex' : 'none';
  });
}

if (historyClose && historyPanel) {
  historyClose.addEventListener('click', () => {
    historyPanel.style.display = 'none';
  });
}

// Example: you can manually sprinkle these where you want:
// addHistoryEntry("Added block");
// addHistoryEntry("Switched page to Home");


// -----------------------------------------------------
// Identity Core UI Bindings
// -----------------------------------------------------
const identityArchetype = document.getElementById('tw-identity-archetype');
const identityVoice = document.getElementById('tw-identity-voice');
const identityPromise = document.getElementById('tw-identity-promise');

if (identityArchetype) {
  identityArchetype.value = IdentityCore.archetype;
  identityArchetype.addEventListener('change', () => {
    IdentityCore.archetype = identityArchetype.value;
  });
}

if (identityVoice) {
  identityVoice.value = IdentityCore.voice.tone;
  identityVoice.addEventListener('input', () => {
    IdentityCore.voice.tone = identityVoice.value;
  });
}

if (identityPromise) {
  identityPromise.value = IdentityCore.promise;
  identityPromise.addEventListener('input', () => {
    IdentityCore.promise = identityPromise.value;
  });
}

// -----------------------------------------------------
// Architect Dashboard Toggle
// -----------------------------------------------------

function showArchitectDashboard() {
  if (!dash) return;

  // Progress summary
  const prog = TeachingEngine.loadProgress();
  const track = TeachingEngine.tracks["architect-track"];
  const total = track.steps.length;
  const completed = Object.keys(prog.completedSteps).length;

  document.getElementById("tw-architect-progress").textContent =
    `${completed} of ${total} steps completed`;

  // Badges
  const badgeEl = document.getElementById("tw-architect-badges");
  badgeEl.innerHTML = (ArchitectBadges.getAll() || [])
    .map(b => `<span class="tw-badge">${b}</span>`)
    .join("");

  dash.style.display = "flex";
}

if (dashClose) {
  dashClose.addEventListener("click", () => {
    dash.style.display = "none";
  });
}

document.getElementById("tw-open-architect-dashboard")
  ?.addEventListener("click", showArchitectDashboard);

// Award when Architect Training is completed
if (TeachingEngine.currentTrack?.name === "Architect Training" &&
    TeachingEngine.currentStepIndex >= TeachingEngine.currentTrack.steps.length) {
  ArchitectBadges.award("Architect Training Complete");
}

// Award when Certification Exam is passed
function awardCertificationBadge() {
  ArchitectBadges.award("Certified Architect");
}

// -----------------------------------------------------
// Graduation Ceremony
// -----------------------------------------------------

function showGraduationCeremony() {
  if (!grad) return;
  grad.style.display = "flex";
}

if (gradClose) {
  gradClose.addEventListener("click", () => {
    grad.style.display = "none";
  });
}

function onArchitectExamPassed() {
  ArchitectBadges.award("Certified Architect");
  showGraduationCeremony();
}

// -----------------------------------------------------
// Member Dashboard
// -----------------------------------------------------

function showMemberDashboard() {
  if (!memberDash) return;

  const prog = TeachingEngine.loadProgress();
  const track = TeachingEngine.tracks["member-track"];
  const total = track.steps.length;
  const completed = Object.keys(prog.completedSteps).length;

  document.getElementById("tw-member-progress").textContent =
    `${completed} of ${total} steps completed`;

  const badgeEl = document.getElementById("tw-member-badges");
  badgeEl.innerHTML = (MemberBadges.getAll() || [])
    .map(b => `<span class="tw-badge">${b}</span>`)
    .join("");

  memberDash.style.display = "flex";
}

if (memberDashClose) {
  memberDashClose.addEventListener("click", () => {
    memberDash.style.display = "none";
  });
}

document.getElementById("tw-open-member-dashboard")
  ?.addEventListener("click", showMemberDashboard);

// -----------------------------------------------------
// Member Badge System
// -----------------------------------------------------
const MemberBadges = {
  storageKey: "tw-member-badges",

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(badges) {
    localStorage.setItem(this.storageKey, JSON.stringify(badges));
  },

  award(name) {
    const badges = this.load();
    if (!badges.includes(name)) {
      badges.push(name);
      this.save(badges);
      console.log("[MemberBadges] Awarded:", name);
    }
  },

  getAll() {
    return this.load();
  }
};

// Award when Member Training is completed
function onMemberTrainingComplete() {
  MemberBadges.award("Member Training Complete");
}

// -----------------------------------------------------
// Member Onboarding Path
// -----------------------------------------------------
TeachingEngine.registerTrack("member-onboarding", {
  name: "Member Onboarding",
  role: "member",
  steps: [

    {
      id: "welcome",
      title: "Welcome to Tyniweb",
      description: "Let’s get you comfortable editing your site.",
      target: "#tw-canvas",
      highlight: "pulse"
    },

    {
      id: "edit-text",
      title: "Edit Text",
      description: "Click any text block and edit it in the Inspector.",
      target: ".tw-inspector-section",
      highlight: "glow"
    },

    {
      id: "add-block",
      title: "Add a Block",
      description: "Add a Section or Hero from the Components panel.",
      target: ".tw-component-list",
      highlight: "pulse"
    },

    {
      id: "ai-help",
      title: "Use AI Help",
      description: "Generate content using the AI Tools.",
      target: "#tw-ai-generate-content",
      highlight: "glow"
    },

    {
      id: "preview",
      title: "Preview Your Work",
      description: "Use Publish → Preview to see your page.",
      target: "#tw-publish-site",
      highlight: "pulse"
    }

  ]
});

if (RoleSystem.getRole() === "member") {
  TeachingEngine.startTrack("member-onboarding");
}

// -----------------------------------------------------
// Member Celebration Modal
// -----------------------------------------------------

function showMemberCelebration() {
  if (!memCele) return;
  memCele.style.display = "flex";
}

if (memCeleClose) {
  memCeleClose.addEventListener("click", () => {
    memCele.style.display = "none";
  });
}

function onMemberTrainingComplete() {
  MemberBadges.award("Member Training Complete");
  showMemberCelebration();
}

// -----------------------------------------------------
// Portal Templates System
// -----------------------------------------------------
const PortalTemplates = {
  templates: {
    "Simple Site": {
      pages: ["Home", "About", "Contact"],
      layout: ["Hero", "Section", "Feature Row"]
    },
    "Landing Page": {
      pages: ["Landing"],
      layout: ["Hero", "Feature Row", "CTA"]
    },
    "Portfolio": {
      pages: ["Home", "Projects", "About"],
      layout: ["Hero", "Grid", "Section"]
    }
  },

  createPortalFromTemplate(name) {
    const tpl = this.templates[name];
    if (!tpl) return;

    const portal = PortalEngine.createPortal(name);

    tpl.pages.forEach(p => PortalEngine.addPage(p));
    PortalEngine.setActivePage(tpl.pages[0]);

    tpl.layout.forEach(block => {
      CanvasEngine.addBlock(block);
    });

    console.log("[PortalTemplates] Created portal:", name);
  }
};

document.getElementById("tw-new-portal-template")
  ?.addEventListener("click", () => {
    PortalTemplates.createPortalFromTemplate("Simple Site");
  });

// -----------------------------------------------------
// Smart Page Generator
// -----------------------------------------------------
const SmartPageGenerator = {
  generate(type = "default") {
    const identity = IdentityEngine.getIdentity();
    const theme = GLOBAL_STYLES.themePreset;

    const blocks = [];

    if (type === "homepage") {
      blocks.push("Hero");
      blocks.push("Feature Row");
      blocks.push("Section");
      blocks.push("CTA");
    }

    if (type === "about") {
      blocks.push("Hero");
      blocks.push("Text Block");
      blocks.push("Grid");
    }

    blocks.forEach(b => CanvasEngine.addBlock(b));

    console.log("[SmartPageGenerator] Generated page:", type);
  }
};

document.getElementById("tw-generate-page")
  ?.addEventListener("click", () => {
    SmartPageGenerator.generate("homepage");
  });


// -----------------------------------------------------
// Identity Wizard
// -----------------------------------------------------
const IdentityWizard = {
  run() {
    const archetype = prompt("Choose archetype (Guide, Creator, Sage):");
    const voice = prompt("Describe your voice tone:");
    const promise = prompt("What transformation do you offer?");

    IdentityEngine.setIdentity({
      archetype,
      voice,
      promise
    });

    console.log("[IdentityWizard] Identity updated.");
  }
};

document.getElementById("tw-identity-wizard")
  ?.addEventListener("click", () => IdentityWizard.run());

// -----------------------------------------------------
// Adaptive Suggestions Engine
// -----------------------------------------------------
const SuggestionsEngine = {
  lastContext: null,

  analyze() {
    const blocks = document.querySelectorAll(".tw-block").length;

    if (blocks === 0) {
      this.suggest("Try adding a Hero block to start your page.");
    }

    if (blocks > 3 && !GLOBAL_STYLES.themePreset) {
      this.suggest("Consider applying a theme preset for consistency.");
    }
  },

  suggest(msg) {
    if (this.lastContext === msg) return;
    this.lastContext = msg;
    console.log("[SuggestionsEngine]", msg);
  }
};

setInterval(() => SuggestionsEngine.analyze(), 3000);

