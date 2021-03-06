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
