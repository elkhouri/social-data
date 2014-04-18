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
    $scope.actualNum = $scope.numTweets;

    for (var provider in me) {
      if (me[provider])
        initData(provider);
    }

    $scope.signin = function (provider) {
      UserService.signin(provider).then(function (res) {
        initData(provider);
      });
    };

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
          if (f.location.name === me.location.nam)
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

    function initFB() {
      $.when(me.facebook.get("/me"),
        me.facebook.get("/me/friends?fields=name,birthday,education,languages,location,gender"))
        .done(function (me, friends) {
          $scope.$apply(function () {
            analyzeFriends(friends[0].data, me[0]);
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

  });

}());
