
async function BankNifty(){

    try{
    const data = await fetch("https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referer": "https://www.nseindia.com/option-chain",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });
    const actualData = await data.json();
    return actualData?.records?.strikePrices;
    }catch(e){
        console.log("error here", e);
        return new Promise((res,rej)=>{
            setTimeout(()=>{
                res(BankNifty());
            }, 5000)
        })
        return BankNifty();
    }
}

module.exports =  BankNifty;