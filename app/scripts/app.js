'use strict';

/**
 * @ngdoc overview
 * @name cityrouteApp
 * @description
 * # cityrouteApp
 *
 * Main module of the application.
 */
angular
  .module('cityrouteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin/itemdetails.html',
        controller: 'AdminItemdetailsCtrl'
      })
      .when('/admin/ItemDetails', {
        templateUrl: 'views/admin/itemdetails.html',
        controller: 'AdminItemdetailsCtrl'
      })
      .when('/admin/ItemDetails/:id',{
        templateUrl: 'views/admin/itemdetails.html',
        controller: 'AdminItemdetailsCtrl'
      })
      .when('/admin/Parent/:parentId/ItemDetails/:id', {
        templateUrl: 'views/admin/itemdetails.html',
        controller: 'AdminItemdetailsCtrl'
      })
      .when('/admin/addNewItem', {
        templateUrl: 'views/admin/addnewitem.html',
        controller: 'AdminAddnewitemCtrl'
      })
      .when('/admin/Parent/:parentId/addNewItem', {
        templateUrl: 'views/admin/addnewitem.html',
        controller: 'AdminAddnewitemCtrl'
      })
      .when('/admin/editItem/:id', {
        templateUrl: 'views/admin/edititem.html',
        controller: 'AdminEdititemCtrl'
      })
      .when('/admin/Parent/:parentId/EditItem/:id', {
        templateUrl: 'views/admin/edititem.html',
        controller: 'AdminEdititemCtrl'
      })
      .when('/admin/addEditRoute/:id', {
        templateUrl: 'views/admin/addeditroute.html',
        controller: 'AdminAddeditrouteCtrl'
      })
      .when('/admin/Parent/:parentId/addEditRoute/:id', {
        templateUrl: 'views/admin/addeditroute.html',
        controller: 'AdminAddeditrouteCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
