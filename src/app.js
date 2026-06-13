const TOPICS = {
  return: {
    title: "5-year return",
    body: "Return measures how much the stock price changed over the period. A higher return is attractive, but it should be judged next to risk, because a stock can earn more while also swinging much more."
  },
  volatility: {
    title: "Volatility / standard deviation",
    body: "Volatility shows how spread out monthly returns are around their average. Higher volatility means the investment has had larger ups and downs, which usually means more risk for a beginner investor."
  },
  beta: {
    title: "CAPM beta",
    body: "Beta estimates how strongly the stock moves when the market moves. A beta above 1 means the stock tends to move more than the market; below 1 means it tends to move less."
  },
  capm: {
    title: "CAPM regression",
    body: "CAPM compares stock excess returns with market excess returns. The slope is beta, while adjusted R-squared estimates how much of the stock's movement is explained by the market."
  },
  rsi: {
    title: "Relative Strength Index",
    body: "RSI is a momentum indicator from 0 to 100. Around 50 is neutral, above 70 can suggest overbought conditions, and below 30 can suggest oversold conditions."
  },
  sma: {
    title: "Simple moving averages",
    body: "A simple moving average smooths recent prices. Short moving averages help read short-term momentum, while longer moving averages help read the broader trend."
  },
  peg: {
    title: "PEG ratio",
    body: "PEG compares the P/E ratio to expected earnings growth. A PEG below 1 can suggest the stock price is reasonable relative to growth, though it is only one valuation signal."
  },
  spread: {
    title: "Bond yield spread",
    body: "A yield spread is the extra yield investors demand above a comparable Treasury. Wider spreads usually mean the market sees more credit risk."
  }
};

const PROFILES = {
  GOOGL: {
    company: "Alphabet Inc.",
    description: "A technology holding company built around Google Services, Google Cloud, and Other Bets. Its largest revenue driver is advertising, with growth support from cloud computing, AI tools, subscriptions, platforms, and devices.",
    revenue: [
      ["Google Services", 85.1],
      ["Google Cloud", 14.6],
      ["Other Bets", 0.4]
    ],
    ratios: {
      currentRatio: 2.01,
      debtEquity: 0.14,
      ltDebtEquity: 0.11,
      receivableTurnover: 7.34,
      assetTurnover: 0.5,
      netMargin: 32.81,
      roa: 21.39,
      roe: 30.33,
      epsGrowth: 22.5,
      revenueGrowth: 17.57,
      pe: 31.62,
      peg: 0.77,
      pb: 6.22
    },
    bonds: {
      rating: "AA+ / Aa2",
      callable: "Mixed callable and non-callable issues",
      spreads: [
        ["2029", 27],
        ["2029 low", 13],
        ["2066", 95]
      ]
    },
    seed: 9,
    basePrice: 140,
    targetPrice: 318,
    marketStart: 420,
    marketEnd: 680
  },
  AAPL: {
    company: "Apple Inc.",
    description: "A global consumer technology company with revenue from iPhone, Mac, iPad, wearables, services, and digital content. Its strengths are brand loyalty, ecosystem depth, margins, and recurring services revenue.",
    revenue: [
      ["Products", 75],
      ["Services", 25],
      ["Other", 0]
    ],
    ratios: {
      currentRatio: 1.04,
      debtEquity: 1.45,
      ltDebtEquity: 1.25,
      receivableTurnover: 6.1,
      assetTurnover: 1.08,
      netMargin: 25.3,
      roa: 28.1,
      roe: 156,
      epsGrowth: 8.9,
      revenueGrowth: 5.2,
      pe: 29.4,
      peg: 2.1,
      pb: 40.2
    },
    bonds: {
      rating: "AA+ / Aaa",
      callable: "Primarily investment-grade corporate issues",
      spreads: [
        ["2029", 35],
        ["2034", 52],
        ["2062", 90]
      ]
    },
    seed: 12,
    basePrice: 120,
    targetPrice: 205,
    marketStart: 420,
    marketEnd: 680
  },
  MSFT: {
    company: "Microsoft Corp.",
    description: "A diversified technology company with major revenue from cloud infrastructure, productivity software, enterprise subscriptions, gaming, LinkedIn, and AI-enabled platforms.",
    revenue: [
      ["Productivity", 40],
      ["Cloud", 43],
      ["Personal Computing", 17]
    ],
    ratios: {
      currentRatio: 1.35,
      debtEquity: 0.18,
      ltDebtEquity: 0.16,
      receivableTurnover: 4.44,
      assetTurnover: 0.5,
      netMargin: 39.04,
      roa: 20.7,
      roe: 35.1,
      epsGrowth: 15.59,
      revenueGrowth: 14.93,
      pe: 36.8,
      peg: 1.8,
      pb: 12.5
    },
    bonds: {
      rating: "AAA / Aaa",
      callable: "High-grade corporate debt",
      spreads: [
        ["2029", 22],
        ["2035", 39],
        ["2065", 78]
      ]
    },
    seed: 16,
    basePrice: 210,
    targetPrice: 480,
    marketStart: 420,
    marketEnd: 680
  }
};

