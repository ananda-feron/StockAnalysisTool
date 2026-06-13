const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("fs");
const path = require("path");

let db = null;
let reportsDir = null;

function safeName(value) {
  return String(value || "report")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "report";
}

function initDatabase() {
  reportsDir = path.join(app.getPath("userData"), "generated-reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  try {
    const Database = require("better-sqlite3");
    db = new Database(path.join(app.getPath("userData"), "hawk_reports.sqlite"));
    db.pragma("journal_mode = WAL");
    db.prepare(`
      CREATE TABLE IF NOT EXISTS generated_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        company TEXT NOT NULL,
        rating TEXT NOT NULL,
        score INTEGER NOT NULL,
        report_path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `).run();
  } catch (error) {
    console.error("SQLite is unavailable. Run npm install before starting the Electron app.", error);
    db = null;
  }
}

function assertDatabase() {
  if (!db) {
    return {
      ok: false,
      error: "SQLite is unavailable. Run npm install in the app folder, then restart the desktop app."
    };
  }
  return null;
}

function registerReportHandlers() {
  ipcMain.handle("reports:list", () => {
    const unavailable = assertDatabase();
    if (unavailable) return { ...unavailable, reports: [] };
    const reports = db.prepare("SELECT * FROM generated_reports ORDER BY created_at DESC").all();
    return { ok: true, reports };
  });

  ipcMain.handle("reports:save", (_event, payload) => {
    const unavailable = assertDatabase();
    if (unavailable) return unavailable;

    const createdAt = new Date().toISOString();
    const ticker = safeName(payload.ticker).toUpperCase();
    const fileName = `${ticker}-${Date.now()}-Hawk-Report.docx`;
    const reportPath = path.join(reportsDir, fileName);
    fs.writeFileSync(reportPath, Buffer.from(payload.bytes));

    const result = db.prepare(`
      INSERT INTO generated_reports (ticker, company, rating, score, report_path, created_at, updated_at)
      VALUES (@ticker, @company, @rating, @score, @report_path, @created_at, @updated_at)
    `).run({
      ticker,
      company: payload.company || ticker,
      rating: payload.rating || "Unrated",
      score: Number(payload.score) || 0,
      report_path: reportPath,
      created_at: createdAt,
      updated_at: createdAt
    });

    return { ok: true, id: result.lastInsertRowid, reportPath };
  });

  ipcMain.handle("reports:open", async (_event, reportPath) => {
    if (!reportPath || !fs.existsSync(reportPath)) return { ok: false, error: "Report file was not found." };
    const error = await shell.openPath(reportPath);
    return error ? { ok: false, error } : { ok: true };
  });

  ipcMain.handle("reports:reveal", async (_event, reportPath) => {
    if (!reportPath || !fs.existsSync(reportPath)) return { ok: false, error: "Report file was not found." };
    shell.showItemInFolder(reportPath);
    return { ok: true };
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 900,
    minWidth: 1080,
    minHeight: 720,
    title: "Hawk Stock Analysis",
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  initDatabase();
  registerReportHandlers();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
