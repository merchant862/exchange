var updateTX = require('./updateTX');
var updateBalance = require('./updateBalance');

module.exports = async function asyncUpdateData(req,res)
{
    await updateTX(req,res);

    await updateBalance(req,res);
}