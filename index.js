var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('app'));

app.use('/js', express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')));
app.use('/js/jquery.min.js', express.static(path.join(__dirname,'node_modules','jquery','dist','jquery.min.js')));
app.use('/js/angular.min.js', express.static(path.join(__dirname,'node_modules','angular','angular.min.js')));
app.use('/css', express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')));
app.use('/fonts', express.static(path.join(__dirname,'node_modules','bootstrap','dist','fonts')));

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
