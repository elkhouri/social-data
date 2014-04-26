/* jshint multistr:true */

var dotenv = require('dotenv');
var graph = require('fbgraph');
var twit = require('twit');
var twitterAPI = require('node-twitter-api');
dotenv.load();

var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
var client_id = process.env.client_id;
var client_secret = process.env.client_secret;
var host = process.env.host;

var conf = {
  client_id: client_id,
  client_secret: client_secret,
  scope: 'email, user_about_me, user_birthday, user_location, read_stream, \
  user_location, friends_location, friends_birthday, friends_education_history',
  redirect_uri: host + '/auth/facebook'
};

var twitter = new twitterAPI({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callback: host + '/auth/twitter'
});

var T = new twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token: '...',
  access_token_secret: '...'
});

exports.tw = function (req, res) {
  if (!req.query.oauth_verifier) {
    twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
      if (error) {
        console.log("Error getting OAuth request token : " + error);
      } else {
        req.session.requestToken = requestToken;
        req.session.requestTokenSecret = requestTokenSecret;

        res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken);
      }
    });

    return;
  }

  var requestToken = req.session.requestToken;
  var requestTokenSecret = req.session.requestTokenSecret;
  var oauth_verifier = req.query.oauth_verifier;

  twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function (error, accessToken, accessTokenSecret, results) {
    if (error) {
      console.log(error);
    } else {
      twitter.verifyCredentials(accessToken, accessTokenSecret, function (error, data, response) {
        if (error) {
          console.log(error);
        } else {
          req.session.accessToken = accessToken;
          req.session.accessTokenScret = accessTokenSecret;
          req.session.twitter = true;
          T.setAuth({
            access_token: accessToken,
            access_token_secret: accessTokenSecret
          });
          res.redirect('/');
        }
      });
    }
  });
};

exports.fb = function (req, res) {
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      "client_id": conf.client_id,
      "redirect_uri": conf.redirect_uri,
      "scope": conf.scope
    });

    if (!req.query.error) {
      res.redirect(authUrl);
    } else {
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
    req.session.facebook = true;
    res.redirect('/');
  });
};

exports.twit = T;

exports.graph = graph;

exports.loggedIn = function (req, res) {
  res.send(req.session);
};
