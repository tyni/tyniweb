// 📄 PORTFOLIO — portfolio.js

document.addEventListener("DOMContentLoaded", () => {
  loadPortfolioItems();  // 🎨 Load public portfolio items
});

// 🎨 Load and display public portfolio items
async function loadPortfolioItems() {
  const container = document.getElementById("portfolioGrid");
  container.innerHTML = "<p>Loading portfolio...</p>";

  try {
    const response = await fetch("https://tynisigns.com/portfolio/manifest.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Manifest not found");
    }

    const items = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      console.warn("No portfolio items found. Loading demo content.");
      return renderPortfolio(getDemoItems());
    }

    renderPortfolio(items);
  } catch (err) {
    console.error("Portfolio load error:", err);
    container.innerHTML = "<p>Error loading portfolio.</p>";
  }
}

function getDemoItems() {
  return [
    {
      title: "Demo Image",
      description: "Placeholder image example",
      type: "image",
      url: "https://tynisigns.com/assets/images/demo.png"
    },
    {
      title: "Demo Video",
      description: "Placeholder video example",
      type: "video",
      url: "https://tynisigns.com/assets/videos/demo.mp4"
    },
    {
      title: "Demo 3D Model",
      description: "Placeholder 3D model example",
      type: "model",
      url: "https://tynisigns.com/assets/models/demo.glb"
    }
  ];
}


// 🖼️ Render portfolio items into the grid
function renderPortfolio(items) {
  const container = document.getElementById("portfolioGrid");
  container.innerHTML = "";

  items.forEach(item => {
    const section = document.createElement("section");
    section.className = "portfolio-block";
    section.setAttribute("data-aos", "fade-up");

    const title = `<h3>${item.title}</h3>`;
    const desc = `<p class="desc">${item.description}</p>`;
    let content = "";

    if (item.type === "image") {
      content = `
        <div class="portfolio-container">
          <img src="${item.url}" alt="${item.title}">
        </div>`;
    } else if (item.type === "video") {
      content = `
        <div class="portfolio-container">
          <video controls>
            <source src="${item.url}" type="video/mp4">
          </video>
        </div>`;
    } else if (item.type === "model") {
      content = `
        <div class="portfolio-container">
          <model-viewer src="${item.url}" auto-rotate camera-controls></model-viewer>
        </div>`;
    }

    section.innerHTML = `${title}${desc}${content}`;
    container.appendChild(section);
  });
}
