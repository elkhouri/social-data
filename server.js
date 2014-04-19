/**
 * Module dependencies
 */
var express = require('express');
var http = require('http');
var dotenv = require('dotenv');
var path = require('path');
var passport = require('passport');

var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var auth = require('./auth');

var app = express();
var fb = require('./routes/fb');
var tw = require('./routes/tw');

dotenv.load();

var client_id = process.env.client_id;
var client_secret = process.env.client_secret;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('port', process.env.PORT || 3000);

app.get('/app/*', function (req, res) {
  res.sendfile('app/' + req.originalUrl.substr(5));
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

passport.use(new FacebookStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "https://social-data.herokuapp.com",
//  callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: false,
  display: 'touch'
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
    //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

//app.get('/auth/facebook', auth.fb);
app.get('/auth/facebook',
  passport.authenticate('facebook', { display: 'touch' }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    display: 'touch'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("SSS");
    res.redirect('/');
  });

app.get('/fb/me', fb.me);
app.get('/fb/friends', fb.friends);
app.get('/fb/statuses', fb.statuses);

app.get('/tw/mentions', tw.mentions);
app.get('/tw/homeTweets', tw.homeTweets);
app.get('/tw/userTweets', tw.userTweets);

app.post('/', function (req, res) {
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});