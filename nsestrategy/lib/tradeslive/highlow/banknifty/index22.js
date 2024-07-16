
const moment = require("moment");

const data = require('./controlit');
const historyData = require('./historydata');
const BankNifty = require('./bankniftyprice');
const getMon = (m)=>{
    return m>8?m+1:`0${m+1}`
}
const getHrms = (m)=>{
    return m>9?m:`0${m}`
}
let intervalHere;

    let startPrice = 0;
    let lowerStartPrice = 0;
    let lowerStartPriceCount = 0;
    let lowerStartPriceOpen = 0;
    let startPriceOpen = 0;
    let startPriceCount = 0;
    let higherHigh = 0;
    let higherHighOpen = 0;
    let higherLow = 0;
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

    function reset(){

    }
function starttrade(from = 45, to = 55, expiryDateInput="03-Jul-2024"){
    
    const expiryDate = moment(expiryDateInput, "DD-MMM-YYYY").format('YYYY-MM-DD');

    function makeAnEntry(type, currentPrice) {
        let data = type+" "+strikePrice+" "+currentPrice+" "+ "\n";
        const date2 = (new Date()).getDate()
    
        const date3 = (new Date()).getMonth()
    
    const date4 = (new Date()).getFullYear();
    const filepath = './directory/dataoncehighlowbanknifty'+date2+"-"+date3+"-"+date4+".txt";
        fs.writeFileSync(filepath, data, {
            flag: "a+"
          });
    }
    async function starttrading () {
  
        const date = new Date();
    
     const fromDate = `${date.getFullYear()}-${getMon(date.getMonth())}-${getHrms(date.getDate())} ${getHrms(date.getHours())}:${getHrms(date.getMinutes()-1)}:00`;
      const toDate =  fromDate;
    // const fromDate = "2024-06-24 09:15:00"
    // const toDate = "2024-06-24 14:00:00";
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
            console.log("green candle", datetime, fromDate, toDate);
            if(trend === 'down'){
                if(close >lowerLowOpen && lowerLowOpen>0){
                    currentLowerHigh = close;
                    currentLowerHighOpen = open;
                }
                if((currentLowerHigh>(lowerHigh+10) && lowerHigh>0) && strikePrice){
                    console.log("trend break");

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

                   
                    const { close} = currentEntryOpt;
                    const currentPrice = close - 3;

                    totalUpDown +=(currentPrice - buyPrice);
                    makeAnEntry("close here  uptrend", currentPrice, currentPrice - buyPrice)
                    console.log("close here  uptrend", currentPrice, currentPrice - buyPrice);
                    console.log("total here", totalUpDown);
                    makeAnEntry("total here", totalUpDown)
                    trend = null;
                    strikePrice = 0
                }
            } else if(trend === 'up'){
                if(close>(currentHigherLowOpen+40) && currentHigherLowOpen>0){
                    higherLow = currentHigherLow;
                }
                if(close>higherHigh){
                    higherHighOpen= open;
                    higherHigh = close;
                }
            } else {
                if((close - open)>=4){ 
                if(startPrice===0 && lowerStartPriceCount<=0){
                    startPrice = close;
                    startPriceOpen = open;
                    startPriceCount+=1;
                    lowerHigh = 0;
                    lowerStartPrice = 0;

                } else if(lowerStartPrice === 0){
                    startPriceCount+=1;
                    if(close>(currentHigherLowOpen+40) && currentHigherLowOpen>0){
                        higherLow = currentHigherLow;
                    }
                } else {
                    lowerStartPriceCount-=1;
                   currentLowerHigh = close;
                   currentLowerHighOpen = open;
                //    lowerHigh = close;
                //    lowerHighOpen = open;
                }
                if((startPriceCount>10&& close>(startPrice+50)) || close > (startPrice+100)){
                    trend="up";
                    
                    
                while(true){

                
                const {CE, PE} = await BankNifty(from, to);

                        if(CE){
                            strikePrice = CE.strikePrice;
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
                            currentEntryCloseOpt = currentEntryClose;
                            console.log("close here", currentEntryOpt, fromDateOpt, toDateOpt)
                            if(currentEntryClose >= from && currentEntryClose <= to) {
                                    break;
                            }
                            currentEntryCloseOpt = currentEntryClose;
                        } else {
                            endTrade();
                            break;
                        }
                       
                }
                    const currentPrice = parseInt(currentEntryCloseOpt) + 3;
                    
                    buyPrice = currentPrice;
                    higherHighOpen= open;
                higherHigh = close;
                    makeAnEntry("buy here  uptrend", currentPrice)
                    console.log("buy here uptrend", currentPrice);
                }
                
                  if(close>(lowerStartPriceOpen+10)) {
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
            console.log("red candle", datetime, fromDate, toDate);
            if(trend === 'down'){
                if(close<(currentLowerHighOpen-40) && currentLowerHighOpen>0){
                    lowerHigh = currentLowerHigh;
                }
                if(close<lowerLow){
                    lowerLowOpen= open;
                    lowerLow = close;
                }
            } else if(trend === 'up') {
                if(close <higherHighOpen && higherHighOpen>0){
                    currentHigherLow = close;
                    currentHigherLowOpen = open;
                }
                if(currentHigherLow<(higherLow+10) && higherLow>0 && strikePrice){
                    console.log("trend break");
                    trend = null;
    
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

                   
                    const { close: currentEntryClose} = currentEntryOpt;
                    const currentPrice = currentEntryClose - 3;
                    totalUpDown+=(currentPrice-buyPrice);
                    makeAnEntry("close here downtrend", currentPrice)  
                    console.log("close here downtrend", currentPrice);
                    makeAnEntry("total here", totalUpDown)  
                    console.log("total here", totalUpDown)
                    strikePrice = 0;
                }
            }
           else {
            if((open - close)>=4){
            if(lowerStartPrice===0 && startPriceCount<=0){
                lowerStartPrice = close;
                lowerStartPriceOpen = open;
                lowerStartPriceCount+=1;
                startPrice=0;
                higherLow = 0;
            } else if(startPrice===0){
                lowerStartPriceCount+=1;
                if(close<(currentLowerHighOpen-40) && currentLowerHighOpen>0){
                    lowerHigh = currentLowerHigh;
                }
            } else {
                startPriceCount-=1;
                currentHigherLow=close;
                currentHigherLowOpen=open;
                // higherLow = close;
            }
            if((lowerStartPriceCount>10 && close<(lowerStartPrice-50)) || close<(lowerStartPrice-100)){
                trend="down";

                while(true){

                const {CE, PE} = await BankNifty(from, to);
              
                if(PE){
                strikePrice = PE.strikePrice;
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
                    const { close: currentEntryClose} = currentEntryOpt;
                    console.log("close here", currentEntryClose)
                    if(currentEntryClose >= from && currentEntryClose <= to) {
                            break;
                    }
                    currentEntryCloseOpt = currentEntryClose
                } else {
                    endTrade();
                    break;
                }
                
                }
                    const currentPrice = parseInt(currentEntryCloseOpt) + 3;
                    makeAnEntry("buy here downtrend", currentPrice)  
                console.log("buy here downtrend", currentPrice);
                lowerLowOpen= open;
                    lowerLow = close;
                    lowerLowOpen=0;
            }

                if(close<(startPriceOpen-10)) {
                    startPrice = 0;
                    higherLow = 0
                    startPriceCount = 0;
                }
            }
          }
        }
        }
    }
    
         intervalHere = setInterval(()=>{
            
            const hours = (new Date()).getHours()
            const minutes = (new Date()).getMinutes()
            console.log("data flagstart", data.flagstart, hours, minutes);
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
starttrade(data.from, data.to, data.expiryDate)