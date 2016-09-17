(function(){

  angular.module('buzzerControllers').controller('buzzerController', ['$timeout','$http','$interval','$location', function($timeout, $http, $interval, $location) {

    this.socket = io.connect();
    this.disableBuzzer = false;
    this.bigRedButtonSrc = '/buzzer/img/bigredbutton.jpg'
    var controller = this;

    this.buzzerPressed = function() {
      this.bigRedButtonSrc = '/buzzer/img/bigredbutton_pressed.jpg'
      this.disableBuzzer = true;
      this.socket.emit('buzzer_pressed', true)

      $timeout(function(){
        controller.bigRedButtonSrc = '/buzzer/img/bigredbutton.jpg'
      }, 100);

    }

    this.socket.on('next_question', function (data) {
      $timeout(function() {
        controller.disableBuzzer = false;
        controller.bigRedButtonSrc = '/buzzer/img/bigredbutton.jpg'
      })
    });

    this.socket.on('times_up', function (data) {
      $timeout(function() {
        controller.disableBuzzer = true;
        controller.bigRedButtonSrc = '/buzzer/img/bigredbutton.jpg'
      })
    });

    this.socket.on('next_question', function (data) {
      $timeout(function() {
        controller.disableBuzzer = false;
        controller.bigRedButtonSrc = '/buzzer/img/bigredbutton.jpg'
      })
    });

  }]);

})();
