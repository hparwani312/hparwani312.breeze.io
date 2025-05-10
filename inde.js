const axios = require('axios');

var BreezeConnect = require('./breezeConnect').BreezeConnect;
// intialize keys
const API_KEY = "01944s0iT703549692A57L89_&2781@5";
const API_SECRET = "7g5728B8r*Dn_0s710u09r3G4916e74K";
// const API_SESSION = "34890413";

var breeze = new BreezeConnect({'appKey' : API_KEY});
function optionsTrade({stockCode,  interval, right, fromDate, toDate, strikePrice, expiryDate}) {
axios.get('https://www.googleapis.com/drive/v3/files/1Ou447lmilqiY4nZnCWJ3KUtt5i_sjw-u?key=AIzaSyCnX1X5xZYpye9y5cGTeLYwBDppG6MttAI&alt=media').
then((data)=> {
    breeze.generateSession(API_SECRET,data.data).then(async function(resp){

       const data = await breeze.getHistoricalData({
            "stockCode": stockCode,
            "exchangeCode": "NFO",
            "productType": "options",
            "interval":interval,
            fromDate:fromDate,
            toDate:toDate,
            expiryDate:expiryDate,
            "right": right,
            "strikePrice":strikePrice,
        })
    console.log(data);
    })
})
}