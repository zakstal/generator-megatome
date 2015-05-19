var express = require('express'),
  path = require('path'),
  app = express(),
  bodyParser = require('body-parser'),
  request = require('superagent');

// app
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '..', 'dist')));

// If you don't want source files on the public server then remove this
app.use('/build', express.static(path.join(__dirname, '..', 'build')));


// html5 routing
app.all('[^\.]+', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')));


// start
app.listen(process.env.PORT || 8080, '0.0.0.0');


console.log('<%= Appname %> is up');


