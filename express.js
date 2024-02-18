const express = require('express')
const path = require("path");
const cors = require('cors');
var bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  


const mainFile = require('./index')
const app = express()
const port = 3000

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  app.post('/trade', function(req, res) {
    if(!req.body.stockCode){
        res.send('Please enter stockcode');
    }
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
    }
  });
  
  
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${process.env.PORT || port}`)
})