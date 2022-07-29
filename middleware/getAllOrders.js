const moment = require('moment');
var userData = require('./auth-data');
const Models = require('../models');
const Orders = Models.orders;

module.exports = async function getOrders(req,res,_param)
{
   var authData = await userData(req);

   var serial = [];
   var amount = [];
   var coin = [];
   var date = [];

   var data = await Orders.findAll(
    {
       where: 
       { 
         f_key: authData.id,
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
                date.push(moment(jsonParsedData[i].createdAt).format("YYYY-MM-DD HH:mm:ss"))
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

    else if(_param == "date")
    {
        return date;
    }

return data;

}