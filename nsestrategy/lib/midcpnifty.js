const fs = require('fs');
const midcpniftyprice = require('./utils/midcpniftyprice');
let  total = 0;
let twominuteintervalCE = 0;
let twominuteintervalPE = 0;
let CElastPrice = 0;
let PElastPrice = 0;
let strikePriceCE = 12600;
let strikePricePE = 8900;
let fixStrikePriceCE = 0;
let fixStrikePricePE = 0;
let buyordered = false;
let sellordered = false;
let orderType = "";
let orderedPrice = 0;
function makeAnEntry(type, strikePrice, price, date, total=0) {
    let data = type+" "+strikePrice+" "+price+" "+date + " "+ total + "\n";
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
const filepath = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    fs.writeFileSync(filepath, data, {
        flag: "a+"
      });
}

function ordertobuyanoption(strikePrice, price) {
    
    makeAnEntry("orderbuy", strikePrice, price, Date.now()+" "+(new Date()).getHours()+" "+(new Date()).getMinutes());
}

function ordertosellanoption(strikePrice, price) {
    
    makeAnEntry("ordersell", strikePrice, price, Date.now()+" "+(new Date()).getHours()+" "+(new Date()).getMinutes());
}

function ordertocancelbuyoption(strikePrice, price){
    makeAnEntry("cancelbuy", strikePrice, price, Date.now()+" "+(new Date()).getHours()+" "+(new Date()).getMinutes());
}
function ordertocancelselloption(strikePrice, price){
    makeAnEntry("cancelsell", strikePrice, price, Date.now()+" "+(new Date()).getHours()+" "+(new Date()).getMinutes());
}

function buyanoption(strikePrice, price) {
    
    makeAnEntry("buy", strikePrice, price, Date.now()+" "+(new Date()).getHours()+" "+(new Date()).getMinutes());
}
function sellanoption(strikePrice, price, total) {
    
    makeAnEntry("sell", strikePrice, price, Date.now()+" "+(new Date()).getHours()+" "+(new Date()).getMinutes(), total);
}