let state = null;

const el = (id) => document.getElementById(id);
const pct = (n, d = 1) => `${Number(n).toFixed(d)}%`;
const money = (n) => `$${Number(n).toFixed(2)}`;

function seeded(seed) {
  let value = seed * 9973;
  return () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };
}

function createSeries(profile, ticker) {
  const rand = seeded(profile.seed + ticker.length);
  const months = 60;
  const stock = [];
  const market = [];
  let s = profile.basePrice;
  let m = profile.marketStart;
  const stockDrift = Math.pow(profile.targetPrice / profile.basePrice, 1 / months) - 1;
  const marketDrift = Math.pow(profile.marketEnd / profile.marketStart, 1 / months) - 1;

  for (let i = 0; i <= months; i += 1) {
    if (i > 0) {
      const commonShock = (rand() - 0.5) * 0.055;
      const stockShock = commonShock * 1.45 + (rand() - 0.5) * 0.085;
      const marketShock = commonShock * 0.7 + (rand() - 0.5) * 0.025;
      s *= 1 + stockDrift + stockShock;
      m *= 1 + marketDrift + marketShock;
    }
    stock.push(Number(s.toFixed(2)));
    market.push(Number(m.toFixed(2)));
  }

  return { stock, market };
}

function profileFor(ticker) {
  if (PROFILES[ticker]) return structuredClone(PROFILES[ticker]);
  const rand = seeded([...ticker].reduce((sum, char) => sum + char.charCodeAt(0), 0));
  const growth = 5 + rand() * 20;
  const pe = 12 + rand() * 30;
  return {
    company: `${ticker} Corporation`,
    description: "A generated beginner-analysis profile. Connect a licensed data provider for exact company segments, filings, and bond information.",
    revenue: [
      ["Core operations", 72],
      ["Growth segment", 22],
      ["Other", 6]
    ],
    ratios: {
      currentRatio: 0.9 + rand() * 2,
      debtEquity: 0.1 + rand() * 1.2,
      ltDebtEquity: 0.1 + rand() * 0.9,
      receivableTurnover: 4 + rand() * 8,
      assetTurnover: 0.25 + rand() * 0.9,
      netMargin: 8 + rand() * 26,
      roa: 5 + rand() * 22,
      roe: 10 + rand() * 35,
      epsGrowth: growth,
      revenueGrowth: 3 + rand() * 18,
      pe,
      peg: pe / Math.max(growth, 1),
      pb: 2 + rand() * 9
    },
    bonds: {
      rating: "Estimated investment-grade profile",
      callable: "Bond data requires provider integration",
      spreads: [
        ["Short", 45 + rand() * 30],
        ["Medium", 70 + rand() * 40],
        ["Long", 100 + rand() * 55]
      ]
    },
    seed: Math.round(rand() * 100),
    basePrice: 60 + rand() * 120,
    targetPrice: 95 + rand() * 240,
    marketStart: 420,
    marketEnd: 680
  };
}

