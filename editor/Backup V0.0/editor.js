// -----------------------------------------------------
// Phase 16: Global Styles
// -----------------------------------------------------
const GLOBAL_STYLES = {
  fontFamily: "system-ui",
  baseColor: "#f5f5f5",
  accentColor: "#00cc88",
  backgroundColor: "#0b0c10",
  spacing: 20
};

// -----------------------------------------------------
// 1. Component Templates
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
// Variant Templates (Phase 14)
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
// Phase 17: Expanded Component Templates
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

// -----------------------------------------------------
// Phase 17: Additional Component Templates
// -----------------------------------------------------

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
// Phase 15: Multi-Page System
// -----------------------------------------------------
const PAGES = {
  "Home": "",   // default page
};

let currentPage = "Home";


// -----------------------------------------------------
// 1B. Block Enhancement Helper (Phase 4)
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
  
  // Add block type badge
  const typeBadge = document.createElement('div');
  typeBadge.className = 'tw-block-type';
  typeBadge.textContent = block.dataset.type || 'Block';
  block.prepend(typeBadge);
}

// -----------------------------------------------------
// 1C. Assign Unique Block IDs (Phase 4 foundation)
// -----------------------------------------------------
let blockCounter = 0;

function assignBlockId(block) {
  block.dataset.blockId = 'block-' + (++blockCounter);
}

// -----------------------------------------------------
// 1D. Make Blocks Draggable (Phase 5 foundation)
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


// -----------------------------------------------------
// 1E. Update Block Type Badge (future-proof)
// -----------------------------------------------------
function updateBlockTypeBadge(block) {
  const badge = block.querySelector('.tw-block-type');
  if (badge) badge.textContent = block.dataset.type || 'Block';
}

// -----------------------------------------------------
// 1F. History System (Undo / Redo)
// -----------------------------------------------------
const history = [];
const future = [];

function saveHistory() {
  history.push(canvasBody.innerHTML);
  future.length = 0; // Clear redo stack
}

function restoreState(html) {
  canvasBody.innerHTML = html;

  // Rebuild all blocks (controls, drag, IDs)
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
// 1G. Save Canvas to JSON
// -----------------------------------------------------
function saveCanvas() {
  const blocks = [...canvasBody.querySelectorAll('.tw-block')];

  const data = blocks.map(block => {
    const type = block.dataset.type;
    const config = COMPONENTS[type];

    const content = {};

    // Extract slot content
    for (const field of config.inspector) {
      const slotSelector = config.slots[field];
      const el = block.querySelector(slotSelector);
      content[field] = el ? el.textContent : "";
    }

    return {
      type,
      content
    };
  });

  return JSON.stringify(data, null, 2);
}

// -----------------------------------------------------
// 1H. Load Canvas from JSON
// -----------------------------------------------------
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
      default:
        html = `<div class="tw-block" data-type="${item.type}">Unknown block</div>`;
    }

    canvasBody.insertAdjacentHTML("beforeend", html);
    const block = canvasBody.lastElementChild;

    assignBlockId(block);
    enhanceBlock(block);
    makeBlockDraggable(block);

    // Fill content
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
// 1I. Export Canvas to Clean HTML
// -----------------------------------------------------
function exportCanvasHTML() {
  // Clone canvas so we don't mutate the editor
  const clone = canvasBody.cloneNode(true);

  // Remove editor-only elements
  clone.querySelectorAll('.tw-block-controls').forEach(el => el.remove());
  clone.querySelectorAll('.tw-block-hoverbar').forEach(el => el.remove());
  clone.querySelectorAll('.tw-block-type').forEach(el => el.remove());

  // Remove editor-only attributes
  clone.querySelectorAll('.tw-block').forEach(block => {
    block.removeAttribute('draggable');
    block.removeAttribute('data-block-id');
    block.classList.remove('tw-selected');
  });

  return clone.innerHTML.trim();
}

// -----------------------------------------------------
// 1J. Export CSS for Canvas
// -----------------------------------------------------
function exportCanvasCSS() {
  // For now, we export the full editor.css as the page stylesheet.
  // Later we can minimize this to only used classes.
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
// 2. Make Component Buttons Draggable
// -----------------------------------------------------
document.querySelectorAll('.tw-component-item').forEach(btn => {
  btn.setAttribute('draggable', 'true');

  btn.addEventListener('dragstart', e => {
    e.dataTransfer.setData('component', btn.textContent.trim());
  });
});


// -----------------------------------------------------
// 3. Canvas Drop Logic
// -----------------------------------------------------
const canvasBody = document.querySelector('.tw-canvas-body');

// Unified dragover handler (reorder + allow component drop)
canvasBody.addEventListener('dragover', e => {
  e.preventDefault();

  // If dragging a block, run reorder logic
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

    return; // stop here — do NOT run component drop logic
  }

  // Otherwise: allow dropping new components
});


