'use strict'

var App = require('App'),
  routes = require('routes')(App);

var generate = function generate(path, props) {
  var html = null;
  Router.run(
    routes,
    path, 
    (Handler) =>
      html = React.renderToString(React.createFactory(Handler)(props))
  );
  return html;
};

module.exports = generate;
