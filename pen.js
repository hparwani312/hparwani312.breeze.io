const moment = require("moment");
const { NSE, Extras } = require('nse-js');
const nse = new NSE();
const hours = (new Date()).getHours()
            const minutes = (new Date()).getMinutes()

console.log("data flagstart", hours, minutes);
console.log(moment("26-Jun-2024", "DD-MMM-YYYY").format('YYYY-MM-DD'))

 const polo =async ()=>{
    const data = await nse.optionChain('midcpnifty')
    console.log("data here", data);
}

polo()