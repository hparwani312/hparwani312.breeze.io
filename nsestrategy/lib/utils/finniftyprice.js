

const {execSync} = require('child_process');

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
async function Nifty(fixStrikePriceCE, fixStrikePricePE){

    try{

        execSync(`curl 'https://www.nseindia.com/api/option-chain-indices?symbol=FINNIFTY' \
        -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
        -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
        -b '_ga=GA1.1.658115741.1708157629; _ga_QJZ4447QD3=GS1.1.1712574819.13.0.1712574819.0.0.0; AKA_A2=A; _abck=1EFBD9C473455993AE34CD00A002B84D~0~YAAQRV06FzJWmISWAQAA+dGRxQ1E2VAsWlxgMzQdzKZYSrt96bF8C3KOj6PcvRkDvcFrpnvpe2D9QKJV0EyIqNwdQo+FSCBvxcYhN9UL76npcSY5I72YZ2dLmJLdBKS5uh46JRomsEQVFoeYRgXo3IxMAw1wEFjqosqNzTAaZ5lOX5YfrVyWSmlO2FYj7xQNKHTMDPKxDOrQyT3V9SQsuEak1EwMQEZmjxWaoOKaNGsla7ABTVnEYFqLK79iTlmMaVb3CdGppi8H49KFp09+IkAla60tCsRAKy8eqX/z/zdz+N5IUAb7Pr8jbkKfxllNQv9RSbIyp2YPaYQHoPWPz+RQF6qgtpRw6HArzHE3Bz4UqHWcZ2g+i4n9N6gtdAA8gy0AF/aTM3J7+6n8j8ncYiwrAzAiEKiEDgS8+uVg78KKD+IKx+tlfijIHG+0mUI3nanT7mFoQIT+Ubkqe51CCKR7poKq1jiI0XIL0hpKZF8hYgXgSSt4QB1BU0sNMi+U4eLXI/04ioX6S2SnGpiwQkR28ZyIWlCuCkcLINEKBwpUMmUqsbXk7BxHResfdTOCK+lLO/vwYvI=~-1~-1~-1; bm_mi=1F8F2FB06B2A14507D9CB5B1D6986127~YAAQRV06F2JdmISWAQAAz3OSxRtxG+uq/1ibioIN0vZ4BLyCRS0B1zKwXgTDEvMY78VnzdmEOSAdxmnUOe7n+j96lZ2tmvxF/B77/MR+dT4LzhzPFN4xSbI3S19QlWmeAcOxbcxoZP0J81XxIAZVlgwjD4BL8+8x2tTPpZx1aEgcdGxEj1BznTkSpu9Ul2dEKYB0qtkV2eNNiDzgkjy0gPtPcyqETEFzShrL7p5t4BiMMvuHnFKeAG1b6+SaxzvTJ99/SgZ57orwYdcQj3Y09IMJ67UrHNtm0+fuylpvGRxVes9nK2fn5pJNlsV1PZ6wXOY0Tlk50sY9WJEcuWIlxO5H5l+e3JKio8rVPPISu12nWoGTyAzD/li2IYJrQj7X10W0OjdXgdFk+V6toYhaUxBnwQOT~1; nsit=R3OQp7fRNpO1u9UBl2SY4hx4; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTc0NzA3MTQzNCwiZXhwIjoxNzQ3MDc4NjM0fQ.rOLvmVHXQtj90kW6XFJklY5soYs7_ruhamlADxqmlfM; _ga_87M7PJ3R97=GS2.1.s1747071404$o36$g1$t1747071440$j24$l0$h0; bm_sv=CBB0CE1244106D1C3708FAAA7BFC8271~YAAQRV06FxVemISWAQAAIImSxRt+QdY4Yz5IXzrDC51w8UdwW4dwAf8pYQWs6m0oA14RMfe2jfAMr5U/e/JNWc0PxqoElh5KwkNvDNYF6Ouj/wbu0wlsAvadJWc/AMWs6UUAhVdgOBcHuja9j8BydW5cskKCIVAXOpWEAv96vNRUiPmHpyxsc1ERsW0wSlkvcsmpCvLXYoZBaKSchpMhUTnPcTjjVMFil1LV9t3ZRMA4rpUYH0xl9j6zBehMTJvccmj9~1; ak_bmsc=C50901027C2A3DCCA75E326885577641~000000000000000000000000000000~YAAQRV06F3lgmISWAQAAosGSxRtk40dFIUDBIfsCTTMfLPRwRwNtdh9/LLYn2k4TlCnEvn3JUCKCEDVJeMznfnqzg7gXO8lopcNpoI9NHHWs76TMLC8Az3mXGl7aGhN/9rqNBd/JtTm4T6ykp1MX602VozpVMu7S6aCPKe+oc6iJ4ldChmSR+YJyZSvqVvov2qjAx15vPjChMDmpBE/eaki2CFKEsKzXmWt6qeiR8m0MuZE+PKr2wdW1JwuPQ5Bskk/2SpMOe6MQVXWrnMxbtFz67cAR8l6n3FAjTW3kMUl2nvW/aMcFFD4bBlrgbr814iz926VUXlTjtrD7f7yOY5AqkYAGSxWCq2T10wL14HDmu1EudHWU3uGHDDdmottngc9xX4UeWtm2toKMNmP4gek1pDnnAxQDHeWmcr9vTH3gi3CLw4yJ/AMyqnSOTCtgV/ZUaC6Ivhu5ISfGekJssPl30nZujJ1FbMBn4Yy5l6lkhPuRQ/5wP7zcGy1wPDgac2J1FjZ9d7ng/BgbfDn5maR93Hn5JFXcpqiV8vCq7lad+2WX5KsoWwm4PQ4sE9pJqkyk/2LagOt6; bm_sz=0146BF9222F5F6F94C62863C4CBF5C34~YAAQRV06Fxh+mISWAQAAtmqWxRubd7sGKg95o6DtrhJGZTYfpAFWYoVJ/pGaaFl+Yv065P/sIQtMA0TDYzfXBXh1pte+h93NNMRgeL97hJFf+xcMGxBWx+w3ysXJfP04ljLdxtd9Wn0lsjPFYOjnYjbEXmITAD5u7fBMeWE7rkDIO83yrKxM0KuAg/kWZVOdZT5ClyWsklm0nj9rXzCKy6rd8yB0lN5HU4QRs5Lr7y2AsVLdh7d9Og4y+8JRCO6XErN0OAna+sSB6D2lczYmTjq1tcpM+GwviiUf43g2JmjouinraAeF28vOwguDBXrT179xijn6CtVsRvMbbFRFUbcso00KkfzxfReCoL1/q5HHedpnb7qhJT5ABxybkKz/OIyCJnxBQdb9N6oyztZWlVXb6OVFkXfuGDTB0JmnOwv62F3rfapLQ3iFeDPKfnJrvljMX8FnBeWfXQLV37NNiKKsUneYXQLokS+9/a6ARg==~4403780~4338480' \
        -H 'priority: u=0, i' \
        -H 'sec-ch-ua: "Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"' \
        -H 'sec-ch-ua-mobile: ?0' \
        -H 'sec-ch-ua-platform: "macOS"' \
        -H 'sec-fetch-dest: document' \
        -H 'sec-fetch-mode: navigate' \
        -H 'sec-fetch-site: none' \
        -H 'sec-fetch-user: ?1' \
        -H 'upgrade-insecure-requests: 1' \
        -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'`);
    const data = await fetch("https://www.nseindia.com/api/option-chain-indices?symbol=FINNIFTY", {
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

module.exports =  Nifty;