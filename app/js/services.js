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
    OAuth.callback('twitter', function (error, result) {
      console.log("SDF");
      if (!error) {
        me['twitter'] = result;

//        deferred.resolve(result);
      } else {
//        deferred.reject(error);
      }

    });
        OAuth.callback('facebook', function (error, result) {
      console.log("SDF");
      if (!error) {
        me['facebook'] = result;

//        deferred.resolve(result);
      } else {
//        deferred.reject(error);
      }

    });

    factory.signin = function (provider) {
      var deferred = $q.defer();
      OAuth.redirect(provider, "/");
      OAuth.callback(provider, function (error, result) {
        console.log("SDF");
        if (!error) {
          me[provider] = result;

          deferred.resolve(result);
        } else {
          deferred.reject(error);
        }

      });
      //      OAuth.popup(provider, function (error, result) {
      //        if (!error) {
      //          me[provider] = result;
      //
      //          deferred.resolve(result);
      //        } else {
      //          deferred.reject(error);
      //        }
      //
      //      });
      return deferred.promise;
    };
    factory.logout = function (provider) {
      OAuth.clearCache(provider);
      me[provider] = false;
    };
    return factory;
  });
}());