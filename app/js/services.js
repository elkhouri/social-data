(function () {
  'use strict';

  angular.module('myApp.services', ['ngCookies']).
  factory('UserService', function ($rootScope, $cookieStore, $q) {
    var factory = {};
    var me = {};
    factory.me = function () {
      return me;
    };

    factory.signin = function (provider) {
      var deferred = $q.defer();
      OAuth.popup(provider, function (error, result) {
        if (!error) {
          me[provider] = result;
          $cookieStore.put('user', result);
          $rootScope.user = result;

          deferred.resolve(result);
        } else {
          deferred.reject(error);
        }

      });
      return deferred.promise;
    };
    factory.logout = function () {
      $cookieStore.remove('user');
      delete $rootScope.user;
    };
    return factory;
  });
}());
