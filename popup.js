const $ = (id) => document.getElementById(id);

function render(data) {
  const { token, url, method, updatedAt } = data || {};
  if (!token) {
    $("source").textContent = "Belum ada token ketangkep.";
    $("token").value = "";
    $("meta").textContent = "";
    return;
  }

  // Tampilin tanpa prefix "Bearer " di textarea biar bersih.
  const raw = token.replace(/^Bearer\s+/i, "");
  $("token").value = raw;
  $("source").textContent = `${method || "GET"} ${url || ""}`;

  const when = updatedAt ? new Date(updatedAt).toLocaleString("id-ID") : "-";
  $("meta").textContent = `Terakhir ketangkep: ${when}`;
}

function load() {
  chrome.storage.local.get(["token", "url", "method", "updatedAt"], render);
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const old = btn.textContent;
    btn.textContent = "✓ Tersalin!";
    setTimeout(() => (btn.textContent = old), 1200);
  } catch (e) {
    // fallback
    const ta = $("token");
    ta.focus();
    ta.select();
    document.execCommand("copy");
  }
}

$("copy").addEventListener("click", (e) => {
  const v = $("token").value.trim();
  if (v) copyText(v, e.target);
});

$("copyBearer").addEventListener("click", (e) => {
  const v = $("token").value.trim();
  if (v) copyText("Bearer " + v, e.target);
});

$("clear").addEventListener("click", () => {
  chrome.storage.local.remove(["token", "url", "method", "updatedAt"], () => {
    chrome.action.setBadgeText({ text: "" });
    load();
  });
});

// Update realtime kalau token baru masuk pas popup lagi kebuka.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.token) load();
});

load();
