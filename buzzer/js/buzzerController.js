(function(){

  angular.module('buzzerControllers').controller('buzzerController', ['$timeout','$http','$interval','$location', function($timeout, $http, $interval, $location) {

    this.socket = io.connect();
    this.disableBuzzer = false;
    var controller = this;

    this.buzzerPressed = function() {
      this.socket.emit('buzzer_pressed', true)
    }

    this.socket.on('times_up', function (data) {
      $timeout(function() {
        controller.disableBuzzer = true;
      })
    });

    this.socket.on('next_question', function (data) {
      $timeout(function() {
        controller.disableBuzzer = false;
      })
    });

  }]);

})();
