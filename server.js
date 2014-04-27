var express = require('express');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(session({
  secret: 'VkJAYDl3gNDaKp73H7pC'
}));

var auth = require('./auth');
var fb = require('./routes/fb');
var tw = require('./routes/tw');

app.use(function (req, res, next) {
  var fb = req.session.facebook || false;
  var tw = req.session.twitter || false;

  res.cookie('facebook', fb, {
    maxAge: 900000,
    httpOnly: false
  });
  res.cookie('twitter', tw, {
    maxAge: 900000,
    httpOnly: false
  });
  next();
});

app.use(express.static(path.join(__dirname, 'app')));

app.get('/auth/facebook', auth.fb);
app.get('/auth/twitter', auth.tw);
app.get('/auth', auth.loggedIn);

app.get('/fb/me', fb.me);
app.get('/fb/friends', fb.friends);
app.get('/fb/statuses', fb.statuses);
app.get('/fb/posts', fb.posts);

app.get('/tw/mentions', tw.mentions);
app.get('/tw/homeTweets', tw.homeTweets);
app.get('/tw/userTweets', tw.userTweets);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
