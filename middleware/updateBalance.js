const sequelize = require('sequelize');
var userData = require('./auth-data');
var mail = require('./mail');
const Models = require('../models');
const Transactions = Models.transactionIds;
const User = Models.User;
var ejs = require('ejs');
var path = require('path');

var from = 'Tech Team';
var subject = 'New Deposit';


module.exports = async function updateBalance(req,res)
{
        var authData = await userData(req);
        
        await Transactions.findAll(
            {
                where:
                {
                    f_key:authData.id
                }
            }).then(async(result) => 
            {
                if(result != "")
                {
                    await Transactions.findAll(
                        {
                            where:
                            {
                               f_key:authData.id,
                               isUsed:"NO"
                            }
                        }).then(async(data)=>
                        {    
                            if(data != "" && data != null)
                            {
                                var json =  JSON.stringify(data);
                   
                                var jsonParsedData = JSON.parse(json);
                        
                                for(i = 0; i < jsonParsedData.length; i++)
                                {
                                  await User.update(
                                    {
                                       USDT_balance: sequelize.literal('USDT_balance +'+jsonParsedData[i].amount), 
                                    },
                                    {
                                       where: {email: authData.email}    
                                    });
            
                                  await Transactions.update(
                                    {
                                        isUsed: "YES", 
                                    },
                                    {
                                        where: {f_key: authData.id}    
                                    }); 

                                    ejs.renderFile(path.join(__dirname, '../views/email_templates/deposit.ejs'), 
                                    {
                                      name: authData.full_name,
                                      amount: jsonParsedData[i].amount,
                                    })
                                    .then(async(template) => 
                                    {
                                        mail(from,authData.email,subject,template);
                                    })
                                }
            
                            }
                            
                        });
                }
            })
}