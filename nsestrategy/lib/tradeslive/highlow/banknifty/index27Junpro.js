
const moment = require("moment");
const fs = require('fs');
// const data = require('./controlit');
const historyData = require('./historydata');
const BankNifty = require('./bankniftyprice');
const midLevelPrice = require('./utils/midlevelprice');
const allStrikePrice = require('./utils/allStrikePrice');


const getMon = (m)=>{
    return m>8?m+1:`0${m+1}`
}
const getHrms = (m)=>{
    return m>9?m:`0${m}`
}

let allStrikePrices = [];
let intervalHere;
let retryCountForGettingPrice = 0;
    let startPrice = 0;
    let lowerStartPrice = 0;
    let lowerStartPriceCount = 0;
    let lowerStartPriceOpen = 0;
    let startPriceOpen = 0;
    let startPriceCount = 0;
    let higherHigh = 0;
    let higherHighOpen = 0;
    let higherLow = 0;
    let higherBreakCounter = 0;
    let higherBreakCounterOpen = 0;
    let higherBreakCounterClose = 0;
    let lowerBreakCounter = 0;
    let lowerBreakCounterOpen = 0;
    let lowerBreakCounterClose = 0;
    let higherLowOpen = 0;
    let lowerHigh = 0;
    let lowerHighOpen = 0;
    let lowerLow = 0;
    let lowerLowOpen = 0;
    let currentHigherLow = 0;
    let currentHigherLowOpen = 0;
    let currentLowerHigh = 0;
    let currentLowerHighOpen = 0;
    let trend = null;
    let strikePrice = 0;
    let buyPrice = 0;
    let totalUpDown = 0;
    let currentEntryCloseOpt = 0;
    let lastStrikePrice;
    let tradeTaken;
    function reset(){

    }

    function makeAnEntry(type, currentPrice, datetime) {
        // const hour = new Date().getHours();

        // const minute = new Date().getMinutes();
        let data = type+" "+strikePrice+" "+currentPrice+" "+datetime+ "\n";
        const date2 = (new Date()).getDate()
    
        const date3 = (new Date()).getMonth()
    
    const date4 = (new Date()).getFullYear();
    const filepath = './directory/dataoncehighlowbanknifty'+date2+"-"+date3+"-"+date4+".txt";
        fs.writeFileSync(filepath, data, {
            flag: "a+"
          });
    }
