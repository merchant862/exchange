var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var cors = require('cors')

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
var kycRouter = require("./routes/kyc");
var depositRouter = require("./routes/deposit");
var walletRouter = require("./routes/wallet");

var menu = require("./middleware/menu");

const { NONE } = require('sequelize');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var corsOptions = {
  origin: 'http://localhost:3000/',
  optionsSuccessStatus: 200
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
      imgSrc:["'self'","data:","https://cdnjs.cloudflare.com"],
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
app.use('/kyc', kycRouter);
app.use('/deposit', depositRouter);
app.use('/wallet', walletRouter);

app.use((req, res, next) => {
  menu(req,res,next,"404","Not Found (404)");;
})

app.listen(process.env.PORT, () =>
{
  console.log(`App running on : http://localhost:${process.env.PORT}`)
});

module.exports = app;
