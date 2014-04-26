var auth = require('../auth');
var twit = auth.twit;

exports.mentions = function (req, res) {
  twit.get('/statuses/mentions_timeline', function(err, reply){
    res.send(reply);
  });
};

exports.homeTweets = function(req, res){
  twit.get('/statuses/home_timeline', function(err, reply){
    res.send(reply);
  });
};

exports.userTweets = function(req, res){
  twit.get('/statuses/user_timeline', function(err, reply){
    res.send(reply);
  });
};
