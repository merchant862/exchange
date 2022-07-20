const Web3 = require('web3');

const dotenv = require('dotenv');

dotenv.config();

var provider = process.env.RPC;

var web3Provider = new Web3.providers.HttpProvider(provider);
    
var web3 = new Web3(web3Provider);

module.exports = web3;