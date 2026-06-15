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

const ORANGE = "#f97316";
const ORANGE_DARK = "#ea580c";
const BLUE = "#0d6efd";
const PURPLE = "#6f42c1";
const AUTH_KEY = "hawk_auth_session";
const ALPHA_VANTAGE_KEY = "hawk_alpha_vantage_key";
const NEWSDATA_KEY = "hawk_newsdata_key";
const UNSPLASH_KEY = "hawk_unsplash_key";
const OPENAI_KEY = "hawk_openai_key";
const OPENAI_MODEL = "hawk_openai_model";
const GOOGLE_SEARCH_KEY = "hawk_google_search_key";
const GOOGLE_SEARCH_CX = "hawk_google_search_cx";
const SHOW_TICKER_HISTORY = "hawk_show_ticker_history";
const RECENT_TICKERS = "hawk_recent_tickers";
const NEWS_REFRESH_MINUTES = "hawk_news_refresh_minutes";

let newsTimer = null;
let newsRefreshTimer = null;

const PROFILES = {
  GOOGL: {
    company: "Alphabet Inc.",
    description: "Alphabet Inc. is the parent company of Google and a major global technology platform business. It earns most of its revenue from advertising while also expanding through cloud computing, subscriptions, devices, YouTube, and artificial intelligence tools. The company is financially strong, but its results remain sensitive to digital ad spending, regulation, and competition in AI and cloud services.",
    competitors: ["Microsoft", "Amazon", "Meta Platforms"],
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
    description: "Apple Inc. is a global consumer technology company known for the iPhone, Mac, iPad, Apple Watch, services, and digital content ecosystem. Its competitive strengths include brand loyalty, premium hardware margins, installed-base scale, and recurring services revenue. Key risks include slower device replacement cycles, supply-chain exposure, regulation of app-store economics, and competition in consumer devices and services.",
    competitors: ["Samsung Electronics", "Microsoft", "Alphabet"],
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
    description: "Microsoft Corp. is a diversified technology company with major revenue from cloud infrastructure, productivity software, enterprise subscriptions, gaming, LinkedIn, and AI-enabled platforms. Its business model benefits from recurring commercial subscriptions, deep enterprise relationships, and strong positioning in cloud and AI. Important risks include cloud competition, cybersecurity execution, regulatory scrutiny, and the need to keep converting AI demand into profitable growth.",
    competitors: ["Amazon", "Alphabet", "Oracle"],
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
let companyDirectoryPromise = null;

const el = (id) => document.getElementById(id);
const pct = (n, d = 1) => `${Number(n).toFixed(d)}%`;
const money = (n) => `$${Number(n).toFixed(2)}`;
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

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
    description: `${ticker} is analyzed with an educational generated profile because exact company reference data is not connected yet. The dashboard estimates business mix, risk, profitability, valuation, and technical signals from available price data and seeded fundamentals. For a final investment decision, users should verify the company name, filings, competitors, and ratios with a licensed market-data provider.`,
    competitors: ["Primary peer 1", "Primary peer 2", "Primary peer 3"],
    generatedProfile: true,
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
  const yahooProfile = await fetchYahooSearchProfile(ticker).catch((error) => {
    console.info("Yahoo Finance symbol lookup unavailable; using fallback profile name.", error);
    return null;
  });
  if (yahooProfile) applyYahooSearchProfile(profile, yahooProfile, ticker);
  await enrichProfileFromDirectory(profile, ticker);
  const generated = createSeries(profile, ticker);
  const alphaKey = localStorage.getItem(ALPHA_VANTAGE_KEY);

  try {
    const [stockChart, marketChart, overview] = await Promise.all([
      fetchYahooChart(ticker),
      fetchYahooChart("SPY"),
      alphaKey ? fetchAlphaOverview(ticker, alphaKey).catch(() => null) : Promise.resolve(null)
    ]);
    if (overview) applyAlphaOverview(profile, overview, ticker);
    await enrichCompetitorsFromGoogle(profile, ticker);
    const stock = stockChart.prices;
    const market = marketChart.prices.slice(-stock.length);
    if (stock.length > 24 && market.length > 24) {
      profile.basePrice = stock[0];
      profile.targetPrice = stock.at(-1);
      return {
        profile,
        prices: { stock, market, labels: stockChart.labels },
        yahoo: stockChart,
        source: `Yahoo Finance chart data for ${ticker}. Latest Yahoo Finance close/quote: ${money(stock.at(-1))}. ${overview ? "Alpha Vantage overview data was used for fundamentals." : "Add an Alpha Vantage key for richer fundamentals."}`
      };
    }
  } catch (error) {
    console.info("Yahoo Finance data unavailable; using generated data.", error);
    await enrichCompetitorsFromGoogle(profile, ticker);
    return {
      profile,
      prices: generated,
      yahoo: null,
      source: `Yahoo Finance data could not be loaded (${error.message}). Showing generated educational data.`
    };
  }

  await enrichCompetitorsFromGoogle(profile, ticker);
  return { profile, prices: generated, yahoo: null, source: "Yahoo Finance returned too little price history. Showing generated educational data." };
}

async function enrichProfileFromDirectory(profile, ticker) {
  if (PROFILES[ticker] || profile.nameSource === "Yahoo Finance") return;
  const match = await findCompanyDirectoryEntry(ticker);
  if (!match) return;
  profile.company = match.name;
  profile.description = `${match.name} (${ticker}) is analyzed with an educational generated profile because detailed fundamentals are not connected yet. The dashboard estimates business mix, risk, profitability, valuation, and technical signals from available price data and seeded fundamentals. For a final investment decision, users should verify filings, competitors, and ratios with a licensed market-data provider.`;
}

async function findCompanyDirectoryEntry(ticker) {
  try {
    if (!companyDirectoryPromise) {
      companyDirectoryPromise = fetch("https://www.sec.gov/files/company_tickers_exchange.json")
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null);
    }
    const directory = await companyDirectoryPromise;
    const row = directory?.data?.find((item) => String(item[2]).toUpperCase() === ticker);
    return row ? { name: row[1], ticker: row[2], exchange: row[3] } : null;
  } catch (error) {
    console.info("Company name lookup unavailable; using generated company label.", error);
    return null;
  }
}

