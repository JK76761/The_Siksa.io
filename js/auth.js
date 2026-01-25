// js/auth.js (GitHub Pages friendly)
const $ = (sel) => document.querySelector(sel);

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

function isDemoMode() {
  // GitHub Pages에서는 보통 API가 없으니까 데모 모드로 동작
  // (API_BASE를 실제 서버 URL로 바꾸면 자동으로 실서버 모드)
  return !window.API_BASE;
}

// -------------------- login.html --------------------
const loginBtn = $("#loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = $("#email")?.value.trim();
    const password = $("#password")?.value;

    if (!email || !password) {
      alert("이메일/비밀번호를 입력해주세요");
      return;
    }

    // ✅ 데모 모드: 서버 없이도 흐름 테스트 가능하게
    if (isDemoMode()) {
      alert("✅ 로그인 데모(서버 미연동)\n다음 화면(쇼핑)으로 이동합니다.");
      window.location.href = "shop.html";
      return;
    }

    try {
      const result = await postJSON(`${window.API_BASE}/api/auth/login`, { email, password });
      alert(`로그인 성공: ${result.user.name}`);
      window.location.href = "shop.html";
    } catch (e) {
      alert(`로그인 실패: ${e.message}`);
    }
  });
}

// -------------------- signup.html --------------------
const signupBtn = $("#signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const name = $("#name")?.value.trim();
    const email = $("#email")?.value.trim();
    const password = $("#password")?.value;
    const passwordConfirm = $("#passwordConfirm")?.value;

    if (!name || !email || !password) {
      alert("이름/이메일/비밀번호를 입력해주세요");
      return;
    }
    if (password.length < 8) {
      alert("비밀번호는 최소 8자 입니다");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호 확인이 일치하지 않습니다");
      return;
    }

    // 아직 서버 없음: 여기까지 동작하면 OK
    alert("✅ 회원가입 데모 성공! (다음 단계: 서버 API 연동)");
  });
}
