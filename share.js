// ── SHARE & QR ──
function getBaseUrl() {
  if (window.location.protocol === 'file:') return '';
  return window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
}

function showShareModal() {
  const url = getBaseUrl() + 'index.html';
  const el = document.createElement('div');
  el.id = 'shareModal';
  el.innerHTML = `
    <div class="share-overlay" onclick="closeShareModal(event)">
      <div class="share-box" onclick="event.stopPropagation()">
        <h3>Bagikan Warung CT</h3>
        <div class="qr-wrap"><canvas id="qrCanvas"></canvas></div>
        <p class="share-url">${url || 'Buka file index.html'}</p>
        <button class="btn-copy" onclick="copyShareUrl()">Salin Link</button>
        <button class="btn-close" onclick="closeShareModal()">Tutup</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  generateQR(url || 'https://warung-ct.web.app');
}

function closeShareModal(e) {
  const m = document.getElementById('shareModal');
  if (m) m.remove();
}

function copyShareUrl() {
  const url = getBaseUrl() + 'index.html';
  navigator.clipboard.writeText(url).then(() => {
    const b = document.querySelector('.btn-copy');
    if (b) { b.textContent = '✅ Tersalin!'; setTimeout(() => b.textContent = 'Salin Link', 1800); }
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  });
}

function generateQR(text) {
  const canvas = document.getElementById('qrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 200;
  canvas.width = size; canvas.height = size;
  if (navigator.onLine && window.location.protocol !== 'file:') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => ctx.drawImage(img, 0, 0, size, size);
    img.onerror = () => _fallbackQR(ctx, size, text);
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  } else {
    _fallbackQR(ctx, size, text);
  }
}

function _fallbackQR(ctx, size, text) {
  ctx.fillStyle = '#1c1814'; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#c8913a'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('QR CODE', size/2, size/2 - 8);
  ctx.fillStyle = '#a08660'; ctx.font = '11px sans-serif';
  ctx.fillText(text.length > 30 ? text.substring(0,30)+'…' : text, size/2, size/2 + 12);
}