async function fetchJsonWithTimeout(url, timeoutMs = 8000, options = {}) {
  if (window.hawkApi) {
    const result = await window.hawkApi.fetchJson({
      url,
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body || null
    });
    if (!result.ok) throw new Error(result.error || `Request failed with status ${result.status}`);
    const data = result.data;
    if (data?.Note || data?.Information) throw new Error(data.Note || data.Information);
    if (data?.["Error Message"]) throw new Error(data["Error Message"]);
    return data;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  const data = await response.json();
  if (data.Note || data.Information) throw new Error(data.Note || data.Information);
  if (data["Error Message"]) throw new Error(data["Error Message"]);
  return data;
}


async function fetchYahooChart(ticker) {
  const yahooSymbol = normalizeYahooSymbol(ticker);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?range=5y&interval=1mo&events=div%2Csplits`;
  const data = await fetchJsonWithTimeout(url, 9000);
  const result = data.chart?.result?.[0];
  if (!result) throw new Error(data.chart?.error?.description || "Yahoo Finance chart data was not returned.");
  const timestamps = result.timestamp || [];
  const close = result.indicators?.quote?.[0]?.close || [];
  const points = timestamps
    .map((stamp, index) => ({ stamp, close: Number(close[index]) }))
    .filter((point) => Number.isFinite(point.stamp) && Number.isFinite(point.close))
    .slice(-61);
  const prices = points.map((point) => point.close);
  const labels = points.map((point) => new Date(point.stamp * 1000).toLocaleDateString(undefined, { month: "short", year: "2-digit" }));
  const quote = Number(result.meta?.regularMarketPrice);
  if (Number.isFinite(quote) && prices.length) prices[prices.length - 1] = quote;
  return {
    prices,
    labels,
    quote: Number.isFinite(quote) ? quote : prices.at(-1),
    currency: result.meta?.currency || "USD",
    yahooUrl: `https://finance.yahoo.com/quote/${encodeURIComponent(yahooSymbol)}/chart/`
  };
}

async function fetchYahooSearchProfile(ticker) {
  const yahooSymbol = normalizeYahooSymbol(ticker);
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(yahooSymbol)}&quotesCount=8&newsCount=0`;
  const data = await fetchJsonWithTimeout(url, 7000);
  const quotes = data.quotes || [];
  const normalizedTicker = yahooSymbol;
  const quote = quotes.find((item) => normalizeYahooSymbol(item.symbol) === normalizedTicker);
  if (!quote) return null;
  const name = quote.longname || quote.shortname || quote.displayName || quote.name;
  return name ? {
    name,
    symbol: quote.symbol,
    quoteType: quote.quoteType || quote.typeDisp || "",
    exchange: quote.exchDisp || quote.exchange || ""
  } : null;
}

function normalizeYahooSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\./g, "-");
}

function applyYahooSearchProfile(profile, yahooProfile, ticker) {
  const name = cleanSecurityName(yahooProfile.name);
  if (!name) return;
  profile.company = name;
  profile.nameSource = "Yahoo Finance";
  profile.instrumentType = yahooProfile.quoteType || profile.instrumentType || "security";
  if (profile.generatedProfile || /analyzed with an educational generated profile/i.test(profile.description)) {
    const type = yahooProfile.quoteType && yahooProfile.quoteType !== "EQUITY" ? yahooProfile.quoteType.toLowerCase().replace(/_/g, " ") : "security";
    profile.description = `${name} (${ticker}) is a ${type} identified through Yahoo Finance symbol lookup. The dashboard analyzes price trend, risk, valuation-style signals, momentum, and report context using the data sources configured in Settings. For a final investment decision, users should verify holdings, fees, filings, and peer comparisons with official issuer and market-data sources.`;
  }
}

function cleanSecurityName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+-\s+Yahoo Finance$/i, "")
    .trim();
}

async function fetchAlphaMonthlySeries(ticker, apiKey) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${encodeURIComponent(ticker)}&apikey=${encodeURIComponent(apiKey)}`;
  const data = await fetchJsonWithTimeout(url);
  const series = data["Monthly Time Series"];
  if (!series) throw new Error("Monthly time series was not returned.");
  return Object.entries(series)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-61)
    .map(([, values]) => Number(values["4. close"]))
    .filter((value) => Number.isFinite(value));
}

async function fetchAlphaGlobalQuote(ticker, apiKey) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${encodeURIComponent(apiKey)}`;
  const data = await fetchJsonWithTimeout(url);
  const price = Number(data["Global Quote"]?.["05. price"]);
  return Number.isFinite(price) ? price : null;
}

async function fetchAlphaOverview(ticker, apiKey) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(ticker)}&apikey=${encodeURIComponent(apiKey)}`;
  return fetchJsonWithTimeout(url);
}

