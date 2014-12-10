'use strict';

/**
 * @ngdoc function
 * @name cityrouteApp.controller:AdminItemdetailsCtrl
 * @description
 * # AdminItemdetailsCtrl
 * Controller of the cityrouteApp
 */
angular.module('cityrouteApp')
  .controller('AdminItemdetailsCtrl', function ($scope, Items, $location, $routeParams) {
    $scope.ItemDetailsRoute = "#/admin/ItemDetails";

    //Parent
    if ($routeParams.parentId) {
      Items.get({id: $routeParams.parentId}).success(function (parent) {
        $scope.Parent = parent;
        $scope.ItemDetailsRoute = "#/admin/Parent/" + $scope.Parent.ParentId + "/ItemDetails/" + $scope.Parent._id;
      });
    }

    // Item
    if ($routeParams.id) {
      Items.get({id: $routeParams.id}).success(function (data) {
        $scope.Item = data;
        $scope.Item.detailUrl = "/Parent/" + $scope.Item._id;
      });
    }
    ;

    // subitems
    function loadSubItems() {
      var params = {}
      if ($routeParams.id) {
        params = {parentId: $routeParams.id};
      }
      Items.query(params).success(function (items) {
        $scope.Items = items;
        for (var i = 0; i< $scope.Items.length; i++) {
          var item = $scope.Items[i];
          var urlToEdit = "#/admin";
          if ($scope.Item) {
            urlToEdit += "/Parent/" + $scope.Item._id;
          }
          switch (item.ShortName) {
            case "bus":
              urlToEdit += "/addEditRoute/" + item._id;
              break;
            default:
              urlToEdit += "/EditItem/" + item._id;
          }
          $scope.Items[i].urlToEdit = urlToEdit;
        }
      });

    };
    loadSubItems();


    $scope.delete=function(index) {
      var item = $scope.Items[index];
      if (confirm("Are you sure to delete " + item.Name)) {
        var params = {
          id:item._id
        };
        Items.remove(params);

        loadSubItems();//$scope.Items.splice(index,1);
      }

    }
  });
