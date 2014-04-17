(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($rootScope, $scope, $http, ezfb, $q, UserService) {
    var api = {};

    //    updateMe();
    //
    //    ezfb.Event.subscribe('auth.statusChange', function (statusRes) {
    //      $scope.loginStatus = statusRes;
    //
    //      updateMe();
    //      initData();
    //    });

    //    $scope.login = function () {
    //      ezfb.login(null, {
    //        scope: 'email,user_likes,user_friends'
    //      });
    //    };

    $scope.me = {};
    $scope.fb = $scope.me.facebook;

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

    function updateMe() {
      ezfb.getLoginStatus()
        .then(function (res) {
          $scope.loginStatus = res;
          return ezfb.api('/me');
        })
        .then(function (me) {
          $scope.me = me;
        });
    }

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
