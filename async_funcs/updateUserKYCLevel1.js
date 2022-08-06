const Models = require("../models");
const User = Models.User;
const userkYC = Models.user_kyc;
var mail = require('../middleware/mail');
var ejs = require('ejs');
var path = require('path');

var from = 'Tech Team';
var subject = 'KYC Approval Level 1';

module.exports = async function updateUserKYCLevel1()
{ 
    await userkYC.findAll(
        {
            where: 
            {
                KYC_LEVEL_1 : "PENDING"
            },
            include:
            {
                model: User,
            },
        })
        .then(async(results) => 
        {
            var json =  JSON.stringify(results);
      
            var jsonParsedData = JSON.parse(json);
            for(var i = 0; i < jsonParsedData.length; i++)
            {
                var ms = +new Date(jsonParsedData[i].updatedAt);

                var currentMS = new Date();

                if(currentMS > ms + 25200000)
                {
                     await userkYC.update(
                        {
                            KYC_LEVEL_1: "YES"
                        },
                        {
                            where: 
                            {
                                KYC_LEVEL_1 : "PENDING"
                            },
                        }).
                        then(async => 
                            {
                                ejs.renderFile(path.join(__dirname, '../views/email_templates/kyc_approval.ejs'), 
                                {
                                    name: jsonParsedData[i].User.full_name,
                                    level: "1",
                                    message: "deposting funds",
                                }).then(async(template) => 
                                {
                                    mail(from,jsonParsedData[i].User.email,subject,template)
                                })
                                
                            })
                }

            }
    
        });
}