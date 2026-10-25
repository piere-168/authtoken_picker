// Nangkep header Authorization dari request ke *.paper.id.
// Dengerin 2 event biar nggak kelewat: onBeforeSendHeaders & onSendHeaders.

const FILTER = { urls: ["*://*.paper.id/*"] };

function handle(details) {
  const header = (details.requestHeaders || []).find(
    (h) => h.name.toLowerCase() === "authorization"
  );
  if (!header || !header.value) return;

  console.log("[AuthPicker] ketangkep:", details.method, details.url);

  chrome.storage.local.set({
    token: header.value,
    url: details.url,
    method: details.method,
    updatedAt: Date.now(),
  });

  chrome.action.setBadgeText({ text: "✓" });
  chrome.action.setBadgeBackgroundColor({ color: "#16a34a" });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  handle,
  FILTER,
  ["requestHeaders", "extraHeaders"]
);

chrome.webRequest.onSendHeaders.addListener(
  handle,
  FILTER,
  ["requestHeaders", "extraHeaders"]
);

console.log("[AuthPicker] service worker aktif, nungguin request ke *.paper.id");
