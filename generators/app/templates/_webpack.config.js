var isProd = (process.argv.indexOf('--production') >= 0);
var isRender = (process.argv.indexOf('--render') >= 0);
var isEmbed = (process.argv.indexOf('--embed') >= 0);
var options = (isProd ?
  require("./webpack.dist.config.js") :
  (isRender ? require("./webpack.render.config.js") :
    (isEmbed ? require("./webpack.embed.config.js") :
      require("./webpack.hot.config.js"))));

module.exports = (function(options){
  var fs = require('fs'),
  version = require('./package.json').version,
  path = require("path"),
  assign = require('object-assign'),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  CompressionPlugin = require("compression-webpack-plugin"),
  ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin"),
  StatsPlugin = require('stats-webpack-plugin'),
  GZipPlugin = require('compression-webpack-plugin'),
  devPort = process.env.PORT = process.env.PORT || 8000;

var globals = {
  React: 'react',
  ReactDom: 'react-dom',
  ReactRouter: 'react-router',
  Perf: 'react-addons-perf',
  'react-motion': 'react-motion',
  assign: 'object-assign',
  request: 'superagent',
  Symbol: 'es6-symbol'
};

var baseConfig = {
  entry: {
    app: ['./src/bootstrap.js'],
    libs: Object.keys(globals).map(function(k){ return globals[k]; })
  },

  output: {
    publicPath: '',
    path: 'dist/',
    filename: "[name].js",
    sourceMapFilename: '[file].map',
    chunkFilename: "[name].js",
    libraryTarget: undefined,
    pathinfo: false
  },

  module:{
    noParse: [],
    // preLoaders: [{
    //   /* shim modules go here */
    //   test: /jquery\.js$/,
    //   loader: 'imports?this=>window!exports?jquery'
    // }],
    loaders: [{
      /* convert all source files */
      test: /\.(js|jsx)$/,
      include: [/src/,/bower_components/],
      exclude: [/(node_modules)/],
      loader: 'babel?plugins[]=transform-runtime&presets[]=es2015&presets[]=stage-0&presets[]=react&cacheDirectory=true',
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      /* Bundle CSS. */
      test: /\.css$/,
      exclude: /.(\-|\.)min.css$/,
      loader: 'style!css'
    }, {
      /* convert sass */
      test: /\.sass/,
      loader: 'style!css!sass?sourceMap=true&indentedSyntax=sass&includePaths[]=' + (__dirname +"./src")
    }, {
      /* Export Fonts */
      test: /\.(eot|woff|ttf)$/,
      loader: 'file?name=[name].[ext]&context=/'
    }, {
      /* File Exporter to include any images */
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      exclude:/icons/,
      loader: 'url?limit=8192&name=assets/images/[name].[ext]'
    }, {
      /* File Exporter to include any images */
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      include:/icons/,
      loader: 'file?name=[name].[ext]'
    }, {
      /* File Exporter to include index */
      test: [/index\.html$/, /\.(ico)/],
      loader: 'file?name=[name].[ext]'
    }]
  },

  target: "web",

  resolveLoader: {
    root: [path.join(__dirname, "node_modules"), './src', 'vendor'],
  },

  resolve: {
    root: "app",
    extensions: ["", ".js", ".jsx"],
    /* allow for friendlier names to pull from preminimized files */
    alias: {
    },
    /* allow for root relative names in require */
    modulesDirectories: ['bower_components', 'node_modules', 'src']
  },

  externals: {},

  plugins: [
    /* "Compiler" switches and embeding versioning. Dead code stripping will remove. */
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version),
      __PROD__: JSON.stringify(JSON.parse(process.env.NODE_ENV === "production" || 'false')),
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
    }), /* BUILD_DEV=1 BUILD_PRERELEASE=1 webpack and `webpack -p` removes dead code */

    ],

  devServer: {
    contentBase: 'dist/',
    proxy: null,
    https: false,
    historyApiFallback: true,
    stats: {
      cached: false,
      exclude: [/node_modules/,/bower_components/]
    },
    watchOptions: {
      aggregateTimeout: 1,
      poll: 100
    },
  },

  /* settings for jshint */
  jshint: {
    "globals": { "__DEV__": true }
  },
}

function runPostConfig(config, options) {
  updateEntry(config, options);

  updateBower(config, options);

  updateDevServer(config, options);

  updateLinting(config, options);

  updateIsomorphic(config, options);

  updateEmbed(config, options);

  updateLoaders(config, options);

  updateDebug(config, options);

  updateLibs(config, options);

  updateCaching(config, options);

  updatePlugins(config, options);

  updateGlobals(config, options);

  config.plugins.push(
    new webpack.DefinePlugin({process:{env:{BROWSER_ENV:(config.target === 'web') }}})
  );
}

function updateEntry(config, options) {
  var entry = config.entry && config.entry.app || Object.keys(config.entry);

  if (options.hotComponents) {
    entry.unshift('webpack/hot/only-dev-server');
    entry.unshift('webpack-dev-server/client?http'+(options.https ? 's':'')+'://localhost:'+devPort);
  }
}

