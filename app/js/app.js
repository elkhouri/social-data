(function () {
  'use strict';

  // Declare app level module which depends on filters, and services

  angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'ui.bootstrap.tabs',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
  ])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/:auth?', {
          templateUrl: 'template/login.html',
          controller: 'MainCtrl'
        }).otherwise({
          redirectTo: '/'
        })
        .otherwise({
          redirectTo: '/'
        });

      //      $locationProvider.html5Mode(true);
    });

}());
