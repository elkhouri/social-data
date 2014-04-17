(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($scope, UserService, $cookies) {
    var api = UserService.api();
    if(api.facebook)
      initData('facebook');
    if(api.twitter)
      initData('twitter');

    $scope.me = {};
    $scope.fb = {};
//    console.log(api);

    $scope.signin = function (provider) {
      UserService.signin(provider).then(function (res) {
        $scope.me = UserService.me();
        api[provider] = res;
//        console.log(res);

        initData(provider);
      });
    };

    $scope.logout = function () {
//      ezfb.logout();
    };

    $scope.loggedIn = function (provider) {
      return api[provider];
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
