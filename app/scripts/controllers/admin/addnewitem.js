'use strict';

/**
 * @ngdoc function
 * @name cityrouteApp.controller:AdminAddnewitemCtrl
 * @description
 * # AdminAddnewitemCtrl
 * Controller of the cityrouteApp
 */
angular.module('cityrouteApp')
  .controller('AdminAddnewitemCtrl', function ($scope, $location, Items, Map, $routeParams) {
    //Parent
    if($routeParams.parentId) {
      Items.get({id: $routeParams.parentId}).success(function (parent) {
        $scope.Parent = parent;
      });
    }

    // Item
    $scope.Item = {
      Name:'',
      ShortName: '',
      Description: '',
      Color: ''
    }

    if($routeParams.parentId){
      $scope.Item.ParentId = $routeParams.parentId;
    }

    $scope.save=function() {

      if ($scope.LatLong && $scope.LatLong != "") {
        var latlong = $scope.LatLong.split(',');
        $scope.Item.Latitude = latlong[0];
        $scope.Item.Longitude = latlong[1];
      }
      var params = {}
      Items.save(params, $scope.Item);

      var url;
      if ($scope.Parent) {
        url = "/admin/Parent/" + $scope.Parent.ParentId + "/ItemDetails/" + $scope.Parent._id;
      }
      else {
        url = "/admin/ItemDetails";
      }
      $location.path(url);

    }

    $scope.showMap = function() {
      if(latlong) {
        var latlong = $scope.LatLong.split(',');
        if (Map.supportGeo()) {
          Map.showMap("#map", latlong[0], latlong[1]);
        }
      }
      else{
        Map.showMap("#map");
      }
    }


  });
