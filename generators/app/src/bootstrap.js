'use strict';

// React, React-Router (and a few other libs) are globals via the webpack config

if (__DEV__) {
  require('common/debugging');
}

require('assets/favicon.ico');

let App = require('App'),
  routes = require('routes');

// bootstrapping to the index.html
let mount = document.getElementById('app');

// HTML 5 routing is supposed in webpack and the basic express server
Router.run(routes(App),
  Router.HistoryLocation,
  function (Handler) {
    React.render(<Handler/>, mount);
});