async function enrichCompetitorsFromGoogle(profile, ticker) {
  const key = localStorage.getItem(GOOGLE_SEARCH_KEY);
  const cx = localStorage.getItem(GOOGLE_SEARCH_CX);
  if (!key || !cx) return;

  try {
    const query = `${profile.company} ${ticker} stock top competitors`;
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}&num=6&gl=us&hl=en&dateRestrict=y2`;
    const data = await fetchJsonWithTimeout(url, 9000);
    const results = (data.items || []).slice(0, 6).map((item) => ({
      title: stripTags(item.title || ""),
      snippet: stripTags(item.snippet || ""),
      link: item.link || ""
    }));
    const names = extractCompetitorNames(results, ticker, profile.company);
    if (names.length) {
      profile.competitors = names.slice(0, 3);
      profile.competitorSource = "Google Programmable Search";
      profile.competitorResearch = results.slice(0, 3);
    }
  } catch (error) {
    console.info("Google competitor research unavailable.", error);
  }
}

function stripTags(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value);
  return template.content.textContent || "";
}

function extractCompetitorNames(results, ticker, companyName) {
  const text = results.map((item) => `${item.title}. ${item.snippet}`).join(" ");
  const blocked = new Set([
    String(ticker).toLowerCase(),
    String(ticker).toUpperCase(),
    "stock",
    "stocks",
    "competitors",
    "alternatives",
    "marketbeat",
    "yahoo",
    "finance",
    "nasdaq",
    "motley",
    "fool",
    "zacks",
    "google",
    "search"
  ]);
  String(companyName).split(/\s+/).forEach((part) => blocked.add(part.toLowerCase().replace(/[^a-z0-9]/g, "")));

  const candidates = [];
  const competitorSections = [...text.matchAll(/(?:competitors|alternatives|peers)(?:\s+(?:include|are|such as))?\s*[:\-]?\s*([^.;]+)/gi)];
  competitorSections.forEach((match) => {
    match[1]
      .split(/,| and | vs\.? | versus |\/|\|/i)
      .map(cleanCompetitorName)
      .filter(Boolean)
      .forEach((name) => candidates.push(name));
  });

  const namePattern = /\b([A-Z][A-Za-z&.'-]+(?:\s+[A-Z][A-Za-z&.'-]+){0,3}(?:\s+(?:Inc|Corp|Corporation|Company|PLC|Ltd|Limited|Platforms|Technologies|Systems|Group|Holdings|Software|Semiconductor|Electronics|Pharmaceuticals|Bancorp|Bank))?)\b/g;
  [...text.matchAll(namePattern)]
    .map((match) => cleanCompetitorName(match[1]))
    .filter(Boolean)
    .forEach((name) => candidates.push(name));

  const tickerBlocks = new Set([
    String(ticker).toUpperCase(),
    "ETF",
    "NYSE",
    "NASDAQ",
    "AMEX",
    "USD",
    "CEO",
    "CFO",
    "SEC",
    "IPO",
    "EPS",
    "PE",
    "ETFDB"
  ]);
  [...text.matchAll(/\b[A-Z]{2,5}\b/g)]
    .map((match) => match[0])
    .filter((symbol) => !tickerBlocks.has(symbol))
    .forEach((symbol) => candidates.push(symbol));

  return [...new Set(candidates)]
    .filter((name) => {
      const compact = name.toLowerCase().replace(/[^a-z0-9]/g, "");
      return compact.length > 2 && !blocked.has(compact) && !blocked.has(name.toLowerCase());
    })
    .slice(0, 3);
}

function cleanCompetitorName(value) {
  return String(value || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\b(?:NYSE|NASDAQ|Nasdaq|Stock|Stocks|Ticker|Quote|Inc\.?|Corp\.?)\b/g, "")
    .replace(/^[^A-Za-z]+|[^A-Za-z0-9.&' -]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeLatestQuote(monthly, quote) {
  const prices = monthly.slice(-61);
  if (quote && Number.isFinite(quote) && prices.length) prices[prices.length - 1] = quote;
  return prices;
}

function alphaNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function alphaPercent(value) {
  const number = alphaNumber(value);
  return number === null ? null : number * 100;
}

function applyAlphaOverview(profile, overview, ticker) {
  if (!overview || Object.keys(overview).length === 0) return;
  if (profile.nameSource !== "Yahoo Finance") profile.company = overview.Name || profile.company || `${ticker} Corporation`;
  if (overview.Description) profile.description = overview.Description;
  const ratios = profile.ratios;
  ratios.netMargin = alphaPercent(overview.ProfitMargin) ?? ratios.netMargin;
  ratios.roa = alphaPercent(overview.ReturnOnAssetsTTM) ?? ratios.roa;
  ratios.roe = alphaPercent(overview.ReturnOnEquityTTM) ?? ratios.roe;
  ratios.epsGrowth = alphaPercent(overview.QuarterlyEarningsGrowthYOY) ?? ratios.epsGrowth;
  ratios.revenueGrowth = alphaPercent(overview.QuarterlyRevenueGrowthYOY) ?? ratios.revenueGrowth;
  ratios.pe = alphaNumber(overview.PERatio) ?? ratios.pe;
  ratios.peg = alphaNumber(overview.PEGRatio) ?? ratios.peg;
  ratios.pb = alphaNumber(overview.PriceToBookRatio) ?? ratios.pb;
  profile.bonds.rating = overview.AnalystRatingStrongBuy ? "Equity analyst ratings available through Alpha Vantage overview" : profile.bonds.rating;
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

function scoreHigher(value, weak, strong) {
  return clamp(((value - weak) / (strong - weak)) * 100);
}

function scoreLower(value, strong, weak) {
  return clamp(((weak - value) / (weak - strong)) * 100);
}

function scoreIdeal(value, low, high, tolerance) {
  if (value >= low && value <= high) return 100;
  if (value < low) return clamp(100 - ((low - value) / tolerance) * 100);
  return clamp(100 - ((value - high) / tolerance) * 100);
}

function weightedScore(parts) {
  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0);
  return parts.reduce((sum, part) => sum + clamp(part.score) * part.weight, 0) / totalWeight;
}

function calculateRatingScore(metrics) {
  const r = metrics.ratios;
  const trendAboveShort = metrics.currentPrice > metrics.sma10;
  const trendAboveLong = metrics.currentPrice > metrics.sma50;
  const range = metrics.resistance - metrics.support;
  const rangePosition = range > 0 ? ((metrics.currentPrice - metrics.support) / range) * 100 : 50;

  const performance = weightedScore([
    { score: scoreHigher(metrics.stockReturn - metrics.marketReturn, -30, 45), weight: 0.6 },
    { score: scoreHigher(metrics.stockReturn, -20, 85), weight: 0.4 }
  ]);
  const risk = weightedScore([
    { score: scoreLower(metrics.volatility, 9, 28), weight: 0.35 },
    { score: scoreHigher(metrics.marketVol - metrics.volatility, -12, 8), weight: 0.25 },
    { score: scoreIdeal(metrics.beta, 0.75, 1.25, 1.1), weight: 0.25 },
    { score: scoreIdeal(Math.abs(metrics.corr), 0.25, 0.85, 0.45), weight: 0.15 }
  ]);
  const fundamentals = weightedScore([
    { score: scoreIdeal(r.currentRatio, 1.2, 3.0, 1.4), weight: 0.11 },
    { score: scoreLower(r.debtEquity, 0.35, 1.8), weight: 0.12 },
    { score: scoreLower(r.ltDebtEquity, 0.3, 1.6), weight: 0.08 },
    { score: scoreHigher(r.netMargin, 4, 32), weight: 0.13 },
    { score: scoreHigher(r.roa, 3, 22), weight: 0.1 },
    { score: scoreHigher(r.roe, 8, 40), weight: 0.1 },
    { score: scoreHigher(r.epsGrowth, -5, 28), weight: 0.1 },
    { score: scoreHigher(r.revenueGrowth, -2, 24), weight: 0.1 },
    { score: scoreLower(r.peg, 0.8, 3.2), weight: 0.1 },
    { score: scoreIdeal(r.pe, 12, 32, 34), weight: 0.06 }
  ]);
  const technical = weightedScore([
    { score: scoreIdeal(metrics.rsi, 42, 66, 36), weight: 0.35 },
    { score: trendAboveShort && trendAboveLong ? 100 : trendAboveShort || trendAboveLong ? 62 : 32, weight: 0.35 },
    { score: scoreIdeal(rangePosition, 50, 86, 50), weight: 0.2 },
    { score: metrics.currentPrice >= metrics.support ? 80 : 35, weight: 0.1 }
  ]);
  const efficiency = weightedScore([
    { score: scoreLower(Math.abs(metrics.ar1), 0.08, 0.55), weight: 0.55 },
    { score: scoreIdeal(metrics.adjR2, 0.18, 0.72, 0.5), weight: 0.45 }
  ]);

  const score = Math.round(weightedScore([
    { score: performance, weight: 0.24 },
    { score: risk, weight: 0.18 },
    { score: fundamentals, weight: 0.32 },
    { score: technical, weight: 0.18 },
    { score: efficiency, weight: 0.08 }
  ]));

  return {
    score: clamp(score),
    breakdown: {
      performance: Math.round(performance),
      risk: Math.round(risk),
      fundamentals: Math.round(fundamentals),
      technical: Math.round(technical),
      efficiency: Math.round(efficiency)
    }
  };
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
  const adjR2 = adjustedR2(corr, stockReturns.length);
  const ratingResult = calculateRatingScore({
    stockReturn,
    marketReturn,
    volatility,
    marketVol,
    beta,
    corr,
    adjR2,
    ar1,
    rsi: rsiValue,
    currentPrice: last,
    sma10: sma10.at(-1),
    sma50: sma50.at(-1),
    support,
    resistance,
    ratios
  });
  const score = ratingResult.score;
  const rating = score >= 72 ? "Positive" : score >= 55 ? "Neutral" : "Cautious";

  return {
    ticker,
    source,
    profile,
    prices,
    yahoo: null,
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
    adjR2,
    ar1,
    weakForm: Math.abs(ar1) < 0.28,
    rsi: rsiValue,
    sma10,
    sma50,
    currentPrice: last,
    support,
    resistance,
    score,
    rating,
    scoreBreakdown: ratingResult.breakdown
  };
}

function setText(id, value) {
  el(id).textContent = value;
}

function render() {
  setText("company-name", state.profile.company);
  setText("company-description", threeSentenceOverview(state.profile.description));
  renderCompetitors();
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
  loadFinancialNews(state.ticker, state.profile.company);
  scheduleNewsRefresh();
  generateAiContent();
}

function setReportActions(enabled) {
  el("download-report").disabled = !enabled;
  el("print-report").disabled = !enabled;
}

function hasDesktopHistory() {
  return Boolean(window.hawkReports);
}

function threeSentenceOverview(description) {
  const sentences = String(description)
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length < 3) return description;
  return sentences.slice(0, 3).join(" ").trim();
}

function competitorNames(competitors = []) {
  return competitors
    .map((item) => typeof item === "string" ? item : item.name)
    .filter(Boolean)
    .filter((name) => !/^Primary peer \d+$/i.test(name))
    .slice(0, 3);
}

function renderCompetitors() {
  const names = competitorNames(state.profile.competitors);
  if (!names.length) {
    const message = localStorage.getItem(GOOGLE_SEARCH_KEY) && localStorage.getItem(GOOGLE_SEARCH_CX)
      ? "Top competitors: Google competitor research did not return clear peer names for this ticker yet."
      : "Top competitors: Add a Google Search API key and Search Engine ID in Settings to research ticker competitors.";
    el("competitors").textContent = message;
    return;
  }
  const source = state.profile.competitorSource ? ` <span class="competitor-source">Source: ${xmlEscape(state.profile.competitorSource)}.</span>` : "";
  const research = (state.profile.competitorResearch || [])
    .slice(0, 3)
    .filter((item) => item.link && item.title)
    .map((item) => `<a href="${xmlEscape(item.link)}" target="_blank" rel="noreferrer">${xmlEscape(item.title)}</a>`)
    .join(" ");
  const links = research ? `<span class="competitor-source">Research links: ${research}</span>` : "";
  el("competitors").innerHTML = `Top competitors: ${names.map(xmlEscape).join(", ")}.${source}${links}`;
}

function renderCards() {
  el("quant-copy").innerHTML = [
    ["Market comparison", `${state.ticker} returned ${pct(state.stockReturn)} versus ${pct(state.marketReturn)} for the market proxy. This shows whether the stock rewarded investors more or less than broad market exposure.`],
    ["Risk profile", `Monthly volatility is ${pct(state.volatility)}, compared with ${pct(state.marketVol)} for the market proxy. This is the risk side of the return story.`],
    ["Efficiency check", `The AR(1) estimate is ${state.ar1.toFixed(2)}. ${state.weakForm ? "Past monthly returns do not look strongly predictive, which supports weak-form efficiency." : "Past monthly returns show some persistence, so the app flags this for further testing."}`]
  ].map(copyTextCard).join("");

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

function copyTextCard([label, body], className = "technical-card") {
  return `<article class="${className}"><strong>${label}</strong><p>${body}</p></article>`;
}

function setupCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssHeight = rect.height || Number(canvas.getAttribute("height"));
  canvas.width = rect.width * ratio;
  canvas.height = cssHeight * ratio;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, rect.width, cssHeight);
  return { ctx, w: rect.width, h: cssHeight };
}

function grid(ctx, w, h) {
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--chart-grid").trim() || "#e8edf3";
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
  const priceValues = [...state.prices.stock, ...state.sma10.filter(Boolean), ...state.sma50.filter(Boolean)];
  drawLine("price-chart", [state.prices.stock, state.sma10, state.sma50], ["#0d6efd", "#a05a00", "#6f42c1"], Math.min(...priceValues), Math.max(...priceValues));
  labelChart("price-chart", [`${state.ticker} close`, "SMA 10", "SMA 50"]);
  labelPriceAxis("price-chart", Math.min(...priceValues), Math.max(...priceValues), state.prices.stock.at(-1));
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

function labelPriceAxis(canvasId, min, max, latest) {
  const canvas = el(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--chart-text").trim() || "#334155";
  ctx.font = "700 12px system-ui";
  ctx.fillText(`High ${money(max)}`, 52, 48);
  ctx.fillText(`Low ${money(min)}`, 52, Number(canvas.getAttribute("height")) - 18);
  ctx.fillText(`Latest ${money(latest)}`, Math.max(52, canvas.getBoundingClientRect().width - 150), 48);
}

function labelChart(canvasId, labels) {
  const canvas = el(canvasId);
  const ctx = canvas.getContext("2d");
  const colors = ["#0d6efd", "#13866f", "#a05a00", "#6f42c1"];
  labels.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(54 + i * 82, 16, 10, 10);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--chart-text").trim() || "#334155";
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
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--chart-text").trim() || "#334155";
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
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--chart-text").trim() || "#334155";
  ctx.font = "700 13px system-ui";
  ctx.fillText(`Beta ${state.beta.toFixed(2)} | Corr ${state.corr.toFixed(2)} | Adj R2 ${state.adjR2.toFixed(2)}`, 52, 28);
}

function renderReport() {
  const p = state.profile;
  const r = p.ratios;
  const html = `
    <h1>${p.company} (${state.ticker}) Hawk Report</h1>
    <p><strong>Recommendation:</strong> ${state.rating} | <strong>Score:</strong> ${state.score}/100 | <strong>Most recent price:</strong> ${money(state.currentPrice)}</p>
    <p><strong>Score model:</strong> Performance ${state.scoreBreakdown.performance}/100, risk ${state.scoreBreakdown.risk}/100, fundamentals ${state.scoreBreakdown.fundamentals}/100, technicals ${state.scoreBreakdown.technical}/100, and efficiency ${state.scoreBreakdown.efficiency}/100.</p>
    <h2>1. Company Introduction</h2>
    <p>${p.description}</p>
    <p><strong>Top competitors:</strong> ${competitorNames(p.competitors).join(", ")}${p.competitorSource ? ` (${p.competitorSource})` : ""}.</p>
    <p><strong>Revenue breakdown:</strong> ${p.revenue.map(([name, value]) => `${name} ${pct(value)}`).join("; ")}.</p>
    <p><strong>Yahoo Finance chart:</strong> ${state.yahoo?.yahooUrl || `https://finance.yahoo.com/quote/${state.ticker}/chart/`}</p>
    <h2>2. Data Analysis Results</h2>
    <h3>2.1 Quantitative Analysis</h3>
    <h4>5-Year Returns on SPY and ${state.ticker}</h4>
    <p>Over the observed period, ${state.ticker} returned ${pct(state.stockReturn)} compared with ${pct(state.marketReturn)} for the market proxy. This indicates that the stock ${state.stockReturn > state.marketReturn ? "outperformed" : "underperformed"} the broad market and helps frame whether company-specific exposure added value beyond a diversified index.</p>
    <h4>Volatility and Standard Deviation</h4>
    <p>The stock's monthly standard deviation was ${pct(state.volatility)}, while the market proxy's was ${pct(state.marketVol)}. The correlation between stock and market excess returns was ${state.corr.toFixed(2)}, and CAPM beta was ${state.beta.toFixed(2)}. Adjusted R-squared was ${pct(state.adjR2 * 100)}, meaning the remaining variation is company-specific or unexplained by the market model.</p>
    <h4>Covariance, CAPM, and Market Efficiency</h4>
    <p>The AR(1) coefficient was ${state.ar1.toFixed(2)}. ${state.weakForm ? "This supports weak-form efficiency because past monthly returns do not appear strongly useful for predicting current returns." : "This suggests the stock deserves additional efficiency testing because past returns show some persistence."}</p>
    <h3>2.2 Fundamental Analysis</h3>
    <h4>Ratio Analysis</h4>
    <p>The company has a current ratio of ${r.currentRatio.toFixed(2)}, debt-to-equity of ${r.debtEquity.toFixed(2)}, and long-term debt-to-equity of ${r.ltDebtEquity.toFixed(2)}. These values summarize liquidity and leverage risk.</p>
    <p>Profitability is represented by a net margin of ${pct(r.netMargin)}, ROA of ${pct(r.roa)}, and ROE of ${pct(r.roe)}. Growth is represented by EPS growth of ${pct(r.epsGrowth)} and revenue growth of ${pct(r.revenueGrowth)}.</p>
    <p>Valuation uses a P/E ratio of ${r.pe.toFixed(2)}, PEG ratio of ${r.peg.toFixed(2)}, and P/B ratio of ${r.pb.toFixed(2)}. The PEG ratio is especially useful for beginners because it connects price to growth.</p>
    <h4>Bond Analysis and Yield Spread</h4>
    <p><strong>Bond analysis:</strong> ${p.bonds.rating}. ${p.bonds.callable}. Yield spreads in this analysis range from ${Math.min(...p.bonds.spreads.map((x) => x[1])).toFixed(0)} to ${Math.max(...p.bonds.spreads.map((x) => x[1])).toFixed(0)} basis points, which indicates the market's perceived credit risk above Treasury bonds.</p>
    <h3>2.3 Technical Analysis</h3>
    <h4>Trend, Momentum, Support, and Resistance</h4>
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
  const list = el("history-list") || el("settings-history-list");
  const settingsList = el("settings-history-list");
  if (!list && !settingsList) return;

  if (!hasDesktopHistory()) {
    setText("history-status", "SQLite history is active in the Electron desktop app. Browser preview mode can download DOCX reports but cannot write to SQLite.");
    if (list) list.innerHTML = "";
    if (settingsList && settingsList !== list) settingsList.innerHTML = "";
    return;
  }

  const result = await window.hawkReports.list();
  if (!result.ok) {
    setText("history-status", result.error || "Could not load report history.");
    if (list) list.innerHTML = "";
    if (settingsList && settingsList !== list) settingsList.innerHTML = "";
    return;
  }

  setText("history-status", result.reports.length ? "Saved DOCX reports are listed below. Open uses your system default editor for .docx files." : "No saved reports yet.");
  const historyHtml = result.reports.map((report) => `
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
  if (list) list.innerHTML = historyHtml;
  if (settingsList && settingsList !== list) settingsList.innerHTML = historyHtml;
}



function reportDataForPrompt() {
  return {
    ticker: state.ticker,
    company: state.profile.company,
    description: state.profile.description,
    competitors: competitorNames(state.profile.competitors),
    competitorResearch: state.profile.competitorResearch || [],
    currentPrice: state.currentPrice,
    stockReturn: state.stockReturn,
    marketReturn: state.marketReturn,
    volatility: state.volatility,
    marketVolatility: state.marketVol,
    beta: state.beta,
    correlation: state.corr,
    adjustedR2: state.adjR2,
    rsi: state.rsi,
    support: state.support,
    resistance: state.resistance,
    rating: state.rating,
    score: state.score,
    scoreBreakdown: state.scoreBreakdown,
    ratios: state.profile.ratios,
    yahooFinanceChart: state.yahoo?.yahooUrl || `https://finance.yahoo.com/quote/${state.ticker}/chart/`
  };
}