async function loadTickerData(ticker) {
  const profile = profileFor(ticker);
  const generated = createSeries(profile, ticker);
  const source = "Educational generated analysis for the entered ticker";

  try {
    const [stock, market] = await Promise.all([fetchStooq(ticker), fetchStooq("SPY")]);
    if (stock.length > 48 && market.length > 48) {
      profile.basePrice = stock[0];
      profile.targetPrice = stock.at(-1);
      return { profile, prices: { stock, market }, source: "Public monthly price history for the entered ticker; fundamentals are educational placeholders until a fundamentals API is connected" };
    }
  } catch (error) {
    console.info("Public price fetch unavailable; using seeded data.", error);
  }

  return { profile, prices: generated, source };
}

async function fetchStooq(ticker) {
  const symbol = `${ticker.toLowerCase()}.us`;
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=m`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error("Price request failed");
  const text = await response.text();
  return text
    .trim()
    .split("\n")
    .slice(-61)
    .map((line) => Number(line.split(",")[4]))
    .filter((value) => Number.isFinite(value));
}

function returns(series) {
  const out = [];
  for (let i = 1; i < series.length; i += 1) out.push(series[i] / series[i - 1] - 1);
  return out;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values) {
  const avg = mean(values);
  return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1);
}

function covariance(a, b) {
  const avgA = mean(a);
  const avgB = mean(b);
  return a.reduce((sum, value, i) => sum + (value - avgA) * (b[i] - avgB), 0) / (a.length - 1);
}

function correlation(a, b) {
  return covariance(a, b) / Math.sqrt(variance(a) * variance(b));
}

function adjustedR2(r, n, k = 1) {
  const r2 = r ** 2;
  return 1 - (1 - r2) * ((n - 1) / (n - k - 1));
}

function sma(series, window) {
  return series.map((_, index) => {
    if (index + 1 < window) return null;
    return mean(series.slice(index + 1 - window, index + 1));
  });
}

function rsi(series, period = 14) {
  const changes = [];
  for (let i = 1; i < series.length; i += 1) changes.push(series[i] - series[i - 1]);
  const recent = changes.slice(-period);
  const gains = recent.filter((v) => v > 0).reduce((sum, v) => sum + v, 0) / period;
  const losses = Math.abs(recent.filter((v) => v < 0).reduce((sum, v) => sum + v, 0) / period);
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function ar1Coefficient(values) {
  const current = values.slice(1);
  const lag = values.slice(0, -1);
  return covariance(current, lag) / variance(lag);
}

function analyze(profile, prices, ticker, source) {
  const stockReturns = returns(prices.stock);
  const marketReturns = returns(prices.market);
  const excessStock = stockReturns.map((v) => v - 0.0025);
  const excessMarket = marketReturns.map((v) => v - 0.0025);
  const corr = correlation(excessStock, excessMarket);
  const beta = covariance(excessStock, excessMarket) / variance(excessMarket);
  const stockReturn = (prices.stock.at(-1) / prices.stock[0] - 1) * 100;
  const marketReturn = (prices.market.at(-1) / prices.market[0] - 1) * 100;
  const volatility = Math.sqrt(variance(stockReturns)) * 100;
  const marketVol = Math.sqrt(variance(marketReturns)) * 100;
  const rsiValue = rsi(prices.stock);
  const sma10 = sma(prices.stock, 10);
  const sma50 = sma(prices.stock, 50);
  const last = prices.stock.at(-1);
  const support = Math.min(...prices.stock.slice(-12));
  const resistance = Math.max(...prices.stock.slice(-12));
  const ar1 = ar1Coefficient(stockReturns);
  const ratios = profile.ratios;

  let score = 50;
  score += stockReturn > marketReturn ? 12 : -5;
  score += volatility < 12 ? 6 : volatility > 20 ? -8 : 2;
  score += ratios.currentRatio > 1 ? 6 : -8;
  score += ratios.debtEquity < 0.8 ? 7 : -6;
  score += ratios.netMargin > 15 ? 8 : 0;
  score += ratios.peg < 1 ? 9 : ratios.peg < 2 ? 3 : -7;
  score += rsiValue > 70 ? -4 : rsiValue < 30 ? 2 : 3;
  score = Math.max(0, Math.min(100, Math.round(score)));
  const rating = score >= 72 ? "Positive" : score >= 55 ? "Neutral" : "Cautious";

  return {
    ticker,
    source,
    profile,
    prices,
    stockReturns,
    marketReturns,
    excessStock,
    excessMarket,
    stockReturn,
    marketReturn,
    volatility,
    marketVol,
    corr,
    beta,
    adjR2: adjustedR2(corr, stockReturns.length),
    ar1,
    weakForm: Math.abs(ar1) < 0.28,
    rsi: rsiValue,
    sma10,
    sma50,
    currentPrice: last,
    support,
    resistance,
    score,
    rating
  };
}

function setText(id, value) {
  el(id).textContent = value;
}

function render() {
  setText("company-name", `${state.profile.company} (${state.ticker})`);
  setText("company-description", state.profile.description);
  setText("score", state.score);
  setText("rating", state.rating);
  setText("metric-return", pct(state.stockReturn));
  setText("metric-vol", pct(state.volatility));
  setText("metric-beta", state.beta.toFixed(2));
  setText("metric-rsi", state.rsi.toFixed(1));
  setText("data-source", state.source);

  renderCards();
  drawAllCharts();
  renderReport();
  setReportActions(true);
  loadReportHistory();
}

function setReportActions(enabled) {
  el("download-report").disabled = !enabled;
  el("print-report").disabled = !enabled;
}

function hasDesktopHistory() {
  return Boolean(window.hawkReports);
}

function renderCards() {
  el("quant-copy").innerHTML = [
    ["Market comparison", `${state.ticker} returned ${pct(state.stockReturn)} versus ${pct(state.marketReturn)} for the market proxy. This shows whether the stock rewarded investors more or less than broad market exposure.`],
    ["Risk profile", `Monthly volatility is ${pct(state.volatility)}, compared with ${pct(state.marketVol)} for the market proxy. This is the risk side of the return story.`],
    ["Efficiency check", `The AR(1) estimate is ${state.ar1.toFixed(2)}. ${state.weakForm ? "Past monthly returns do not look strongly predictive, which supports weak-form efficiency." : "Past monthly returns show some persistence, so the app flags this for further testing."}`]
  ].map(copyCard).join("");

  const ratios = [
    ["Current ratio", state.profile.ratios.currentRatio.toFixed(2), state.profile.ratios.currentRatio > 1 ? "Healthy short-term liquidity." : "Short-term liquidity needs attention."],
    ["Debt to equity", state.profile.ratios.debtEquity.toFixed(2), state.profile.ratios.debtEquity < 0.8 ? "Low leverage supports financial flexibility." : "Higher leverage raises balance-sheet risk."],
    ["Net profit margin", pct(state.profile.ratios.netMargin), "Shows how much revenue becomes profit."],
    ["ROA / ROE", `${pct(state.profile.ratios.roa)} / ${pct(state.profile.ratios.roe)}`, "Measures profit generated from assets and shareholder equity."],
    ["EPS growth", pct(state.profile.ratios.epsGrowth), "Shows historical earnings growth momentum."],
    ["P/E and PEG", `${state.profile.ratios.pe.toFixed(2)} / ${state.profile.ratios.peg.toFixed(2)}`, "Compares price to earnings and growth expectations."]
  ];
  el("ratio-grid").innerHTML = ratios.map(([label, value, body]) => copyCard([label, value, body], "ratio-card")).join("");

  const technical = [
    ["Current price", money(state.currentPrice), `The latest observed price in this analysis set.`],
    ["10-day SMA", money(state.sma10.at(-1)), state.currentPrice > state.sma10.at(-1) ? "Price is above short-term trend." : "Price is below short-term trend."],
    ["50-day SMA", money(state.sma50.at(-1)), state.currentPrice > state.sma50.at(-1) ? "Price is above medium-term trend." : "Price is below medium-term trend."],
    ["RSI", state.rsi.toFixed(1), state.rsi > 70 ? "Potentially overbought." : state.rsi < 30 ? "Potentially oversold." : "Neutral momentum zone."],
    ["Support", money(state.support), "Recent low area where buyers previously stepped in."],
    ["Resistance", money(state.resistance), "Recent high area where selling pressure may appear."]
  ];
  el("technical-grid").innerHTML = technical.map(([label, value, body]) => copyCard([label, value, body], "technical-card")).join("");
}

function copyCard([label, value, body], className = "technical-card") {
  return `<article class="${className}"><small>${label}</small><strong>${value}</strong><p>${body}</p></article>`;
}

function setupCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = Number(canvas.getAttribute("height")) * ratio;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, rect.width, rect.height);
  return { ctx, w: rect.width, h: Number(canvas.getAttribute("height")) };
}

function grid(ctx, w, h) {
  ctx.strokeStyle = "#e8edf3";
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i += 1) {
    const y = 20 + ((h - 48) * i) / 5;
    ctx.beginPath();
    ctx.moveTo(42, y);
    ctx.lineTo(w - 18, y);
    ctx.stroke();
  }
}

function drawLine(canvasId, series, color, min, max, width = 2) {
  const canvas = el(canvasId);
  const { ctx, w, h } = setupCanvas(canvas);
  grid(ctx, w, h);
  series.forEach((values, idx) => {
    ctx.strokeStyle = color[idx];
    ctx.lineWidth = width;
    ctx.beginPath();
    values.forEach((value, i) => {
      if (value === null || Number.isNaN(value)) return;
      const x = 42 + (i / (values.length - 1)) * (w - 64);
      const y = 18 + (1 - (value - min) / (max - min || 1)) * (h - 46);
      if (i === 0 || values[i - 1] === null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function drawAllCharts() {
  const normalizedStock = state.prices.stock.map((v) => (v / state.prices.stock[0]) * 100);
  const normalizedMarket = state.prices.market.map((v) => (v / state.prices.market[0]) * 100);
  const normalizedSma10 = state.sma10.map((v) => (v ? (v / state.prices.stock[0]) * 100 : null));
  const normalizedSma50 = state.sma50.map((v) => (v ? (v / state.prices.stock[0]) * 100 : null));
  const lineValues = [...normalizedStock, ...normalizedMarket, ...normalizedSma10.filter(Boolean), ...normalizedSma50.filter(Boolean)];
  drawLine("price-chart", [normalizedStock, normalizedMarket, normalizedSma10, normalizedSma50], ["#0d6efd", "#13866f", "#a05a00", "#6f42c1"], Math.min(...lineValues), Math.max(...lineValues));
  labelChart("price-chart", [`${state.ticker}`, "SPY", "SMA 10", "SMA 50"]);
  drawBars("return-chart", [
    [state.ticker, state.stockReturn, "#0d6efd"],
    ["SPY", state.marketReturn, "#13866f"]
  ], "%");
  drawScatter();
  drawBars("valuation-chart", [
    ["P/E", state.profile.ratios.pe, "#0d6efd"],
    ["PEG", state.profile.ratios.peg, "#13866f"],
    ["P/B", state.profile.ratios.pb, "#a05a00"]
  ], "");
  drawBars("spread-chart", state.profile.bonds.spreads.map(([label, value]) => [label, value, "#6f42c1"]), " bps");
}

function labelChart(canvasId, labels) {
  const canvas = el(canvasId);
  const ctx = canvas.getContext("2d");
  const colors = ["#0d6efd", "#13866f", "#a05a00", "#6f42c1"];
  labels.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(54 + i * 82, 16, 10, 10);
    ctx.fillStyle = "#334155";
    ctx.font = "12px system-ui";
    ctx.fillText(label, 70 + i * 82, 25);
  });
}

function drawBars(canvasId, rows, suffix) {
  const canvas = el(canvasId);
  const { ctx, w, h } = setupCanvas(canvas);
  grid(ctx, w, h);
  const max = Math.max(...rows.map((row) => Math.abs(row[1])), 1) * 1.15;
  const barH = Math.min(42, (h - 70) / rows.length - 8);
  rows.forEach(([label, value, color], i) => {
    const y = 44 + i * (barH + 24);
    const barW = Math.max(2, (Math.abs(value) / max) * (w - 142));
    ctx.fillStyle = color;
    ctx.fillRect(86, y, barW, barH);
    ctx.fillStyle = "#334155";
    ctx.font = "13px system-ui";
    ctx.fillText(label, 18, y + barH / 2 + 4);
    ctx.font = "700 13px system-ui";
    ctx.fillText(`${value.toFixed(1)}${suffix}`, 94 + barW, y + barH / 2 + 4);
  });
}

function drawScatter() {
  const canvas = el("scatter-chart");
  const { ctx, w, h } = setupCanvas(canvas);
  grid(ctx, w, h);
  const xs = state.excessMarket;
  const ys = state.excessStock;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  ctx.fillStyle = "#0d6efd";
  xs.forEach((xVal, i) => {
    const x = 42 + ((xVal - minX) / (maxX - minX || 1)) * (w - 64);
    const y = 20 + (1 - (ys[i] - minY) / (maxY - minY || 1)) * (h - 54);
    ctx.beginPath();
    ctx.arc(x, y, 3.4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#334155";
  ctx.font = "700 13px system-ui";
  ctx.fillText(`Beta ${state.beta.toFixed(2)} | Corr ${state.corr.toFixed(2)} | Adj R2 ${state.adjR2.toFixed(2)}`, 52, 28);
}

function renderReport() {
  const p = state.profile;
  const r = p.ratios;
  const html = `
    <h1>${p.company} (${state.ticker}) Hawk Report</h1>
    <p><strong>Recommendation:</strong> ${state.rating} | <strong>Score:</strong> ${state.score}/100 | <strong>Most recent price:</strong> ${money(state.currentPrice)}</p>
    <h2>1. Company Introduction</h2>
    <p>${p.description}</p>
    <p><strong>Revenue breakdown:</strong> ${p.revenue.map(([name, value]) => `${name} ${pct(value)}`).join("; ")}.</p>
    <h2>2. Data Analysis Results</h2>
    <h3>2.1 Quantitative Analysis</h3>
    <p>Over the observed period, ${state.ticker} returned ${pct(state.stockReturn)} compared with ${pct(state.marketReturn)} for the market proxy. This indicates that the stock ${state.stockReturn > state.marketReturn ? "outperformed" : "underperformed"} the broad market.</p>
    <p>The stock's monthly standard deviation was ${pct(state.volatility)}, while the market proxy's was ${pct(state.marketVol)}. The correlation between stock and market excess returns was ${state.corr.toFixed(2)}, and CAPM beta was ${state.beta.toFixed(2)}. Adjusted R-squared was ${pct(state.adjR2 * 100)}, meaning the remaining variation is company-specific or unexplained by the market model.</p>
    <p>The AR(1) coefficient was ${state.ar1.toFixed(2)}. ${state.weakForm ? "This supports weak-form efficiency because past monthly returns do not appear strongly useful for predicting current returns." : "This suggests the stock deserves additional efficiency testing because past returns show some persistence."}</p>
    <h3>2.2 Fundamental Analysis</h3>
    <p>The company has a current ratio of ${r.currentRatio.toFixed(2)}, debt-to-equity of ${r.debtEquity.toFixed(2)}, and long-term debt-to-equity of ${r.ltDebtEquity.toFixed(2)}. These values summarize liquidity and leverage risk.</p>
    <p>Profitability is represented by a net margin of ${pct(r.netMargin)}, ROA of ${pct(r.roa)}, and ROE of ${pct(r.roe)}. Growth is represented by EPS growth of ${pct(r.epsGrowth)} and revenue growth of ${pct(r.revenueGrowth)}.</p>
    <p>Valuation uses a P/E ratio of ${r.pe.toFixed(2)}, PEG ratio of ${r.peg.toFixed(2)}, and P/B ratio of ${r.pb.toFixed(2)}. The PEG ratio is especially useful for beginners because it connects price to growth.</p>
    <p><strong>Bond analysis:</strong> ${p.bonds.rating}. ${p.bonds.callable}. Yield spreads in this analysis range from ${Math.min(...p.bonds.spreads.map((x) => x[1])).toFixed(0)} to ${Math.max(...p.bonds.spreads.map((x) => x[1])).toFixed(0)} basis points, which indicates the market's perceived credit risk above Treasury bonds.</p>
    <h3>2.3 Technical Analysis</h3>
    <p>The latest price is ${money(state.currentPrice)}. The 10-period SMA is ${money(state.sma10.at(-1))}, and the 50-period SMA is ${money(state.sma50.at(-1))}. RSI is ${state.rsi.toFixed(1)}, which is ${state.rsi > 70 ? "overbought" : state.rsi < 30 ? "oversold" : "neutral"}.</p>
    <p>Recent support is near ${money(state.support)}, while recent resistance is near ${money(state.resistance)}. Beginners can use these levels to understand where buying or selling pressure has recently appeared.</p>
    <h2>3. Conclusion</h2>
    <p>Based on the quantitative, fundamental, and technical analysis, ${p.company} receives a <strong>${state.rating}</strong> recommendation. The strongest factors in this result are ${state.stockReturn > state.marketReturn ? "market outperformance" : "valuation/risk balance"}, ${r.debtEquity < 0.8 ? "manageable leverage" : "the need to monitor leverage"}, and ${r.peg < 1 ? "an attractive PEG ratio" : "a valuation that should be compared with growth expectations"}.</p>
  `;
  el("report-preview").innerHTML = html;
}

async function downloadReport() {
  if (!state) return;
  const bytes = buildDocx();

  if (hasDesktopHistory()) {
    setText("save-status", "Saving DOCX report to SQLite history...");
    const result = await window.hawkReports.save({
      ticker: state.ticker,
      company: state.profile.company,
      rating: state.rating,
      score: state.score,
      bytes: Array.from(bytes)
    });
    if (result.ok) {
      setText("save-status", `Saved to history: ${result.reportPath}`);
      await loadReportHistory();
    } else {
      setText("save-status", result.error || "Could not save the report to history.");
    }
    return;
  }

  downloadDocxBytes(bytes, `${state.ticker}-Hawk-Report.docx`);
  setText("save-status", "Browser preview downloaded the DOCX. SQLite history is available in the Electron desktop app.");
}

function downloadDocxBytes(bytes, fileName) {
  const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

async function loadReportHistory() {
  const list = el("history-list");
  if (!list) return;

  if (!hasDesktopHistory()) {
    setText("history-status", "SQLite history is active in the Electron desktop app. Browser preview mode can download DOCX reports but cannot write to SQLite.");
    list.innerHTML = "";
    return;
  }

  const result = await window.hawkReports.list();
  if (!result.ok) {
    setText("history-status", result.error || "Could not load report history.");
    list.innerHTML = "";
    return;
  }

  setText("history-status", result.reports.length ? "Saved DOCX reports are listed below. Open uses your system default editor for .docx files." : "No saved reports yet.");
  list.innerHTML = result.reports.map((report) => `
    <article class="history-item">
      <div>
        <strong>${report.company} (${report.ticker})</strong>
        <span>${report.rating} | Score ${report.score}/100 | ${new Date(report.created_at).toLocaleString()}</span>
        <span>${report.report_path}</span>
      </div>
      <div class="action-row">
        <button data-open-report="${report.report_path}">Open</button>
        <button class="secondary" data-reveal-report="${report.report_path}">Show File</button>
      </div>
    </article>
  `).join("");
}

function reportBlocks() {
  const blocks = [];
  el("report-preview").querySelectorAll("h1,h2,h3,p").forEach((node) => {
    blocks.push({ tag: node.tagName.toLowerCase(), text: node.textContent.trim() });
  });
  return blocks;
}

function xmlEscape(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphXml(block) {
  const style = block.tag === "h1" ? "Title" : block.tag === "h2" ? "Heading1" : block.tag === "h3" ? "Heading2" : "Normal";
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t xml:space="preserve">${xmlEscape(block.text)}</w:t></w:r></w:p>`;
}

