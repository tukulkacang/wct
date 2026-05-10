// ── SHARE & QR ──
function getBaseUrl() {
  if (window.location.protocol === "file:") return "";
  return window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/");
}

function showShareModal() {
  const url = getBaseUrl() + "index.html";
  const modal = document.createElement("div");
  modal.id = "shareModal";
  modal.innerHTML = `
    <div class="share-overlay" onclick="closeShareModal(event)">
      <div class="share-box" onclick="event.stopPropagation()">
        <h3>Bagikan Warung CT</h3>
        <div class="qr-wrap"><canvas id="qrCanvas"></canvas></div>
        <p class="share-url">${url || "Buka file index.html"}</p>
        <button class="btn-copy" onclick="copyShareUrl()">📋 Salin Link</button>
        <button class="btn-close" onclick="closeShareModal()">Tutup</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  generateQR(url || "https://warung-ct.web.app");
}

function closeShareModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById("shareModal");
  if (modal) modal.remove();
}

function copyShareUrl() {
  const url = getBaseUrl() + "index.html";
  const btn = document.querySelector(".btn-copy");
  navigator.clipboard.writeText(url).then(() => {
    if (btn) { btn.textContent = "✅ Tersalin!"; setTimeout(() => btn.textContent = "📋 Salin Link", 1500); }
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = url; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); document.body.removeChild(ta);
    if (btn) { btn.textContent = "✅ Tersalin!"; setTimeout(() => btn.textContent = "📋 Salin Link", 1500); }
  });
}

function generateQR(text) {
  const canvas = document.getElementById("qrCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = 200; canvas.width = size; canvas.height = size;
  if (navigator.onLine && window.location.protocol !== "file:") {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => ctx.drawImage(img, 0, 0, size, size);
    img.onerror = () => drawFallbackQR(ctx, size, text);
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  } else drawFallbackQR(ctx, size, text);
}

function drawFallbackQR(ctx, size, text) {
  ctx.fillStyle = "#1d1812"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#c8913a"; ctx.font = "bold 13px serif"; ctx.textAlign = "center";
  ctx.fillText("QR CODE", size/2, size/2 - 10);
  ctx.font = "10px sans-serif"; ctx.fillStyle = "#9c8462";
  ctx.fillText(text.length > 28 ? text.substring(0,28)+"…" : text, size/2, size/2 + 12);
  ctx.strokeStyle = "#c8913a40"; ctx.lineWidth = 1;
  ctx.strokeRect(12, 12, size-24, size-24);
}