function starttrade(from = 45, to = 55, expiryDateInput="16-Jul-2024"){
    
    const expiryDate = moment(expiryDateInput, "DD-MMM-YYYY").format('YYYY-MM-DD');

   
    async function starttrading () {
  
        const date = new Date();
    if(!allStrikePrices?.length){
        allStrikePrices = await allStrikePrice();
    }
     const fromDate = `${date.getFullYear()}-${getMon(date.getMonth())}-${getHrms(date.getDate())} ${getHrms(date.getHours())}:${getHrms(date.getMinutes()-1)}:00`;
      const toDate =  fromDate;
    // const fromDate = "2024-07-02 09:15:00"
    // const toDate = "2024-07-02 15:30:00";
       const {Success=[]}= await historyData({
            interval: "1minute",
            fromDate:fromDate,
            toDate:toDate,
            exchangeCode:"NSE",
            productType:"margin",
        })
        for(let i=0;i< Success.length;i+=1){
        const {
            close,
            datetime,
            high,
            low,
            open,
            volume
          } = Success[i];
          
          if(open < close){
            console.log("green candle", datetime, fromDate, toDate, trend);

            console.log("current lower high", currentLowerHigh, lowerHigh, currentHigherLow, higherLow)
            if(trend === 'down'){
                if(close >lowerLow && lowerLow>0){
                    currentLowerHigh = close;
                    currentLowerHighOpen = open;
                }
                if(!lowerBreakCounter){
                    lowerBreakCounterClose = close;
                    lowerBreakCounterOpen = open;
                }
                    
                    lowerBreakCounter+=1;
                    console.log("lower break counter here", lowerBreakCounter, datetime);
                
                if((currentLowerHigh>(lowerHigh+10) && lowerHigh>0 && strikePrice)|| (lowerHigh <=0 && close >= lowerLow+45)){
                    console.log("trend break");
                    lastStrikePrice = strikePrice;
                    const fromDateOpt = datetime;
                    const toDateOpt =  fromDateOpt;
                    const {Success:[currentEntryOpt]}= await historyData({
                        interval: "1minute",
                        fromDate:fromDateOpt,
                        toDate:toDateOpt,
                        exchangeCode:"NFO",
                        productType:"options",
                        "expiryDate":expiryDate,
                        "right": "put",
          "strikePrice":strikePrice,
                        
                    })

                   
                    const { close: currentEntryCloseOpt} = currentEntryOpt;
                    const currentPrice = currentEntryCloseOpt - 3;

                    totalUpDown +=(currentPrice - buyPrice);
                    makeAnEntry("close here  downtrend", currentPrice, datetime)
                    console.log("close here  downtrend", currentPrice, currentPrice - buyPrice, datetime);
                    console.log("total here", totalUpDown, currentPrice, buyPrice);
                    makeAnEntry("total here", totalUpDown)
                    trend = null;
                    strikePrice = 0


                    startPrice = close;
                    startPriceOpen = open;
                    higherHigh = close;
                    higherHighOpen = open;
                    startPriceCount+=1;
                    lowerHigh = 0;
                    lowerStartPrice = 0;
                    lowerBreakCounter = 0;
                } 
            } else if(trend === 'up'){
                if(close>(currentHigherLowOpen+30) && currentHigherLowOpen>0){
                    higherLow = currentHigherLow;
                }
                if(close>higherHigh){
                    higherHighOpen= open;
                    higherHigh = close;
                    higherBreakCounter = 0;

                } else {
                    higherBreakCounter+=1
                    if(higherBreakCounter>5){
                        console.log("trend break");
                        trend = null;
                        lastStrikePrice = strikePrice;
                        const fromDateOpt = datetime;
                        const toDateOpt =  fromDateOpt;
                        const {Success:[currentEntryOpt]}= await historyData({
                            interval: "1minute",
                            fromDate:fromDateOpt,
                            toDate:toDateOpt,
                            exchangeCode:"NFO",
                            productType:"options",
                            "expiryDate":expiryDate,
                            "right": "call",
              "strikePrice":strikePrice,
                            
                        })
    
                       
                        const { close: currentEntryClose} = currentEntryOpt;
                        const currentPrice = currentEntryClose - 3;
                        totalUpDown+=(currentPrice-buyPrice);
                        makeAnEntry("close here uptrend",  currentPrice, datetime)  
                        console.log("close here uptrend", currentPrice);
                        makeAnEntry("total here", totalUpDown)  
                        console.log("total here", totalUpDown)
                        strikePrice = 0;
    
                        lowerStartPrice = close;
                    lowerStartPriceOpen = open;
                    lowerLow = close;
                    lowerLowOpen = open;
                    lowerStartPriceCount+=1;
                    startPrice=0;
                    higherLow = 0;
                    higherBreakCounter=0
                    }
                }
            } else {
                if((close - open)>=4){ 
                if(startPrice===0 && lowerStartPrice===0){
                    startPrice = close;
                    startPriceOpen = open;
                    higherHigh = close;
                    higherHighOpen = open;
                    startPriceCount+=1;
                    lowerHigh = 0;
                    lowerStartPrice = 0;

                } else if(lowerStartPrice === 0){
                    startPriceCount+=1;
                    if(close>=(currentHigherLow+45) && currentHigherLow>0){
                        higherLow = currentHigherLow;
                    }
                    if(close>(higherHigh+10)){
                        higherHigh = close;
                        higherHighOpen = open;
                    }
                } else {
                    lowerStartPriceCount-=1;
                    if(lowerStartPriceCount < 0){
                        lowerStartPriceCount = 0;
                    }
                        currentLowerHigh = close;
                        currentLowerHighOpen = open;
                    if((close>lowerHigh+10 && lowerHigh>0)){
                        lowerStartPrice = 0;
                        lowerStartPriceCount = 0;
                            startPrice = lowerLow;
                            startPriceOpen = lowerLowOpen;
                            startPriceCount+=1;
                            lowerHigh = 0;
                    }
                //    lowerHigh = close;
                //    lowerHighOpen = open;
                }
                if(((startPriceCount>7&& close>=(startPrice+45)) || (close > (startPrice+80) && startPrice > 0)) || (close> (lowerBreakCounterClose+80) && lowerBreakCounterClose > 0) || (close > higherLow + 80 && higherLow > 0 && tradeTaken)){
                    trend="up";
                console.log("up head here first", startPriceCount>7,(close > (startPrice+80)), close, startPrice );   
                    
                while(true){

                
                const currentEntryOpt = await midLevelPrice(from, to, datetime, datetime, allStrikePrices, "call", expiryDate, lastStrikePrice);
                    console.log("current Entry opt here", currentEntryOpt);
                    if(retryCountForGettingPrice<3){
                        if(currentEntryOpt?.strike_price){
                            retryCountForGettingPrice=0
                            strikePrice = currentEntryOpt.strike_price;
                            const fromDateOpt = datetime;
                            const toDateOpt =  fromDateOpt;
                            // const {Success:[currentEntryOpt]}= await historyData({
                            //     interval: "1minute",
                            //     fromDate:fromDateOpt,
                            //     toDate:toDateOpt,
                            //     exchangeCode:"NFO",
                            //     productType:"options",
                            //     "expiryDate":expiryDate,
                            //     "right": "call",
                            //     "strikePrice":strikePrice, 
                            // })
                        
                            const { close: currentEntryClose} = currentEntryOpt;
                            currentEntryCloseOpt = currentEntryClose;
                            console.log("close here", currentEntryOpt, fromDateOpt, toDateOpt)
                            if(Math.floor(currentEntryClose)>= from && Math.floor(currentEntryClose) <= to) {
                                    break;
                            }
                        } else{
                            retryCountForGettingPrice+=1;
                        }
                    }else {
                            endTrade();
                            return;
                            break;
                            
                        }
                       
                }
                    const currentPrice = parseInt(currentEntryCloseOpt) + 3;
                    
                    buyPrice = currentPrice;
                    higherHighOpen= open;
                higherHigh = close;

                startPrice = 0;
                    startPriceOpen = 0;
                    startPriceCount=0;
                     lowerHigh = 0;
                    lowerStartPrice = 0;
                    lowerBreakCounterClose=0;
                    lowerBreakCounterOpen=0;
                    tradeTaken = true;
                    makeAnEntry("buy here  uptrend", currentPrice, datetime,)
                    console.log("buy here uptrend", currentPrice);
                }
                
                  if(close>(lowerStartPriceOpen+10) && lowerStartPriceOpen>0) {
                    lowerStartPrice = 0;
                    lowerStartPriceCount = 0;
                    lowerHigh = 0;
                    lowerHighOpen = 0;
                  }
                }
            }
           // higherHigh = close;

            //lowerHigh = close;
            //trend="up";
          } else if(open > close){
            console.log("red candle", datetime, fromDate, toDate, trend, open, close);
            console.log("current lower high", currentLowerHigh, lowerHigh)
            if(trend === 'down'){
                if(close<(currentLowerHigh-30) && currentLowerHigh>0){
                    lowerHigh = currentLowerHigh;
                }
                if(close<lowerLow){
                    lowerLowOpen= open;
                    lowerLow = close;
                    lowerBreakCounter = 0;
                } else {
                    lowerBreakCounter+=1
                    console.log("lower break counter here", lowerBreakCounter, datetime)
                    if(lowerBreakCounter>5){
        //                 console.log("trend break");
        //             lastStrikePrice = strikePrice;
        //             const fromDateOpt = datetime;
        //             const toDateOpt =  fromDateOpt;
        //             const {Success:[currentEntryOpt]}= await historyData({
        //                 interval: "1minute",
        //                 fromDate:fromDateOpt,
        //                 toDate:toDateOpt,
        //                 exchangeCode:"NFO",
        //                 productType:"options",
        //                 "expiryDate":expiryDate,
        //                 "right": "put",
        //   "strikePrice":strikePrice,
                        
        //             })

                   
        //             const { close: currentEntryCloseOpt} = currentEntryOpt;
        //             const currentPrice = currentEntryCloseOpt - 3;

        //             totalUpDown +=(currentPrice - buyPrice);
        //             makeAnEntry("close here  downtrend", currentPrice, datetime)
        //             console.log("close here  downtrend", currentPrice, currentPrice - buyPrice, datetime);
        //             console.log("total here", totalUpDown, currentPrice, buyPrice);
        //             makeAnEntry("total here", totalUpDown)
        //             trend = null;
        //             strikePrice = 0


        //             startPrice = close;
        //             startPriceOpen = open;
        //             higherHigh = close;
        //             higherHighOpen = open;
        //             startPriceCount+=1;
        //             lowerHigh = 0;
        //             lowerStartPrice = 0;
                    lowerBreakCounter=0
                    }
                }
            } else if(trend === 'up') {
                if(close <(higherHigh - 10) && higherHigh>0){
                    currentHigherLow = close;
                    currentHigherLowOpen = open;
                }

                console.log("current higher low first", currentHigherLow, higherLow);

                if(!higherBreakCounter){
                    higherBreakCounterClose = close;
                    higherBreakCounterOpen = open;
                }
                higherBreakCounter+=1
                if((currentHigherLow<(higherLow-10) && higherLow>0 && strikePrice) || (higherLow <=0 && close <= higherHigh-45) || higherBreakCounter>5){
                    console.log("trend break");
                    trend = null;
                    lastStrikePrice = strikePrice;
                    const fromDateOpt = datetime;
                    const toDateOpt =  fromDateOpt;
                    const {Success:[currentEntryOpt]}= await historyData({
                        interval: "1minute",
                        fromDate:fromDateOpt,
                        toDate:toDateOpt,
                        exchangeCode:"NFO",
                        productType:"options",
                        "expiryDate":expiryDate,
                        "right": "call",
          "strikePrice":strikePrice,
                        
                    })

                   
                    const { close: currentEntryClose} = currentEntryOpt;
                    const currentPrice = currentEntryClose - 3;
                    totalUpDown+=(currentPrice-buyPrice);
                    makeAnEntry("close here uptrend",  currentPrice, datetime)  
                    console.log("close here uptrend", currentPrice);
                    makeAnEntry("total here", totalUpDown)  
                    console.log("total here", totalUpDown)
                    strikePrice = 0;

                    lowerStartPrice = close;
                lowerStartPriceOpen = open;
                lowerLow = close;
                lowerLowOpen = open;
                lowerStartPriceCount+=1;
                startPrice=0;
                higherLow = 0;
                higherBreakCounter=0
                }
            }
           else {
            if((open - close)>=4){
            if(lowerStartPrice===0 && startPrice===0){
                lowerStartPrice = close;
                lowerStartPriceOpen = open;
                lowerLow = close;
                lowerLowOpen = open;
                lowerStartPriceCount+=1;
                startPrice=0;
                higherLow = 0;
            } else if(startPrice===0){
                lowerStartPriceCount+=1;
                console.log("cureent lower high and close here", currentLowerHigh, close);
                if(close<=(currentLowerHigh-45) && currentLowerHigh>0){
                    lowerHigh = currentLowerHigh;
                }
                if(close<(lowerLow-10)){
                    lowerLow = close;
                    lowerLowOpen = open;
                }
            } else {
                startPriceCount-=1;
                if(startPriceCount < 0) {
                    startPriceCount = 0;
                }
                currentHigherLow=close;
                currentHigherLowOpen=open;

                if((close<higherLow-10 && higherLow>0) || (close<(startPrice-40) && startPrice>0)){
                    startPrice = 0;
                    startPriceCount = 0;
                        lowerStartPrice = higherHigh;
                        lowerStartPriceOpen = higherHighOpen;
                        lowerStartPriceCount+=1;
                        higherLow = 0;
                }
                // higherLow = close;
            }
            if(((lowerStartPriceCount>7 && close<=(lowerStartPrice-45)) || (close<(lowerStartPrice-80) )) && lowerStartPrice >0 || (close< (higherBreakCounterClose-80) && higherBreakCounterClose > 0) || (close < (lowerHigh-80) && lowerHigh > 0) && tradeTaken){
                trend="down";
                console.log("down head here first", lowerStartPriceCount>7, close<(lowerStartPrice-80), close, lowerStartPrice );   
                while(true){
                if(retryCountForGettingPrice < 3){
                const currentEntryOpt = await midLevelPrice(from, to, datetime, datetime, allStrikePrices, "put", expiryDate, lastStrikePrice);
                console.log("current Entry opt here first", currentEntryOpt);
                if(currentEntryOpt?.strike_price){
                    retryCountForGettingPrice =0
                strikePrice = currentEntryOpt.strike_price;
                // const fromDateOpt = datetime;
                // const toDateOpt =  fromDateOpt;
        //             const {Success:[currentEntryOpt]}= await historyData({
        //                 interval: "1minute",
        //                 fromDate:fromDateOpt,
        //                 toDate:toDateOpt,
        //                 exchangeCode:"NFO",
        //                 productType:"options",
        //                 "expiryDate":expiryDate,
        //                 "right": "put",
        //   "strikePrice":strikePrice,
                        
        //             })
                    const { close: currentEntryClose} = currentEntryOpt;
                    console.log("close here", currentEntryClose)

                    currentEntryCloseOpt = currentEntryClose
                    lowerStartPrice = 0;
                lowerStartPriceOpen = 0;
                lowerStartPriceCount=0;
                higherBreakCounterClose = 0;
                higherBreakCounterOpen =0;
                startPrice=0;
                higherLow = 0;
                    if(Math.floor(currentEntryClose) >= from && Math.floor(currentEntryClose) <= to) {
                            break;
                    }
                }  else{
                    retryCountForGettingPrice+=1
                }
            }else {
                    endTrade();
                    return;
                    break;
                    
                }
                
                }
                    const currentPrice = parseInt(currentEntryCloseOpt) + 3;
                    buyPrice = currentPrice;
                    tradeTaken = true;
                    makeAnEntry("buy here downtrend", currentPrice, datetime)  
                console.log("buy here downtrend", currentPrice);
                lowerLowOpen= open;
                    lowerLow = close;
            }

                // if(close<(startPriceOpen-10) && startPriceOpen>0) {
                //     startPrice = 0;
                //     higherLow = 0
                //     startPriceCount = 0;
                // }
            }
          }
        }
        }
    }
    
         intervalHere = setInterval(()=>{
            
            const hours = (new Date()).getHours()
            const minutes = (new Date()).getMinutes()
            console.log("data flagstart", hours, minutes);
            // 25 and 27 are profitable
                if(hours>=9 && hours<=15){
                    if(hours===9 && minutes<16){
                        endTrade(true);
                        return
                    }
                    if(hours===15 && minutes>1) {
                        endTrade();
                         return;
                    }
                    starttrading()
                }

               
            // }
        }, 60000);
    
}
const endTrade =(dontClear)=>{
    if(!dontClear){
        clearInterval(intervalHere);
    }
   
                    if(strikePrice){
                                    if(trend === "up"){
                                        const currentPrice = buyPrice - 3;
                                        totalUpDown+=(currentPrice-buyPrice);
                                        makeAnEntry("close here uptrend threshold", currentPrice)  
                                        console.log("close here downtrend", currentPrice);
                                        makeAnEntry("total here threshold", totalUpDown)  

                                    } else if(trend === "down"){
                                        const currentPrice = buyPrice - 3;
                                        totalUpDown+=(currentPrice-buyPrice);
                                        makeAnEntry("close here downtrend threshold", currentPrice)  
                                        console.log("close here downtrend", currentPrice);
                                        makeAnEntry("total here threshold", totalUpDown)  
                                    }
                                    strikePrice=0
                                }
startPrice = 0;
lowerStartPrice = 0;
lowerStartPriceCount = 0;
lowerStartPriceOpen = 0;
startPriceOpen = 0;
startPriceCount = 0;
higherHigh = 0;
higherHighOpen = 0;
higherLow = 0;
higherLowOpen = 0;
lowerHigh = 0;
lowerHighOpen = 0;
lowerLow = 0;
lowerLowOpen = 0;
currentHigherLow = 0;
currentHigherLowOpen = 0;
currentLowerHigh = 0;
currentLowerHighOpen = 0;
trend = null;
strikePrice = 0;
buyPrice = 0;
totalUpDown = 0;
}
module.exports = {starttrade, endTrade};
starttrade()