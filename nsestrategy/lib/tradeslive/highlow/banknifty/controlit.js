const tradeControl = require('./index22');

let flagstart = false;
let from = 40;
let to = 55;

let expiryDate;
function start({fromPrice, toPrice , expiryDate:expiryDateTine}){
    flagstart = true;
    from=fromPrice;
    to=toPrice;
    expiryDate=expiryDateTine;
    tradeControl.starttrade(fromPrice,toPrice,expiryDateTine)
}

function end(){
    flagstart = false;
    tradeControl.endTrade()
}




const data = {
    start,
    end,
    flagstart,
    from,
    to,
    expiryDate
}

module.exports = data;