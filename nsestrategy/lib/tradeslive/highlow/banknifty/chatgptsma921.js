const fetch = require('node-fetch');
const { SMA, EMA, WMA, ATR } = require('technicalindicators');
const historyData = require('./historydata');

// Function to fetch Bank Nifty data (assuming you have an API)
async function fetchBankNiftyData() {
    const fromDate = "2024-07-01 09:15:00"
    const toDate = "2024-07-03 15:30:00";
  const response = await historyData({
    interval: "1minute",
    fromDate:fromDate,
    toDate:toDate,
    exchangeCode:"NSE",
    productType:"margin",
}) // Replace with your actual API endpoint

  return response.Success;
}

// Function to calculate moving averages and ATR
function calculateIndicators(data, shortWindow, longWindow, atrPeriod, movingAverageType) {
  let shortMA, longMA, atr;

  switch (movingAverageType) {
    case 'SMA':
      shortMA = SMA.calculate({ period: shortWindow, values: data.map(d => d.close) });
      longMA = SMA.calculate({ period: longWindow, values: data.map(d => d.close) });
      break;
    case 'EMA':
      shortMA = EMA.calculate({ period: shortWindow, values: data.map(d => d.close) });
      longMA = EMA.calculate({ period: longWindow, values: data.map(d => d.close) });
      break;
    case 'WMA':
      shortMA = WMA.calculate({ period: shortWindow, values: data.map(d => d.close) });
      longMA = WMA.calculate({ period: longWindow, values: data.map(d => d.close) });
      break;
    default:
      throw new Error('Invalid moving average type. Choose "SMA", "EMA", or "WMA".');
  }

  atr = ATR.calculate({
    period: atrPeriod,
    high: data.map(d => d.high),
    low: data.map(d => d.low),
    close: data.map(d => d.close)
  });

  return { shortMA, longMA, atr };
}

// Function to generate signals
function generateSignals(data, shortMA, longMA, shortWindow, longWindow) {
  const signals = [];
  const startIndex = Math.max(shortWindow, longWindow);

  // console.log("data here", data[0]);
  for (let i = startIndex+1; i < data.length; i++) {
    const signal = {
      time: data[i].datetime,
      close: data[i].close,
      shortMA: shortMA[i - shortWindow],
      longMA: longMA[i - longWindow],
      position: 0,
    };

    if ((shortMA[i - shortWindow] > longMA[i - longWindow]) && (shortMA[i - 1- shortWindow] < longMA[i -1- longWindow])) {
      signal.position = 1; // Buy signal
    } else if ((shortMA[i - shortWindow] < longMA[i - longWindow]) && (shortMA[i - 1- shortWindow] > longMA[i -1- longWindow])) {
      signal.position = -1; // Sell signal
    }

    signals.push(signal);
  }

  return signals;
}

// Function to execute trades with ATR-based stop-loss and take-profit
function executeTrades(signals, atr, atrMultiplier) {
  const trades = [];
  let currentTrade = null;

  //console.log("signals here", signals[0]);
  signals.forEach((signal, index) => {
    if (currentTrade) {
      const currentATR = atr[index - signals.length + atr.length];
      const takeProfit = currentTrade.entryPrice * (1 + (currentTrade.position * atrMultiplier * currentATR / currentTrade.entryPrice));
      const stopLoss = currentTrade.entryPrice * (1 - (currentTrade.position * atrMultiplier * currentATR / currentTrade.entryPrice));

    
      if (
        (currentTrade.position === 1 && signal.close >= takeProfit) || // Take profit for buy
        (currentTrade.position === -1 && signal.close <= takeProfit) || // Take profit for sell
        (currentTrade.position === 1 && signal.close <= stopLoss) || // Stop loss for buy
        (currentTrade.position === -1 && signal.close >= stopLoss) || // Stop loss for sell
        (signal.position !== currentTrade.position && signal.position !== 0)// Signal reversal
      ) {
        currentTrade.exitPrice = signal.close;
        currentTrade.exitTime = signal.time;
        console.log("entry and exit price here",
        currentTrade.entryTime,
        currentTrade.exitTime,
        currentTrade.position,
        currentTrade.shortMA,
        currentTrade.longMA
        );
        trades.push(currentTrade);
        currentTrade = null;
      }
    }

    if (!currentTrade && signal.position !== 0) {
      currentTrade = {
        entryPrice: signal.close,
        entryTime: signal.time,
        position: signal.position,
        shortMA: signal.shortMA,
        longMA: signal.longMA
      };
    }
  });

  return trades;
}

// Main function to execute the strategy
async function executeStrategy() {
  const data = await fetchBankNiftyData();
  const shortWindow = 9;
  const longWindow = 21;
  const atrPeriod = 14;
  const atrMultiplier = 1.5; // Change this value as needed
  const movingAverageType = 'EMA'; // Change to 'SMA' or 'WMA' as needed

  const { shortMA, longMA, atr } = calculateIndicators(data, shortWindow, longWindow, atrPeriod, movingAverageType);
  const signals = generateSignals(data, shortMA, longMA, shortWindow, longWindow);
  const trades = executeTrades(signals, atr, atrMultiplier);

//    console.log(JSON.stringify(trades));
}

// Run the strategy
executeStrategy().catch(console.error);