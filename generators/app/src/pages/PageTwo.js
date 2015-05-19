'use strict';

let PageTwo extends React.Component{
  render() {
    var activeRouteName = this.context.router.getCurrentPath() || '/';
    return (
      <div className='page'>
        <h1>Page Two @ {activeRouteName}</h1>
      </div>
    );
  }
}
PageTwo.contextTypes = {router: React.PropTypes.func};

module.exports = PageTwo;