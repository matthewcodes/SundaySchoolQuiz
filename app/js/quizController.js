(function(){

  angular.module('quizControllers').controller('quizController', ['$timeout','$http','$interval','$location', function($timeout, $http, $interval, $location) {

    this.config = {};
    this.questions = []
    this.timeLeft = 60;
    this.timeLeftTimer;
    var controller = this;

    this.startTimer = function() {
      if ( angular.isDefined(this.timeLeftTimer) ) return;

      this.timeLeftTimer = $interval(function() {
        if(controller.timeLeft > 0) {
          controller.timeLeft--;
        }
      }, 1000);
    }

    this.resetTimer = function() {
      if (angular.isDefined(this.timeLeftTimer)) {
        $interval.cancel(this.timeLeftTimer);
        this.timeLeftTimer = undefined;
      }

      this.timeLeft = 60;
    }

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

    this.httpGet('/data/config.json', function(err, response) {
      if(!err) {
        controller.config = response.data;
      }
    })

    this.httpGet('/data/questions.json', function(err, response) {
      if(!err) {
        controller.questions = response.data;
      }
    })

    this.startTimer()

  }]);

})();
