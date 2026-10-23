const money = n => n.toFixed(2).replace(".", ",") + " €";
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = c => { localStorage.setItem("cart", JSON.stringify(c)); updateCount(); };

function updateCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = getCart().reduce((s, i) => s + i.qty, 0);
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty++; else cart.push({ id, qty: 1 });
  saveCart(cart);
}

async function loadProducts() {
  const res = await fetch("products.json");
  return res.json();
}

async function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const products = await loadProducts();
  grid.innerHTML = products.map(p => `
    <div class="card">
      <div class="card-img">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p class="muted">${p.category}</p>
      <strong>${money(p.price)}</strong>
      <button class="btn" onclick="addToCart(${p.id}); this.textContent='Añadido ✓'">Añadir</button>
    </div>`).join("");
}

async function renderCart() {
  const box = document.getElementById("cart-items");
  if (!box) return;
  const products = await loadProducts();
  const cart = getCart();
  if (!cart.length) { box.innerHTML = "<p>Tu carrito está vacío.</p>"; return; }
  let total = 0;
  box.innerHTML = cart.map(i => {
    const p = products.find(x => x.id === i.id);
    total += p.price * i.qty;
    return `<div class="row"><span>${p.emoji} ${p.name} × ${i.qty}</span>
      <span>${money(p.price * i.qty)}
      <button class="del" onclick="removeItem(${i.id})">✕</button></span></div>`;
  }).join("") + `<h3 class="total">Total: ${money(total)}</h3>`;
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart();
}

updateCount();
renderProducts();
renderCart();
