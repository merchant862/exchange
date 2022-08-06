var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var cors = require('cors')

//-------------HTTPS----------------------
const fs = require('fs');

const https = require('https');

const key = fs.readFileSync('./ssl/key.pem');

const cert = fs.readFileSync('./ssl/cert.pem');
//-------------HTTPS----------------------

var indexRouter = require('./routes/index');
var signinRouter = require('./routes/login');
var signupRouter = require('./routes/registration');
var homeRouter = require('./routes/home');
var exchangeRouter = require('./routes/exchange');
var settingsRouter = require('./routes/settings');
var indicesRouter = require('./routes/indices');
var heatmapRouter = require('./routes/heatmap');
var resetPassRouter = require('./routes/reset-pass');
var updatePassRouter = require('./routes/update-pass')
var verifyUserRouter = require('./routes/verify-user');
var logoutRouter = require('./routes/logout');
var kycLevel1Router = require("./routes/kycLevel1");
var kycLevel2Router = require("./routes/kycLevel2");
var depositRouter = require("./routes/deposit");
var walletRouter = require("./routes/wallet");
var BinanceAPI = require("./routes/BinanceAPI");
var depthRouter = require('./routes/depth');

/*Update User KYC Data*/

var userKYCUpdateLevel1 = require("./async_funcs/updateUserKYCLevel1");
var userKYCUpdateLevel2 = require("./async_funcs/updateUserKYCLevel2");

/*Update User KYC Data*/

var menu = require("./middleware/menu");

var app = express();

const server = https.createServer({key: key, cert: cert }, app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var corsOptions = {
  origin: 'http://localhost:3000/',
  credentials:true,            //access-control-allow-credentials:true
  optionsSuccessStatus: 200,
  
}
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('tiny'));
app.use(cookieParser());
app.use('/assets', express.static('assets'));

app.disable('x-powered-by');
app.use(helmet.hidePoweredBy());

app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());

app.use(
  helmet.frameguard({
    action: "deny",
  })
 );

app.use(
  helmet.dnsPrefetchControl({
    allow: true,
  })
 );

app.use(helmet.contentSecurityPolicy({
    //useDefaults: true,
    directives:
    {
      'script-src-attr': null,
      defaultSrc: ["'self'","http: 'unsafe-inline'"],
      imgSrc:["'self'","data:","https://cdnjs.cloudflare.com","https://i.ibb.co"],
      scriptSrc: ["'self'","http: 'unsafe-inline'","https://s3.tradingview.com"],
      objectSrc: ["'none'"],
      childSrc: ["'self'","https://s.tradingview.com","https://www.google.com"],
      styleSrc:["'self'","http://fonts.googleapis.com","http: 'unsafe-inline'"],
      fontSrc:["'self'","https://fonts.gstatic.com","http: 'unsafe-inline'"],
      formAction: ["'self'"],
      baseUri:["'none'"],
      upgradeInsecureRequests: [],
      frameAncestors: ["'none'"]
    },
    reportOnly: false,
  }));

const requestTime = function (req, res, next) 
{
    var agents = 
    [
      "Microsoft IIS",
      "nginx",
      "Apache (Arch)",
      "Apache Tomcat",
      "Cloudflare",
      "Fastly",
      "CloudFront"
    ];

    const agent = agents[  
      Math.floor(Math.random() * agents.length)
    ]
    
    res.setHeader('Server',agent);
    next()
}

app.use(requestTime);

app.use('/',  indexRouter);
app.use('/login' , signinRouter);
app.use('/signup', signupRouter);
app.use('/reset-pass', resetPassRouter);
app.use('/update-pass', updatePassRouter);
app.use('/home', homeRouter);
app.use('/exchange', exchangeRouter);
app.use('/settings', settingsRouter);
app.use('/indices', indicesRouter);
app.use('/heatmap', heatmapRouter);
app.use('/verify', verifyUserRouter);
app.use('/logout', logoutRouter);
app.use('/kycLevel1', kycLevel1Router);
app.use('/kycLevel2', kycLevel2Router);
app.use('/deposit', depositRouter);
app.use('/wallet', walletRouter);
app.use('/price', BinanceAPI);
app.use('/depth', depthRouter)


//----------Mail Templates------------------


/* app.get('/kyc',async(req,res,next) =>
{
  res.status(200).render("email_templates/order")
}) */

//----------Mail Templates------------------

app.use((req, res, next) => {
  menu(req,res,next,"404","Not Found (404)");;
})

var UpdateUserKYCLevel1Data = async()=> 
    {
      await userKYCUpdateLevel1();
    };

var UpdateUserKYCLevel2Data = async()=> 
    {
      await userKYCUpdateLevel2();
    };
    
    setInterval(UpdateUserKYCLevel1Data,3600000);
    setInterval(UpdateUserKYCLevel2Data,3600000);

app.listen(process.env.PORT, () =>
{
  console.log(`App running on : http://localhost:${process.env.PORT}`)
});

/* server.listen(process.env.PORT, () => 
{ 
  console.log(`App running on : https://localhost:${process.env.PORT}`) 
}); */

module.exports = app;
