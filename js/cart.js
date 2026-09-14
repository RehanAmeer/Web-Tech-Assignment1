/* =========================================================
   Moonpure — client-side order list ("cart")
   Persisted with localStorage. No backend involved.
   ========================================================= */

const CART_KEY = "moonpure_cart";
const WHATSAPP_NUMBER = "923001234567"; // demo number — replace with real store number

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(product, qty) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, unit: product.unit, img: product.img, qty });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(item => item.id !== id));
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(cart.filter(i => i.id !== id));
  } else {
    saveCart(cart);
  }
}

function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function renderCartDrawer() {
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!wrap) return;

  const cart = getCart();

  if (cart.length === 0) {
    wrap.innerHTML = `<p class="cart-empty">Your order list is empty.<br>Browse products and add a few favourites.</p>`;
  } else {
    wrap.innerHTML = cart.map(item => `
      <div class="cart-line" data-id="${item.id}">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-line-info">
          <strong>${item.name}</strong>
          <span>Rs. ${item.price.toLocaleString()} / ${item.unit}</span>
          <div class="cart-line-qty">
            <button class="qty-minus" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button class="qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-remove">Remove</button>
      </div>
    `).join("");
  }

  if (totalEl) totalEl.textContent = "Rs. " + cartTotal(cart).toLocaleString();

  wrap.querySelectorAll(".qty-minus").forEach(b => b.addEventListener("click", e => changeQty(e.target.closest(".cart-line").dataset.id, -1)));
  wrap.querySelectorAll(".qty-plus").forEach(b => b.addEventListener("click", e => changeQty(e.target.closest(".cart-line").dataset.id, 1)));
  wrap.querySelectorAll(".cart-remove").forEach(b => b.addEventListener("click", e => removeFromCart(e.target.closest(".cart-line").dataset.id)));
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("is-open");
  document.getElementById("cartOverlay")?.classList.add("is-open");
}
function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("is-open");
  document.getElementById("cartOverlay")?.classList.remove("is-open");
}

function buildWhatsAppOrderLink() {
  const cart = getCart();
  if (cart.length === 0) return null;
  let msg = "Hello Moonpure! I'd like to order:\n";
  cart.forEach(item => {
    msg += `- ${item.name} x${item.qty} (${item.unit})\n`;
  });
  msg += `Total: Rs. ${cartTotal(cart).toLocaleString()}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartDrawer();

  document.getElementById("openCartBtn")?.addEventListener("click", openCart);
  document.getElementById("closeCartBtn")?.addEventListener("click", closeCart);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCart);

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    const link = buildWhatsAppOrderLink();
    if (!link) {
      showToast("Add a few items to your order list first.");
      return;
    }
    window.open(link, "_blank");
  });
});
