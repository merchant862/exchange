const Models = require("../models");
const User = Models.User;
const userkYC = Models.user_kyc;
var mail = require('../middleware/mail');
var ejs = require('ejs');
var path = require('path');

var from = 'Tech Team';
var subject_approval = 'KYC Approval Level 2';
var subject_rejection = 'KYC Rejection Level 2';

module.exports = async function updateUserKYCLevel2()
{ 
    await userkYC.findAll(
        {
            where: 
            {
                KYC_LEVEL_1 : "YES",
                KYC_LEVEL_2 : "PENDING"
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
                     if(jsonParsedData[i].KYC_LEVEL_2_TRY == 1 &&
                        jsonParsedData[i].KYC_LEVEL_2 == "PENDING")
                     {
                        await userkYC.update(
                            {
                                KYC_LEVEL_2: "NO",
                            },
                            {
                                where: 
                                {
                                    KYC_LEVEL_2 : "PENDING"
                                },
                            }).
                            then(async => 
                                {
                                    ejs.renderFile(path.join(__dirname, '../views/email_templates/kyc_rejection.ejs'), 
                                    {
                                        name: jsonParsedData[i].User.full_name,
                                        level: "2",
                                    }).then(async(template) => 
                                    {
                                        mail(from,jsonParsedData[i].User.email,subject_rejection,template)
                                    })
                                    
                                })   
                     }

                     else
                     {
                        await userkYC.update(
                            {
                                KYC_LEVEL_2: "YES"
                            },
                            {
                                where: 
                                {
                                    KYC_LEVEL_2 : "PENDING"
                                },
                            }).
                            then(async => 
                                {
                                    ejs.renderFile(path.join(__dirname, '../views/email_templates/kyc_approval.ejs'), 
                                    {
                                        name: jsonParsedData[i].User.full_name,
                                        level: "2",
                                        message: "trading assets",
                                    }).then(async(template) => 
                                    {
                                        mail(from,jsonParsedData[i].User.email,subject_approval,template)
                                    })
                                })
                     }
                }

            }
    
        });
}