async function generateAiContent() {
  const key = localStorage.getItem(OPENAI_KEY);
  if (!key || !state) return;
  const model = localStorage.getItem(OPENAI_MODEL) || "gpt-4.1-mini";
  const snapshot = JSON.stringify(reportDataForPrompt(), null, 2);
  try {
    setText("company-description", "AI is writing a 3 sentence overview...");
    const overview = await callOpenAI(model, key, `Write exactly 3 beginner-friendly sentences overviewing this stock for a student investment report. Use only the supplied data and avoid investment advice language.\n\nDATA:\n${snapshot}`);
    if (overview) setText("company-description", overview.replace(/\s+/g, " ").trim());

    el("report-preview").innerHTML = '<p class="muted">AI is writing the detailed Hawk Report...</p>';
    const report = await callOpenAI(model, key, `Write a detailed Hawk Report as safe HTML using only h1, h2, h3, h4, and p tags. Base the structure on this template: 1 Company Introduction; revenue breakdown; 2 Data Analysis Results; 2.1 Quantitative Analysis covering 5-year returns, volatility/standard deviation, covariance/correlation, CAPM beta, weak-form market efficiency; 2.2 Fundamental Analysis covering ratio analysis, valuation, bond/yield spread; 2.3 Technical Analysis covering SMA, RSI, support, resistance; 3 Conclusion. Mention the Yahoo Finance chart link as the source for market chart imagery. Make it beginner-friendly but detailed, similar to a student Hawk Report.\n\nDATA:\n${snapshot}`);
    if (report) el("report-preview").innerHTML = sanitizeReportHtml(report);
  } catch (error) {
    console.info("AI report generation unavailable.", error);
    renderReport();
    setText("api-status", `AI generation failed: ${error.message}`);
  }
}

