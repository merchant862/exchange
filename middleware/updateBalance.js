const sequelize = require('sequelize');
var userData = require('./auth-data');
var mail = require('./mail');
const Models = require('../models');
const Transactions = Models.transactionIds;
const User = Models.User;

var from = 'Tech Team';
var subject = 'New Deposit';
var html = (user,amount)=>
{
    return "Hi&nbsp;<b>"+user+"</b><br/><p>Your account has been deposited by&nbsp;$"+amount+"</p>";
}

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
            
                                    mail(from,authData.email,subject,html(authData.full_name,jsonParsedData[i].amount));
                                }
            
                            }
                            
                        });
                }
            })
}