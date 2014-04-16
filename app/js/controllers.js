(function () {
  'use strict';

  var app = angular.module('myApp.controllers', []);

  app.controller('MainCtrl', function ($scope, $http, ezfb) {

    updateMe();

    updateLoginStatus()
      .then(updateApiCall);

    ezfb.Event.subscribe('auth.statusChange', function (statusRes) {
      $scope.loginStatus = statusRes;

      updateMe();
      updateApiCall();
    });

    $scope.login = function () {
      ezfb.login(null, {
        scope: 'email,user_likes'
      });
    };

    $scope.logout = function () {
      ezfb.logout();
    };

    $scope.share = function () {
      ezfb.ui({
        method: 'feed',
        name: 'angular-easyfb API demo',
        picture: 'http://plnkr.co/img/plunker.png',
        link: 'http://plnkr.co/edit/qclqht?p=preview',
        description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' +
          ' Facebook integration in AngularJS made easy!' +
          ' Please try it and feel free to give feedbacks.'
      })
        .then(function (res) {
          console.log(res);
        });
    };

    var autoToJSON = ['loginStatus', 'apiRes'];
    angular.forEach(autoToJSON, function (varName) {
      $scope.$watch(varName, function (val) {
        $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
      }, true);
    });

    function updateMe() {
      ezfb.getLoginStatus()
        .then(function () {
          return ezfb.api('/me');
        })
        .then(function (me) {
          $scope.me = me;
        });
    }

    function updateLoginStatus() {
      return ezfb.getLoginStatus()
        .then(function (res) {
          $scope.loginStatus = res;
        });
    }

    function updateApiCall() {
      return $q.all([
        ezfb.api('/me'),
        ezfb.api('/me/likes')
      ])
        .then(function (resList) {
          $scope.apiRes = resList;
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