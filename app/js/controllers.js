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

    function initFB() {
      $.when(me.facebook.get("/me"),
        me.facebook.get('/me/friends'))
        .done(function (me, friends) {
          $scope.$apply(function () {
            $scope.fb = me[0];
            $scope.numFriends = friends[0].data.length;
          });
        });
    }

    function initTW(numTweets) {
      $.when(me.twitter.get("/1.1/statuses/user_timeline.json?count=" + numTweets),
        me.twitter.get("/1.1/statuses/home_timeline.json?count=" + numTweets),
        me.twitter.get("/1.1/statuses/mentions_timeline.json?count=" + numTweets))
        .done(function (tweets, homeTweets, mentions) {
          $scope.$apply(function () {
            $scope.tweets = tweets[0];
            $scope.homeTweets = homeTweets[0];
            $scope.mentions = mentions[0];
            $scope.actualNum = numTweets;
            delete $scope.error.text;
          });
        })
        .fail(function (error) {
          $scope.$apply(function () {
            $scope.error.text = error.statusText;
          });
        });
    }
    $scope.getTweets = initTW;

  });

}());
