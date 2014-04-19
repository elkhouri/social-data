/**
 * Module dependencies
 */
var express = require('express');
var http = require('http');
var dotenv = require('dotenv');
var path = require('path');
var passport = require('passport');

var auth = require('./auth');

var app = express();
var fb = require('./routes/fb');
var tw = require('./routes/tw');

var client_id = process.env.client_id;
var client_secret = process.env.client_secret;

app.set('port', process.env.PORT || 3000);

app.get('/app/*', function (req, res) {
  res.sendfile('app/' + req.originalUrl.substr(5));
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

app.get('/auth/facebook', auth.fb);

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