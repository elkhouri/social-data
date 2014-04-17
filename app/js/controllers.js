(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($scope, UserService) {
    var api = {};

    $scope.me = {};
    $scope.fb = {};

    $scope.signin = function (provider) {
      UserService.signin(provider).then(function (res) {
        $scope.me = UserService.me();
        api[provider] = res;

        initData(provider);
      });
    };

    $scope.logout = function () {
//      ezfb.logout();
    };

    $scope.loggedIn = function () {
      return Object.getOwnPropertyNames($scope.me).length !== 0;
    };

    function initData(provider) {
      if (provider === "facebook")
        initFB();
      if (provider === "twitter")
        initTW();
    }

    function initFB() {
      api.facebook.get("/me").done(function (res) {
        console.log(res);
        $scope.$apply(function () {
          $scope.fb = res;
        });
      });
    }

    function initTW() {
      api.twitter.get("/1.1/statuses/user_timeline.json").done(function (res) {
        console.log(res);
      });
    }

  });

}());
