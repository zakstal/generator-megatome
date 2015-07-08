'use strict';

require('common/main.sass');

let RouteHandler = Router.RouteHandler,
  CSSTransitionGroup = require('rc-css-transition-group');

// App
class App extends React.Component{
  render() {
    var activeRouteName = this.context.router.getCurrentPath() || '/';
    return (
      <div className='app'>
        {/* insert navigation header here */}
        {/* this enables the page transitions */}
        <CSSTransitionGroup transitionName="fade">
          <RouteHandler key={activeRouteName} />
        </CSSTransitionGroup>
      </div>
    );
  }
}
App.contextTypes = {router: React.PropTypes.func};

module.exports = App;