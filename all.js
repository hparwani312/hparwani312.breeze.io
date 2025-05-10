const {spawn} = require('child_process');

const mainFile = spawn('node', ['express.js'],{
    detached: true,
    stdio: 'ignore'
})

const nifty = spawn('node', ['nsestrategy/lib/nifty.js'],{
    detached: true,
    stdio: 'ignore'
})

const finnifty = spawn('node', ['nsestrategy/lib/finnifty.js'],{
    detached: true,
    stdio: 'ignore'
})

const midcpnifty = spawn('node', ['nsestrategy/lib/midcpnifty.js'],{
    detached: true,
    stdio: 'ignore'
})

const banknifty = spawn('node', ['nsestrategy/lib/banknifty.js'],{
    detached: true,
    stdio: 'ignore'
})


const bankniftycont = spawn('node', ['nsestrategy/lib/bankniftycont.js'],{
    detached: true,
    stdio: 'ignore'
})

const HighLowBankNifty = spawn('node', ['nsestrategy/lib/tradeslive/highlow/banknifty/index27Junpro.js'],{
    detached: true,
    stdio: 'ignore'
})

const check = spawn('node', ['nsestrategy/lib/biner.js'],{
    detached: true,
    stdio: 'ignore'
})
mainFile.unref();
bankniftycont.unref();
banknifty.unref();
midcpnifty.unref();
finnifty.unref();
nifty.unref();
HighLowBankNifty.unref()
check.unref();