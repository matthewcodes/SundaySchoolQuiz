(function(){

  angular.module('remoteControllers').controller('remoteController', ['$timeout','$http','$interval','$location', function($timeout, $http, $interval, $location) {

    this.state = "NOT_STARTED";
    this.config = {};
    this.question = {};
    this.currentTeam;
    this.socket = io.connect();
    var controller = this;

    this.startingTeam = function(teamIndex) {
      this.state = "STARTING_TEAM_SELECTED";
      this.currentTeam = teamIndex;
      this.socket.emit('starting_team', teamIndex);
    }

    this.startQuiz = function() {
      this.getCurrentQuestion()
      this.state = "STARTED"
      this.socket.emit('start_quiz', 'start')
    }

    this.nextQuestion = function() {
      controller.state = 'STARTED';
      this.httpGet('/data/question/next', function(err, response) {
        if(!err) {
          controller.question = response.data;

          if(controller.currentTeam == 0) {
            controller.currentTeam = 1
          } else {
            controller.currentTeam = 0
          }

          controller.socket.emit('switch_team', controller.currentTeam)
          controller.socket.emit('next_question', controller.question)
        }
      })
    }

    this.answeredCorrectly = function() {
      controller.socket.emit('correct_answer', controller.currentTeam)
    }

    this.answeredIncorrectly = function() {

    }

    this.socket.on('times_up', function (data) {
      $timeout(function() {
        controller.state = 'TIMES_UP';
      })
    });

    this.socket.on('buzzer_pressed', function (data) {
      $timeout(function() {
        controller.state = 'BUZZER_PRESSED';
      })
    });

    this.socket.on('score_update', function (data) {
      $timeout(function() {
        controller.state = 'READY_FOR_NEXT_QUESTION';
      })
    });

    this.getCurrentQuestion = function(callback) {
      this.httpGet('/data/question/current', function(err, response) {
        if(!err) {
          controller.question = response.data;
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

    this.initialiseData = function() {
      this.httpGet('/data/config', function(err, response) {
        if(!err) {
          controller.config = response.data;
        }
        
      })
      this.httpGet('/state', function(err, response) {
        if(!err) {

          if(response.data.currentTeam != undefined) {
            controller.currentTeam = response.data.currentTeam
          }

          if(!response.data.quizStarted && !response.data.timesUp && !response.data.buzzerPressed && response.data.currentTeam == undefined) {
            controller.state = "NOT_STARTED"
          } else if(!response.data.quizStarted && !response.data.timesUp && !response.data.buzzerPressed && response.data.currentTeam != undefined) {
            controller.state = "STARTING_TEAM_SELECTED";
          } else if(response.data.quizStarted && !response.data.timesUp && !response.data.buzzerPressed) {
            controller.state = "STARTED";
            controller.getCurrentQuestion()
          } else if(response.data.quizStarted && response.data.timesUp) {
            controller.state = "TIMES_UP";
            controller.getCurrentQuestion()
          } else if(response.data.quizStarted && response.data.buzzerPressed) {
            controller.state = "BUZZER_PRESSED";
            controller.getCurrentQuestion()
          }
        }
      })
    }

    this.initialiseData();

  }]);

})();
