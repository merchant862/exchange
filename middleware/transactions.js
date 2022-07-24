const web3 = require('../config/web3');
var dotenv = require("dotenv");

dotenv.config();

var USDT = process.env.USDT_ADDRESS;
var abi = require("../abis/abi.json");
var USDT_interface = new web3.eth.Contract(abi, USDT);

module.exports = async function call(req,res,_param,_address)
{
        let options = {
            filter: {
                to: _address,
            },
            fromBlock: 0,            
            toBlock: 'latest'
        };
        
        var data = [];
        var txHash = [];
    ;
        await USDT_interface.getPastEvents("Transfer", options)
        .then(async(results) =>
        {
            var json =  JSON.stringify(results);
       
            var jsonParsedData = JSON.parse(json);
    
            for(i = 0; i < jsonParsedData.length; i++)
            {
              data.push(jsonParsedData[i].returnValues.value);
              txHash.push(jsonParsedData[i].transactionHash)
            }
        });

        if(_param == "hash")
        {
            return txHash;
        }

        else if(_param = "data")
        {
            return data;
        }
}
