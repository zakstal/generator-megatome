require('assets/icons/AppIcon152x152.png');
require('assets/icons/AppIcon120x120.png');
require('assets/icons/AppIcon76x76.png');
require('assets/icons/AppIcon60x60.png');
require('assets/manifest.json');
require('assets/favicon.ico');

// React, React-Router (and a few other libs) are globals via the webpack config

if (__DEV__) {
  require('common/debugging');
}

let App = require('App'),
  render = require('react-dom').render,
  assign = require('object-assign'),
  { Router } = ReactRouter,
  { createHistory }= require('history'),
  history = createHistory(),
  routes = require('routes');

// bootstrapping to the index.html
let mount = window.document.getElementById('app');

// const enforceAuth = (router, replaceWith) => {
//   /* If you have any login put it here. */
// };
// routes.childRoutes.map(r => assign(r, {onEnter: enforceAuth}));
// routes.onEnter = enforceAuth;


// HTML 5 routing is supposed in webpack and the basic express server
render(
  <Router history={history}>
    {routes}
  </Router>, mount);
