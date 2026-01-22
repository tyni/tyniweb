/* =====================================================
   SettingsCore — simple in-memory settings
===================================================== */

const SettingsCore = {
  data: {
    site: {
      extensions: {}
    }
  },

  save() {
    try {
      localStorage.setItem("tw-settings", JSON.stringify(this.data));
    } catch (e) {
      console.warn("Could not save settings", e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem("tw-settings");
      if (raw) this.data = JSON.parse(raw);
    } catch (e) {
      console.warn("Could not load settings", e);
    }
  }
};

SettingsCore.load();

/* =====================================================
   Extension Hooks
===================================================== */

const ExtensionHooks = {
  hooks: {},

  register(id, hooks) {
    this.hooks[id] = hooks;
  },

  call(id, hookName) {
    const extHooks = this.hooks[id];
    if (!extHooks) return;
    const fn = extHooks[hookName];
    if (typeof fn === "function") {
      try {
        fn();
      } catch (e) {
        console.error(`Error in hook ${hookName} for ${id}`, e);
      }
    }
  }
};

/* =====================================================
   Extension Registry — Metadata + Auto-Registration
===================================================== */

const ExtensionRegistry = {
  extensions: {},

  register(id, config) {
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

    if (!SettingsCore.data.site.extensions[id]) {
      SettingsCore.data.site.extensions[id] = config.enabledByDefault ?? true;
      SettingsCore.save();
    }

    if (config.hooks) {
      ExtensionHooks.register(id, config.hooks);
    }
  },

  list() {
    return Object.values(this.extensions);
  }
};

/* =====================================================
   Extension Loader — Executes Extension Code
===================================================== */

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
    if (this.loaded[id]) return;
    const ext = ExtensionRegistry.extensions[id];
    if (!ext) return;

    for (const dep of ext.dependencies) {
      if (!SettingsCore.data.site.extensions[dep]) {
        console.warn(`Extension "${id}" requires "${dep}" — enabling dependency.`);
        SettingsCore.data.site.extensions[dep] = true;
        SettingsCore.save();
      }
      await this.load(dep);
    }

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

/* =====================================================
   Command Deck — Global Command Registry
===================================================== */

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

/* =====================================================
   Block Engine — Metadata + Categories + Previews
===================================================== */

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
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const node = temp.firstElementChild;

    const canvas = BlockCanvas.canvas;
    if (!canvas) return;

    canvas.appendChild(node);
    BlockCanvas.render();
  }
};

BlockEngine.insertAtIndex = function(id, index) {
  const block = this.blocks[id];
  if (!block) return;

  const html = block.render();
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const node = temp.firstElementChild;

  const zones = BlockCanvas.canvas.querySelectorAll(".tw-drop-zone");
  const zone = zones[index];
  zone.insertAdjacentElement("afterend", node);

  BlockCanvas.render();
};

/* =====================================================
   DragManager — Tracks drag state
===================================================== */

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

/* =====================================================
   BlockCanvas — Unified Rendering + Drag + Drop Zones
===================================================== */

const BlockCanvas = {
  canvas: null,
  selectedBlock: null,

  init(selector = "#tw-editor-canvas") {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) return;
    this.render();
  },

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

    html.push(`<div class="tw-drop-zone" data-drop-index="${blocks.length}"></div>`);
    this.canvas.innerHTML = html.join("");
    this.bindEvents();
  },

  bindEvents() {
    const wrappers = this.canvas.querySelectorAll(".tw-block-wrapper");
    const zones = this.canvas.querySelectorAll(".tw-drop-zone");

    wrappers.forEach(wrapper => {
      wrapper.addEventListener("dragstart", () => {
        DragManager.startExisting(wrapper);
      });

      wrapper.addEventListener("click", () => {
        this.select(wrapper);
      });
    });

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

        if (DragManager.draggingBlockId) {
          BlockEngine.insertAtIndex(DragManager.draggingBlockId, index);
          DragManager.end();
          return;
        }

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
  },

  select(wrapper) {
    if (this.selectedBlock) {
      this.selectedBlock.classList.remove("selected");
    }
    this.selectedBlock = wrapper;
    wrapper.classList.add("selected");
    InspectorEngine.showFor(wrapper.dataset.block);
  }
};

/* =====================================================
   InspectorEngine — simple block inspector stub
===================================================== */

const InspectorEngine = {
  el: null,

  init() {
    this.el = document.getElementById("tw-inspector-content");
  },

  showFor(blockId) {
    if (!this.el) return;
    const block = BlockEngine.blocks[blockId];
    if (!block) {
      this.el.innerHTML = "<p>No block metadata.</p>";
      return;
    }

    this.el.innerHTML = `
      <h4>${block.name}</h4>
      <p style="opacity:0.7; font-size:13px;">${block.description}</p>
      <p style="font-size:12px; opacity:0.7;">Category: ${block.category}</p>
      <button class="tw-secondary small" onclick="CommandDeck.run('block.duplicate', '${blockId}')">Duplicate</button>
    `;
  }
};

