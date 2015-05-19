'use strict';

// React, React-Router (and a few other libs) are globals via the webpack config

if (__DEV__) {
  require('common/debugging');
}

require('bootstrap/main.sass');

// routes can be leveraged via client or browser
let routes = require('routes'),
  TransitionGroup = React.addons.CSSTransitionGroup;

// bootstrapping to the index.html
let mount = document.getElementById('content');


// App
class App extends React.Component{
  render() {
    var activeRouteName = this.context.router.getCurrentPath() || '/';
    return (
      <div className='app'>
        {/* insert navigation header here */}
        {/* this enables the page transitions */}
        <TransitionGroup transitionName="fade">
          <RouteHandler key={activeRouteName} />
        </TransitionGroup>
      </div>
    );
  }
}
App.contextTypes = {router: React.PropTypes.func};

// HTML 5 routing is supposed in webpack and the basic express server
Router.run(routes(App),
  Router.HistoryLocation,
  function (Handler) {
    React.render(<Handler/>, mount);
});

