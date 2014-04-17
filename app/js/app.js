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
      OAuth.initialize('S6i3fJXQNTUm7A6opZsJPA_1mto', {cache: true});
      $routeProvider.
      when('/', {
        templateUrl: 'template/login.html',
        controller: 'MainCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
    });
}());