/* =====================================================
   Block Picker Panel — UI Logic
===================================================== */

const BlockPicker = {
  panel: null,
  closeBtn: null,
  search: null,
  list: null,

  init() {
    this.panel = document.getElementById("tw-block-picker");
    this.closeBtn = document.getElementById("tw-block-picker-close");
    this.search = document.getElementById("tw-block-search");
    this.list = document.getElementById("tw-block-list");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.search) {
      this.search.addEventListener("input", () => {
        this.refresh(this.search.value);
      });
    }

    const btn = document.getElementById("tw-open-block-picker");
    if (btn) btn.addEventListener("click", () => this.open());
  },

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
      if (!blocks.length) return;

      const header = document.createElement("h4");
      header.textContent = category;
      this.list.appendChild(header);

      blocks.forEach(block => {
        const row = document.createElement("div");
        row.className = "tw-block-row";
        row.draggable = true;

        row.innerHTML = `
          <div style="font-size:20px;">${block.icon}</div>
          <div>
            <div style="font-size:14px;">${block.name}</div>
            <div style="opacity:0.6; font-size:12px;">${block.description}</div>
          </div>
        `;

        row.addEventListener("dragstart", () => {
          DragManager.startNew(block.id);
        });

        row.addEventListener("click", () => {
          BlockEngine.insert(block.id);
          this.close();
        });

        this.list.appendChild(row);
      });
    });
  }
};

/* =====================================================
   Command Palette — UI Logic
===================================================== */

const CommandPalette = {
  panel: null,
  input: null,
  list: null,

  init() {
    this.panel = document.getElementById("tw-command-palette");
    this.input = document.getElementById("tw-command-input");
    this.list = document.getElementById("tw-command-list");

    if (!this.panel) return;

    this.input.addEventListener("input", () => {
      this.refresh(this.input.value);
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") this.close();
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.open();
      }
    });

    const btn = document.getElementById("tw-open-command-palette");
    if (btn) btn.addEventListener("click", () => this.open());
  },

  open() {
    this.refresh();
    this.panel.style.display = "block";
    this.input.value = "";
    this.input.focus();
  },

  close() {
    this.panel.style.display = "none";
  },

  refresh(filter = "") {
    const cmds = CommandDeck.list().filter(cmd =>
      cmd.toLowerCase().includes(filter.toLowerCase())
    );

    this.list.innerHTML = cmds
      .map(cmd => `<div class="tw-command-item" data-cmd="${cmd}">${cmd}</div>`)
      .join("");

    this.list.querySelectorAll("[data-cmd]").forEach(el => {
      el.onclick = () => {
        CommandDeck.run(el.dataset.cmd);
        this.close();
      };
    });
  }
};

/* =====================================================
   Slash Menu — Type "/" to open contextual menu
===================================================== */

const SlashMenu = {
  menu: null,
  list: null,
  active: false,
  filter: "",

  init() {
    this.menu = document.getElementById("tw-slash-menu");
    this.list = document.getElementById("tw-slash-list");

    document.addEventListener("keydown", e => {
      if (e.key === "/") {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        this.open(rect.left, rect.bottom);
      }

      if (e.key === "Escape") this.close();

      if (this.active && e.key.length === 1) {
        this.filter += e.key;
        this.refresh();
      }

      if (this.active && e.key === "Backspace") {
        this.filter = this.filter.slice(0, -1);
        this.refresh();
      }
    });
  },

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

    const blocks = Object.keys(BlockEngine.blocks).filter(b =>
      b.toLowerCase().includes(this.filter.toLowerCase())
    );

    const items = [
      ...blocks.map(b => ({ type: "block", name: b })),
      ...commands.map(c => ({ type: "command", name: c }))
    ];

    this.list.innerHTML = items
      .map(item => `
        <div class="tw-slash-item" data-type="${item.type}" data-name="${item.name}">
          ${item.name}
        </div>
      `)
      .join("");

    this.list.querySelectorAll(".tw-slash-item").forEach(el => {
      el.onclick = () => {
        const type = el.dataset.type;
        const name = el.dataset.name;

        if (type === "command") CommandDeck.run(name);
        if (type === "block") BlockEngine.insert(name);

        this.close();
      };
    });
  }
};

/* =====================================================
   PanelEngine — Extension Panels (slide-over)
===================================================== */