async function callOpenAI(model, apiKey, prompt) {
  const data = await fetchJsonWithTimeout("https://api.openai.com/v1/responses", 30000, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: prompt,
      temperature: 0.3
    })
  });
  return data.output_text || data.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("\n") || "";
}

function sanitizeReportHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const allowed = new Set(["H1", "H2", "H3", "H4", "P", "STRONG", "EM", "BR"]);
  template.content.querySelectorAll("*").forEach((node) => {
    if (!allowed.has(node.tagName)) {
      const p = document.createElement("p");
      p.textContent = node.textContent;
      node.replaceWith(p);
      return;
    }
    [...node.attributes].forEach((attr) => node.removeAttribute(attr.name));
  });
  return template.innerHTML;
}

function reportBlocks() {
  const blocks = [];
  el("report-preview").querySelectorAll("h1,h2,h3,h4,p").forEach((node) => {
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
  const style = block.tag === "h1" ? "Title" : block.tag === "h2" ? "Heading1" : block.tag === "h3" ? "Heading2" : block.tag === "h4" ? "Heading3" : "Normal";
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
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="F97316"/></w:rPr><w:pPr><w:spacing w:before="180" w:after="100"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="EA580C"/></w:rPr><w:pPr><w:spacing w:before="120" w:after="80"/></w:pPr></w:style>
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



function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

function applyAuthState() {
  const session = getSession();
  const authenticated = Boolean(session?.username);
  document.body.classList.toggle("auth-locked", !authenticated);
  el("app-shell").setAttribute("aria-hidden", String(!authenticated));
  el("login-screen").setAttribute("aria-hidden", String(authenticated));
  setText("session-role", authenticated ? session.username : "--");
}

function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const role = new FormData(form).get("role");
  const username = String(new FormData(form).get("username") || "").trim();
  const password = String(new FormData(form).get("password") || "").trim();

  if (!username || !password) {
    setText("login-error", "Please enter both a username and a password.");
    return;
  }

  sessionStorage.setItem(AUTH_KEY, JSON.stringify({ role, username, signedInAt: new Date().toISOString() }));
  form.reset();
  setText("login-error", "");
  applyAuthState();
}

function handleLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  applyAuthState();
  el("login-password").focus();
}

async function runAnalysis(ticker) {
  const normalized = String(ticker || "").trim().toUpperCase();
  if (!normalized) {
    setText("data-source", "Please enter a ticker symbol before analyzing.");
    return;
  }
  state = null;
  resetVisuals();
  setText("data-source", "Loading analysis...");
  setReportActions(false);
  const data = await loadTickerData(normalized);
  state = analyze(data.profile, data.prices, normalized, data.source);
  state.yahoo = data.yahoo || null;
  recordTicker(normalized);
  render();
}

function resetVisuals() {
  ["price-chart", "return-chart", "scatter-chart", "valuation-chart", "spread-chart"].forEach((id) => {
    const canvas = el(id);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.clientWidth;
    canvas.height = Number(canvas.getAttribute("height"));
  });
  ["quant-copy", "ratio-grid", "technical-grid"].forEach((id) => { if (el(id)) el(id).innerHTML = ""; });
  el("report-preview").innerHTML = '<p class="muted">Loading a fresh report for the new ticker...</p>';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("hawk-theme", theme);
  const dark = theme === "dark";
  const button = el("theme-toggle");
  button.setAttribute("aria-checked", String(dark));
  button.querySelector(".switch-icon").textContent = dark ? "☾" : "☀";
  if (state) drawAllCharts();
}



function getRecentTickers() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_TICKERS)) || [];
  } catch {
    return [];
  }
}

