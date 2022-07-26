const dotenv = require('dotenv');
var getQRCode = require('./qr')
var callTxData = require('./transactions');
var userData = require("./auth-data");
var asyncUpdateData = require('./asyncUpdateData');
var getWalletBalance = require('./walletBalance');
var createWallet = require("./createWallet");

dotenv.config();

var title = process.env.TITLE;

module.exports =  async function authMenu(req, res, next,_route,_title,_msg_type,_msg)
{   
  
  var data = await userData(req)

  var AsyncUpdateData = async()=> {await asyncUpdateData(req,res)};

  setInterval(AsyncUpdateData,10000);
  
  await createWallet(req,res);

  var getCoinBalance = await getWalletBalance(req,res);

  var balance = (data.USDT_balance != 0) ? (await data.USDT_balance.toFixed(2)) : "00.00";
  

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
    });

    next();

};