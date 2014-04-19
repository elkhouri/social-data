var auth = require('../auth');
var twit = auth.twit;

exports.mentions = function (req, res) {
//  var name = req.params.name;

  twit.get('/statuses/mentions_timeline', {screen_name: "ERO"}, function(err, reply){
    res.send(reply);
  });
};

exports.homeTweets = function(req, res){
  var name = req.params.name;
  
  twit.get('/statuses/home_timeline', {screen_name: name}, function(err, reply){
    res.send(reply);
  });
};

exports.userTweets = function(req, res){
  var name = req.params.name;
  
  twit.get('/statuses/user_timeline', {screen_name: name}, function(err, reply){
    res.send(reply);
  });
};