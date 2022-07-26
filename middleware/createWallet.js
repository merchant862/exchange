const userData = require('./auth-data'); 
const Models = require('../models');
const Wallets = Models.wallet;

module.exports = async function createWallet(req,res)
{ 
    var authData = await userData(req);

    await Wallets.count(
        {
            where:{f_key: authData.id}
        }).then(async(count)=>
        {
            if(count < 1)
            {
                var data = 
                {
                    f_key:authData.id,
                    BTC:0.00,
                    ETH:0.00,
                    BNB:0.00,
                    SOL:0.00,
                    DOT:0.00
                };
                await Wallets.create(data)
            }
        })
}