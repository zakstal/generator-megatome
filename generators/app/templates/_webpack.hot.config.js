
module.exports = {
  devtool: "cheap-module-eval-source-map", // http://webpack.github.io/docs/configuration.html#devtool
  proxy: {'*': {target: 'http://localhost:8080'}}, // http://webpack.github.io/docs/webpack-dev-server.html#api
  devServer: true, 
  hotComponents: true, 
  commonsChunk: false, 
  bower: true,
  debug: true,
  longTermCaching: false,
  separateStylesheet: false,
  minimize: false,
  gzip: false,
  stats: false,
};
