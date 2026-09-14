/* =========================================================
   Moonpure — product catalog + rendering + filter/search
   ========================================================= */

const PRODUCTS = [
  { id: "p1", name: "Premium Almonds", urdu: "Badaam", category: "nuts", price: 1250, unit: "kg", img: "images/almonds.jpg", tint: "" },
  { id: "p2", name: "Roasted Cashews", urdu: "Kaju", category: "nuts", price: 2200, unit: "kg", img: "images/cashews.jpg", tint: "" },
  { id: "p3", name: "Walnuts", urdu: "Akhrot", category: "nuts", price: 1850, unit: "kg", img: "images/walnuts.jpg", tint: "" },
  { id: "p4", name: "Pumpkin Seeds", urdu: "Kaddu ke Beej", category: "nuts", price: 980, unit: "kg", img: "images/pumpkin-seeds.jpg", tint: "" },
  { id: "p5", name: "Premium Dates", urdu: "Mabroom", category: "dried", price: 1450, unit: "kg", img: "images/dates.jpg", tint: "" },
  { id: "p6", name: "Dried Figs", urdu: "Anjeer", category: "dried", price: 1650, unit: "kg", img: "images/figs.jpg", tint: "" },
  { id: "p7", name: "House Mixed Dry Fruit", urdu: "Mix Dry Fruit", category: "dried", price: 1350, unit: "kg", img: "images/mixed-dry-fruit.jpg", tint: "" },
  { id: "p8", name: "Green Pistachios", urdu: "Pista", category: "nuts", price: 3200, unit: "kg", img: "images/pistachios.jpg", tint: "" },
  { id: "p11", name: "Chia Seeds", urdu: "Chia Seeds", category: "nuts", price: 1450, unit: "kg", img: "images/chia-seeds.jpg", tint: "tint-cool" },
  { id: "p12", name: "Sunflower Seeds", urdu: "Surajmukhi ke Beej", category: "nuts", price: 850, unit: "kg", img: "https://images.unsplash.com/photo-1635843111961-06c71c3ed8cf?auto=format&fit=crop&w=800&q=70", tint: "" },
  { id: "p13", name: "Dried Apricots", urdu: "Khubani", category: "dried", price: 1150, unit: "kg", img: "https://images.unsplash.com/photo-1595412017587-b7f3117dff54?auto=format&fit=crop&w=800&q=70", tint: "" },
  { id: "p14", name: "Golden Raisins", urdu: "Kishmish", category: "dried", price: 780, unit: "kg", img: "images/raisins.jpg", tint: "" },
  { id: "p15", name: "Natural Jaggery", urdu: "Gur", category: "dried", price: 420, unit: "kg", img: "images/jaggery.jpg", tint: "" },
  { id: "p9", name: "Eid Gift Box", urdu: "Tohfa", category: "gifts", price: 2800, unit: "box", img: "images/eid-box.jpg", tint: "" },
  { id: "p10", name: "Premium Hamper", urdu: "Premium Hamper", category: "gifts", price: 3800, unit: "box", img: "images/mixed-dry-fruit.jpg", tint: "tint-gold" },
];

const CATEGORY_LABELS = { nuts: "Nuts & Seeds", dried: "Dried Fruit", gifts: "Gift Pack" };

/* ---- Hand-rolled fuzzy match (Levenshtein distance) ---- */

/**
 * Minimum number of single-character edits (insert, delete, substitute)
 * needed to turn string `a` into string `b`.
 * Uses one rolling row of the classic DP table — O(m×n) time, O(n) space.
 */
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array(n + 1);
  let curr = new Array(n + 1);

  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,       /* delete from a */
        curr[j - 1] + 1,   /* insert into a */
        prev[j - 1] + cost /* substitute */
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * Typo-tolerant match: exact substring first, then allow 1–2 edit distance.
 * Short queries (≤4 chars) allow 1 typo; longer queries allow 2.
 */
function fuzzyMatch(term, text) {
  if (!term) return true;
  if (text.includes(term)) return true;

  const maxDist = term.length <= 4 ? 1 : 2;

  if (levenshtein(term, text) <= maxDist) return true;

  /* Match each search word against any word in the product name */
  const termWords = term.split(/\s+/).filter(Boolean);
  const textWords = text.split(/\s+/);

  return termWords.every(tw =>
    textWords.some(word =>
      word.includes(tw) || levenshtein(tw, word) <= maxDist
    )
  );
}

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
      const matchesSearch =
        fuzzyMatch(term, p.name.toLowerCase()) ||
        fuzzyMatch(term, p.urdu.toLowerCase());
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
