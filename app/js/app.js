(function () {
  'use strict';

  // Declare app level module which depends on filters, and services

  angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap.tabs',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
  ])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'template/login.html',
          controller: 'MainCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      //      $locationProvider.html5Mode(true);
    });

}());
