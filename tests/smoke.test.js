const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");

function read(file) {
  return fs.readFileSync(path.join(src, file), "utf8");
}

for (const file of ["index.html", "app.js", "styles.css", "main.js", "preload.js"]) {
  assert.ok(fs.existsSync(path.join(src, file)), `${file} should exist`);
}

const html = read("index.html");
const app = read("app.js");
const css = read("styles.css");
const main = read("main.js");
const preload = read("preload.js");

assert.match(html, /id="settings-button"[^>]*>Settings<\/button>/, "Settings should be a word button");
assert.match(html, /id="close-info-modal"/, "Definition modal close button should have a dedicated id");
assert.doesNotMatch(html, /id="company-overview"/, "Current recommendation should not include a duplicate overview paragraph");
assert.match(app, /getElementById\("close-info-modal"\)/, "Definition modal close handler should target the dedicated id");
assert.match(app, /fallbackNewsSlides/, "News should have ticker-specific fallback slides");
assert.match(app, /fallbackNewsImage/, "News fallback slides should include generated images");
assert.match(html, /id="news-refresh-minutes"/, "Settings should include news refresh interval");
assert.match(html, /id="google-search-key"/, "Settings should include a Google Search API key field");
assert.match(html, /id="google-search-cx"/, "Settings should include a Google Programmable Search Engine id field");
assert.match(app, /scheduleNewsRefresh/, "News auto-refresh should be scheduled");
assert.match(app, /calculateRatingScore/, "Ratings should use a metric-based scoring algorithm");
assert.match(app, /scoreBreakdown/, "Reports and AI prompts should include score breakdown context");
assert.match(app, /fetchYahooSearchProfile/, "Ticker display names should be retrieved from Yahoo Finance search");
assert.match(app, /normalizeYahooSymbol/, "Yahoo lookup should normalize ticker symbols before matching");
assert.match(app, /nameSource === "Yahoo Finance"/, "Yahoo display names should not be overwritten by fallback directory names");
assert.match(app, /enrichCompetitorsFromGoogle/, "Competitors should be enriched from Google Programmable Search when configured");
assert.match(app, /\^Primary peer \\d\+\$/, "Primary peer placeholders should be filtered before display");
assert.match(css, /top:\s*calc\(50% - 11px\)/, "Theme icon should be vertically centered");
assert.match(main, /better-sqlite3/, "SQLite dependency should be wired in Electron main process");
assert.match(main, /customsearch\.googleapis\.com/, "Electron API bridge should allow Google Custom Search requests");
assert.match(main, /CREATE TABLE IF NOT EXISTS generated_reports/, "Report history table should be created");
assert.match(preload, /hawkReports/, "Report history API should be exposed to renderer");
assert.match(preload, /hawkApi/, "External API fetch bridge should be exposed to renderer");

console.log("smoke.test.js passed");
