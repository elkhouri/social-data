(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($scope, UserService) {
    var me = UserService.me();
    $scope.fb = {};
    $scope.error = {};
    $scope.tweets = {};
    $scope.homeTweets = {};
    $scope.mentions = {};
    $scope.numTweets = 5;
    $scope.sameBDay = 0;
    $scope.sameGender = 0;
    $scope.sameSchool = 0;
    $scope.sameLocation = 0;
    $scope.avgLen = 0;
    $scope.avgWordLen = 0;
    $scope.avgDelay = 0;
    $scope.avgPerDay = 0;
    $scope.actualNum = $scope.numTweets;

    for (var provider in me) {
      if (me[provider])
        initData(provider);
    }

    $scope.signin = function (provider) {
      OAuth.redirect(provider, "/");
//      UserService.signin(provider).then(function (res) {
//        initData(provider);
//      });
    };
//          OAuth.callback(provider, function (error, result) {
//        console.log("SDF");
//        if (!error) {
//          me[provider] = result;
//
//          deferred.resolve(result);
//        } else {
//          deferred.reject(error);
//        }
//
//      });

    $scope.logout = function (provider) {
      UserService.logout(provider);
    };

    $scope.loggedIn = function (provider) {
      return me[provider];
    };

    function initData(provider) {
      if (provider === "facebook")
        initFB();
      if (provider === "twitter")
        initTW($scope.numTweets);
    }

    function analyzeFriends(friends, me) {
      $scope.fb = me;
      $scope.numFriends = friends.length;
      friends.forEach(function (f, i) {
        if ("birthday" in f && "birthday" in me) {
          if (f.birthday.substring(0, 2) === me.birthday.substring(0, 2))
            $scope.sameBDay++;
        }
        if ("gender" in f && "gender" in me) {
          if (f.gender === me.gender)
            $scope.sameGender += 1;
        }
        if ("location" in f && "location" in me) {
          if (f.location.name === me.location.name)
            $scope.sameLocation += 1;
        }
        if ("education" in f && "education" in me) {
          f.education.every(function (e) {
            if (me.education.indexOf(e.name)) {
              $scope.sameSchool += 1;
              return false;
            }
          });
        }
      });
    }

    function analyzeStatuses(friends, statuses) {
      var time;
      statuses.forEach(function (s, i) {
        $scope.avgLen += s.message.length / statuses.length;
        $scope.avgWordLen += countWords(s.message) / statuses.length;
        if (time) {
          var newTime = new Date(s.updated_time);
          var diff = (time - newTime) / 1000 / 60 / 60;
          time = newTime;
          $scope.avgDelay = diff;
        }
        time = new Date(s.updated_time);
      });
      var firstTime = new Date(statuses[0].updated_time);
      var lastTime = new Date(statuses[statuses.length - 1].updated_time);
      $scope.avgPerDay = statuses.length / ((firstTime - lastTime) / 1000 / 60 / 60 / 24);
    }

    function initFB() {
      $.when(me.facebook.get("/me"),
        me.facebook.get("/me/friends?fields=name,birthday,education,languages,location,gender"),
        me.facebook.get("/me/statuses"))
        .done(function (me, friends, statuses) {
          $scope.$apply(function () {
            analyzeFriends(friends[0].data, me[0]);
            analyzeStatuses(friends[0].data, statuses[0].data);
          });
        });
    }



    function initTW(numTweets) {
      //      $.when(me.twitter.get("/1.1/statuses/user_timeline.json?count=" + numTweets),
      //        me.twitter.get("/1.1/statuses/home_timeline.json?count=" + numTweets),
      //        me.twitter.get("/1.1/statuses/mentions_timeline.json?count=" + numTweets))
      //        .done(function (tweets, homeTweets, mentions) {
      //          $scope.$apply(function () {
      //            $scope.tweets = tweets[0];
      //            $scope.homeTweets = homeTweets[0];
      //            $scope.mentions = mentions[0];
      //            $scope.actualNum = numTweets;
      //            delete $scope.error.text;
      //          });
      //        })
      //        .fail(function (error) {
      //          $scope.$apply(function () {
      //            $scope.error.text = error.statusText;
      //          });
      //        });
    }
    $scope.getTweets = initTW;

    function countWords(s) {
      s = s.replace(/(^\s*)|(\s*$)/gi, ""); //exclude  start and end white-space
      s = s.replace(/[ ]{2,}/gi, " "); //2 or more space to 1
      s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
      return s.split(' ').length;
    }

  });

}());