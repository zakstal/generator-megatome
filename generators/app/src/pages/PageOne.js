'use strict';

let PageOne extends React.Component{
  render() {
    var activeRouteName = this.context.router.getCurrentPath() || '/';
    return (
      <div className='page'>
        <h1>Page One @ {activeRouteName}</h1>
      </div>
    );
  }
}
PageOne.contextTypes = {router: React.PropTypes.func};

module.exports = PageOne;