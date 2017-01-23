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

let { Router, Route } = ReactRouter;
let App = require('App');

// routes
var routes = {
  path: '/',
  component: App,
  onEnter: (router, replaceWith) => {
    if (router.location.pathname === '/') {
      replaceWith(null, '/one');
    }
  },
  childRoutes:[
    {
      path:"/one",
      getComponents:(a, cb) => require.ensure([], require => {cb(null, require("pages/PageOne"));})
    },
    {
      path:"/two",
      getComponents:(a, cb) => require.ensure([], require => {cb(null, require("pages/PageTwo"));})
    },
  ]
};

module.exports = routes;
