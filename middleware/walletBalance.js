var userData = require('./auth-data');
const Models = require('../models');
const Wallets = Models.wallet;

module.exports = async function getWalletBalance(req,res)
{
    var authData = await userData(req);

    var data = await Wallets.findAll(
            {
               where: 
               { 
                 f_key: authData.id 
               }   
            }).then((results) => 
            {
                if(results != "")
                {
                    var json =  JSON.stringify(results);
          
                    var jsonParsedData = JSON.parse(json);
                    
                    for(var i = 0; i < jsonParsedData.length; i++)
                    {
                        return jsonParsedData[i] 
                    }
                }
        
            });
        
    return data;
}