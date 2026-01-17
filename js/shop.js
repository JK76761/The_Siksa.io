// js/shop.js
const CART_KEY = "deosigaya_cart";

// ✅ 임시 상품 데이터
const PRODUCTS = [
  { id: 1, name: "설렁탕", price: 18, desc: "15분 · 2인분 · 담백", image: "./images/돼.jpg" },
  { id: 2, name: "육개장", price: 16.5, desc: "12분 · 2인분 · 얼큰", image: "./images/설.jpg" },
  { id: 3, name: "갈비탕", price: 14.9, desc: "20분 · 2~3인분 · 진한국물", image: "./images/설.jpg" },
  { id: 4, name: "국밥",   price: 19.9, desc: "18분 · 2인분 · 든든", image: "./images/설.jpg" },
  { id: 5, name: "비빔밥", price: 13.9, desc: "25분 · 2~3인분 · 고소", image: "./images/설.jpg" },
  { id: 6, name: "양념갈비", price: 21.9, desc: "15분 · 2인분 · 달짝", image: "./images/설.jpg" },
];

const $ = (sel) => document.querySelector(sel);

// -------------------- cart helpers --------------------
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ✅ AUD 달러 포맷 ($ 포함, 센트 2자리)
function formatAUD(value) {
  return Number(value).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
}

function setCartCount() {
  const cart = loadCart();
  const count = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
  const el = $("#cartCount");
  if (el) el.textContent = String(count);
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = loadCart();
  const idx = cart.findIndex((x) => x.id === productId);

  if (idx >= 0) cart[idx].qty = Number(cart[idx].qty || 1) + 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image });

  saveCart(cart);
  setCartCount();
  alert(`✅ 장바구니에 담았어요: ${product.name}`);
}

// -------------------- UI rendering --------------------
function renderProducts(list) {
  const grid = $("#productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach((p) => {
    const card = document.createElement("div");

    card.style.border = "1px solid rgba(0,0,0,.08)";
    card.style.borderRadius = "14px";
    card.style.padding = "12px";
    card.style.background = "white";
    card.style.boxShadow = "0 8px 20px rgba(0,0,0,.05)";

    card.innerHTML = `
      <div style="display:flex; gap:12px; align-items:center;">

        <!-- ✅ 작은 썸네일 -->
        <div style="
          width:92px;
          height:92px;
          flex:0 0 92px;
          overflow:hidden;
          border-radius:12px;
          background:#f2f2f2;
          border:1px solid rgba(0,0,0,.06);
        ">
          <img
            src="${p.image}"
            alt="${p.name}"
            style="width:100%; height:100%; object-fit:cover; display:block;"
            onerror="this.src='https://via.placeholder.com/200x200?text=No+Image';"
          />
        </div>

        <!-- 상품 정보 -->
        <div style="flex:1; min-width:0;">
          <div style="font-size:15px; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${p.name}
          </div>
          <div style="opacity:.75; font-size:12.5px; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${p.desc}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <div style="font-size:16px; font-weight:900;">${formatAUD(p.price)}</div>
            <button class="btn btn-primary addBtn" data-id="${p.id}" type="button">담기</button>
          </div>
        </div>

      </div>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll(".addBtn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

// -------------------- search/sort --------------------
function applyFilters() {
  const q = ($("#searchInput")?.value || "").trim().toLowerCase();
  const sort = $("#sortSelect")?.value || "new";

  let list = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));

  if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);

  renderProducts(list);
}

// -------------------- responsive grid --------------------
function updateGridCols() {
  const grid = $("#productGrid");
  if (!grid) return;

  const w = window.innerWidth;
  if (w < 740) grid.style.gridTemplateColumns = "1fr";
  else if (w < 1100) grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  else grid.style.gridTemplateColumns = "repeat(3, 1fr)";
}

// -------------------- init --------------------
document.addEventListener("DOMContentLoaded", () => {
  setCartCount();
  renderProducts(PRODUCTS);

  $("#searchInput")?.addEventListener("input", applyFilters);
  $("#sortSelect")?.addEventListener("change", applyFilters);

  updateGridCols();
  window.addEventListener("resize", updateGridCols);
});
