'use strict';

/**
 * @ngdoc service
 * @name cityrouteApp.Map
 * @description
 * # Map
 * Factory in the cityrouteApp.
 */
angular.module('cityrouteApp')
  .factory('Map', function ($q) {
    var mapAreaId = "#map";
    var txtCoords;// "#latlong";
    var mapCanvas = document.querySelector(mapAreaId);
    var map;
    var markers = new Array();
    var mapClickCallBack;
    var polylineCoords = new Array();
    var routePath;
    var drawType ={
      type:"route"  // point, both
    };

    function supportGeo() {
      return 'geolocation' in navigator;
    }
    function showPosition(position){
      //var datetime = new Date(position.timestamp).toLocaleString();
      var msg = position.coords.latitude +", " + position.coords.longitude;
      return showMap(position.coords.latitude,  position.coords.longitude);
    }

    function showMap(latitude, longitude){

      var coords = new google.maps.LatLng(latitude, longitude);

      var options = {
        zoom:13,
        center: coords,
        mapTypeControl:false,
        navigationControlOptions:{
          style:google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(mapCanvas,options);
      /*
       var marker = new google.maps.Marker({
       position:coords,
       map:map,
       title:"Marker "
       });
       markers.push({marker:marker, latitude: latitude, longitude:longitude});
       */
      google.maps.event.addListener(map, 'click', function(event) {
        if (mapClickCallBack) {
          mapClickCallBack(event.latLng.k, event.latLng.B);
        }

        switch (drawType.type)
        {
          case "route":
            addPolygonPointTo(event.latLng);
                break;
          case "both" :
            addPolygonPointTo(event.latLng);
            addMarker(event.latLng);
            break;
          case "point":
          default:{
            addMarker(event.latLng);
          }
        }

      });
    }

    function addMarker(location, title) {
      var options = {
        position: location,
        map: map
      }
      if (title) {
        options.title = title;
      }
      var marker = new google.maps.Marker(options);

      markers.push({marker: marker, latitude: location.k, longitude: location.B});

    }

    function addPolygonPointTo(location){
      if (location) {
        polylineCoords.push(location);
      }
      if(routePath) {
        routePath.setMap(null);
      }

      routePath = new google.maps.Polyline({
        path: polylineCoords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      routePath.setMap(map);
    }

    // Sets the map on all markers in the array.
    function setAllMap(map) {
      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        marker.marker.setMap(map);
      }
    }

// Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setAllMap(null);
    }

    function errorMessage(error){
      switch(error.code){
        case error.PERMISSION_DENIED:
          return "Permiso denedago";
          break;
        case error.POSITION_UNAVAILABLE:
          return "Posición no disponible";
          break;
        case error.TIMEOUT:
          return "Tiempo agodato";
          break;
        case error.UNKNOWN_ERROR:
          return "Error desconocido";
          break;
      }
    }

    return{
      supportGeo: function(){
        return supportGeo();
      },
      getLocation: function(){
        if(supportGeo()){
          navigator.geolocation.getCurrentPosition(showPosition,errorMessage);
        }
      },
      showMap: function(areaId, latitude, longitude){
        mapAreaId = areaId;
        mapCanvas = document.querySelector(mapAreaId);
        if(latitude && longitude) {
          showMap(latitude, longitude);

          var tmpCallBack = mapClickCallBack;
          mapClickCallBack = undefined;
          var location = new google.maps.LatLng(latitude, longitude);
          addMarker(location);
          mapClickCallBack = tmpCallBack;

        }
        else{
          if(supportGeo()){
            navigator.geolocation.getCurrentPosition(showPosition,errorMessage);

            var tmpCallBack = mapClickCallBack;
            mapClickCallBack = undefined;
            var location = new google.maps.LatLng(latitude, longitude);
            addMarker(location);
            mapClickCallBack = tmpCallBack;
          }
        }
      },
      setDrawType:function(type){
        var deferred = $q.defer();
        if (type == "point" || type == "route" || type == "both"){
          drawType.type = type;
          deferred.resolve({success: true});
        }
        else{
          deferred.reject({success: false});
        }
        return deferred.promise;
      },
      addMarker:function(latitude,longitude,title){
        var tmpCallBack = mapClickCallBack;
        mapClickCallBack = undefined;
        var location = new google.maps.LatLng(latitude, longitude);
        addMarker(location, title);
        mapClickCallBack = tmpCallBack;
      },
      addClickEventToMap:function(callback){
        if (callback){
          mapClickCallBack=callback;
        }
      }
      ,clearMarkers:function(){
        clearMarkers();
      }
      ,popMarker:function(){
        var marker = markers.pop();
        marker.marker.setMap(null);
      }
      ,addPolygonPointTo:function(coordsArray){
        if (coordsArray) {
          polylineCoords = new Array();
          for (var i = 0; i < coordsArray.length; i++) {
            var coord = coordsArray[i];
            var location = new google.maps.LatLng(coord.Latitude, coord.Longitude);
            polylineCoords.push(location);
          }
          addPolygonPointTo();
        }
      }
    };
  });
