(function () {
  'use strict';

  // Declare app level module which depends on filters, and services

  angular.module('myApp', [
  'ngRoute',
  'ezfb',
  'ui.bootstrap.tabs',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
  ])
    .config(function ($routeProvider, $locationProvider) {
      OAuth.initialize('S6i3fJXQNTUm7A6opZsJPA_1mto');
      $routeProvider.
      when('/', {
        templateUrl: 'template/login.html',
        controller: 'MainCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
    })
    .config(function (ezfbProvider) {
      ezfbProvider.setInitParams({
        appId: '277415149092039'
      });
    });
}());
