
module.exports = {
  devtool: "cheap-module-eval-source-map", // http://webpack.github.io/docs/configuration.html#devtool
  proxy: <% if (env.options.proxy) { %>{'*': {target: 'http://localhost:8080'}} <% } else { %> null <% } %>, // http://webpack.github.io/docs/webpack-dev-server.html#api
  devServer: true, 
  /*https: true,*/
  hotComponents: true, 
  bower: true,
  debug: true
};
