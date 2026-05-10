// ===================== PWA INSTALL PROMPT =====================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

function showInstallPrompt() {
  const asked = localStorage.getItem('pwa_install_asked');
  const dismissed = localStorage.getItem('pwa_install_dismissed');

  if (asked === 'yes') return;
  if (dismissed) {
    const dismissedDate = new Date(dismissed);
    const now = new Date();
    const diffDays = (now - dismissedDate) / (1000 * 60 * 60 * 24);
    if (diffDays < 7) return;
  }

  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (navigator.standalone === true) return;

  const modal = document.createElement("div");
  modal.id = 'pwaInstallModal';
  modal.innerHTML = `
    <div class="pwa-overlay">
      <div class="pwa-box">
        <div class="pwa-icon">📲</div>
        <h3>Tambahkan ke Layar Utama?</h3>
        <p class="pwa-desc">
          Tambahkan <strong>WARUNG CT</strong> ke layar utama HP agar lebih cepat memesan di lain waktu.
        </p>
        <div class="pwa-benefits">
          <div class="pwa-benefit">⚡ Buka lebih cepat</div>
          <div class="pwa-benefit">📴 Bisa dipakai offline</div>
          <div class="pwa-benefit">💾 <strong>Tidak mengurangi memori HP</strong></div>
        </div>
        <button class="pwa-btn-yes" onclick="acceptInstall()">
          ✅ Ya, Tambahkan
        </button>
        <button class="pwa-btn-no" onclick="dismissInstall()">
          ❌ Nanti Saja
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function acceptInstall() {
  const modal = document.getElementById('pwaInstallModal');
  if (modal) modal.remove();

  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        localStorage.setItem('pwa_install_asked', 'yes');
        showToast('✅ WARUNG CT berhasil ditambahkan ke layar utama!');
      } else {
        dismissInstall();
      }
      deferredPrompt = null;
    });
  } else {
    showIOSTip();
  }
}

function dismissInstall() {
  const modal = document.getElementById('pwaInstallModal');
  if (modal) modal.remove();
  localStorage.setItem('pwa_install_dismissed', new Date().toISOString());
}

function showIOSTip() {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="pwa-overlay" onclick="this.remove()">
      <div class="pwa-box" onclick="event.stopPropagation()">
        <div class="pwa-icon">🍎</div>
        <h3>Tambahkan di iPhone</h3>
        <p class="pwa-desc">Tap tombol <strong>Share ⬆️</strong> di bawah, lalu pilih <strong>"Add to Home Screen"</strong>.</p>
        <button class="pwa-btn-yes" onclick="this.closest('.pwa-overlay').remove()">Mengerti</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = 'pwa-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
