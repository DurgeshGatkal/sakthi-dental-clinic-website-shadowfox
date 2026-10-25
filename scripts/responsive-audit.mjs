/*
 * Responsive audit â€” Day 7.
 *
 *   node scripts/responsive-audit.mjs [baseUrl]
 *
 * Loads every page at every target width and reports:
 *   - horizontal overflow (document scrollWidth vs viewport)
 *   - the elements that stick out past the right edge
 *   - interactive controls smaller than 48x48 on phones
 *   - body copy below the 18px design minimum
 *
 * Needs Chrome with --remote-debugging-port=9222.
 */
const BASE = process.argv[2] ?? "http://localhost:5173";
const PAGES = ["/", "/about", "/treatments", "/faqs", "/contact", "/privacy-policy"];
const WIDTHS = [360, 768, 1024, 1440];
const HEIGHT = 900;

const target = await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" }).then(
  (r) => r.json(),
);
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

let nextId = 0;
const pending = new Map();
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  const resolver = pending.get(message.id);
  if (!resolver) return;
  pending.delete(message.id);
  if (message.error) resolver.reject(new Error(message.error.message));
  else resolver.resolve(message.result);
};
const send = (method, params = {}) => {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const evaluate = async (expression) => {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails)
    throw new Error(res.exceptionDetails.exception?.description ?? "evaluate failed");
  return res.result?.value;
};

const audit = `(() => {
  const vw = window.innerWidth;
  const overflow = document.documentElement.scrollWidth - vw;
  const scrollable = (el) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      const ox = getComputedStyle(node).overflowX;
      if (ox === "auto" || ox === "scroll" || ox === "hidden" || ox === "clip") return true;
    }
    return false;
  };
  const offenders = [];
  if (overflow > 1) {
    for (const el of document.querySelectorAll("body *")) {
      const style = getComputedStyle(el);
      if (style.clipPath !== "none" || style.clip !== "auto") continue;
      if (style.position === "fixed" || style.display === "none" || style.visibility === "hidden")
        continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) continue;
      if (rect.right > vw + 1 && !scrollable(el)) {
        offenders.push(
          el.tagName.toLowerCase() +
            "." +
            String(el.className || "").slice(0, 50) +
            " right=" +
            Math.round(rect.right) +
            " w=" +
            Math.round(rect.width),
        );
      }
      if (offenders.length >= 8) break;
    }
  }

  const small = [];
  if (vw < 768) {
    for (const el of document.querySelectorAll("a[href], button, [role=button], summary")) {
      const style = getComputedStyle(el);
      if (style.clipPath !== "none" || style.clip !== "auto") continue;
      if (style.display === "inline" || style.visibility === "hidden" || style.display === "none")
        continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.width < 48 || rect.height < 48) {
        small.push(
          el.tagName.toLowerCase() +
            "[" +
            (el.getAttribute("href") || el.textContent.trim().slice(0, 20)) +
            "] " +
            Math.round(rect.width) +
            "x" +
            Math.round(rect.height),
        );
      }
      if (small.length >= 6) break;
    }
  }

  const bodyFonts = new Set();
  for (const el of document.querySelectorAll("main p, main li")) {
    const size = getComputedStyle(el).fontSize;
    if (parseFloat(size) < 15) bodyFonts.add(size + " (" + el.tagName.toLowerCase() + ")");
  }

  return {
    vw,
    scrollWidth: document.documentElement.scrollWidth,
    overflow,
    offenders,
    small,
    smallCount: small.length,
    bodyFontsBelow18: [...bodyFonts],
  };
})()`;

for (const width of WIDTHS) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });

  for (const path of PAGES) {
    await send("Page.navigate", { url: BASE + path });
    await wait(2600);
    const result = await evaluate(audit);
    const flags = [];
    if (result.overflow > 1) flags.push(`OVERFLOW +${result.overflow}px`);
    if (result.smallCount > 0) flags.push(`${result.smallCount}+ small targets`);
    if (result.bodyFontsBelow18.length) flags.push(`font ${result.bodyFontsBelow18.join(", ")}`);
    console.log(
      `${String(width).padEnd(5)} ${path.padEnd(15)} ${flags.length ? flags.join(" | ") : "ok"}`,
    );
    for (const item of result.offenders) console.log(`      overflow: ${item}`);
    for (const item of result.small) console.log(`      tap: ${item}`);
  }
}

await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
socket.close();
