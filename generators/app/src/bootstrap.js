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

require('assets/icons/AppIcon152x152.png');
require('assets/icons/AppIcon120x120.png');
require('assets/icons/AppIcon76x76.png');
require('assets/icons/AppIcon60x60.png');
require('assets/manifest.json');
require('assets/favicon.ico');

// React, React-Router (and a few other libs) are globals via the webpack config
//
if (__DEV__) {
  require('common/debugging');
}

let { createHistory } = require('history'),
  history = createHistory();

// bootstrapping to the index.html
let mount = window.document.getElementById('app');
if (!mount){
  mount = window.document.createElement("div");
  mount.id = "app";
  window.document.body.appendChild('mount');
}

// const enforceAuth = (router, replaceWith) => {
//   /* If you have any login put it here. */
// };
// routes.childRoutes.map(r => assign(r, {onEnter: enforceAuth}));
// routes.onEnter = enforceAuth;


// HTML 5 routing is supposed in webpack and the basic express server
require.ensure([],
  // lazy require allows webpack to HMR the app
  require => {
    let routes = require('routes');
    ReactDom.render(
      <ReactRouter.Router history={history}>
        {routes}
      </ReactRouter.Router>, mount);
  });
