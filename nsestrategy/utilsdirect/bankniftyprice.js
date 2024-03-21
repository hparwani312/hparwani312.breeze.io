

var BreezeConnect = require('../../../breezeConnect').BreezeConnect;
const API_KEY = "01944s0iT703549692A57L89_&2781@5";
const API_SECRET = "7g5728B8r*Dn_0s710u09r3G4916e74K";
// const API_SESSION = "34890413";

var breeze = new BreezeConnect({'appKey' : API_KEY});


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
    const data = await fetch("https://www.googleapis.com/drive/v3/files/1Ou447lmilqiY4nZnCWJ3KUtt5i_sjw-u?key=AIzaSyCnX1X5xZYpye9y5cGTeLYwBDppG6MttAI&alt=media");
    
    const anotherData = await data.json();


    await breeze.generateSession(API_SECRET,anotherData)
    
    const breezeOrderDaataCall = await breeze.getHistoricalDatav2({
          "stockCode": "CNXBAN",
          "exchangeCode": "NFO",
          "productType": "options",
          "fromDate":"2024-03-20 10:43:00",
          "toDate":"2024-03-20 10:44:00",
          "interval":"1minute",
          "expiryDate":"2024-03-27T07:00:00.000Z",
          "right": "call",
          "strikePrice":"45400",
      })

    //   const breezeOrderDaataCallJson = await breezeOrderDaataCall.json();


      const breezeOrderDaataPut = await breeze.getHistoricalDatav2({
        "stockCode": "CNXBAN",
        "exchangeCode": "NFO",
        "productType": "options",
        "fromDate":"2024-03-20 10:43:00",
          "toDate":"2024-03-20 10:44:00",
          "interval":"1minute",
          "expiryDate":"2024-03-27T07:00:00.000Z",
        "right": "put",
        "strikePrice":"45400",
    })
    // const breezeOrderDaataPutJson = await breezeOrderDaataPut.json();
console.log("breeze order dara", breezeOrderDaataCall, breezeOrderDaataPut)
//     const actualData = await data.json();
    
//     const {CE, PE} = findPEAndCEInRange(actualData.filtered.data, 20, 25, fixStrikePriceCE, fixStrikePricePE);
   
//    return {CE, PE, dataExists: !!(CE && PE)};
    }catch(e){
        console.error(e);
        // return {dataExists: false};
    }
}

// module.exports =  BankNifty;


BankNifty();