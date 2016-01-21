require('assets/icons/AppIcon152x152.png');
require('assets/icons/AppIcon120x120.png');
require('assets/icons/AppIcon76x76.png');
require('assets/icons/AppIcon60x60.png');
require('assets/manifest.json');
require('assets/favicon.ico');

// React, React-Router (and a few other libs) are globals via the webpack config
//
if (__DEV__) {
  require('common/debugging');
}

let { createHistory } = require('history'),
  history = createHistory();

// bootstrapping to the index.html
let mount = window.document.getElementById('app');
if (!mount){
  mount = window.document.createElement("div");
  mount.id = "app";
  window.document.body.appendChild('mount');
}

// const enforceAuth = (router, replaceWith) => {
//   /* If you have any login put it here. */
// };
// routes.childRoutes.map(r => assign(r, {onEnter: enforceAuth}));
// routes.onEnter = enforceAuth;


// HTML 5 routing is supposed in webpack and the basic express server
require.ensure([],
  // lazy require allows webpack to HMR the app
  require => {
    let routes = require('routes');
    ReactDom.render(
      <ReactRouter.Router history={history}>
        {routes}
      </ReactRouter.Router>, mount);
  });
