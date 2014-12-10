'use strict';

/**
 * @ngdoc function
 * @name cityrouteApp.controller:AdminEdititemCtrl
 * @description
 * # AdminEdititemCtrl
 * Controller of the cityrouteApp
 */
angular.module('cityrouteApp')
  .controller('AdminEdititemCtrl', function ($scope, Items, $routeParams, Map, $location) {

    //Parent
    if ($routeParams.parentId) {
      Items.get({id: $routeParams.parentId}).success(function (parent) {
        $scope.Parent = parent;
      });
    }

    // Item
    Items.get({parentId:$routeParams.parentId, id:$routeParams.id}).success(function(data){
      $scope.Item = data;
      if (data.Latitude && data.Longitude) {
        $scope.LatLong = data.Latitude + "," + data.Longitude;
      }
    });

    $scope.save=function(){
      if($scope.LatLong) {
        var latlong = $scope.LatLong.split(',');
        $scope.Item.Latitude = latlong[0];
        $scope.Item.Longitude = latlong[1];
      }
      var params = {
        id: $routeParams.id
      };
      Items.save(params, $scope.Item);
      var url = "/admin/Parent/" + $routeParams.id;
      if($scope.Parent) {
        var url = "/admin/Parent/" + $scope.Parent.ParentId + "/ItemDetails/" + $scope.Parent._id
      }
      $location.path(url);
    }

    $scope.showMap = function(){
      var pattern = '^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$';
      //if (pattern.test($scope.LatLong)) {
      var latlong = $scope.LatLong.split(',');
      if (Map.supportGeo()) {
        Map.showMap("#map", latlong[0], latlong[1]);
        Map.addClickEventToMap(addCoords);
      }
    };

    function addCoords(latitude, longitude) {
      if ($scope.LatLong) {
        $scope.LatLong = latitude + "," + longitude;
      }
    }


  });
