
const {NSE} = require('nse-js');

const findPEAndCEInRange = (actualData, from, to, fixStrikePriceCE, fixStrikePricePE) => {
    let CE = null;
    let PE = null;
    for(let i = 0;i < actualData.length; i+=1){
        const {PE:{lastPrice:lastPEPrice}, CE:{lastPrice:lastCEPrice}, strikePrice} = actualData[i];
        const conditionForCE  = fixStrikePriceCE?fixStrikePriceCE===strikePrice:(lastCEPrice >= from && lastCEPrice <= to);
        const conditionForPE  = fixStrikePricePE?fixStrikePricePE===strikePrice:(lastPEPrice >= from && lastPEPrice <= to);

        if(conditionForPE && !PE ) {
            
            PE = actualData[i].PE;
            console.log("PE strike price", PE.strikePrice, lastPEPrice);
            
        }
        if(conditionForCE) {
            
            CE = actualData[i].CE;
            console.log("CE strike price", CE.strikePrice, lastCEPrice);
        }
        if(PE && CE && !conditionForCE){
            break;
        }
    }
    return {CE, PE};
}
async function BankNifty(fixStrikePriceCE, fixStrikePricePE){

    try{
        const nse = new NSE();
        const actualData = await nse.optionChain('banknifty')
    
    const {CE, PE} = findPEAndCEInRange(actualData.filtered.data, 20, 25, fixStrikePriceCE, fixStrikePricePE);
   
   return {CE, PE, dataExists: !!(CE && PE)};
    }catch(e){
        return {dataExists: false};
    }
}

module.exports =  BankNifty;