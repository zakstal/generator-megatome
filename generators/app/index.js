'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var exec = require('child_process').execSync;
var mkdirp = require('mkdirp');
var wrench = require('wrench');
var _ = require('Lodash');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the slick ' + chalk.red('Megatome') + ' generator!'
    ));

    this.argument('appname', { type: String, required: false });
    
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = _.camelCase(this.appname);
    this.Appname = this.appname.charAt(0).toUpperCase() + this.appname.slice(1);
    this.config.set('appname', this.appname);
    
    var prompts = [{
      type    : 'input',
      name    : 'email',
      message : 'What\'s your Github username?',
      default : exec("git config user.email").toString('utf8').replace("\n","") || null,
      store   : true
    }, {
      type: 'input',
      name: 'proxy',
      message: 'Do you need an API server?',
      choices: ['y','N'],
      default: 'y'
    }, {
      type: 'input',
      name: 'bower',
      message: 'Would you like the private bower repo?',
      default: 'http://bower.level:5678'
    }, {
      type: 'choices',
      name: 'skipLibUpdate',
      message: 'Would you check for the latest library versions?',
      choices: ['y','N'],
      default: 'y'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.env.options.proxy = props.proxy === 'y';
      this.env.options.bower = props.bower;
      this.env.options.email = props.email;
      this.env.options.sass = true;
      this.env.options.express = true;
      this.env.options.standardApp = true;
      this.env.options.router = true;

      var deps = {
        webpackdeps:[
          'babel-core',
          'babel-loader',
          'compression-webpack-plugin',
          'css-loader',
          'exports-loader',
          'expose-loader',
          'extract-text-webpack-plugin',
          'html-webpack-plugin',
          'imports-loader',
          'jshint-loader',
          'json-loader',
          'jsx-loader',
          'jsxhint-loader',
          'stats-webpack-plugin',
          'style-loader',
          'url-loader',
          'webpack'  
        ],
        sassdeps: (!this.env.options.sass ? null : [
          'sass-loader',
          'node-sass'
        ]),
        bowerdeps: (!this.env.options.bower ? null : ['bower']),
        expressdeps: (!this.env.options.express ? null : ['express','body-parser','compression']),
        appdeps: (!this.env.options.standardApp ? null : [
          'baconjs',
          'immutable',
          'moment',
          'object-assign',
          'react',
          'react-tools',
          'react-immutable-render-mixin',
          'superagent'
         ]),
        routerdeps: (!this.env.options.router ? null : [
          'react-async',
          'rc-css-transition-group',
          'react-proxy-loader',
          'react-router'
         ]),
        testdeps: (!this.env.options.test ? null : [
          'karma',
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasminewebpack',
          'karma-phantomjs-launcher',
          'karma-script-launcher',
          'karma-webpack'
         ]),
        devdeps : [
          'nodemon',
          'react-hot-loader',
          'webpack-dev-server'
         ]
       };
       
      var say = this.log;
      var keys = Object.keys(deps);
      var libCount = keys.reduce(function(c, n){return c + (!deps[n] ? 0 : deps[n].length)}, 0);
      var i = 0;
      keys.map(function(key){
        var packages = deps[key];
        if (!packages) {
          return '';
        }
        var includes = packages.map(function(name){
          if (props.skipLibUpdate === 'n'){
            return '      "'+name+'": "*",\n';
          }
          var version = exec("npm show "+name+" version").toString('utf8').replace(/\n/g,"");
          say('Checking '+name+' ('+(i++)+'/'+libCount+').');
          return '      "'+name+'": "^'+version+'",\n';
        }).join('');
        this.env.options[key] = includes;
      }.bind(this))
      
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var cp = function(src, dest) {
        this.template(
          this.templatePath(src),
          this.destinationPath(dest)
        );  
      }.bind(this)

      cp('_README.md','README.md');

      cp('_gitignore','.gitignore');
      cp('_sublime-settings','.sublime-settings');

      cp('_Dockerfile','Dockerfile');

      if (this.env.options.bower){
        cp('_bower.json','bower.json');
        cp('_bowerrc','.bowerrc-tbd'); // bower repo not setup yet
      }
    },

    projectfiles: function () {
      var cp = function(src, dest) {
        this.template(
          this.templatePath(src),
          this.destinationPath(dest)
        );  
      }.bind(this);

      var srcPath = path.join(this.templatePath(), '..', 'src');
      var serverPath = path.join(this.templatePath(), '..', 'server');
      wrench.copyDirSyncRecursive(srcPath, this.destinationPath('src'), {
        forceDelete: true
      });
      wrench.copyDirSyncRecursive(serverPath, this.destinationPath('server'), {
        forceDelete: true
      });
      
      cp('_package.json','package.json');
      
      cp('_webpack.config.js','webpack.config.js');
      cp('_webpack.dist.config.js','webpack.dist.config.js');
      cp('_webpack.hot.config.js','webpack.hot.config.js');
      cp('_webpack.render.config.js','webpack.render.config.js');

      cp('_server.js','server/server.js');
      cp('_index.html','src/assets/index.html');
    }
  },

  install: function () {
    this.installDependencies();
    this.log('Install Complete.\n');
    this.log('Now run `npm run go` to start the devlopment server.');
  }
});
