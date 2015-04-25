//módulo angular para verificar a distância entre dois pontos, a partir da localização do dispositivo
var ngGeoCalc = angular.module('ngGeoCalc', [])

ngGeoCalc.run(function($rootScope){
  if(navigator.geolocation){
    $rootScope.myPosition = {}
    var success = function(pos){$rootScope.myPosition = {latitude: pos.coords.latitude, longitude: pos.coords.longitude}}
    var error = function(err){if(err.PERMISSION_DENIED == 1) alert('Não foi permitida a localização a partir deste dispositivo');}
    var options = {enableHighAccuracy: true}

    var watchId = navigator.geolocation.watchPosition(success, error,options);
  }
});

ngGeoCalc.controller("GeoController", ['$scope','$rootScope', function($scope, $rootScope){
  
  $scope.distancia = null;
  $scope.latitude = null;
  $scope.longitude = null;
  
  $scope.atualiza = function(){
    if(navigator.geolocation){
    	$scope.distancia = $scope.calcularDistancia($scope.latitude,$scope.longitude);
      return $scope.distancia;
    }else {
      alert("Desculpe, seu dispositivo não permite geolocalização!")
    }
  }
  
  $scope.calcularDistancia = function(lat,lon){
    
    if(lat == null || lon == null) return "";
    
    var R = 6371; // raio da terra
    var Lati = Math.PI/180*(lat-$rootScope.myPosition.latitude);  //Graus  - > Radianos
    var Long = Math.PI/180*(lon-$rootScope.myPosition.longitude); 
    var a = Math.sin(Lati/2) * Math.sin(Lati/2) + Math.cos($scope.deg2rad($rootScope.myPosition.latitude)) * Math.cos($scope.deg2rad(lat)) * Math.sin(Long/2) * Math.sin(Long/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // distância en km
    
    var result = d.toPrecision(3);
    
    if(result == 'NaN') return "";
    
    return result+" km";
  }
  
  $scope.deg2rad = function(angle) {
  	return angle * .017453292519943295;
  }
}]);
