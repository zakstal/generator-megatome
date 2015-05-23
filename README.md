# generator-megatome 

A React framework performance with batteries included but removable.

Goals of this project:
* Highly flexable and tunable React full-stack application.
* **Animated pages/routes transitions.** Make web apps feel closer to native apps without jumping between pages. Support custom animations on a per-page-to-page level.
* **Minimize the time to first paint.** Optional server-side rendering on the initial load. XHR for subsquent loads. Reduce the weight of each page.
* **Offline support by default.**
* Create completely **stateless apps**. A functional application that works completely without a UI. The app can be froze or brought up at point in the state. This is a feature of a purely functional archetecture. The app can be snapshot at any point and rewinded/fast-forward to debug.
* **Decentralized, semantically versioned component library.** This allows discrete teams to use the same components but also add features and fix issues without the need for layers of converstations and approvals. Just update the component, increase the version number and start using the new version without breaking others.
* **Unify environments and code base.** Seemless transition from development, deployment, production debugging and scaling. Using docker, webpack-hot-loader and stateless FRP dataflows to snapshot application state.

Currently supported:
* Code hot swapping for streamlined development environment
* Isomorphic javascript (run either on the client or the server)
* React w/ ES6/Babel support
* React-Router w/ asynchronous page/data loading, animated transitions and HTML 5 routing
* Docker container for distributing the web app
* Webpack w/ hot-loader, proxy-server and advanced customizations
* ImmutableJS
* BaconJS
* Express server
* Source maps
* Linting
* Minifcation & gzipping
* Code Chunking 
* Image compression

The coming road map includes:
* Bower w/ private repo
* Service Worker for offline support by default
* preconfigured Docker private repo for bower
* FRP framework for cursor properties
* React view diffing optimzations (to minimize render cycle workload)
* Performance debugging/tuning
* generator for pages that will update the router for sync loading
* generator for components
* generator for dataflow


## Getting Started

1. Make sure Yoeman is installed.

```bash
npm install -g yo
```

2. download the generator

```bash
cd generator-megatome // navigate to the folder
npm link // links the folder globally
// npm install -g generator-megatome
```

3. Create a new project

```bash
yo megatome MyAppName
```

4. Run the Webpack dev server

```bash
npm run go
```

### Webpack Configuration options

The webpack config unifies the development mode and production mode in one config file. It exposes a few options that can toggle options that can easily pivot from dev work, to an optimized client-side rendering, rendering static html or a hybrid which can render HTML dynamically serverside then once on the client React will initialize and handle subsquent calls over AJAX.

The webpack.hot.config and webpack.dist.config expose a few simple options depending on your environment. The __webpack.hot.config__ is defaulted to enable hot swapping, source maps and a proxy server. 

```javascript
module.exports = {
  devtool: "cheap-module-eval-source-map", // http://webpack.github.io/docs/configuration.html#devtool
  proxy: {'*': {target: 'http://localhost:8080'}}, // http://webpack.github.io/docs/webpack-dev-server.html#api
  devServer: true, 
  hotComponents: true, 
  bower: true,
  debug: true
}
````

The __webpack.dist.config__ is config will seperate your bootstraping/libaray and other common files into commons chunks, add long term caching (via MD5 hash of the chunk), source maps is a seperate build folder so they aren't accessable by default, seperate css file(s), minified code, gzipped files and webpack analyze stats about your project dependancies.  

```javascript
module.exports = {
  bower: true,
  commonsChunk: true,
  longTermCaching: false,
  separateStylesheet: true,
  minimize: true,
  devtool: "source-map",
  gzip: true,
  stats: true
};
````

The __webpack.render.config__ config will create a folder called static with the app compiled for use in node. The server/render.js class will allow you to render any route in react. This will have an enormous decrease in the **time to first paint**. The first page will download html that is already rendered. The index will download the pre-rendered HTML followed by downloading react which will connect to the active DOM on the page (instead of re-rendering). Once react is active on the client, each subsequent pages/data will be over XHR to minimize network load. Deep linking is supported so the initally rendered page could be anything. If JS is disabled or it's a web scrapper the server is able to render every page if needed.

```javascript
module.exports = {
  isomorphic: true,
  bower: true,
  devtool: "source-map",
  stats: true,
  bower: true,
  debug: true
};
````

To render React on the server use the server/render.js file.

```javascript
var render = require('render');
var html = render('/two', optionalProps);
console.log(html);
```

By opening the standard webpack.config file it contains a standard config setup but then contains additional functions to easily swap between different distibution environments.


### Application Structure

The bootstrap.js file in src is used for client-side bootstrapping. It will inject the App into the route.js and mount the application to the client.

Server-side rendering is handled by the src/generate.js file. To source needs to be compiled by webpack so that the production app doesn't need to run webpack for each request. `npm run render` will create the static folder with the compiled app. In the node server to render a page import the server/render.js file and pass in the route and optional props to render the HTML.



## License

MIT
