const express = require('express')
const path = require("path");
const cors = require('cors');
const fs = require('fs');
var bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  


const app = express()
const port = 3002

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
    // const filepath1 = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath2 = './directory/dataoncenifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath3 = './directory/dataoncefinnifty'+date2+"-"+date3+"-"+date4+".txt";
     const filepath4 = './directory/dataoncebanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filePath1Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath2Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath3Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    const filePath4Data = fs.existsSync(filepath4) ? fs.readFileSync(filepath4,{ encoding: 'utf8', flag: 'r' }):"";
    res.send("BankNifty "+filePath4Data);
    // +"\n\n\n"+"Nifty "+filePath2Data+"\n\n\n"+"FinNifty "+filePath3Data+"\n\n\n"+"MidCap "+filePath1Data);

}
);

app.get('/nifsel', function(req, res) {
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
    const filepath1 = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath2 = './directory/dataoncenifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath3 = './directory/dataoncefinnifty'+date2+"-"+date3+"-"+date4+".txt";
     //const filepath4 = './directory/dataoncebanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filePath1Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath2Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath3Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    const filePath4Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    res.send("nifsel "+filePath4Data);
    // +"\n\n\n"+"Nifty "+filePath2Data+"\n\n\n"+"FinNifty "+filePath3Data+"\n\n\n"+"MidCap "+filePath1Data);

}
);
app.get('/finnifty', function(req, res) {
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
    // const filepath1 = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath2 = './directory/dataoncenifty'+date2+"-"+date3+"-"+date4+".txt";
    const filepath3 = './directory/dataoncefinnifty'+date2+"-"+date3+"-"+date4+".txt";
     //const filepath4 = './directory/dataoncebanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filePath1Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath2Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath3Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    const filePath4Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    res.send("Finnifty "+filePath4Data);
    // +"\n\n\n"+"Nifty "+filePath2Data+"\n\n\n"+"FinNifty "+filePath3Data+"\n\n\n"+"MidCap "+filePath1Data);

}
);
app.get('/banknifty', function(req, res) {
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
    // const filepath1 = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath2 = './directory/dataoncenifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath3 = './directory/dataoncefinnifty'+date2+"-"+date3+"-"+date4+".txt";
     const filepath4 = './directory/dataoncebanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filePath1Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath2Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath3Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    const filePath4Data = fs.existsSync(filepath4) ? fs.readFileSync(filepath4,{ encoding: 'utf8', flag: 'r' }):"";
    res.send("BankNifty "+filePath4Data);
    // +"\n\n\n"+"Nifty "+filePath2Data+"\n\n\n"+"FinNifty "+filePath3Data+"\n\n\n"+"MidCap "+filePath1Data);

}
);
app.get('/nifty', function(req, res) {
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
    // const filepath1 = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    const filepath2 = './directory/dataoncenifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath3 = './directory/dataoncefinnifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath4 = './directory/dataoncebanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filePath1Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath2Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath3Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    const filePath4Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    res.send("Nifty "+filePath4Data);
    // +"\n\n\n"+"Nifty "+filePath2Data+"\n\n\n"+"FinNifty "+filePath3Data+"\n\n\n"+"MidCap "+filePath1Data);

}
);
  
  
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${process.env.PORT || port}`)
})