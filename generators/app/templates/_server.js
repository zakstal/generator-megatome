var express = require('express'),
  path = require('path'),
  fs = require('fs'),
  render = require('./render'),
  app = express(),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  request = require('superagent');

var TEN_YEARS = 315569259747,
  CAN_PRERENDER = fs.existsSync(path.join(__dirname, '..', 'static', 'app.js')),
  everythingButFilesRegex = /^[^\.]+$/;

// app
app.use(compress()); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// If you don't want source files on the public server then remove this
app.use('/build', express.static(path.join(__dirname, '..', 'build')));


// html5 routing
app.use(everythingButFilesRegex, (req, res) => 
  (CAN_PRERENDER ?
    res.set({'Cache-Control':'public, max-age='+TEN_YEARS}).send(render(req.baseUrl)) :
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'), { maxAge: TEN_YEARS }))
);

app.use(express.static(path.join(__dirname, '..', 'dist'), { maxAge: TEN_YEARS }));


// start
app.listen(process.env.PORT || 8080, '0.0.0.0');


console.log('<%= Appname %> is up');