function recordTicker(ticker) {
  const recent = [ticker, ...getRecentTickers().filter((item) => item !== ticker)].slice(0, 10);
  localStorage.setItem(RECENT_TICKERS, JSON.stringify(recent));
  updateTickerHistoryUI();
}

function getNewsRefreshMinutes() {
  const value = Number(localStorage.getItem(NEWS_REFRESH_MINUTES) || "30");
  return Number.isFinite(value) && value >= 1 ? value : 30;
}

function scheduleNewsRefresh() {
  if (newsRefreshTimer) clearInterval(newsRefreshTimer);
  if (!state) return;
  const minutes = getNewsRefreshMinutes();
  newsRefreshTimer = setInterval(() => {
    if (state) loadFinancialNews(state.ticker, state.profile.company);
  }, minutes * 60 * 1000);
  setText("api-status", `News will auto-refresh every ${minutes} minute${minutes === 1 ? "" : "s"} for the current ticker.`);
}

function updateTickerHistoryUI() {
  const enabled = localStorage.getItem(SHOW_TICKER_HISTORY) !== "false";
  el("ticker").toggleAttribute("list", enabled);
  if (enabled) el("ticker").setAttribute("list", "ticker-history-list");
  const recent = getRecentTickers();
  el("ticker-history-list").innerHTML = enabled ? recent.map((ticker) => `<option value="${ticker}"></option>`).join("") : "";
  const settingsList = el("settings-ticker-history");
  if (settingsList) settingsList.innerHTML = recent.length ? recent.map((ticker) => `<button type="button" class="ticker-pill" data-use-ticker="${ticker}">${ticker}</button>`).join("") : '<p class="muted">No recent tickers yet.</p>';
  const checkbox = el("show-ticker-history");
  if (checkbox) checkbox.checked = enabled;
}

