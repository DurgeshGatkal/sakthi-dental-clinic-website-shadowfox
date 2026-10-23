// Dev-only QA helper: screenshots a URL at an exact device width and reports
// horizontal overflow. Requires Chrome started with --remote-debugging-port=9222.
//
//   node scripts/screenshot.mjs <url> <out.png> [width] [height] [dpr]
import { writeFileSync } from "node:fs";

const [, , url, out, widthArg = "390", heightArg = "844", dprArg = "2", clickSelector] =
  process.argv;

if (!url || !out) {
  console.error("usage: node scripts/screenshot.mjs <url> <out.png> [width] [height] [dpr]");
  process.exit(1);
}

const width = Number(widthArg);
const height = Number(heightArg);
const deviceScaleFactor = Number(dprArg);

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

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor,
  mobile: width < 768,
});
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});

await send("Page.navigate", { url });
await wait(3500);

if (clickSelector) {
  await send("Runtime.evaluate", {
    expression: `document.querySelector(${JSON.stringify(clickSelector)})?.click()`,
  });
  await wait(600);
}

const metrics = await send("Page.getLayoutMetrics");
const content = metrics.cssContentSize;
const layout = await send("Runtime.evaluate", {
  expression:
    "({ viewport: Math.round(visualViewport.width), clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth })",
  returnByValue: true,
});

const { data } = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width, height: Math.ceil(content.height), scale: 1 },
});

writeFileSync(out, Buffer.from(data, "base64"));

const { viewport, clientWidth, scrollWidth } = layout.result.value;
console.log(
  `${out} | viewport ${viewport}px | page ${Math.round(content.width)}x${Math.round(content.height)} | ` +
    `scrollWidth ${scrollWidth}px | ${scrollWidth > clientWidth ? "HORIZONTAL OVERFLOW" : "no horizontal overflow"}`,
);

await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
socket.close();
