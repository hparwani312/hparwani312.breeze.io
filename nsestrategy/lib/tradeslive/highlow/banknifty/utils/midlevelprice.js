
const historyData = require('../historydata');


async function findStrikePrice(from,
    to,
    fromDateOpt,
    toDateOpt,
    listPrice,
    right,
    expiryDate,
    actualLastStrikePrice,
    lastBuyPrice, 
    currentPrice){
    
        let lastStrikePrice = actualLastStrikePrice??listPrice[listPrice.length-1];
        const data= await historyData({
            interval: "1minute",
            fromDate:fromDateOpt,
            toDate:toDateOpt,
            exchangeCode:"NFO",
            productType:"options",
            "expiryDate":expiryDate,
            "right": right,
"strikePrice":lastStrikePrice,
            
        })
        const {Success:[currentEntryOpt1={}]} = data;
        console.log("last here", lastStrikePrice, currentEntryOpt1, fromDateOpt, toDateOpt, data);

        
    const { close: closeOfCurrentEntryOpt1 = -1 } = currentEntryOpt1;

    const currentIndex = listPrice.findIndex((pri)=>pri === lastStrikePrice);

    ;
    if(Math.floor(closeOfCurrentEntryOpt1) >=from && Math.floor(closeOfCurrentEntryOpt1)<=to){
        return currentEntryOpt1;
    }
    let i =  0;
    let j = listPrice.length - 1;
    let mid = Math.floor((i+j)/2)
    if(closeOfCurrentEntryOpt1 >-1 && closeOfCurrentEntryOpt1<from){
        mid = Math.floor((currentIndex+j)/2);
        // if(right === 'call'){
        //     j=mid-1;
        // } else {
        //     i=mid+1;
        // }
    } else if(closeOfCurrentEntryOpt1> -1 && closeOfCurrentEntryOpt1>to){
        mid = Math.floor((currentIndex)/2);
        // if(right === 'call'){
        //     i=mid+1;
        // } else {
        //     j=mid-1;
        // }
    }
    

    let currentValue = {};
    while(i<=j){
        mid = Math.floor((i+j)/2);
        const {Success:[currentEntryOpt]}= await historyData({
            interval: "1minute",
            fromDate:fromDateOpt,
            toDate:toDateOpt,
            exchangeCode:"NFO",
            productType:"options",
            "expiryDate":expiryDate,
            "right": right,
"strikePrice":listPrice[mid],
            
        })

        if(!currentEntryOpt){
            if(mid<Math.floor(listPrice.length - 1)/2) {
                i+=1
            } else {
                j-=1;
            }
            continue;
        }
       
        const { close} = currentEntryOpt;
        console.log("here i am", close, listPrice[mid], i, j, mid);
        if(Math.floor(close)<from){
            if(right === 'call'){
                j=mid-1;
            } else {
                i=mid+1;
            }
        } else if(Math.floor(close)>to){
            if(right === 'call'){
                i=mid+1;
            } else {
                j=mid-1;
            }
        } else{
           currentValue= currentEntryOpt
            break;
        }

    }
    return currentValue;
}

module.exports = findStrikePrice;