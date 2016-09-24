(function(){

  angular.module('buzzerControllers').controller('buzzerController', ['$timeout','$http','$interval','$location', function($timeout, $http, $interval, $location) {

    this.socket = io.connect();
    var controller = this;

    this.buzzerPressed = function() {
      this.socket.emit('buzzer_pressed', true)
    }

  }]);

})();
