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

    this.argument('componentname', { type: String, required: false });
    
    this.componentname = this.componentname || path.basename(process.cwd());
    this.componentname = _.camelCase(this.componentname);
    this.ComponentName = this.componentname.charAt(0).toUpperCase() + this.componentname.slice(1);
    this.config.set('componentname', this.componentname);
    
    var prompts = [{
      type    : 'input',
      name    : 'email',
      message : 'What\'s your Github username?',
      default : exec("git config user.email").toString('utf8').replace("\n","") || null,
      store   : true
    }, {
      type: 'input',
      name: 'aws',
      message: 'Will you need to run this on S3 as well?',
      choices: ['y','N'],
      default: 'N'
    }, {
      type: 'input',
      name: 'bower',
      message: 'Where is the address of your private bower repo (It must end in :5678)?'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.env.options.aws = props.aws === 'N';
      this.env.options.bower = props.bower;
      this.env.options.email = props.email;
      
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
    },

    projectfiles: function () {
      var cp = function(src, dest) {
        this.template(
          this.templatePath(src),
          this.destinationPath(dest)
        );  
      }.bind(this);
  
      if (this.env.aws) {
        cp('_docker-compose-s3.yml','docker-compose.yml');
        cp('_Dockerfile.S3','Dockerfile.S3');
        cp('_s3.env','s3.env');
      } else {
        cp('_docker-compose.yml','docker-compose.yml');
      }

      cp('_gitignore','.gitignore');
      cp('_README.md', 'README.md')
    }
  },

  install: function () {
    this.log('Install Complete.\n');
    this.log('Make sure docker `brew update && brew install docker`');
    this.log('as well as docker-compose `brew update && brew install docker-compose');

    if (this.env.aws) {
      this.log('Building the custom S3 docker image.');
      exec("docker build -f _Dockerfile.S3 -t S3 .");
    } 
    
    this.log('Bring up your bower repo and git server using `docker-compose -p bower up`');
  }
});
