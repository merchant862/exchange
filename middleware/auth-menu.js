const dotenv = require('dotenv');
var getQRCode = require('./qr')
var callTxData = require('./transactions');
var userData = require("./auth-data");
var updateTX = require('./updateTX');
dotenv.config();

var title = process.env.TITLE;

module.exports =  async function authMenu(req, res, next,_route,_title,_msg_type,_msg)
{   
  
  var data = await userData(req)

  await updateTX(req,res);

  var balance = 
  (data.USDT_balance != 0) ? 
  (Math.round((data.USDT_balance + Number.EPSILON) * 100) / 100) : "00.00";

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
    });

    next();

};