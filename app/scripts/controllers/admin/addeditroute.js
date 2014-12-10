'use strict';

/**
 * @ngdoc function
 * @name cityrouteApp.controller:AdminAddeditrouteCtrl
 * @description
 * # AdminAddeditrouteCtrl
 * Controller of the cityrouteApp
 */
angular.module('cityrouteApp')
  .controller('AdminAddeditrouteCtrl', function ($scope, Items, Map, $routeParams, $location) {

    //Parent
    Items.get({id:$routeParams.parentId}).success(function(parent){
      $scope.Parent = parent;
    });

    // Bus
    Items.get({parentId:$routeParams.parentId, id:$routeParams.id}).success(function(bus){
      $scope.Bus = bus;
      $scope.LatLong = $scope.Bus.Latitude + "," + $scope.Bus.Longitude;

      Map.showMap("#map", $scope.Bus.Latitude, $scope.Bus.Longitude);
      Map.addMarker($scope.Bus.Latitude, $scope.Bus.Longitude, "Punto de inicio");
      Map.addClickEventToMap(addCoords);


    });

    // coords
    function loadCoords() {
      Items.query({parentId: $routeParams.id}).success(function (coords) {
        $scope.Coords = coords;
        if (coords.length == 0 ){
          var latlong = $scope.LatLong.split(',');
          var coord = {
            Name: "stop 00000",
            ShortName: "stop",
            Latitude: latlong[0],
            Longitude: latlong[1],
            Color: $scope.Bus.Color,
            Description: "Stop 00000",
            ParentId: $scope.Bus._id
          };
          Items.save({}, coord);
          $scope.Coords.push(coord);
        }
        Map.addPolygonPointTo($scope.Coords);
      });
    }

    function addCoords(latitude, longitude) {

      if ($scope.setStart) {
        Map.setDrawType("marker").then(function () {
          Map.clearMarkers();
          Map.addMarker(latitude, longitude);
          $scope.Bus.Latitude = latitude;
          $scope.Bus.Longitude = longitude;
          $scope.LatLong = $scope.Bus.Latitude + "," + $scope.Bus.Longitude;
          loadCoords();
        });
        return
      }
      Map.setDrawType("route").then(function () {
        var n = 1;
        if ($scope.Coords) {
          n = $scope.Coords.length + 1;
          n = '0000' + n
          n = n.substr(n.length - 5);

          var coords = {
            Name: "stop " + n,
            ShortName: "stop",
            Latitude: latitude,
            Longitude: longitude,
            Color: $scope.Bus.Color,
            Description: "Stop " + n,
            ParentId: $scope.Bus._id
          };
          Items.save({}, coords).then(function () {
              loadCoords()
            }
          );
        }
      });
    }

    loadCoords();


    $scope.save=function(){
      var latlong = $scope.LatLong.split(',');
      $scope.Bus.Latitude = latlong[0];
      $scope.Bus.Longitude = latlong[1];
      var params = {parentId:$routeParams.parentId, id:$routeParams.id}
      Items.save( params, $scope.Bus);
      var url="/admin/Parent/" + $scope.Parent.ParentId + "/ItemDetails/" + $scope.Parent._id
      $location.path(url);
    }

    $scope.deleteCoord = function() {
      var coord = $scope.Coords[$scope.Coords.length - 1 ];
      Items.remove({id: coord._id}).then(function () {
        Map.popMarker();
        loadCoords();
      });
    }

  });
