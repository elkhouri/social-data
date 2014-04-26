var dotenv = require('dotenv');
var graph = require('fbgraph');
var twit = require('twit');

dotenv.load();

var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
var access_token = process.env.access_token;
var access_token_secret = process.env.access_token_secret;
var client_id = process.env.client_id;
var client_secret = process.env.client_secret;
var host = process.env.host;

var conf = {
  client_id: client_id,
  client_secret: client_secret,
  scope: 'email, user_about_me, user_birthday, user_location, read_stream',
  redirect_uri: host+'/auth/facebook'
};

exports.fb = function (req, res) {
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      "client_id": conf.client_id,
      "redirect_uri": conf.redirect_uri,
      "scope": conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else { //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  graph.authorize({
    "client_id": conf.client_id,
    "redirect_uri": conf.redirect_uri,
    "client_secret": conf.client_secret,
    "code": req.query.code
  }, function (err, facebookRes) {
    console.log(facebookRes);
    res.redirect('/');
  });
};


exports.twit = new twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token: access_token,
  access_token_secret: access_token_secret
});

exports.graph = graph;
