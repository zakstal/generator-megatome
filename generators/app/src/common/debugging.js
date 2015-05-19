'use strict';

if (__DEV__) {
  // expose main libraries to window to easy access/debugging in the browser
  let request = require('superagent');
  (window !== window.top ? window.top : window).request = request;

  let React = require('react/addons');
  (window !== window.top ? window.top : window).React = React;

  let Router = require('react-router');
  (window !== window.top ? window.top : window).Router = Router;

  let Bacon = require('baconjs');
  (window !== window.top ? window.top : window).Bacon = Bacon;

  let Immutable = require('immutable');
  (window !== window.top ? window.top : window).Immutable = Immutable;

  let moment = require('moment');
  (window !== window.top ? window.top : window).moment = moment;

  
  if(window && !document.querySelector('head > script.hot')) {
    var script = document.createElement('script');
    script.className = 'hot';
    script.src = "http://localhost:8000/webpack-dev-server.js";
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
