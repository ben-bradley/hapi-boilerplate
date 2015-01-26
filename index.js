var Hapi = require('hapi'),
  config = require('config'),
  Lout = require('lout'),
  glob = require('glob');

var server = new Hapi.Server();

server.connection({
  port: config.api_port,
  labels: ['api']
});

server.connection({
  port: config.ui_port,
  labels: ['ui']
});

server.app.config = config;

glob.sync('./plugins/*/index.js').forEach(function (file) {
  var plugin = require(file);
  server.register({
    register: plugin
  }, function (err) {
    if (err)
      throw new Error(err);
    console.log('Plugin loaded: ' + plugin.register.attributes.pkg.name);
  });
});

server.register({
  register: Lout
}, function (err) {
  if (err)
    throw new Error(err);
  console.log('Plugin loaded: Lout');
});

server.start(function (err) {
  if (err)
    throw new Error(err);
  console.log('Server started!');
  server.connections.forEach(function (cn) {
    console.log({
      labels: cn.settings.labels,
      uri: cn.info.uri
    });
  });
});
