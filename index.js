var BreezeConnect = require('./breezeConnect').BreezeConnect;
const axios = require('axios')
// intialize keys
const API_KEY = "01944s0iT703549692A57L89_&2781@5";
const API_SECRET = "7g5728B8r*Dn_0s710u09r3G4916e74K";
// const API_SESSION = "34890413";

var breeze = new BreezeConnect({'appKey' : API_KEY});


breeze.onTicks=(data)=>{
    console.log("tick data here", data);
}
const getCurrentMonthIn10 = (currentMonth)=>{
    if(currentMonth<10){
        return `0${currentMonth+1}`;
    }
    return currentMonth+1;
}
function optionsTrade({stockCode, price, quantity, right, strikePrice, expiryDate, stoploss = ''}) {
    return new Promise((res,rej)=>{
    axios.get('https://www.googleapis.com/drive/v3/files/1Ou447lmilqiY4nZnCWJ3KUtt5i_sjw-u?key=AIzaSyCnX1X5xZYpye9y5cGTeLYwBDppG6MttAI&alt=media').
            then((data)=> {
                console.log("data here", data.data);
                breeze.generateSession(API_SECRET,data.data).then(function(resp){

                // call function containing api calls
                breeze.placeOrder({
                  "stockCode": stockCode,
                  "exchangeCode": "NFO",
                  "product": "options",
                  "orderType": "limit",
                  "price": price,
                  "stoploss":stoploss,
                  "action": "buy",
                  "quantity": quantity,
                  "validity":"DAY",
                  expiryDate:expiryDate,
                  "right": right,
                  "strikePrice":strikePrice,
              }).then(function(resp){console.log("data here once", resp);res(resp);}).catch(function(err){
                  console.log("error here once", err);
                  rej(err);
              })
              }).catch(function(err){
                  console.log("error here once", err);
                  rej(err);
              })}).catch((err)=>{
                rej(err);
            })
       
});


}

function subscribeFeedsoneclick() {

  
    return new Promise((res,rej)=>{
        axios.get('https://www.googleapis.com/drive/v3/files/1Ou447lmilqiY4nZnCWJ3KUtt5i_sjw-u?key=AIzaSyCnX1X5xZYpye9y5cGTeLYwBDppG6MttAI&alt=media').
            then((data)=> {
                console.log("data here", data.data);
            breeze.generateSession(API_SECRET,data.data).then(function(resp){
              
                breeze.connect({});
                breeze.subscribeFeeds({
                    "stockToken": "one_click_fno"
                }).then((data)=>{
                    console.log("data here once", data);
                    res(data);
                }).catch(function(err){
                    rej(err);
                 })
            }).catch(function(err){
                console.log("data here once again", err);
               rej(err);
            });
        }).catch((err)=>{
            console.log("data here once again here", err);
            rej(err);
        })
    })

}

