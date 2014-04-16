(function () {
  'use strict';

  app = angular.module('myApp.controllers', []);
  
  app.controller('AppCtrl', function ($scope, $http) {
    function updateLoginStatus(more) {
      ezfb.getLoginStatus(function (res) {
        $scope.loginStatus = res;

        (more || angular.noop)();
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