function loadApiSettings() {
  el("openai-key").value = localStorage.getItem(OPENAI_KEY) || "";
  el("openai-model").value = localStorage.getItem(OPENAI_MODEL) || "gpt-4.1-mini";
  el("alpha-vantage-key").value = localStorage.getItem(ALPHA_VANTAGE_KEY) || "";
  el("newsdata-key").value = localStorage.getItem(NEWSDATA_KEY) || "";
  el("unsplash-key").value = localStorage.getItem(UNSPLASH_KEY) || "";
  el("google-search-key").value = localStorage.getItem(GOOGLE_SEARCH_KEY) || "";
  el("google-search-cx").value = localStorage.getItem(GOOGLE_SEARCH_CX) || "";
  el("news-refresh-minutes").value = String(getNewsRefreshMinutes());
  updateTickerHistoryUI();
}

function saveApiSettings() {
  localStorage.setItem(OPENAI_KEY, el("openai-key").value.trim());
  localStorage.setItem(OPENAI_MODEL, el("openai-model").value.trim() || "gpt-4.1-mini");
  localStorage.setItem(ALPHA_VANTAGE_KEY, el("alpha-vantage-key").value.trim());
  localStorage.setItem(NEWSDATA_KEY, el("newsdata-key").value.trim());
  localStorage.setItem(UNSPLASH_KEY, el("unsplash-key").value.trim());
  localStorage.setItem(GOOGLE_SEARCH_KEY, el("google-search-key").value.trim());
  localStorage.setItem(GOOGLE_SEARCH_CX, el("google-search-cx").value.trim());
  localStorage.setItem(SHOW_TICKER_HISTORY, String(el("show-ticker-history").checked));
  const refreshMinutes = Math.max(1, Math.min(240, Number(el("news-refresh-minutes").value) || 30));
  localStorage.setItem(NEWS_REFRESH_MINUTES, String(refreshMinutes));
  el("news-refresh-minutes").value = String(refreshMinutes);
  updateTickerHistoryUI();
  scheduleNewsRefresh();
  setText("api-status", `Settings saved locally. News will auto-refresh every ${refreshMinutes} minute${refreshMinutes === 1 ? "" : "s"}.`);
  if (state) {
    runAnalysis(state.ticker);
  }
}

async function loadFinancialNews(ticker, companyName) {
  const newsKey = localStorage.getItem(NEWSDATA_KEY);
  const carousel = el("news-carousel");
  if (!carousel) return;
  if (!newsKey) {
    renderNewsSlides(fallbackNewsSlides(ticker, companyName, "Add a NewsData.io key in Settings for live recent headlines."));
    return;
  }

  try {
    const query = `${ticker} stock`;
    const url = `https://newsdata.io/api/1/latest?apikey=${encodeURIComponent(newsKey)}&q=${encodeURIComponent(query)}&language=en&category=business`;
    const data = await fetchJsonWithTimeout(url, 9000);
    const articles = (data.results || []).slice(0, 6);
    const slides = await Promise.all(articles.map(async (article) => ({
      title: article.title || `${companyName} market news`,
      description: article.description || article.source_name || "Recent business headline.",
      link: article.link || "",
      image: article.image_url || await fetchUnsplashImage(`${companyName} stock market`)
    })));
    renderNewsSlides(slides.length ? slides.map((slide, index) => ({
      ...slide,
      image: slide.image || fallbackNewsImage(ticker, slide.title, index)
    })) : fallbackNewsSlides(ticker, companyName, "NewsData.io did not return recent headlines for this ticker."));
  } catch (error) {
    renderNewsSlides(fallbackNewsSlides(ticker, companyName, `Live news could not load: ${error.message}`));
  }
}

