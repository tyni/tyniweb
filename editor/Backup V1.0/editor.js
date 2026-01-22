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

    console.log("[AI Content] Generating content for:", selectedBlock.dataset.type);
    await generateAIContentForSelection();

    autosaveDirty = true;
  });
}

// AI Layout for current page
if (aiLayoutBtn) {
  aiLayoutBtn.addEventListener('click', async () => {
    console.log("[AI Layout] Generating layout for page:", currentPage);
    await generateAILayoutForPage("landing");

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


