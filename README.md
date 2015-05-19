# generator-megatome 

**WARNING: Currently contains some Level environment specific settings that need to be moved to Yeoman stored config.**

Master web stack setup for Level Money. 

The stack sets up and configures:
* React w/ ES6/Babel support
* React-Router w/ asynchronous page/api loading and animated transitions
* ImmutableJS
* BaconJS
* Bower w/ private repo
* Docker container for web app
* Webpack w/ hot-loader, proxy-server and advanced customizations
* Barebone Express server

The coming road map includes:
* Isomorphic javascript to optionally render a page server-side
* Service Worker for offline support by default
* preconfigured Docker private repo for bower
* FRP framework for cursor properties
* React rendering optimzations
* Performance Debugging/tuning
* generator for pages that will update the router for sync loading
* generator for components
* generator for baconflow


## Getting Started

1. Make sure Yoeman is installed.

```bash
npm install -g yo
```

2. download the generator

```bash
npm install -g generator-megatome
```

3. Create a new project

```bash
yo Megatome MyAppName
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

By opening the standard webpack.config file it contains a standard config setup but then contains additional functions to easily swap between different distibution environments.


### Application Structure

The main.js file in src is used for bootstrapping. It pulls in the router.js file which creates the routes for the client and the server.





## License

MIT
