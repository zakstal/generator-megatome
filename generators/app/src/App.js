// Copyright [2017] Capital One Services, LLC 
// 
// Licensed under the Apache License, Version 2.0 (the "License"); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at: 
// 
//     http://www.apache.org/licenses/LICENSE-2.0 
// 
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
// See the License for the specific language governing permissions and 
// limitations under the License.

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
