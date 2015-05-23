
module.exports = function(route, props){
  
  require('../static/app.js'); // webpack exposes renderRoute to global
  
  var path = require('path'),
  regexMount = /<div id="app">(.|\n)*?<\/div>/,
    index = require('fs')
      .readFileSync(path.join(__dirname, '..', 'static', 'index.html'))
      .toString();

  var content = renderRoute(route, props);
  var page = index.replace(regexMount, content);
  
  return page;
};
