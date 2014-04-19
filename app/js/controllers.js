(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($scope, $http, $q, UserService, $location, $cookies) {
    var me = UserService.me();
    $scope.fb = {};
    $scope.error = {};
    $scope.tweets = {};
    $scope.homeTweets = {};
    $scope.mentions = {};
    $scope.tweetUser = '';
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

    if ($cookies.facebook)
      initFB();
    if ($cookies.twitter) {
      $scope.tweetUser = $cookies.twitter;
      initTW(5);
    }

    $scope.signin = function (provider, user) {
      me[provider] = true;
      $cookies[provider] = true;
      if (provider === "twitter")
        $cookies[provider] = user;
      initData(provider);
    };

    $scope.logout = function (provider) {
      UserService.logout(provider);
    };

    $scope.loggedIn = function (provider) {
      return me[provider] || $cookies[provider];
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

    function analyzeStatuses(statuses) {
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
      var promises = [];
      promises.push($http.get("/fb/me").success(function (me) {}));
      promises.push($http.get("/fb/friends").success(function (friends) {}));
      promises.push($http.get("/fb/statuses").success(function (statuses) {}));
      $q.all(promises).then(function (resList) {
        var me = resList[0].data;
        var friends = resList[1].data.data;
        var statuses = resList[2].data.data;

        $scope.fb = me;
        analyzeFriends(friends, me);
        analyzeStatuses(statuses);

      });
    }

    function initTW(user) {
      $http.get('/tw/userTweets/' + $cookies.twitter).success(function (data) {
        $scope.tweets = data;
      });
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