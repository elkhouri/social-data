(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($scope, $http, ezfb, $q) {

    updateMe();

    ezfb.Event.subscribe('auth.statusChange', function (statusRes) {
      $scope.loginStatus = statusRes;

      updateMe();
      initData();
    });

    $scope.login = function () {
      ezfb.login(null, {
        scope: 'email,user_likes,user_friends'
      });
    };

    $scope.logout = function () {
      ezfb.logout();
    };

    $scope.loggedIn = function () {
      return $scope.loginStatus && $scope.loginStatus.status == 'connected';
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

    function initData() {
      ezfb.api('/me/friends').then(function (res) {
        console.log(res);
      });
    }

  });

  app.controller('MyCtrl1', function ($scope) {
    // write Ctrl here

  });

  app.controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });

}());
