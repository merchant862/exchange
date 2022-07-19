var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")
var auth_data = require('../middleware/auth-data');
var Web3 = require("web3");
const Models = require('./../models');
const User = Models.User;

dotenv.config();

var title = process.env.TITLE;
var provider = process.env.RPC;

/* GET home page. */

router.get('/', auth, authMenu, async function(req, res, next) 
{
    authMenu(req,res,next,"deposit","Deposit Funds");
});

router.post('/', auth, authMenu, async function(req, res, next) 
{
    var txID = req.body.txID;

    var email = await auth_data(req,res,next);

    var balance = await User.findAll(
        {
            attributes: ['USDT_balance']
        },
        {
            where: {email: email }
        }).then((results) => 
        {
           var json =  JSON.stringify(results);

           
           var jsonParsedData = JSON.parse(json);
           for(var i = 0; i < jsonParsedData.length; i++)
           {
              return jsonParsedData[i]['USDT_balance']; 
           }

        });
    
    if(txID != "")
    {
        var web3Provider = new Web3.providers.HttpProvider(provider);
    
        var web3 = new Web3(web3Provider);
        
        web3.eth.getTransactionReceipt(txID, async(err, result)=>
        {
           if(!err)
           {
                var rawdata = JSON.stringify(result.logs);
            
                if(rawdata != null)
                {
                    var data = JSON.parse(rawdata);
                    for (var i = 0; i < data.length; i++) 
                    {
                        var value = web3.utils.hexToNumber(data[i]['data']);
                        console.log(value,await balance);
        
                        await User.update(
                            { 
                              USDT_balance: balance+value 
                            },
                            {
                              where: {email: email}    
                            }); 
                    }
                      res.redirect('/deposit');
                }
    
                else
                {
                  res.redirect('/deposit');
                }
           }

           else
           {
              res.redirect('/deposit');
           }

        });
    }

    else
    {
        res.redirect('/deposit');
    }
    
});

module.exports =  router;
