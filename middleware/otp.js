const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');
const phone = require('libphonenumber-js')

dotenv.config();

async function getSMS(_number,_otp)
{
    var url = "https://api.smsala.com/api/SendSMS";

    var senderID = '120i03rkowkdso';

    var data = 
    {
        api_id : process.env.SMSALA_API_ID,
        api_password : process.env.SMSALA_API_PASS,
        sms_type : 'T',
        encoding : 'T',
        sender_id : senderID,
        phonenumber : '+1 541-708-3275',
        textmessage: 'Your verification code: #V5',
    };

    await fetch(url, 
      {
        method: 'POST',
        data: JSON.stringify(data),
		headers: {"Content-type": "application/json"},
      })
      .then(async(data) => 
      {
          console.log(await data.json());
      })
      .catch(async(e) => 
      {
          console.log(e);
      })
}

getSMS();