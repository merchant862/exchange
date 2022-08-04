var authData = require("./auth-data");
const Models = require('../models');
const userkYC = Models.user_kyc;

module.exports = async function getKYCdata(req)
{
    var userData = await authData(req);

    var data = await userkYC.findAll(
        {
            where: 
            {
                f_key: userData.id, 
            }
        }).then((results) => 
        {
            var json =  JSON.stringify(results);
      
            var jsonParsedData = JSON.parse(json);
            for(var i = 0; i < jsonParsedData.length; i++)
            {
                return jsonParsedData[i] 
            }
    
        });
    
        return data;
}