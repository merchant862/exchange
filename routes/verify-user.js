var express = require('express');
var router = express.Router();
const Models = require('./../models');
const dotenv = require('dotenv');
var deauth = require('../middleware/deauth');
var randtoken = require('rand-token');


const User = Models.User;
dotenv.config();

var title = process.env.TITLE;

/* GET users listing. */
router.get('/', deauth, async function(req, res, next) 
{
    
    if(req.query.token != "")
    {
        var user = await User.findOne(
            {
                where: {verification_token: req.query.token}
            });

        if (!user) return res.status(400).render("verify-user",{title:title+" | "+"User Verification",page:"login",error:"Invalid link"});
    
        await User.update({ 
          verification_token: null, verified: 'YES' 
          },
          {
            where: {email: user.email}    
          });

        res.status(200).render("verify-user",{title:title+" | "+"User Verification",page:"login","success":"Email Verified!"});
    }

    else
    {
      res.status(400).render("verify-user",{title:title+" | "+"User Verification",page:"login",error:"An error occured"});
    }
});

module.exports = router;