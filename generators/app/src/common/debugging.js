if (__DEV__ && process.env.BROWSER_ENV) {
  window.request = request;
  window.React = React;
  window.ReactRouter = ReactRouter;

  if(process.env.BROWSER_ENV && !document.querySelector('head > script.hot')) {
    var script = document.createElement('script');
    script.className = 'hot';
    script.src = "http://localhost:8000/webpack-dev-server.js";
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
