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

    $scope.twitterLogin = function () {
      OAuth.initialize('S6i3fJXQNTUm7A6opZsJPA_1mto');
      OAuth.popup('twitter', function (error, result) {
        //handle error with error
        //use result.access_token in your API request
        alert("popup");
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
        $scope.numFriends = res.data.length;
        res.data.forEach(function (f) {

        });
      });
    }

  });

}());
