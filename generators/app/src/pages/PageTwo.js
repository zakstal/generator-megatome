
module.exports = React.createClass({
  display: "PageOne",
  render(){
    var activeRouteName = this.props.location.pathname || '/';
    return (
      <div className='page'>
        <h1>Page Two @ {activeRouteName}</h1>
        <ReactRouter.Link to="/one">Go to Page One</ReactRouter.Link>
      </div>
    );
  },
});
