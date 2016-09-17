var express = require('express');
var app = express();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');
var quizStarted = false;
var timesUp = false;
var buzzerPressed = false;
var currentQuestion = 0;
var currentTeam;
var questions = JSON.parse(fs.readFileSync(path.join(__dirname,'data','questions.json')));
var config = JSON.parse(fs.readFileSync(path.join(__dirname,'data','config.json')));

app.use(express.static('app'));
app.set('port', (process.env.PORT || 3000));

app.use('/js', express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')));
app.use('/js/jquery.min.js', express.static(path.join(__dirname,'node_modules','jquery','dist','jquery.min.js')));
app.use('/js/angular.min.js', express.static(path.join(__dirname,'node_modules','angular','angular.min.js')));
app.use('/css', express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')));
app.use('/fonts', express.static(path.join(__dirname,'node_modules','bootstrap','dist','fonts')));

app.use('/remote', express.static('remote'))
app.use('/remote/js', express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')));
app.use('/remote/js/jquery.min.js', express.static(path.join(__dirname,'node_modules','jquery','dist','jquery.min.js')));
app.use('/remote/js/angular.min.js', express.static(path.join(__dirname,'node_modules','angular','angular.min.js')));
app.use('/remote/css', express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')));
app.use('/remote/fonts', express.static(path.join(__dirname,'node_modules','bootstrap','dist','fonts')));

app.use('/buzzer', express.static('buzzer'))
app.use('/buzzer/js', express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')));
app.use('/buzzer/js/jquery.min.js', express.static(path.join(__dirname,'node_modules','jquery','dist','jquery.min.js')));
app.use('/buzzer/js/angular.min.js', express.static(path.join(__dirname,'node_modules','angular','angular.min.js')));
app.use('/buzzer/css', express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')));
app.use('/buzzer/fonts', express.static(path.join(__dirname,'node_modules','bootstrap','dist','fonts')));

app.get('/data/config', function(req, res) {
  res.json(config)
})

app.get('/state', function(req, res) {
  res.json({
    'quizStarted':quizStarted,
    'timesUp':timesUp,
    'buzzerPressed':buzzerPressed,
    'currentTeam':currentTeam
  })
})

app.get('/data/question/current', function(req, res) {
  res.json(questions[currentQuestion])
})

app.get('/data/question/next', function(req, res) {
  currentQuestion++
  res.json(questions[currentQuestion])
})

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('start_quiz', function(data) {
      quizStarted = true;
      timesUp = false;
      buzzerPressed = false;
      io.emit('start_quiz', data)
    })

    socket.on('next_question', function(data) {
      timesUp = false;
      buzzerPressed = false;
      io.emit('next_question', data)
    })

    socket.on('times_up', function(data) {
      timesUp = true;
      io.emit('times_up', data)
    })

    socket.on('buzzer_pressed', function(data) {
      buzzerPressed = true;
      io.emit('buzzer_pressed', data)
    })

    socket.on('starting_team', function(teamIndex) {
      console.log('STARTING TEAM: ' + teamIndex);
      currentTeam = teamIndex;
      io.emit('starting_team', teamIndex);
    })

    socket.on('switch_team', function(teamIndex) {
      console.log('SWITCH TO TEAM: ' + teamIndex);
      currentTeam = teamIndex;
      io.emit('switch_team', teamIndex);
    })

    socket.on('correct_answer', function(data) {
      io.emit('correct_answer', data);
    })

    socket.on('incorrect_answer', function(data) {
      io.emit('incorrect_answer', data);
    })

    socket.on('score_update', function(data) {
      io.emit('score_update', data);
    })

});


http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});
