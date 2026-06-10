/* =====================================================
   YIBOHUY — pwa.js
   Nút cài app trên navbar — bấm khi muốn, không pop-up
   ===================================================== */

// ── 1. ĐĂNG KÝ SERVICE WORKER ──────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => {
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('🔄 Có bản mới! Tải lại để cập nhật.', 5000);
            }
          });
        });
      })
      .catch(() => {});
  });
}

// ── 2. NÚT CÀI APP ──────────────────────────────────
let deferredPrompt = null;
const installBtn = document.getElementById('pwa-install-btn');

// Khi trình duyệt sẵn sàng cho phép cài → hiện nút
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn?.style.setProperty('display', 'flex');
});

// Bấm nút → hỏi cài ngay
installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.style.display = 'none';
  if (outcome === 'accepted') {
    showToast('🎉 Yibohuy đã cài xong! Mở từ màn hình chính nhé.', 4000);
  }
});

// Ẩn nút sau khi đã cài
window.addEventListener('appinstalled', () => {
  installBtn.style.display = 'none';
  deferredPrompt = null;
});

// ── 3. TOAST ─────────────────────────────────────────
function showToast(msg, duration = 3000) {
  const t = document.createElement('div');
  t.className = 'pwa-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, duration);
}

// ── 4. SHORTCUT URL PARAM (?page=search) ────────────
document.addEventListener('DOMContentLoaded', () => {
  const p = new URLSearchParams(location.search).get('page');
  if (p && document.getElementById(`page-${p}`)) {
    navigateTo(p);
  }
});
