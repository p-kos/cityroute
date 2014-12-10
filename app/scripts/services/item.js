'use strict';

/**
 * @ngdoc service
 * @name cityrouteApp.Item
 * @description
 * # Item
 * Factory in the cityrouteApp.
 */
angular.module('cityrouteApp')
  .factory('Items', function ($http, $q) {
    var baseUrl = '/api/Parent';
    return{
      query:function(params){
        var url = baseUrl;
        if (params.parentId){
          url += '/' + params.parentId + '/Items';
        }
        return $http.get(url);

      },
      get:function(params){
        if(params.id){
          var url = baseUrl + '/' + params.id;
          return $http.get(url);
        }
      }
      ,save:function(params, data) {
        var deferred = $q.defer();
        var url;
        if (params.id) {
          url = baseUrl + '/' + params.id;
          $http.put(url, data)
            .success(function(){
              deferred.resolve({success:true});
            })
            .error(function(msg,code){
              deferred.reject(msg);
            });
        }
        else {
          url = baseUrl;
          $http.post(url, data)
            .success(function(){
              deferred.resolve({result:true})
            })
            .error(function(msg, code){
              deferred.reject(msg);
            });
        }
        return deferred.promise;
      },
      remove:function(params){
        var deferred = $q.defer();
        var url = baseUrl + '/' + params.id;
        $http.delete(url)
          .success(function(data) {
            deferred.resolve({success: true});
          })
          .error(function(msg,code){
            deferred.reject(msg);
          });
        return deferred.promise;
      },
      items:function(params){
        if (params.id){
          var url = baseUrl + '/' + params.id + '/Childs/';
          return $http.get(url);
        }
      }
    };
  });
