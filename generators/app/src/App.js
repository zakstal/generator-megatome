'use strict';

require('common/main.sass');

let RouteHandler = Router.RouteHandler,
  TransitionGroup = React.addons.CSSTransitionGroup;


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

module.exports = App;