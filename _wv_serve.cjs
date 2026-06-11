// Standalone static server for the TSL web-verifier public dir.
// SPA fallback: "/" and "/p/<payload>" -> index.html. No build step.
// Also implements the spec's proof-bundle store (§49.2) so share links can
// be short IDs instead of multi-KB inline payloads:
//   POST /v1/proof-bundles            {bundle} -> {bundle_id}
//   GET  /v1/proof-bundles/:bundleId           -> {bundle}
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "clients", "web-verifier", "public");
const STORE = path.join(__dirname, "clients", "web-verifier", "data", "proof-bundles");
const PORT = Number(process.argv[2] || process.env.PORT || 8090);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".map": "application/json", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".png": "image/png"
};
const ID_RE = /^0x[0-9a-f]{64}$/;

function send(res, code, body, type) {
  res.writeHead(code, { "content-type": type || "text/plain", "cache-control": "no-cache" });
  res.end(body);
}
function sendJson(res, code, obj) { send(res, code, JSON.stringify(obj), TYPES[".json"]); }

function bundleId(bundle) {
  if (typeof bundle.bundle_id === "string" && ID_RE.test(bundle.bundle_id)) return bundle.bundle_id;
  return "0x" + crypto.createHash("sha256").update(JSON.stringify(bundle)).digest("hex");
}

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  // ---- proof-bundle store ----
  if (req.method === "POST" && urlPath === "/v1/proof-bundles") {
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 4e6) req.destroy(); });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const bundle = parsed.bundle || parsed.proof_bundle || parsed;
        if (!bundle || typeof bundle !== "object" || !bundle.envelope) return sendJson(res, 400, { error: "not a proof bundle" });
        const id = bundleId(bundle);
        fs.mkdirSync(STORE, { recursive: true });
        fs.writeFileSync(path.join(STORE, id + ".json"), JSON.stringify(bundle));
        sendJson(res, 200, { bundle_id: id });
      } catch (e) { sendJson(res, 400, { error: "invalid json" }); }
    });
    return;
  }
  if (req.method === "GET" && urlPath.startsWith("/v1/proof-bundles/")) {
    const id = urlPath.slice("/v1/proof-bundles/".length);
    if (!ID_RE.test(id)) return sendJson(res, 400, { error: "invalid bundle id" });
    return fs.readFile(path.join(STORE, id + ".json"), "utf8", (err, data) =>
      err ? sendJson(res, 404, { error: "unknown bundle" }) : send(res, 200, '{"bundle":' + data + "}", TYPES[".json"]));
  }

  // ---- static + SPA ----
  if (urlPath === "/" || urlPath.startsWith("/p/") || urlPath.startsWith("/verify") || urlPath.startsWith("/network") || urlPath.startsWith("/passport") || urlPath.startsWith("/agents")) {
    urlPath = "/index.html";
  }
  const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ""));
  if (!filePath.startsWith(ROOT)) return send(res, 403, "forbidden");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // last-resort SPA fallback
      return fs.readFile(path.join(ROOT, "index.html"), (e2, html) =>
        e2 ? send(res, 404, "not found") : send(res, 200, html, TYPES[".html"]));
    }
    send(res, 200, data, TYPES[path.extname(filePath)] || "application/octet-stream");
  });
}).listen(PORT, () => console.log("tsl web-verifier (static) on http://localhost:" + PORT));
