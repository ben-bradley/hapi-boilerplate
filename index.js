var Hapi = require('hapi'),
  config = require('config'),
  Lout = require('lout'),
  glob = require('glob'),
  Good = require('good'),
  GoodFile = require('good-file');

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

var reporters = [];

glob.sync('./plugins/*/index.js').forEach(function (file) {
  var plugin = require(file);
  server.register({
    register: plugin
  }, function (err) {
    if (err)
      throw new Error(err);
    var name = plugin.register.attributes.pkg.name;
    reporters.push({
      reporter: GoodFile,
      args: [
        __dirname + '/logs/plugins/' + name +'.log',
        { log: ['plugins', name] }
      ]
    });
    console.log('Plugin loaded: ' + name);
  });
});

server.register({
  register: Lout
}, function (err) {
  if (err)
    throw new Error(err);
  console.log('Plugin loaded: Lout');
});

server.register({
  register: Good,
  options: {
    opsInterval: 1000,
    reporters: reporters
  }
}, function (err) {
  if (err)
    throw new Error(err);
  console.log('Plugin loaded: Good');
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
