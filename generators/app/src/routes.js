'use strict';

let { DefaultRoute, Route } = Router;

let PageOneProxy = React.createClass({
  mixins: [require('react-proxy!pages/PageOne').Mixin], // NOTE: generally keep requires agnostic. This is an exception.
  statics: {
    /* ensure the new page is loaded then animate to the new page */
    willTransitionTo: function (transition, params, query, callback) {
      require.ensure([], function() {
        var Component = require('pages/PageOne');
        // do any async data loading here
        callback();
      }, 'PageOne'); // FYI this names the chunk in webpack
    }
  }
});

let PageTwoProxy = React.createClass({
  mixins: [require('react-proxy!pages/PageTwo').Mixin],
  statics: {
    /* ensure the new page is loaded then animate to the new page */
    willTransitionTo: function (transition, params, query, callback) {
      require.ensure([], function() {
        var Component = require('pages/PageTwo');
        // do any async data loading here
        callback();
      }, 'PageTwo');
    }
  }
});

//routes
var routes = (App) => (
  <Route handler={App}>
    <DefaultRoute handler={PageOneProxy} />
    <Route path="/one" name="one" handler={PageOneProxy} />
    <Route path="/two" name="two" handler={PageTwoProxy} />
  </Route>
);


module.exports = routes;
