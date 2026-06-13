# Stock Analysis Tool
A beginner-friendly stock analysis desktop app scaffold for Windows and macOS. It includes visuals, calculations, vocabulary assistance, and generates reports. 

As a former Student Stock Analyst for the SUNY New Paltz Hawk Fund, I was inspired by the stock analysis reports I created to help the club make investment decisions on behalf of the school. Each report required:

• Selecting a stock
<br>• Conducting quantitative analysis
<br>• Conducting fundamental analysis
<br>• Conducting technical analysis
<br>• Synthesizing findings
<br>• Making a buy/hold/sell recommendation

My goal with this tool is to help current students in the club more easily navigate and produce these reports.




Company introduction and revenue mix
5-year stock vs. market returns
Volatility and standard deviation
Covariance, correlation, and CAPM beta
Weak-form market efficiency checks
Fundamental ratio analysis
Bond rating and yield spread interpretation
Technical analysis with SMA, RSI, support, and resistance

A Word-compatible report export
Run as a local web app
python3 -m http.server 4173
Then open http://localhost:4173.
Run as a desktop app
npm install
npm start
Build installers
npm run build:mac
npm run build:win
The current build works offline with seeded educational data and tries to load public daily prices when available. For production, connect the loadTickerData function in app.js to a licensed market-data provider and a fundamentals API.