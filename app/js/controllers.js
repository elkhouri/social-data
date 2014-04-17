(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($scope, UserService) {
    var me = UserService.me();
    $scope.fb = {};

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
        initTW();
    }

    function initFB() {
      me.facebook.get("/me").done(function (res) {
        console.log(res);
        $scope.$apply(function () {
          $scope.fb = res;
        });
      });
    }

    function initTW() {
     me.twitter.get("/1.1/statuses/user_timeline.json?count=1").done(function (res) {
       console.log(res);
      });
    }

  });

}());