function buildDocx() {
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
${reportBlocks().map(paragraphXml).join("")}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>
</w:body></w:document>`;
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    "word/document.xml": documentXml,
    "word/styles.xml": stylesXml()
  };
  return zipStore(files);
}

function stylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr><w:pPr><w:spacing w:after="160" w:line="276" w:lineRule="auto"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="44"/><w:color w:val="17202A"/></w:rPr><w:pPr><w:spacing w:after="240"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="0D6EFD"/></w:rPr><w:pPr><w:spacing w:before="260" w:after="120"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="13866F"/></w:rPr><w:pPr><w:spacing w:before="180" w:after="100"/></w:pPr></w:style>
</w:styles>`;
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const local = concatBytes(
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes, data
    );
    const central = concatBytes(
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes
    );
    localParts.push(local);
    centralParts.push(central);
    offset += local.length;
  });
  const central = concatBytes(...centralParts);
  const end = concatBytes(u32(0x06054b50), u16(0), u16(0), u16(centralParts.length), u16(centralParts.length), u32(central.length), u32(offset), u16(0));
  return concatBytes(...localParts, central, end);
}

function u16(value) {
  return new Uint8Array([value & 255, (value >> 8) & 255]);
}

function u32(value) {
  return new Uint8Array([value & 255, (value >> 8) & 255, (value >> 16) & 255, (value >> 24) & 255]);
}

