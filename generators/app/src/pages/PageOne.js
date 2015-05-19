'use strict';

class PageOne extends React.Component{
  render() {
    var activeRouteName = this.context.router.getCurrentPath() || '/';
    return (
      <div className='page'>
        <h1>Page One @ {activeRouteName}</h1>
        <Router.Link to="two">Go to Page Two</Router.Link>
      </div>
    );
  }
}
PageOne.contextTypes = {router: React.PropTypes.func};

module.exports = PageOne;