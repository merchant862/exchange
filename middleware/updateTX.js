var userData = require('./auth-data');
var TX = require('./transactions');
const Models = require('../models');
const Transactions = Models.transactionIds

module.exports = async function updateTX(req,res)
{
        var authData = await userData(req);

        var txHash = await TX(req,res,"hash",authData.address);
        var data = await TX(req,res,"data",authData.address);
        
        for(x = 0; (x < txHash.length) && (x < data.length); x++)
        {
            await Transactions.count(
            {
                where: 
                { 
                    transactionID: txHash[x]
                }
            }).then(async(checkTX) =>
            {
                if(checkTX == 0 && checkTX < 1)
                {
                    var tx = 
                    {
                        f_key:authData.id,
                        transactionID:txHash[x],
                        amount:data[x],
                        isUsed:"NO"
                    };
                
                    await Transactions.create(tx);
            
                }  
            })
        }
}