function increasingContinously() {

}
 function checkIfCanBuy(){
    setInterval(async ()=>{
        const hours = (new Date()).getHours()
        const minutes = (new Date()).getMinutes()

        if(hours>=9 && hours<=15){
        if(hours===9 && minutes<15){
            return
        }
        
        
        const {CE, PE, dataExists} = await midcpniftyprice(fixStrikePriceCE, fixStrikePricePE);
        if(hours===15 && minutes>1) {
            if(sellordered){
                            if(orderType === "PE"){
                                total = total + orderedPrice -  PE.lastPrice;
                                sellanoption(PE.strikePrice, PE.lastPrice, total);
                                sellordered = false;
                                orderType = ""
                            } else if(orderType === "CE"){
                                total = total + orderedPrice -  CE.lastPrice;
                                sellanoption(CE.strikePrice, CE.lastPrice, total);
                                sellordered = false;
                                orderType = ""
                            }
                        }
                        return;
        }
        if(dataExists){
            console.log("CE and PE here", CE, PE);
                    if(!twominuteintervalCE || ((Date.now()-twominuteintervalCE)>=60*2*1000) || strikePriceCE!=CE.strikePrice){
                        if(CE.strikePrice>strikePriceCE &&!buyordered && !sellordered){
                            ordertobuyanoption(CE.strikePrice, CE.lastPrice+Math.floor((CE.strikePrice-strikePriceCE)/200));
                            fixStrikePriceCE=CE.strikePrice;
                            // twominuteinterval=Date.now();
                            // CElastPrice = CE.lastPrice;
                            // PElastPrice = PE.lastPrice;
                            orderedPrice = CE.lastPrice+Math.floor((CE.strikePrice-strikePriceCE)/200);
                            orderType = "CE";
                            buyordered = true;
                            twominuteintervalCE=Date.now();
                            CElastPrice = CE.lastPrice;
                            strikePriceCE=CE.strikePrice;
                            return;
                        }
                        twominuteintervalCE=Date.now();
                        CElastPrice = CE.lastPrice;
                        strikePriceCE=CE.strikePrice;
                    } 

                    if(!twominuteintervalPE || ((Date.now()-twominuteintervalPE)>=60*2*1000) || strikePricePE!=PE.strikePrice){
                        if(PE.strikePrice<strikePricePE &&!buyordered && !sellordered){
                            ordertobuyanoption(PE.strikePrice, PE.lastPrice+Math.floor((strikePricePE-PE.strikePrice)/200));
                            fixStrikePricePE=PE.strikePrice;
                            // twominuteinterval=Date.now();
                            // CElastPrice = CE.lastPrice;
                            // PElastPrice = PE.lastPrice;
                            orderedPrice = PE.lastPrice+Math.floor((strikePricePE-PE.strikePrice)/200);
                            orderType = "PE";
                            buyordered = true;
                            twominuteintervalPE=Date.now();
                        PElastPrice = PE.lastPrice;
                        strikePricePE=PE.strikePrice;
                            return;
                        }
                        twominuteintervalPE=Date.now();
                        PElastPrice = PE.lastPrice;
                        strikePricePE=PE.strikePrice;
                        // if(sellordered){
                        //     if(orderType === "PE"){
                        //         total = total + orderedPrice -  PE.lastPrice;
                        //         sellanoption(PE.strikePrice, PE.lastPrice, total);
                        //         sellordered = false;
                        //         orderType = ""
                        //     } else if(orderType === "CE"){
                        //         total = total + orderedPrice -  CE.lastPrice;
                        //         sellanoption(CE.strikePrice, CE.lastPrice, total);
                        //         sellordered = false;
                        //         orderType = ""
                        //     }
                        // }
                    } 
                

                        if(!buyordered && !sellordered){
                        if(CElastPrice-CE.lastPrice>3){
                            ordertobuyanoption(CE.strikePrice, CE.lastPrice);
                            fixStrikePriceCE=CE.strikePrice;
                            // twominuteinterval=Date.now();
                            // CElastPrice = CE.lastPrice;
                            // PElastPrice = PE.lastPrice;
                            orderedPrice = CE.lastPrice;
                            orderType = "CE";
                            buyordered = true;
                        } else if(PElastPrice-PE.lastPrice>3){
                            ordertobuyanoption(PE.strikePrice, PE.lastPrice);
                            fixStrikePricePE=PE.strikePrice;
                            // twominuteinterval=Date.now();
                            // CElastPrice = CE.lastPrice;
                            // PElastPrice = PE.lastPrice;
                            orderedPrice = PE.lastPrice;
                            orderType = "PE";
                            buyordered = true
                        }
                    } else if(buyordered){
                        if(orderType === "PE"){
                            if(PE.lastPrice<=orderedPrice){
                                buyanoption(PE.strikePrice, PE.lastPrice);
                                total-=PE.lastPrice;
                                orderedPrice=PE.lastPrice+1;
                                ordertosellanoption(PE.strikePrice, orderedPrice);
                                buyordered = false;
                                sellordered = true;
                            } else if(PE.lastPrice-orderedPrice>3){
                                buyordered = false;
                                ordertocancelbuyoption(PE.strikePrice, orderedPrice);
                                fixStrikePricePE=0;
                                orderType = ""
                            }
                        } else if(orderType === "CE"){
                            if(CE.lastPrice<=orderedPrice){
                                buyanoption(CE.strikePrice, CE.lastPrice);
                                total-=CE.lastPrice;
                                orderedPrice=CE.lastPrice+1;
                                ordertosellanoption(CE.strikePrice, orderedPrice);
                                buyordered = false;
                                sellordered = true;
                            }else if(CE.lastPrice-orderedPrice>3){
                                buyordered = false;
                                ordertocancelbuyoption(CE.strikePrice, orderedPrice);
                                fixStrikePriceCE=0;
                                orderType = ""
                            }
                        }
                    } else if(sellordered){
                        if(orderType === "PE"){
                            if(PE.lastPrice>=orderedPrice){
                                total+=PE.lastPrice;
                                sellanoption(PE.strikePrice, PE.lastPrice, total);
                                fixStrikePricePE=0;
                                console.log(total);
                                sellordered = false;
                                orderType = ""
                            }else if(orderedPrice-PE.lastPrice>3){
                                ordertocancelselloption(PE.strikePrice, orderedPrice);
                                orderedPrice=PE.lastPrice-1;
                                ordertosellanoption(PE.strikePrice, orderedPrice);
                            }
                        } else if(orderType === "CE"){
                            if(CE.lastPrice>=orderedPrice ){
                                total+=CE.lastPrice;
                                sellanoption(CE.strikePrice, CE.lastPrice, total);
                                fixStrikePriceCE=0;
                                console.log(total);
                                sellordered = false;
                                orderType = ""
                            }else if(orderedPrice-CE.lastPrice>3){
                                ordertocancelselloption(CE.strikePrice, orderedPrice);
                                orderedPrice=CE.lastPrice-1;
                                ordertosellanoption(CE.strikePrice, CE.lastPrice-1);
                            }
                        }
                    }
    }
}
    }, 5000)
}

checkIfCanBuy()