(function(){

  angular.module('quizControllers').controller('quizController', ['$timeout','$http','$interval','$location', function($timeout, $http, $interval, $location) {

    this.config = {};
    this.question = {};
    this.timeLeft = this.config.timeUpIntervalInSeconds;
    this.timeLeftTimer;
    this.socket = io.connect();
    this.currentTeam;
    this.quizStarted = false;
    this.timesUp = false;
    this.answeredQuestion = false;
    this.buzzerPressed = false;
    var controller = this;

    this.socket.on('starting_team', function (teamIndex) {
      $timeout(function() {
        controller.currentTeam = teamIndex;
      })
    });

    this.socket.on('switch_team', function (teamIndex) {
      $timeout(function() {
        controller.currentTeam = teamIndex;
      })
    });

    this.socket.on('start_quiz', function (data) {
      controller.answeredQuestion = false;
      controller.getCurrentQuestion(function(err, question) {
        controller.startTimer()
      })

      $timeout(function(){
        controller.quizStarted = true;
        controller.timesUp = false;
      })

    });

    this.socket.on('next_question', function (data) {
      controller.answeredQuestion = false
      controller.getCurrentQuestion(function(err, question) {
        controller.startTimer()
      })

      $timeout(function(){
        controller.quizStarted = true;
        controller.timesUp = false;
      })

    });

    this.socket.on('correct_answer', function (data) {
      controller.answeredQuestion = true
      var score = controller.config.teams[controller.currentTeam].score + controller.timeLeft;
      $timeout(function(){
        controller.config.teams[controller.currentTeam].score = score
        controller.resetTimer();
      })
      controller.socket.emit('score_update', {
        'team':controller.currentTeam,
        'score':score
      })
    });

    this.socket.on('incorrect_answer', function (data) {
      controller.answeredQuestion = true
      var score = controller.config.teams[controller.currentTeam].score - 5;
      $timeout(function(){
        controller.config.teams[controller.currentTeam].score = score
        controller.resetTimer();
      })
      controller.socket.emit('score_update', {
        'team':controller.currentTeam,
        'score':score
      })
    })


    this.socket.on('buzzer_pressed', function (data) {
      controller.buzzerPressed = true;
      if (angular.isDefined(controller.timeLeftTimer)) {
        $interval.cancel(controller.timeLeftTimer);
        controller.timeLeftTimer = undefined;
      }
    });

    this.noTimeLeft = function() {
      this.timesUp = true;
      this.resetTimer();
      this.socket.emit('times_up', 'timeup')
    }

    this.startTimer = function() {
      if ( angular.isDefined(this.timeLeftTimer) ) return;

      this.timeLeftTimer = $interval(function() {
        if(controller.timeLeft > 0) {
          controller.timeLeft--;
        } else {
          controller.noTimeLeft();
        }
      }, 1000);
    }

    this.resetTimer = function() {
      if (angular.isDefined(this.timeLeftTimer)) {
        $interval.cancel(this.timeLeftTimer);
        this.timeLeftTimer = undefined;
      }

      this.timeLeft = this.config.timeUpIntervalInSeconds;
    }

    this.getCurrentQuestion = function(callback) {
      this.httpGet('/data/question/current', function(err, response) {
        if(!err) {
          $timeout(function() {
            controller.question = response.data;
          })
          if(callback) {
            callback(undefined, response.data)
          }
        }
      })
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

    this.httpGet('/data/config', function(err, response) {
      if(!err) {
        controller.config = response.data;
        controller.timeLeft = controller.config.timeUpIntervalInSeconds;
      }
    })

    this.httpGet('/state', function(err, response) {
      if(!err) {
        controller.quizStarted = response.data.quizStarted;
        controller.timesUp = response.data.timesUp;
        controller.buzzerPressed = response.data.buzzerPressed;
        controller.currentTeam = response.data.currentTeam;
        controller.getCurrentQuestion()

        if(controller.quizStarted && ! controller.timesUp && !controller.buzzerPressed) {
          controller.startTimer()
        }

      }
    })

  }]);

})();