function fallbackNewsSlides(ticker, companyName, note) {
  const yahooNews = `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/news/`;
  const slides = [
    {
      title: `${companyName} (${ticker}) market snapshot`,
      description: `${note} Review the latest price trend, risk score, and recommendation while live headlines refresh.`,
      link: yahooNews
    },
    {
      title: `${ticker} valuation and fundamentals watch`,
      description: "Use the ratio cards and Hawk Report to compare profitability, growth, leverage, and valuation before reading outside research.",
      link: yahooNews
    },
    {
      title: `${ticker} technical trend check`,
      description: "The chart section updates moving averages, RSI, support, and resistance from the analyzed ticker's price history.",
      link: yahooNews
    }
  ];
  return slides.map((slide, index) => ({
    ...slide,
    image: fallbackNewsImage(ticker, slide.title, index)
  }));
}

function fallbackNewsImage(ticker, title, index) {
  const palettes = [
    ["#0f766e", "#f59e0b", "#eff6ff"],
    ["#2563eb", "#16a34a", "#f8fafc"],
    ["#7c3aed", "#f97316", "#fdf2f8"]
  ];
  const [primary, accent, background] = palettes[index % palettes.length];
  const safeTicker = xmlEscape(String(ticker).slice(0, 8));
  const safeTitle = xmlEscape(String(title).slice(0, 54));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
    <rect width="720" height="420" fill="${background}"/>
    <path d="M0 320 C120 240 170 280 260 205 C350 130 420 180 510 92 C585 20 640 38 720 8 L720 420 L0 420 Z" fill="${primary}" opacity=".14"/>
    <path d="M68 298 L198 236 L310 258 L438 154 L604 184" fill="none" stroke="${primary}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="604" cy="184" r="24" fill="${accent}"/>
    <rect x="58" y="54" width="172" height="58" rx="12" fill="${primary}"/>
    <text x="84" y="94" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#fff">${safeTicker}</text>
    <text x="58" y="366" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#111827">${safeTitle}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function fetchUnsplashImage(query) {
  const key = localStorage.getItem(UNSPLASH_KEY);
  if (!key) return "";
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${encodeURIComponent(key)}`;
    const data = await fetchJsonWithTimeout(url, 7000);
    return data.results?.[0]?.urls?.small || "";
  } catch {
    return "";
  }
}

function renderNewsSlides(slides) {
  const carousel = el("news-carousel");
  if (newsTimer) clearInterval(newsTimer);
  carousel.innerHTML = slides.map((slide, index) => {
    const image = slide.image ? `style="background-image: url('${slide.image.replace(/'/g, "%27")}')"` : "";
    const body = `<div class="news-image ${slide.image ? "" : "placeholder"}" ${image}></div><strong>${xmlEscape(slide.title)}</strong><span>${xmlEscape(String(slide.description || "").slice(0, 140))}</span>`;
    return `<article class="news-slide ${index === 0 ? "active" : ""}">${slide.link ? `<a href="${slide.link}" target="_blank" rel="noreferrer">${body}</a>` : body}</article>`;
  }).join("");
  let active = 0;
  newsTimer = setInterval(() => {
    const items = [...carousel.querySelectorAll(".news-slide")];
    if (items.length < 2) return;
    items[active].classList.remove("active");
    active = (active + 1) % items.length;
    items[active].classList.add("active");
  }, 5500);
}

document.getElementById("login-form").addEventListener("submit", handleLogin);
document.getElementById("logout-button").addEventListener("click", handleLogout);

document.getElementById("stock-form").addEventListener("submit", (event) => {
  event.preventDefault();
  runAnalysis(new FormData(event.currentTarget).get("ticker"));
});

document.addEventListener("click", async (event) => {
  const topicButton = event.target.closest("[data-topic]");
  if (topicButton) showTopic(topicButton.dataset.topic);

  const useTicker = event.target.closest("[data-use-ticker]");
  if (useTicker) {
    el("ticker").value = useTicker.dataset.useTicker;
    runAnalysis(useTicker.dataset.useTicker);
  }

  const openReport = event.target.closest("[data-open-report]");
  if (openReport && window.hawkReports) {
    const result = await window.hawkReports.open(openReport.dataset.openReport);
    if (!result.ok) setText("history-status", result.error || "Could not open report.");
  }

  const revealReport = event.target.closest("[data-reveal-report]");
  if (revealReport && window.hawkReports) {
    const result = await window.hawkReports.reveal(revealReport.dataset.revealReport);
    if (!result.ok) setText("history-status", result.error || "Could not show report file.");
  }
});

document.getElementById("close-info-modal").addEventListener("click", () => el("info-modal").close());
document.getElementById("download-report").addEventListener("click", downloadReport);
document.getElementById("settings-button").addEventListener("click", () => {
  updateTickerHistoryUI();
  loadReportHistory();
  el("settings-modal").showModal();
});
document.getElementById("close-settings").addEventListener("click", () => el("settings-modal").close());
document.getElementById("show-ticker-history").addEventListener("change", saveApiSettings);
document.getElementById("save-api-keys").addEventListener("click", saveApiSettings);
document.getElementById("refresh-history")?.addEventListener("click", loadReportHistory);
document.getElementById("refresh-news").addEventListener("click", () => state && loadFinancialNews(state.ticker, state.profile.company));
document.getElementById("theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
document.getElementById("print-report").addEventListener("click", () => {
  if (state) window.print();
});
window.addEventListener("resize", () => state && drawAllCharts());

loadApiSettings();
applyTheme(localStorage.getItem("hawk-theme") || "light");
applyAuthState();
loadReportHistory();
setReportActions(false);

const initialTicker = new URLSearchParams(window.location.search).get("ticker");
if (initialTicker) {
  el("ticker").value = initialTicker.toUpperCase();
  runAnalysis(initialTicker);
}
