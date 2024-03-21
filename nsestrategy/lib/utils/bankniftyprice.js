

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
    const data = await fetch("https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrer": "https://www.nseindia.com/option-chain",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });
    const actualData = await data.json();
    
    const {CE, PE} = findPEAndCEInRange(actualData.filtered.data, 20, 25, fixStrikePriceCE, fixStrikePricePE);
   
   return {CE, PE, dataExists: !!(CE && PE)};
    }catch(e){
        return {dataExists: false};
    }
}

module.exports =  BankNifty;