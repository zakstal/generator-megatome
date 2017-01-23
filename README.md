# generator-megatome

A React stack of libraries built to deliver rich UIs, simplicity and performance for developers, server, network and users.

## Features

* **Use libraries not frameworks.** The power of the web comes from leveraging everyone's best ideas. Don't get locked into a large framework that's hard to get out of and doesn't let you to try new libraries. Any or all of these pieces can be swapped out for something that fits your needs better or when a better tool comes along. The current tool box is React for views, ES6/Babel for cleaner code, React-Router for page transitions and HTML5 routing, docker for running the app anywhere, webpack for deployment optimizations, express for proxying/server APIs/optional HTML generation, Bower for component versioning/distribution, Immutable JS for data.
* **Hot swap live code.** Using the webpack-dev-server to hot swap live code with __NO__ page reloads. The included source map support means you can debugger the actual code in the browser.
* **Unify environments.** Enable a seamless transition from development, qa, production, debugging and scaling. Megatome uses Docker, Webpack hot swapping, webpack dev server to proxy external servers/services to deliver a full life cycle.
* **Universal code base.** A single boolean switch will allow the code to be ran on the client (w/o a headless browser to eat up all your server's CPU).
* **Optimized for development AND delivery.** Structure the code base so that it's best for developers and leverage best practices to deliver your app faster then everyone else. Pick which deployment options are best for your users. Single toggle switches for: generating HTML in node, Code Chunking, pre-gzip, minification, source maps, view dependency graph, long-term caching, optimize images, create responsive images and proxy calls to other servers.
* **Rich UI with animations between pages/routes.** Make web apps feel closer to native apps without jumping between pages or popping items in and out. Maintain a clean, consistent experience while loading data and assets.
* **Decentralized, semantically versioned component library.** Whether working in a small team or very large teams allow components to be built and versioned independently. It promotes highly reuseable code as well as enhancing communication between development, design and business groups. There is a one touch install of a private bower registry via Docker.


## Getting Started

1. Make sure Yeoman is installed.

```bash
npm install -g yo
```

2. install the generator

```bash
npm install -g generator-megatome

// to develop/change the generator you can download and link it
git clone https://github.com/Levelmoney/Megatome
cd generator-megatome
npm link
```

3. Create a new project

```bash
yo megatome MyAppName
```

4. Run the Webpack dev server

```bash
npm run go
```

## Same Code Base, Multiple Deploy Targets

### Dev mode - Instant refresh

Dev mode will turn on hot swap reloads and no minification. This will update your code without refreshing the browser and all in under a second. Once you used HMR everything else is horrible.

```javascript
npm start
```

### Standard Deployment - 2s page loads & offline (coming soon)

Standard build will separate CSS, images and JS. JS code will be chunked for optimal loading. Use `require.ensure` on routes instead of normal `import` to hint at Webpack on where best to separate JS code. Images used with the resize-image-loader will all create optimized and minified images to load without any server support needed. In our production environment we get 2 second load times over 3G celluar internet. Faster speeds mean less user abandonment.

```javascript
npm run build
```

### Server-side prebooting - <1s page loads & offline (coming soon)

For each faster speeds use the `render` target. This has a small express server that can render any route in your entire app server side. The HTML and CSS is loaded first. This minimizes network load as well as skips a lot of bootup process in the browser. No javascript means it by passes everything and sends HTML/CSS straight to the rendering pipeline. In our use we can achieve render times on 3G connects, for any page in the site, in about 800 miliseconds.

One word of advise, when you have that little time to process, deliver and paint, every extra step adds overhead. Webpack turns our async code to sync and we have a data layer with React that allows us to render everything from a static JSON rather than an event system like in Flux and Redux. This generator doesn't make any assumptions about what data layer you choose with React. More details at [http://bit.ly/spa-in-2-seconds-over-3g](http://bit.ly/spa-in-2-seconds-over-3g).

```javascript
npm run render
```


### Embed Target - Web Page in a Box for easy CMS deploys

Sometimes ease of deployment is more important and page load speed. The `embed` target will package all JS, CSS, JSON and images needed for a site and bundle it all into one single js file. If you need separated files and assets for faster page load speed use the normal `build` or `render` targets.

```javascript
/* Create a single .js with all images, css and code. Great for offline prototype or deploying to stupid CMSs */
npm run embed

```


## Universal/Isomorphic code.

The goal of every developer to have the page start to render in under 2 seconds. Many metrics from Bing, Amazon and other so that any page that takes longer than 2 seconds to load will see users leave before the page loads and **you will LOSE 2% to 4% of revenue because of slow page load.** This is **REGARDLESS** of the user's connection speed. So you need to render in 2 seconds on a 3G connection. Use [webpagetest.org](http://www.webpagetest.org/) with the 3G connection under advanced options to test.

In my use cases there is usually a **4x to 6x improvement** in speed of delivery in rendering the first page ([Test results here.](https://twitter.com/puppybits/status/602160744042336256)). This works for deep links as well as the index.html. Also once the first page is loaded, react will attach itself to the live HTML and make all subsequent pages to load the minimum set via XHR.

```javascript
npm run render // This will create a stat sync version of the app for node to run

node server/server.js // run the server

// The built-in express server will check if it can render statically and pre-render HTML. If not it will send the default bootstrapping for client-side rendering.
var everythingButFilesRegex = /^[^\.]+$/;
var canPrerender = fs.existsSync(path.join(__dirname, '..', 'static', 'app.js'));
app.use(everythingButFilesRegex, (req, res) => {
  console.log('render:', req.path, canPrerender);
  return (canPrerender ?
    res.set({'Cache-Control':'public, max-age=31536000'}).send(render(req.path)) :
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'), { maxAge: 315569259747 }))
})


```


## Webpack config options

Webpack is great and sucks at the same time. It's does a million wonderful things for your code base and deployment but is very hard to setup everything just right. The aim to to create a few of the most important settings as simple toggles so you don't have to mess with it but can tune the deployment when you need to.

```javascript
{
  isomorphic: true, /* Create a version to run server-side. default: false. unless running the npm run render command. */
  embed: true, /* ignore all chunking and include all images, css, JSON, JS and other assests into a single file. Great for CMS  */
  bower: true, /* search for bower components as well.*/
  commonsChunk: true, /* Split code in multiple chunks to allow the user to only download code that is used on that page. */
  longTermCaching: false, /* Add a hash to the file name. Unless the hash changes, the browser wont download it again. */
  separateStylesheet: false, /* Separate CSS from JS. default: false. This means less files to download separately and allow hot swapping to work for CSS. */
  minimize: false, /* Minify code. Default for production build is true. */
  devtool: "cheap-module-eval-source-map", /* Create source maps. Dev source maps build only what is needed. Production source maps go into the /build folder by deafult so they are never deployed to the end-users. */
  devServer: true, /* HMR dev mode */
  proxy: {'*': {target: 'http://localhost:8080'}}, /* transparently proxy unknown to another backend server, like ruby or node.*/ 
  gzip: false, /* Gzip code after minified. This allows you to see the true deployment size as well as optionally send pre-gziped files that is just one less thing for the server to do. */
  stats: false, /* Generate a dependency graph of your app. This helps you see bottle necks and see the complexity of your app. Upload the file to http://webpack.github.io/analyse/*/
  lang: "en", /* only include a single language. useful excluding extra language files from packages like moment.js */ 
}
```

## Hot swapping code with source maps

Hot swapping code is the equivalent as big of a revolution as having a debugger. Hot swapping will watch for changes in your code, compile the minimal change and push it to the browser directly where it just replaces itself on the current page. The entire state of your page is unchanged and the new changes are just live. It's magic.

Megatome has hot swapping out of the box. Just use `npm run up` and open the page in your browser. If you have another server in Ruby or whatever connecting to S3 or other custom things, the hot swap server will proxy over those calls automatically.

```javascript
/* start a local dev server that will hot swap code, proxy an external server and create source maps. */
npm run up

/* The command above uses the webpack.hot.config.js file. */
module.exports = {
  devtool: "cheap-module-eval-source-map", // enable source maps
  proxy: {'*': {target: 'http://localhost:8080'}}, // proxy another server
  devServer: true,
  hotComponents: true, // hot swap code
  bower: true, // use bower for components
  debug: true
};
```

## Deploy code

The excuse of "It runs on my machine." needs to die. Docker killed that excuse. The 100% same environment on your computer will run on the server as well. QA can pull down any version of your app and run it locally. The server can also grab any version, run it, scale it with a reverse proxy and run up multiple instances of each service with little to no work.

```javascript
/* Package up your entire app into a light vm. */
npm run docker-build

/* Run the vm of your app locally. */
npm run docker-run

/* Push your vm to Docker Hub or your private repo. (You'll have to orchestrate deployment seperatly). */
npm run docker-push

```


## Animated Page Transitions

User trust, professionalism and selling a premium experience comes from rich animations. Animations engage the user and guide them through the interface. Animations between pages and between states should be the norm, not the exception. We also need to consider loading data from an API, off-line cache, loading view components (and their dependencies) and control those all together with the animation. Data requirements and loading for a page should be coupled to the page that needs them not the router. In the example below the route uses a proxy element that will dynamically load the code chunk, which in turn will be given an opportunity to load any data needed to display before the animation kicks off.

```javascript
/* routes.js */
let PageOneProxy = React.createClass({
  mixins: [require('react-proxy!pages/PageOne').Mixin],
  statics: {
    /* ensure the new page is loaded then animate to the new page */
    willTransitionTo: function (transition, params, query, callback) {
      /* require.ensure is a webpack thing to tell it where it can split the code when compiling */
      require.ensure([], function() {
        /* Load the page from server or local cache. */
        var Component = require('pages/PageOne');
        /* Optionally allow the page a chance to load external data before it's displayed. */
        if (Component.getAsyncData) {
          Component.getAsyncData(function(data){
            /* This will set the props for the component. */
            assign(params, data);
            /* start the transition. */
            callback();
          });
        } else {
          callback();  
        }
      }, 'PageOne'/* This tells webpack the chunk name */);
    }
  }
});

//routes
var routes = (App) => (
  <Route handler={App}>
    <DefaultRoute handler={Home} />
    <Route path="/one" name="one" handler={PageOneProxy} />
    ...
  </Route>
);

Router.run(routes(App),
  Router.HistoryLocation, /* HTML 5 routes are turned on by default. No more horrible #! */
  function (Handler) {
    React.render(<Handler/>, mount);
});

/* PageOne.js (in a separate chunk than the router) */
class PageOne extends React.Component{
  render() {
    var activeRouteName = this.context.router.getCurrentPath() || '/';
    return (
      <div className='page'>
        <h1>Page One @ {activeRouteName}</h1>
        <p>dynamically loaded: {{this.props.myAsyncData}}</p>
        <Router.Link to="two">Go to Page Two</Router.Link>
      </div>
    );
  }
}
PageOne.contextTypes = {router: React.PropTypes.func};
PageOne.getAsyncData = () => {
  setTimeout(() => {
    return {myAsyncData: "example data"}
  },2000)
};

module.exports = PageOne;
```

## Responsive images

A big waste of network load is sending images that are much large than the display. Using webpack loaders we can let the browser know which alternate sizes are available so that it can choose the best size based on screen size, pixel density and network connection speed.

All that's needed is to pick the sizes you'd like and add that to the img srcSet tag. The webpack loader will create custom, optimized images at those widths and add include it in the dist folder.

```shell
brew install ImageMagick # mac install for Image Magick
npm install resize-image-loader --save
```

```javascript
// default image
var HeroImg = require('assets/images/hero.jpg'),
// alternate sizes for hero image
HeroImgSet = require('resize-image-loader?sizes[]=320w&sizes[]=960w&sizes[]=2048w,!assets/images/hero.jpg');

...
render(){
  return (<img src={HeroImg} srcSet={HeroImgSet}/>);
}

```

### Webpack Cookbook

* adding globals so that we can skip importing in every class

```javascript
{
  plugins: [new webpack.ProvidePlugin({
    react:React, // everything needs react so just make it global
    k: src/common/konst // constants should be availble everywhere
  })]
}
```




### Application Structure

The bootstrap.js file in src is used for client-side bootstrapping. It will inject the App into the route.js and mount the application to the client.

Server-side rendering is handled by the src/generate.js file. To source needs to be compiled by webpack so that the production app doesn't need to run webpack for each request. `npm run render` will create the static folder with the compiled app. In the node server to render a page import the server/render.js file and pass in the route and optional props to render the HTML.



## License

* Apache 2.0 (Please see license file and headers)
* Please review and agree to our [Contributor License Agreement](https://docs.google.com/forms/d/e/1FAIpQLSfwtl1s6KmpLhCY6CjiY8nFZshDwf_wrmNYx1ahpsNFXXmHKw/viewform) before contributing.


## Road Map

* Service Worker for off-line support by default
* FRP dataflow w/ cursors for snapshotable, reversible data flow
* React view diffing optimizations (to minimize render cycle workload)
* Performance debugging/tuning
* generator for pages that will update the router for sync loading
* generator for components
* generator for dataflow
