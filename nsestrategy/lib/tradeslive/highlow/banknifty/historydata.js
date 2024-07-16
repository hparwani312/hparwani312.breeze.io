const fs = require('fs');
var BreezeConnect = require('../../../../../breezeConnect').BreezeConnect;
const API_KEY = "01944s0iT703549692A57L89_&2781@5";
const API_SECRET = "7g5728B8r*Dn_0s710u09r3G4916e74K";
// const API_SESSION = "34890413";

var breeze = new BreezeConnect({'appKey' : API_KEY});

let firstKey = null;
async function BankNifty({
    interval="1minute",
    fromDate,
    toDate,
    exchangeCode,
    productType = "",
    expiryDate,
    right ='',
    strikePrice = ''
}){

    try{
        if(!firstKey){
    const data = await fetch("https://www.googleapis.com/drive/v3/files/1Ou447lmilqiY4nZnCWJ3KUtt5i_sjw-u?key=AIzaSyCnX1X5xZYpye9y5cGTeLYwBDppG6MttAI&alt=media");
    
    try {
    const anotherData = await data.json();
    if(anotherData){
        firstKey = anotherData;
    }
    } catch(e){
        firstKey = 43156936
    }

}
   console.log("first key here", firstKey);
    await breeze.generateSession(API_SECRET,firstKey)
    


      const breezeOrderDaata = await breeze.getHistoricalDatav2({
        "stockCode": "CNXBAN",
        "exchangeCode": exchangeCode,
        "productType": productType,
       fromDate,
          "toDate":toDate,
          "interval":interval,
          "expiryDate":expiryDate,
        "right": right,
        "strikePrice":strikePrice,
    })
    // const breezeOrderDaataPutJson = await breezeOrderDaataPut.json();
console.log("breeze order dara", breezeOrderDaata)
const date2 = (new Date()).getDate()
    
        const date3 = (new Date()).getMonth()
    
    const date4 = (new Date()).getFullYear();
    if(!breezeOrderDaata?.Success){
    const filepath = './directory/dataoncehighlowbanknifty'+date2+"-"+date3+"-"+date4+".txt";
        fs.writeFileSync(filepath, breezeOrderDaata, {
            flag: "a+"
          });
        }
    
// console.log("breeze order data here", breezeOrderDaata);
    return breezeOrderDaata;
    }catch(e){
        console.error("error here",e);
        return {};
    }
}



module.exports =  BankNifty;
