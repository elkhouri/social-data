/**
 * Module dependencies
 */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('port', process.env.PORT || 3000);

app.get('/app/*', function (req, res) {
  res.sendfile('app/' + req.originalUrl.substr(5));
});

app.use(cookieParser());
app.use(session({secret:'VkJAYDl3gNDaKp73H7pC'}));
app.use(express.static(path.join(__dirname, 'app')));

var auth = require('./auth');
var fb = require('./routes/fb');
var tw = require('./routes/tw');

app.get('/auth/facebook', auth.fb);
app.get('/auth/twitter', auth.tw);
app.get('/auth', auth.loggedIn);

app.get('/fb/me', fb.me);
app.get('/fb/friends', fb.friends);
app.get('/fb/statuses', fb.statuses);
app.get('/fb/posts', fb.posts);

app.get('/tw/mentions/:name', tw.mentions);
app.get('/tw/homeTweets/:name', tw.homeTweets);
app.get('/tw/userTweets/:name', tw.userTweets);

app.post('/', function (req, res) {
  res.redirect('/');
});

auth.graph.get("/me/statuses", function (err, reply) {
  console.log(reply);
  //  res.send(reply);
});
auth.graph.get("/me/friends?fields=name,birthday,education,languages,location,gender", function (err, reply) {
  console.log(reply);
  //  res.send(reply);
});
auth.graph.get("/me", function (err, reply) {
  console.log(reply);
  //  res.send(reply);
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
