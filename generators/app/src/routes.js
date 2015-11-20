let { Router, Route } = ReactRouter;
let App = require('App');

// routes
var routes = {
  path: '/',
  component: App,
  onEnter: (router, replaceWith) => {
    if (router.location.pathname === '/') {
      replaceWith(null, '/one');
    }
  },
  childRoutes:[
    {
      path:"/one",
      getComponents:(a, cb) => require.ensure([], require => {cb(null, require("pages/PageOne"));})
    },
    {
      path:"/two",
      getComponents:(a, cb) => require.ensure([], require => {cb(null, require("pages/PageTwo"));})
    },
  ]
};

module.exports = routes;