// Drop handler (ONLY for new components)
canvasBody.addEventListener('drop', e => {
  e.preventDefault();

  // If this is a block reorder, ignore component drop logic
  if (e.dataTransfer.types.includes('move-block')) return;

  const component = e.dataTransfer.getData('component');
  if (!component) return;

  // Remove empty state
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
// 4. Component Registry (Phase 3 + 17)
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
// 5. Selection Logic
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


// -----------------------------------------------------
// 5B. Block Controls: Delete / Move / Add / Duplicate
// -----------------------------------------------------
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
// 6. Load Inspector (Component-Specific)
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


// -----------------------------------------------------
// 7. Live Editing (Unified Logic)
// -----------------------------------------------------
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


// -----------------------------------------------------
// 10. Save / Load JSON
// -----------------------------------------------------
document.getElementById("tw-save-json").addEventListener("click", () => {
  const json = saveCanvas();
  document.getElementById("tw-json-area").value = json;
});

document.getElementById("tw-load-json").addEventListener("click", () => {
  const json = document.getElementById("tw-json-area").value.trim();
  if (json) loadCanvas(json);
});

// -----------------------------------------------------
// 11. Export HTML
// -----------------------------------------------------
document.getElementById("tw-export-html").addEventListener("click", () => {
  const html = exportCanvasHTML();
  document.getElementById("tw-html-area").value = html;
});

// -----------------------------------------------------
// 12. Export CSS
// -----------------------------------------------------
document.getElementById("tw-export-css").addEventListener("click", () => {
  const css = exportCanvasCSS();
  document.getElementById("tw-css-area").value = css;
});

// -----------------------------------------------------
// 13. Collapsible Inspector Sections
// -----------------------------------------------------
document.querySelectorAll('.tw-inspector-section h3').forEach(header => {
  header.addEventListener('click', () => {
    header.parentElement.classList.toggle('collapsed');
  });
});

// -----------------------------------------------------
// Variant Change Handler (Phase 14)
// -----------------------------------------------------
const variantSelect = document.querySelector('[name="variant"]');

if (variantSelect) {
  variantSelect.addEventListener('change', e => {
    if (!selectedBlock) return;

    const type = selectedBlock.dataset.type;
    const variant = e.target.value;
    const config = COMPONENTS[type];

    if (!config || !config.variants || !config.variants[variant]) return;

    // Save content before swap
    const oldContent = {};
    for (const field of config.inspector) {
      const slot = config.slots[field];
      const el = selectedBlock.querySelector(slot);
      oldContent[field] = el ? el.textContent : "";
    }

    // Replace block HTML
    selectedBlock.outerHTML = config.variants[variant];

    // Find the new block
    const newBlock = canvasBody.querySelector(`[data-variant="${variant}"]:last-child`);

    assignBlockId(newBlock);
    enhanceBlock(newBlock);
    makeBlockDraggable(newBlock);

    // Restore content
    for (const field of config.inspector) {
      const slot = config.slots[field];
      const el = newBlock.querySelector(slot);
      if (el) el.textContent = oldContent[field];
    }

    selectedBlock = newBlock;
  });
}

// -----------------------------------------------------
// Switch Pages + Menu Handling (Corrected)
// -----------------------------------------------------
document.querySelector('.tw-page-list').addEventListener('click', e => {
  const item = e.target.closest('.tw-page-item');
  if (!item) return;

  // If menu button clicked → rename
  if (e.target.classList.contains('tw-page-menu')) {
    renamePage(item.dataset.page);
    return;
  }

  // Otherwise → switch pages
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

// -----------------------------------------------------
// Add New Page (Corrected)
// -----------------------------------------------------
document.getElementById('tw-add-page').addEventListener('click', () => {
  const name = prompt("Page name:");
  if (!name) return;

  if (PAGES[name]) {
    alert("A page with that name already exists.");
    return;
  }

  // Create page entry
  PAGES[name] = "";

  // Create UI element
  const item = document.createElement('div');
  item.className = 'tw-page-item';
  item.dataset.page = name;
  item.innerHTML = `
    <span class="tw-page-name">${name}</span>
    <button class="tw-page-menu">⋮</button>
  `;

  // Insert before the "+ Add Page" button
  const addBtn = document.getElementById('tw-add-page');
  document.querySelector('.tw-page-list').insertBefore(item, addBtn);
});

// -----------------------------------------------------
// Rename Page
// -----------------------------------------------------
function renamePage(oldName) {
  const newName = prompt("Enter a new page name:", oldName);
  if (!newName || newName === oldName) return;

  // Move content to new key
  PAGES[newName] = PAGES[oldName];
  delete PAGES[oldName];

  // Update UI
  const pageItem = document.querySelector(`.tw-page-item[data-page="${oldName}"]`);
  if (pageItem) {
    pageItem.dataset.page = newName;
    pageItem.querySelector('.tw-page-name').textContent = newName;
  }

  // Update current page if needed
  if (currentPage === oldName) {
    currentPage = newName;
  }
}


// -----------------------------------------------------
// Phase 16: Apply Global Styles
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
