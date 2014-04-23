var auth = require('../auth');
var fb = auth.graph;

exports.me = function (req, res) {
  fb.get("me", function (err, reply) {
//    console.log(reply);
    res.send(reply);
  });
};

exports.friends = function (req, res) {
  fb.get("me/friends?fields=name,birthday,education,languages,location,gender", function (err, reply) {
//    console.log(reply);
    res.send(reply);
  });
};

exports.statuses = function (req, res) {
  fb.get("me/statuses", function (err, reply) {
//    console.log(reply);
    res.send(reply);
  });
};

exports.posts = function (req, res) {
  fb.get("me/posts", function (err, reply) {
//    console.log(reply);
    res.send(reply);
  });
};