const PanelEngine = {
  panels: {},

  register({ id, title, render }) {
    this.panels[id] = { id, title, render };
  },

  open(id) {
    const panel = this.panels[id];
    if (!panel) return;

    const container = document.getElementById("tw-extension-panel-container");
    if (!container) return;

    container.style.pointerEvents = "auto";
    container.innerHTML = `
      <div style="
        position: absolute;
        top: 0;
        right: 0;
        width: 420px;
        height: 100%;
        background: rgba(20,22,28,0.98);
        border-left: 1px solid rgba(255,255,255,0.12);
        padding: 20px;
        color: #fff;
        overflow-y: auto;
      ">
        <div class="tw-panel-header">
          <h2>${panel.title}</h2>
          <button id="tw-ext-panel-close" class="tw-icon-button">✕</button>
        </div>
        <div id="tw-ext-panel-content">${panel.render()}</div>
      </div>
    `;

    document.getElementById("tw-ext-panel-close").onclick = () => {
      container.innerHTML = "";
      container.style.pointerEvents = "none";
    };
  }
};

/* =====================================================
   Extension Details Panel — JS Wiring
===================================================== */

const ExtensionDetails = {
  panel: null,
  closeBtn: null,
  title: null,
  description: null,
  category: null,
  version: null,
  author: null,
  deps: null,
  toggleBtn: null,
  runTestsBtn: null,
  openPanelBtn: null,
  currentId: null,

  init() {
    this.panel = document.getElementById("tw-extension-details");
    this.closeBtn = document.getElementById("tw-ext-close");
    this.title = document.getElementById("tw-ext-title");
    this.description = document.getElementById("tw-ext-description");
    this.category = document.getElementById("tw-ext-category");
    this.version = document.getElementById("tw-ext-version");
    this.author = document.getElementById("tw-ext-author");
    this.deps = document.getElementById("tw-ext-deps");
    this.toggleBtn = document.getElementById("tw-ext-toggle");
    this.runTestsBtn = document.getElementById("tw-ext-run-tests");
    this.openPanelBtn = document.getElementById("tw-ext-open-panel");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    this.toggleBtn.addEventListener("click", () => {
      const id = this.currentId;
      const enabled = SettingsCore.data.site.extensions[id];
      SettingsCore.data.site.extensions[id] = !enabled;
      SettingsCore.save();
      document.dispatchEvent(new Event("settings:changed"));
      this.toggleBtn.textContent = !enabled ? "Disable" : "Enable";
    });

    this.runTestsBtn.addEventListener("click", () => {
      const ext = ExtensionRegistry.extensions[this.currentId];
      if (ext?.hooks?.tests) ext.hooks.tests();
    });

    this.openPanelBtn.addEventListener("click", () => {
      const ext = ExtensionRegistry.extensions[this.currentId];
      if (ext?.hooks?.openPanel) ext.hooks.openPanel();
    });
  },

  open(id) {
    const ext = ExtensionRegistry.extensions[id];
    if (!ext) return;

    this.currentId = id;
    this.title.textContent = ext.name;
    this.description.textContent = ext.description;
    this.category.textContent = ext.category;
    this.version.textContent = ext.version;
    this.author.textContent = ext.author;
    this.deps.textContent = ext.dependencies.length ? ext.dependencies.join(", ") : "None";

    const enabled = SettingsCore.data.site.extensions[id];
    this.toggleBtn.textContent = enabled ? "Disable" : "Enable";

    this.runTestsBtn.style.display = ext.hooks?.tests ? "block" : "none";
    this.openPanelBtn.style.display = ext.hooks?.openPanel ? "block" : "none";

    this.panel.style.display = "block";
  },

  close() {
    this.panel.style.display = "none";
  }
};

/* =====================================================
   Extensions Manager — With Categories
===================================================== */

const ExtensionsManager = {
  listEl: null,

  init() {
    this.listEl = document.getElementById("tw-extensions-list");
    if (!this.listEl) return;
    this.render();

    document.addEventListener("settings:changed", () => {
      this.render();
    });
  },

  render() {
    const extState = SettingsCore.data.site.extensions;
    const registry = ExtensionRegistry.extensions;

    const categories = {};
    Object.values(registry).forEach(ext => {
      if (!categories[ext.category]) categories[ext.category] = [];
      categories[ext.category].push(ext);
    });

    this.listEl.innerHTML = "";

    Object.keys(categories).forEach(category => {
      const header = document.createElement("h4");
      header.textContent = category;
      header.style.margin = "20px 0 10px";
      header.style.opacity = "0.8";
      header.style.fontSize = "13px";
      this.listEl.appendChild(header);

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

    this.listEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.addEventListener("change", () => {
        const key = cb.dataset.ext;
        SettingsCore.data.site.extensions[key] = cb.checked;
        SettingsCore.save();
        document.dispatchEvent(new Event("settings:changed"));
      });
    });

    this.listEl.querySelectorAll("[data-ext-details]").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.extDetails;
        ExtensionDetails.open(id);
      });
    });
  }
};

