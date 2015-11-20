
module.exports = React.createClass({
  display: "PageOne",
  render(){
    var activeRouteName = this.props.location.pathname || '/';
    return (
      <div className='page'>
        <h1>Page One @ {activeRouteName}</h1>
        <ReactRouter.Link to="/two">Go to Page Two</ReactRouter.Link>
      </div>
    );
  },
});
