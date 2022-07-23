const {service,user,pass} = require('../config/email-config.json');

var nodemailer = require("nodemailer");

async function send(_from,_to,_subject,_html)
{
    var transport = nodemailer.createTransport(
        {
            service:service,
            auth:
            {
                user:user,
                pass:pass
                
            },
            
        });
    
    var mailOptions = 
    {
        from: _from,
        to: _to,
        subject: _subject,
        html: _html,
    }
    
    await transport.sendMail(mailOptions);
}

module.exports = send;
