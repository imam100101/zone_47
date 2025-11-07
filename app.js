// Utility: format NGN
const fmt = (n) => "₦" + n.toLocaleString();

// State
let CART = JSON.parse(localStorage.getItem("CART") || "[]");
const els = {
  grid: document.getElementById("productGrid"),
  count: document.getElementById("cartCount"),
  drawer: document.getElementById("cartDrawer"),
  overlay: document.getElementById("overlay"),
  items: document.getElementById("cartItems"),
  subtotal: document.getElementById("subtotal"),
  search: document.getElementById("searchInput"),
  category: document.getElementById("categoryFilter"),
  sort: document.getElementById("sortSelect"),
  shopName: document.getElementById("shopName"),
  shopNameFooter: document.getElementById("shopNameFooter"),
  year: document.getElementById("year"),
  contactPhone: document.getElementById("contactPhone")
};

// Init text
els.shopName.textContent = window.SHOP_CONFIG.name;
els.shopNameFooter.textContent = window.SHOP_CONFIG.name;
els.contactPhone.textContent = window.SHOP_CONFIG.phone.replace(/^\+/, '+');
els.year.textContent = new Date().getFullYear();

function saveCart(){ localStorage.setItem("CART", JSON.stringify(CART)); }
function updateCount(){ els.count.textContent = CART.reduce((a,i)=>a+i.qty,0); }

function addToCart(p){
  const found = CART.find(i => i.id === p.id);
  if(found){ found.qty += 1; }
  else { CART.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 }); }
  saveCart(); updateCount(); renderCart();
}

function removeFromCart(id){
  CART = CART.filter(i => i.id !== id);
  saveCart(); updateCount(); renderCart();
}

function changeQty(id, delta){
  const it = CART.find(i => i.id === id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0){ removeFromCart(id); return; }
  saveCart(); updateCount(); renderCart();
}

function subtotal(){
  return CART.reduce((a,i)=> a + i.price * i.qty, 0);
}

function renderCart(){
  els.items.innerHTML = "";
  if(CART.length === 0){
    els.items.innerHTML = `<p class="muted">Your cart is empty.</p>`;
  } else {
    CART.forEach(it => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${it.img}" alt="">
        <div>
          <div><strong>${it.name}</strong></div>
          <div class="muted">${fmt(it.price)}</div>
          <div class="qty">
            <button aria-label="Decrease" onclick="changeQty('${it.id}', -1)">-</button>
            <span>${it.qty}</span>
            <button aria-label="Increase" onclick="changeQty('${it.id}', 1)">+</button>
            <button class="icon-btn" title="Remove" onclick="removeFromCart('${it.id}')">🗑️</button>
          </div>
        </div>
        <div><strong>${fmt(it.price * it.qty)}</strong></div>
      `;
      els.items.appendChild(row);
    });
  }
  els.subtotal.textContent = fmt(subtotal());
}

function openCart(){ els.drawer.classList.add("open"); els.overlay.classList.add("show"); renderCart(); }
function closeCart(){ els.drawer.classList.remove("open"); els.overlay.classList.remove("show"); }

// Product grid
function populateCategories(){
  const cats = Array.from(new Set(window.PRODUCTS.map(p => p.category))).sort();
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    els.category.appendChild(opt);
  });
}

function renderGrid(){
  const q = els.search.value.trim().toLowerCase();
  const cat = els.category.value;
  let list = window.PRODUCTS.slice();

  if(cat !== "all") list = list.filter(p => p.category === cat);
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q));

  const sort = els.sort.value;
  if(sort === "price-asc") list.sort((a,b)=> a.price - b.price);
  if(sort === "price-desc") list.sort((a,b)=> b.price - a.price);

  els.grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img loading="lazy" src="${p.img}" alt="${p.name}"/>
      <div class="content">
        <div class="muted">${p.category}</div>
        <div><strong>${p.name}</strong></div>
        <div class="price">${fmt(p.price)}</div>
        <div class="actions">
          <button class="btn" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
          <button class="btn primary" onclick='buyNow(${JSON.stringify(p)})'>Buy Now</button>
        </div>
      </div>
    `;
    els.grid.appendChild(card);
  });
}

function buyNow(p){
  // Add one to cart then open checkout
  addToCart(p);
  openCart();
}

function buildWAUrl(){
  const phone = window.SHOP_CONFIG.phone.replace(/\D/g,'');
  const items = CART.map(i => `• ${i.name} x${i.qty} — ${fmt(i.price * i.qty)}`).join('%0A');
  const total = fmt(subtotal());
  const text = `Hello, I want to place an order:%0A${items}%0A%0ATotal: ${total}%0AName:%0AAddress:%0ACity:%0APayment method: (Cash/Transfer)%0A`;
  return `https://wa.me/${phone}?text=${text}`;
}

// Events
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", () => {
  window.open(buildWAUrl(), "_blank");
});

els.overlay.addEventListener("click", closeCart);
[els.search, els.category, els.sort].forEach(el => el.addEventListener("input", renderGrid));

// Init
updateCount();
populateCategories();
renderGrid();
renderCart();
