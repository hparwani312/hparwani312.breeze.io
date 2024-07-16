const express = require('express')
const path = require("path");
const cors = require('cors');
const fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const firebaseSaveData = require('./Firebase');
const firebaseSaveData1 = require('./FirebaseIC');
// const controlitbanknifty = require('./nsestrategy/lib/tradeslive/highlow/banknifty/controlit');

// Create application/x-www-form-urlencoded parser  


const mainFile = require('./index')
const app = express()
const port = 3000

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use((req, res, next) => {
    console.log('cookie', req.cookies);
    res.cookie
    next()
  })

app.post('/getimagechunks', async function(req, res){
    const doc  = await firebaseSaveData.getChunks(req.body);
    res.send(doc);
})

app.post('/imagechunks', async function(req, res){
    firebaseSaveData.setChunks(req.body);
    res.sendStatus(200);
})

app.post('/deleteimagechunks', async function(req, res){
   firebaseSaveData.deleteChunks(req.body);
    res.sendStatus(200);
})



app.post('/thread', function(req, res){
    firebaseSaveData.saveThread(req.body);
    res.sendStatus(200);
})

app.post('/image', function(req, res){
    console.log("inside save image here");
    firebaseSaveData.saveImage(req.body);
    res.sendStatus(200);

})

app.post('/getthread', async function(req, res){
    const doc  = await firebaseSaveData.getThread(req.body);
    res.send(doc);
})


app.post('/deletethread', async function(req, res){
    const doc  = await firebaseSaveData.deletethread(req.body);
    res.sendStatus(200);
})

app.post('/getimage', async function(req, res){
    const doc  = await firebaseSaveData.getImage(req.body);
    res.send(doc);
})
  
app.post('/deleteimage', async function(req, res){
    const doc  = await firebaseSaveData.deleteImage(req.body);
    res.sendStatus(200);
})


app.get('/', function(req, res) {
    res.redirect('/login');;
  });


app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
  });

app.get('/trade', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  app.post('/trade', function(req, res) {
    // if(!req.body.stockCode){
    //     res.send('Please enter stockcode');
    //     return;
    // }
    if(req.body.type==='options'){
        mainFile.optionsTrade(req.body).then((data)=>{
            res.send(data);
        }).catch((data)=>{
            console.log("data here once", data);
            res.send(data);
        })
    } else if(req.body.type==='square'){
       mainFile.squareOff(req.body).then((data)=>{
            res.send(data);
        }).catch((data)=>{
            res.send(data);
        })
    } else if(req.body.type==='quotings') {
        mainFile.subscribeFeedsLive(req.body).then((data)=>{
            res.send(data);
        }).catch((data)=>{
            res.send(data);
        })
    }
    else if(req.body.type==='quotingslive') {
        mainFile.subscribeFeedsoneclick().then((data)=>{
            res.send(data);
        }).catch((data)=>{
            res.send(data);
        })
    }
  });
  
  app.get("/tickdata", function(req, res){
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
    // const filepath1 = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    const filepath2 = './directory/dataoncetickdata'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath3 = './directory/dataoncefinnifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath4 = './directory/dataoncebanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filePath1Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath2Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath3Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    const filePath4Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    res.send("TickData "+filePath4Data);
  });

  app.get("/highlowbanknifty", function(req, res){
    const date2 = (new Date()).getDate()

    const date3 = (new Date()).getMonth()

const date4 = (new Date()).getFullYear();
    // const filepath1 = './directory/dataoncemidcpnifty'+date2+"-"+date3+"-"+date4+".txt";
    const filepath2 = './directory/dataoncehighlowbanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath3 = './directory/dataoncefinnifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filepath4 = './directory/dataoncebanknifty'+date2+"-"+date3+"-"+date4+".txt";
    // const filePath1Data = fs.existsSync(filepath1) ? fs.readFileSync(filepath1,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath2Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    // const filePath3Data = fs.existsSync(filepath3) ? fs.readFileSync(filepath3,{ encoding: 'utf8', flag: 'r' }):"";
    const filePath4Data = fs.existsSync(filepath2) ? fs.readFileSync(filepath2,{ encoding: 'utf8', flag: 'r' }):"";
    res.send("HighLowBankNifty "+filePath4Data);
  })
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


app.post('/starthighlowbanknifty', function(req, res) {
    
    // controlitbanknifty.start(req.body);

})
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