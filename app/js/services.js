(function () {
  'use strict';

  var app = angular.module('myApp.services', []);

  app.factory('UserService', function ($q) {
    var factory = {};
    var me = {
      facebook: OAuth.create('facebook'),
      twitter: OAuth.create('twitter')
    };

    factory.me = function () {
      return me;
    };

    factory.signin = function (provider) {
      var deferred = $q.defer();
      OAuth.popup(provider, function (error, result) {
        if (!error) {
          me[provider] = result;

          deferred.resolve(result);
        } else {
          deferred.reject(error);
        }

      });
      return deferred.promise;
    };
    factory.logout = function (provider) {
      OAuth.clearCache(provider);
      me[provider] = false;
    };
    return factory;
  });
}());
