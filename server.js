/**
 * Module dependencies
 */
var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var Twit = require('twit');
var auth = require('./auth');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/app/*', function (req, res) {
  res.sendfile('app/' + req.originalUrl.substr(5));
});


app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

app.get('/auth/facebook', auth.fb);
//var T = new Twit({
//  consumer_key: 'nzZi1TdQ6nQcwnB0BjuuYw',
//  consumer_secret: '9x05JVxIHpo26cmxns837fcqgFPn5ooL2eWiKusCk',
//  access_token: '433326184-bxsa9CK51AtwrfISfubgfuqOFDHU8mImVeDJKrGD',
//  access_token_secret: 'VGfHZxMsLVAJ8LJhEW1c9H0e74cvrSHpt2Wu3NZJb26md'
//});
//
//T.get('/statuses/user_timeline', {
//  screen_name: "EroJunko"
//}, function (err, reply) {
//  console.log(err);
//  console.log(reply);
//});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