function updateBower(config, options){
  if (options.bower) {
    var mainFile = new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]);
    config.resolveLoader.root.unshift(path.join(__dirname, "bower_components"));
    config.plugins.push(new webpack.ResolverPlugin(mainFile));
  }
}

function updateLinting(config, options) {
  if (options.lint) {
    config.preLoaders.unshift({
      test: /\.(js|jsx)$/,
      include: [/src/],
      loader: 'jsxhint'
    });
  }
}

function updateDebug(config, options) {
  if (options.debug){
    config.output.pathinfo = true;
  }
}

function updateDevServer(config, options) {
  if (options.devServer) {
    config.output.publicPath = 'http'+(options.https ? 's':'')+'://localhost:'+devPort+'/';
    config.output.chunkFilename = "[name]-[id].js";
    config.devServer.https = options.https || false;
  }

  if (options.proxy) {
    config.devServer.proxy = options.proxy;
  }

  if (options.hotComponents) {
    config.module.loaders.some(function(loader) {
      if(loader.test.toString().indexOf('jsx') > -1){
        loader.loader = 'react-hot!' + loader.loader;
        return true;
      }
      return false;
    });
    config.devServer.hot = true;
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    // include --inline to the start command
    // OR add <script src="http://localhost:8000/webpack-dev-server.js"></script> in index.html
  }
}

function updateIsomorphic(config, options) {
  if (options.isomorphic) {

    config.target = "node"; // don't prebuild anything in node_modules (maybe all modules).
    config.output.path = "static/";
    config.entry.app = "expose?renderRoute!./src/generate.js";

    // use superagent node version
    config.plugins.push(new webpack.ProvidePlugin({"request": "superagent"}));
    assign(config.externals, {"superagent":"superagent"});

    config.module.loaders.map(function(load) {
      if (load.loader.indexOf('style!') === 0) {
        load.loader = load.loader.replace('style!','');
      }
    });
  }
}

function updateEmbed(config, options) {
  if (options.embed) {
    config.output.path = "embed/";
    config.entry.libs.map(function(l){
      config.entry.app.push(l)
    });
    delete config.entry.libs;
    delete config.output.chunkFilename;
    delete config.output.libraryTarget;

    config.module.loaders.map(function(loader){
      console.log(loader.test)
      if (loader.test && loader.test.exec && loader.test.exec('fake.png')){
        loader.loader = 'url?limit=9999999'
      }
    })

    config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({maxChunks:1}))
  }
}

function updateLoaders(config, options) {
  config.module.noParse.push(/(\-|\.)min.js$/); /* don't parse minified files */

  config.plugins.push(new webpack.optimize.DedupePlugin());

  if (options.separateStylesheet) {
    config.module.loaders.map(function(load) {
      if (load.loader.indexOf('style!') === 0) {
        load.loader = ExtractTextPlugin.extract("style", load.loader.replace('style!',''));
      }
    });
    config.plugins.push(new ExtractTextPlugin("[name].css"));
  }
}

function updateLibs(config, options) {
  if(options.commonsChunk) {
    var name = "libs.js" + (options.longTermCaching && !options.isomorphic ? "?[chunkhash]" : "");
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin('libs', "libs.js"));
  }
}

function updateCaching(config, options) {
  if (options.longTermCaching && !options.isomorphic){
    config.output.filename += "?[chunkhash]";
    config.output.chunkFilename += "?[chunkhash]";
  }
}

function updatePlugins(config, options) {
  config.plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/assets/index.html'
  }));

  if(options.minimize) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress:{warnings:false},
        test:/[^min]\.js/i /* IMPORTANT: Uglify will crawl with minified code */
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        },
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
        __version__: version,
      }),
      new webpack.NoErrorsPlugin()
    );
  }

  if (options.lang){
    var langExp = new RegExp("/^\.\/("+options.lang+")$/");
    config.plugins.push(new ContextReplacementPlugin(/moment\.js[\/\\]lang$/, langExp));
  }

  if(options.gzip) {
    config.plugins.push(new CompressionPlugin({asset: "{file}.gz",regExp: /\.js$|\.css$|\.html$|\.png$|\.jpg$|\.jpeg$|\.gif$/}));
  }

  if (options.stats) {
    config.plugins.push(new StatsPlugin(path.join('./build', 'stats.json'), {
      chunkModules: true,
      exclude: [/node_modules/]
    }));
  }
}

function updateGlobals(config, options) {
  var libs = new webpack.ProvidePlugin(globals);
  config.plugins.push(libs);
  config.jshint.globals = assign(config.jshint.globals, globals);
}
baseConfig.devtool = options.devtool;
runPostConfig(baseConfig, options);

/* uncomment to test webpack config */
// console.log(baseConfig)

return baseConfig;

}(options));
