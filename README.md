# Hawk Fund Stock Analyzer

A beginner-friendly stock analysis desktop app inspired by SUNY New Paltz Hawk Fund research reports. Users enter a ticker symbol, the app retrieves market data, explains the calculations in plain language, creates visuals, and generates an editable Hawk Report.

## Purpose

The goal of this app is to help students more easily understand the research process and produce Hawk-style reports in a digestible format.

As a former Student Stock Analyst for the SUNY New Paltz Hawk Fund, I was inspired by the stock analysis reports I created to assist the club's investment decisions that were made on behalf of the school. Each report required:

- Selecting a stock or ETF
- Conducting quantitative analysis
- Conducting fundamental analysis
- Conducting technical analysis
- Synthesizing findings
- Making a recommendation

## Preview

<img width="1464" height="779" alt="Screenshot 2026-06-15 at 2 48 59 PM" src="https://github.com/user-attachments/assets/a97129a1-ef73-40d7-95e4-13052aab2af8" />

## Current Features

- Analyze any ticker symbol entered by the user.
- Retrieve the real ticker name from Yahoo Finance symbol search, such as `VOO` resolving to `Vanguard S&P 500 ETF`.
- Display price, return, volatility, CAPM beta, RSI, support, resistance, moving averages, and other beginner-friendly metrics.
- Generate charts for price trends, moving averages, returns, CAPM relationship, valuation, and bond spread context.
- Show clickable calculation labels with definition popups.
- Create a weighted recommendation score using performance, risk, fundamentals, technicals, and market-efficiency signals.
- Display recent financial news cards with images.
- Use Google Programmable Search to research and display top competitors or comparable tickers when configured.
- Generate a Hawk Report preview and save a DOCX report.
- Store generated report history in a local SQLite database in the Electron desktop app.
- Support light and dark mode from Settings.
- Keep optional recent ticker history in the ticker input.

## Data Sources

The app uses several data sources depending on which settings are configured:

- Yahoo Finance: ticker display names, chart data, latest quote/close data, and Yahoo chart links.
- Alpha Vantage: optional fundamentals backup through the Overview API.
- NewsData.io: optional live financial news headlines.
- Unsplash: optional fallback images for news cards.
- Google Programmable Search Engine: optional competitor and comparable-company research.
- OpenAI: optional AI-generated 3 sentence overview and detailed Hawk Report text.

API keys are saved locally in the app profile through the Settings panel.

## Required and Optional API Keys

Yahoo Finance lookup does not require a user API key.

Optional keys can be added in Settings:

- OpenAI API Key and model name for AI-written overviews and reports.
- Alpha Vantage API Key for richer fundamentals.
- NewsData.io API Key for live financial news.
- Unsplash Access Key for news images.
- Google Search API Key and Google Programmable Search Engine ID (`cx`) for competitor research.

For Google Programmable Search, create a search engine at:

https://programmablesearchengine.google.com/about/

Then add both the API key and the Search Engine ID in Settings.

## Running the App

Install dependencies and start the Electron desktop app from the `src` folder:

```bash
cd src
npm install
npm start
```

The desktop app is the recommended way to run the project because it includes the Electron API bridge for Yahoo Finance, Google Search, NewsData.io, Unsplash, OpenAI, and SQLite report history.

## Browser Preview

You can preview the UI in a browser from the `src` folder:

```bash
cd src
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

Browser preview mode is useful for layout checks, but some external APIs may be blocked by browser CORS rules. SQLite report history is only available in the Electron desktop app.

## Report History

In the Electron app, saved DOCX reports are tracked in a local SQLite database. Reports can be opened in an external Word editor such as Microsoft Word, Apple Pages, or another `.docx`-compatible editor.

The database and saved reports live in the app's local user data folder on the user's device.

## Testing

The project includes a lightweight test folder:

```bash
node tests/run-all.js
```

The tests include:

- Smoke tests for major app wiring, settings fields, SQLite wiring, Google Search wiring, modal controls, and news/report behavior.
- Unit tests for standalone financial calculation helpers.

## Notes

- The recommendation score is educational and should not be treated as financial advice.
- The app is designed for beginner-friendly learning and report drafting.
- Users should verify important financial data with official filings, issuer pages, and licensed market-data providers before making real investment decisions.
