require('common/main.sass');

var versionInfo = (__DEV__ ? `v${require("../package.json").version}` : "");


let { Spring } = require('react-motion');

// App
let App = React.createClass({
  getInitialState:() => ({
    loaded: false,
  }),
  componentDidMount(){
    this.setState({loaded:true});
  },
  render(){
    var activeRouteName = this.props.location.pathname || '/';
    let start = (!this.state.loaded ? 1 : 0);

    return (
      <div className='app'>

        <Spring defaultValue={{val:start}} endValue={{val:1}}>
          {interpolated =>
            <div style={{display: 'block', height: '100%', opacity: interpolated.val}}>
              {this.props.children}
            </div>}
        </Spring>
      </div>
    );
  }
});

module.exports = App;
