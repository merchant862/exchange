const moment = require('moment');
var userData = require('./auth-data');
const Models = require('../models');
const Orders = Models.orders;

module.exports = async function getOrders(req,res,_asset,_param)
{
   var authData = await userData(req);

   var serial = [];
   var amount = [];
   var coin = [];
   var price = [];
   var date = [];
   var time = [];

   var data = await Orders.findAll(
    {
       where: 
       { 
         f_key: authData.id,
         coin: _asset
       }   
    }).then((results) => 
    {
        if(results != "")
        {
            var json =  JSON.stringify(results);
  
            var jsonParsedData = JSON.parse(json);
            
            for(var i = 0; i < jsonParsedData.length; i++)
            {
                serial.push(jsonParsedData[i].serial);
                amount.push(jsonParsedData[i].amount);
                coin.push(jsonParsedData[i].coin);
                price.push(jsonParsedData[i].price);
                date.push(moment(jsonParsedData[i].createdAt).format("YYYY-MM-DD HH:mm:ss"));
                time.push(moment(jsonParsedData[i].createdAt).format("HH:mm:ss"));
            }
        }

    });

    if(_param == "serial")
    {
        return serial;
    }

    else if(_param == "amount")
    {
        return amount;
    }

    else if(_param == "coin")
    {
        return coin;
    }

    else if(_param == "price")
    {
        return price;
    }

    else if(_param == "date")
    {
        return date;
    }

    else if(_param == "time")
    {
        return time;
    }

return data;

}