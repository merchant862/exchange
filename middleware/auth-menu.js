const dotenv = require('dotenv');
var getQRCode = require('./qr')
var callTxData = require('./transactions');
var userData = require("./auth-data");
var asyncUpdateData = require('./asyncUpdateData');
var getWalletBalance = require('./walletBalance');
var createWallet = require("./createWallet");

dotenv.config();

var title = process.env.TITLE;

module.exports =  async function authMenu(
  req, 
  res, 
  next,
  _route,
  _title,
  _msg_type,
  _msg,
  _asset,
  _order_no,
  _amount,
  _coin,
  _price,
  _date)

{   
  
  var data = await userData(req)

  var AsyncUpdateData = async()=> {await asyncUpdateData(req,res)};

  setInterval(AsyncUpdateData,100000);
  
  await createWallet(req,res);

  var getCoinBalance = await getWalletBalance(req,res);

  var balance = (data.USDT_balance != 0) ? (await data.USDT_balance.toFixed(2)) : "00.00";

  var getCoinPrices = async(_coin) =>
    {
            var price = await fetch('https://api.binance.com/api/v3/ticker/price?symbol='+_coin+'USDT', 
            {
                method: 'GET',
            })
            .then(async(response) => response.json())
            .then(async(data) => 
            {
                return ((parseFloat(data['price'])/100)*70);
            })

            return price;
    }
 

    var finalBalance =

        (parseFloat((await getCoinPrices("BTC")))*getCoinBalance.BTC)+
        (parseFloat((await getCoinPrices("ETH")))*getCoinBalance.ETH)+
        (parseFloat((await getCoinPrices("BNB")))*getCoinBalance.BNB)+
        (parseFloat((await getCoinPrices("SOL")))*getCoinBalance.SOL)+
        (parseFloat((await getCoinPrices("DOT")))*getCoinBalance.DOT)

    /* var finalBalance = 
    getCoinBalance.BTC+
    getCoinBalance.ETH+
    getCoinBalance.BNB+
    getCoinBalance.SOL+
    getCoinBalance.DOT */ 
  

  res.render(_route,
    {
      title: title+" | "+_title,
      name: data.name,
      email: data.email,
      balance: balance,
      address: data.address,
      state: data.isKYCDone,
      _msg_type,_msg,
      code:await getQRCode(req,res,data.address),
      data: await callTxData(req,res,"data",data.address),
      txHash:await callTxData(req,res,"hash",data.address),
      BTC:getCoinBalance.BTC,
      ETH:getCoinBalance.ETH,
      BNB:getCoinBalance.BNB,
      SOL:getCoinBalance.SOL,
      DOT:getCoinBalance.DOT,
      asset:_asset,
      wallet_bal:finalBalance.toFixed(2),
      order_no:_order_no,
      amount:_amount,
      coin:_coin,
      price:_price,
      date:_date
    });

    next();

};