function concatBytes(...arrays) {
  const length = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  arrays.forEach((arr) => {
    out.set(arr, offset);
    offset += arr.length;
  });
  return out;
}

function crc32(data) {
  let crc = -1;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i];
    for (let j = 0; j < 8; j += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function showTopic(topic) {
  const content = TOPICS[topic];
  if (!content) return;
  setText("modal-title", content.title);
  setText("modal-body", content.body);
  el("info-modal").showModal();
}

async function runAnalysis(ticker) {
  const normalized = String(ticker || "").trim().toUpperCase();
  if (!normalized) {
    setText("data-source", "Please enter a ticker symbol before analyzing.");
    return;
  }
  setText("data-source", "Loading analysis...");
  setReportActions(false);
  const data = await loadTickerData(normalized);
  state = analyze(data.profile, data.prices, normalized, data.source);
  render();
}

document.getElementById("stock-form").addEventListener("submit", (event) => {
  event.preventDefault();
  runAnalysis(new FormData(event.currentTarget).get("ticker"));
});

document.addEventListener("click", (event) => {
  const topicButton = event.target.closest("[data-topic]");
  if (topicButton) showTopic(topicButton.dataset.topic);
});

document.querySelector(".close-modal").addEventListener("click", () => el("info-modal").close());
document.getElementById("download-report").addEventListener("click", downloadReport);
document.getElementById("print-report").addEventListener("click", () => {
  if (state) window.print();
});
window.addEventListener("resize", () => state && drawAllCharts());

setReportActions(false);

const initialTicker = new URLSearchParams(window.location.search).get("ticker");
if (initialTicker) {
  el("ticker").value = initialTicker.toUpperCase();
  runAnalysis(initialTicker);
}
