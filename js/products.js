/* =========================================================
   Moonpure — product catalog + rendering + filter/search
   ========================================================= */

const IMG = {
  almond: "https://images.unsplash.com/photo-1615485737457-f07082c77813?auto=format&fit=crop&w=800&q=70",
  walnut: "https://images.unsplash.com/photo-1512905024369-fe9701b6d8f1?auto=format&fit=crop&w=800&q=70",
  pista:  "https://images.unsplash.com/photo-1551238875-13b9d38454db?auto=format&fit=crop&w=800&q=70",
};

const PRODUCTS = [
  { id: "p1", name: "Premium Almonds", urdu: "Badam", category: "nuts", price: 1250, unit: "kg", img: IMG.almond, tint: "" },
  { id: "p2", name: "California Walnuts", urdu: "Akhrot", category: "nuts", price: 1850, unit: "kg", img: IMG.walnut, tint: "" },
  { id: "p3", name: "Green Pistachios", urdu: "Pista", category: "nuts", price: 3200, unit: "kg", img: IMG.pista, tint: "" },
  { id: "p4", name: "Roasted Cashews", urdu: "Kaju", category: "nuts", price: 2200, unit: "kg", img: IMG.almond, tint: "tint-warm" },
  { id: "p5", name: "Soft Dates", urdu: "Khajoor", category: "dried", price: 950, unit: "kg", img: IMG.walnut, tint: "tint-rust" },
  { id: "p6", name: "Golden Raisins", urdu: "Kishmish", category: "dried", price: 750, unit: "kg", img: IMG.pista, tint: "tint-cool" },
  { id: "p7", name: "Dried Apricots", urdu: "Khubani", category: "dried", price: 890, unit: "kg", img: IMG.almond, tint: "tint-gold" },
  { id: "p8", name: "House Trail Mix", urdu: "Mix Dry Fruit", category: "dried", price: 1100, unit: "kg", img: IMG.walnut, tint: "tint-cool" },
  { id: "p9", name: "Eid Gift Box", urdu: "Tohfa", category: "gifts", price: 2800, unit: "box", img: IMG.pista, tint: "tint-warm" },
  { id: "p10", name: "Wedding Hamper", urdu: "Shaadi Hamper", category: "gifts", price: 3600, unit: "box", img: IMG.almond, tint: "" },
  { id: "p11", name: "Corporate Gift Set", urdu: "Corporate Box", category: "gifts", price: 4500, unit: "box", img: IMG.walnut, tint: "tint-gold" },
];

const CATEGORY_LABELS = { nuts: "Nuts", dried: "Dried Fruit", gifts: "Gift Pack" };

/* ---- Product card markup ---- */
function productCardHTML(p) {
  const tagClass = p.category === "gifts" ? "product-tag gift" : "product-tag";
  return `
    <article class="product-card" data-id="${p.id}" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
      <div class="thumb">
        <img src="${p.img}" alt="${p.name}" class="${p.tint}" loading="lazy">
        <span class="${tagClass}">${CATEGORY_LABELS[p.category]}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-urdu">${p.urdu}</p>
        <p class="product-price">Rs. ${p.price.toLocaleString()} <span style="font-size:0.7rem;color:var(--ink-soft);font-family:var(--font-body);">/ ${p.unit}</span></p>
        <div class="product-actions">
          <input type="number" class="qty-input" value="1" min="1" max="20" aria-label="Quantity for ${p.name}">
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${p.id}">Add to Order</button>
        </div>
      </div>
    </article>`;
}

/* ---- Render full product grid (products.html) with filter + search ---- */
function initProductGrid() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const chips = document.querySelectorAll(".chip[data-filter]");
  const searchInput = document.getElementById("productSearch");
  let activeFilter = "all";

  function render() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    const list = PRODUCTS.filter(p => {
      const matchesCategory = activeFilter === "all" || p.category === activeFilter;
      const matchesSearch = p.name.toLowerCase().includes(term) || p.urdu.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    grid.innerHTML = list.length
      ? list.map(productCardHTML).join("")
      : `<p class="no-results">No products match "${term}". Try a different search or category.</p>`;

    attachAddToCartHandlers(grid);
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeFilter = chip.dataset.filter;
      render();
    });
  });

  searchInput?.addEventListener("input", render);

  render();
}

/* ---- Render featured slider (index.html) ---- */
function initFeaturedSlider() {
  const track = document.getElementById("featuredTrack");
  if (!track) return;
  const featured = PRODUCTS.slice(0, 6);
  track.innerHTML = featured.map(productCardHTML).join("");
  attachAddToCartHandlers(track);

  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  prevBtn?.addEventListener("click", () => track.scrollBy({ left: -320, behavior: "smooth" }));
  nextBtn?.addEventListener("click", () => track.scrollBy({ left: 320, behavior: "smooth" }));
}

/* ---- Wire Add-to-cart buttons to cart.js ---- */
function attachAddToCartHandlers(scope) {
  scope.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const product = PRODUCTS.find(p => p.id === id);
      const card = btn.closest(".product-card");
      const qty = parseInt(card.querySelector(".qty-input").value, 10) || 1;
      if (typeof addToCart === "function") {
        addToCart(product, qty);
        if (typeof showToast === "function") showToast(`${product.name} added to your order list`);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProductGrid();
  initFeaturedSlider();
});