function subscribeFeedsLive({stockCode, price, quantity, right, strikePrice, expiryDate, interval="1minute"}) {

    const currentDate = new Date(expiryDate);
    const date = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return new Promise((res,rej)=>{
        axios.get('https://www.googleapis.com/drive/v3/files/1Ou447lmilqiY4nZnCWJ3KUtt5i_sjw-u?key=AIzaSyCnX1X5xZYpye9y5cGTeLYwBDppG6MttAI&alt=media').
            then((data)=> {
                console.log("data here", data.data);
            breeze.generateSession(API_SECRET,data.data).then(function(resp){
              
                breeze.connect({});
                breeze.subscribeFeeds({
                    "stockCode": stockCode,
                    "exchangeCode": "NFO",
                    "quantity": quantity,
                    "price": price,
                    "action": "sell",
                    "right": right,
                    "orderType": "limit",
                    "stoploss": "0",
                    "disclosedQuantity": "0",
                    "validity": "Day",
                    expiryDate:expiryDate,
                    "strikePrice":strikePrice,
                    "interval":interval,
                    "productType": "options"
                }).then((data)=>{
                    console.log("data here once", data);
                    res(data);
                }).catch(function(err){
                    rej(err);
                 })
            }).catch(function(err){
               rej(err);
            });
        }).catch((err)=>{
            rej(err);
        })
    })

}
function squareOff({stockCode, price, quantity, right, strikePrice, expiryDate}) {

    const currentDate = new Date(expiryDate);
    const date = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    return new Promise((res,rej)=>{
    axios.get('https://www.googleapis.com/drive/v3/files/1Ou447lmilqiY4nZnCWJ3KUtt5i_sjw-u?key=AIzaSyCnX1X5xZYpye9y5cGTeLYwBDppG6MttAI&alt=media').
        then((data)=> {
            console.log("data here", data.data);
        breeze.generateSession(API_SECRET,data.data).then(function(resp){
          

            breeze.squareOff({
                "sourceFlag": "",
                "stockCode": stockCode,
                "exchangeCode": "NFO",
                "quantity": quantity,
                "price": price,
                "action": "sell",
                "right": right,
                "orderType": "limit",
                "stoploss": "0",
                "disclosedQuantity": "0",
                "validity": "Day",
                expiryDate:`${year}-${getCurrentMonthIn10(month)}-${date}`,
                "strikePrice":strikePrice,
                "productType": "options"
            }).then((data)=>{
                console.log("data here once", data);
                res(data);
            }).catch(function(err){
                rej(err);
             })
        }).catch(function(err){
           rej(err);
        });
    }).catch((err)=>{
        rej(err);
    })
})
    
    
}
function api_calls(){
  // This function houses API calls. Below is example of option chain API
  
    // breeze.getDematHoldings(
    //     {
    //         stockCode:"NIFTY",
    //         exchangeCode:"NFO",
    //         productType:"options",
    //         expiryDate:"2023-01-25T06:00:00.000Z",
    //         right:"call",
    //         strikePrice:"18000"
    //     }
    // ).then(function(resp){console.log(resp);})

    // breeze.placeOrder({stockCode:"BAAUTO", 
    // exchangeCode:"NSE", 
    // action:"SELL",
    // orderType:"LIMIT",
    // quantity:10, 
    // validity:"DAY",
    // product:"CASH",
    // price:9020 }).then(function(resp){console.log(resp);})

     breeze.placeOrder({
         "stockCode": "NIFTY",
         "exchangeCode": "NFO",
         "product": "options",
         "orderType": "limit",
         "price": "171",
         "action": "buy",
         "quantity": "10",
         "validity":"DAY",
         "expiryDate": "19-Feb-2024",
         "right": "call",
         "strikePrice": "22000",
         "specialFlag": "S",
         "stoploss": "190",
         "orderRateFresh": "195.50"
     }).then(function(resp){console.log(resp);})
    // 20240219N400005256
    //breeze.getOrderDetail({exchangeCode:"NSE",orderId:"20240219N400005256"}).then(function(resp){console.log(resp);})
    //breeze.getOrderList({exchangeCode:"NSE", fromDate: '2024-02-12T14:48:00.000Z', toDate: '2024-02-18T14:48:00.000Z'}).then(function(resp){console.log(resp);})
    // breeze.previewOrder({
    //     "stockCode": "NIFTY",
    //     "exchangeCode": "NFO",
    //     "productType": "options",
    //     "orderType": "limit",
    //     "price": "171",
    //     "action": "buy",
    //     "quantity": "50",
    //     "expiryDate": "19-Feb-2024",
    //     "right": "call",
    //     "strikePrice": "22000",
    //     "specialFlag": "S",
    //     "stoploss": "190",
    //     "orderRateFresh": "195.50"
    // }).then(function(resp){console.log(resp);})
//     breeze.squareOff({
//     "source_flag": "",
//     "stock_code": "NIFTY",
//     "exchange_code": "NFO",
//     "quantity": "50",
//     "price": "180",
//     "action": "Sell",
//     "order_type": "Limit",
//     "validity": "Day",
//     "stoploss_price": "0",
//     "disclosed_quantity": "0",
//     "protection_percentage": "",
//     "settlement_id": "",
//     "margin_amount": "",
//     "open_quantity": "",
//     "cover_quantity": "",
//     "product_type": "Options",
//     "expiry_date": "2021-12-30",
//     "right": "Others",
//     "strike_price": "0",
//     "validity_date": "2021-12-16T06:00:00.000Z",
//     "alias_name": "",
//     "trade_password": ""
// })

}

module.exports ={
    optionsTrade,
    squareOff,
    subscribeFeedsLive,
    subscribeFeedsoneclick
}