/* =====================================================
   Control Center wiring
===================================================== */

const ControlCenter = {
  init() {
    const cc = document.getElementById("tw-control-center");
    const openBtn = document.getElementById("tw-open-control-center");
    const closeBtn = document.getElementById("tw-cc-close");
    const tabs = document.querySelectorAll("#tw-cc-tabs button");
    const panels = document.querySelectorAll(".tw-cc-panel");

    if (openBtn) openBtn.onclick = () => (cc.style.display = "flex");
    if (closeBtn) closeBtn.onclick = () => (cc.style.display = "none");

    tabs.forEach(tab => {
      tab.onclick = () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        panels.forEach(p => {
          p.classList.toggle("active", p.dataset.tabPanel === target);
        });
      };
    });
  }
};

/* =====================================================
   Simple panels wiring (training, testing, portals, membership)
===================================================== */

function wireSimplePanel(openId, panelId, closeId) {
  const openBtn = document.getElementById(openId);
  const panel = document.getElementById(panelId);
  const closeBtn = document.getElementById(closeId);
  if (!openBtn || !panel || !closeBtn) return;
  openBtn.onclick = () => (panel.style.display = "block");
  closeBtn.onclick = () => (panel.style.display = "none");
}

/* =====================================================
   Built-in Extensions
===================================================== */

/* -------------------------
   AI Tools
------------------------- */

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
      CommandDeck.register("ai.generateSection", () => {
        alert("AI would generate a section here.");
      });
    },
    onEnable() {
      console.log("[AI Tools] Enabled");
    },
    onDisable() {
      console.log("[AI Tools] Disabled");
    }
  }
});

/* -------------------------
   Training System
------------------------- */

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
      console.log("[Training] Enabled");
    },
    onDisable() {
      console.log("[Training] Disabled");
    }
  }
});

/* -------------------------
   Portals
------------------------- */

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

/* -------------------------
   Membership System
------------------------- */

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

/* -------------------------
   GitHub Sync (simulated)
------------------------- */

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

/* -------------------------
   Magic Tools (with panel)
------------------------- */

ExtensionRegistry.register("magicTools", {
  name: "Magic Tools",
  description: "Adds a magic panel with fun tools.",
  category: "Fun",
  version: "1.0.0",
  author: "Tyniweb",
  enabledByDefault: true,
  hooks: {
    onInit() {
      PanelEngine.register({
        id: "magicToolsPanel",
        title: "Magic Tools",
        render: () => `
          <p>✨ Welcome to Magic Tools ✨</p>
          <button class="tw-primary small" onclick="alert('Magic!')">Cast Spell</button>
        `
      });

      CommandDeck.register("magic.openPanel", () => {
        PanelEngine.open("magicToolsPanel");
      });
    },
    openPanel() {
      PanelEngine.open("magicToolsPanel");
    }
  }
});

/* =====================================================
   Built-in Blocks
===================================================== */

BlockEngine.register("hero", {
  name: "Hero Section",
  category: "Layout",
  icon: "🖼️",
  description: "A large header section with title and subtitle.",
  preview: () => `<div style="padding:20px; background:#333;">Hero Preview</div>`,
  render: () => `
    <section class="hero">
      <h1>Hero Title</h1>
      <p>Hero subtitle goes here.</p>
    </section>
  `
});

BlockEngine.register("text", {
  name: "Text Block",
  category: "Content",
  icon: "✏️",
  description: "A simple paragraph of text.",
  render: () => `<p>New text block. Edit me.</p>`
});

BlockEngine.register("magic-block", {
  name: "Magic Block",
  category: "Fun",
  icon: "✨",
  description: "A fun magic block.",
  render: () => `<div class="magic-block">✨ Magic Block ✨</div>`
});

/* =====================================================
   Commands
===================================================== */

CommandDeck.register("block.duplicate", blockId => {
  const block = BlockEngine.blocks[blockId];
  if (!block) return;
  BlockEngine.insert(blockId);
});

/* =====================================================
   Initialization
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  // Core UI
  ControlCenter.init();
  ExtensionsManager.init();
  ExtensionDetails.init();
  BlockPicker.init();
  CommandPalette.init();
  SlashMenu.init();
  InspectorEngine.init();

  // Panels
  wireSimplePanel("tw-open-training", "tw-training-panel", "tw-training-close");
  wireSimplePanel("tw-open-testing", "tw-testing-panel", "tw-testing-close");
  wireSimplePanel("tw-open-portals", "tw-portals-panel", "tw-portals-close");
  wireSimplePanel("tw-open-membership", "tw-membership-panel", "tw-membership-close");

  // Canvas
  BlockCanvas.init();

  // Extensions
  await ExtensionLoader.loadAll();

  console.log("Tyniweb Editor Loaded");
});
