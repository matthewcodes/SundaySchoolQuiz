(function(){

  angular.module('remoteControllers').controller('remoteController', ['$timeout','$http','$interval','$location', function($timeout, $http, $interval, $location) {

    this.httpGet = function(url, callback) {
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {
        callback(undefined, response)
      }, function errorCallback(response) {
        callback(response)
      });
    }

  }]);

})();
