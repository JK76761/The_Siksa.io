// js/cart.js
const CART_KEY = "deosigaya_cart";

// --- helpers ---
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

function formatWon(value) {
  // value는 숫자(원)
  return Number(value).toLocaleString("ko-KR");
}

// --- render ---
function renderCart() {
  const cart = loadCart();

  const cartEmpty = document.querySelector("#cartEmpty");
  const cartWrap = document.querySelector("#cartWrap");
  const cartBody = document.querySelector("#cartBody");
  const totalPriceEl = document.querySelector("#totalPrice");

  if (!cartBody || !totalPriceEl || !cartEmpty || !cartWrap) return;

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartWrap.style.display = "none";
    return;
  }

  cartEmpty.style.display = "none";
  cartWrap.style.display = "block";

  cartBody.innerHTML = "";

  let total = 0;

  for (const item of cart) {
    const price = Number(item.price || 0);
    const qty = Number(item.qty || 1);
    const line = price * qty;
    total += line;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td style="padding:10px;">
        <div style="font-weight:600;">${item.name}</div>
        <div style="opacity:.7; font-size:12px;">ID: ${item.id}</div>
      </td>

      <td style="padding:10px; text-align:right;">
        ${formatWon(price)}원
      </td>

      <td style="padding:10px; text-align:center;">
        <button class="qtyBtn" data-id="${item.id}" data-delta="-1" type="button">-</button>
        <span style="display:inline-block; min-width:32px; text-align:center;">${qty}</span>
        <button class="qtyBtn" data-id="${item.id}" data-delta="1" type="button">+</button>
      </td>

      <td style="padding:10px; text-align:right; font-weight:600;">
        ${formatWon(line)}원
      </td>

      <td style="padding:10px; text-align:center;">
        <button class="removeBtn btn" data-id="${item.id}" type="button">삭제</button>
      </td>
    `;

    cartBody.appendChild(tr);
  }

  totalPriceEl.textContent = formatWon(total);

  // 이벤트 바인딩
  document.querySelectorAll(".qtyBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const delta = Number(btn.dataset.delta);
      updateQty(id, delta);
    });
  });

  document.querySelectorAll(".removeBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      removeItem(id);
    });
  });
}

// --- actions ---
function updateQty(id, delta) {
  const cart = loadCart();
  const idx = cart.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) return;

  const nextQty = Number(cart[idx].qty || 1) + delta;
  if (nextQty <= 0) {
    // 0 이하로 내려가면 삭제
    cart.splice(idx, 1);
  } else {
    cart[idx].qty = nextQty;
  }

  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = loadCart().filter((x) => String(x.id) !== String(id));
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function checkoutPrototype() {
  const cart = loadCart();
  if (cart.length === 0) {
    alert("장바구니가 비어 있어요!");
    return;
  }

  // 지금은 서버 연동 전이라, 주문 동작은 '완료된 척'만
  alert("✅ 주문 완료(프로토)! 다음 단계에서 DB에 주문 저장으로 연결할게요.");
  clearCart();
}

// --- init ---
document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.querySelector("#clearBtn");
  const checkoutBtn = document.querySelector("#checkoutBtn");

  if (clearBtn) clearBtn.addEventListener("click", clearCart);
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkoutPrototype);

  renderCart();
});
