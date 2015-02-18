var Hapi = require('hapi'), // for reasons
  config = require('config'), // for app config
  glob = require('glob'), // for dynamically reading plugins
  Lout = require('lout'), // for API documentation
  Good = require('good'), // for logging
  GoodFile = require('good-file');

var server = new Hapi.Server();

// init the API
server.connection({
  port: config.api_port,
  labels: ['api']
});

// init the UI
server.connection({
  port: config.ui_port,
  labels: ['ui']
});

// store the config for reference
server.app.config = config;

var reporters = [];

// register each plugin and configure a Good reporter for each
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
        __dirname + '/logs/plugins/' + name + '.log', {
          log: ['plugins', name]
        }
      ]
    });
    if (!config.test)
      console.log('Plugin loaded: ' + name);
  });
});

// register Lout for the /docs routes
server.register({
  register: Lout
}, function (err) {
  if (err)
    throw new Error(err);
  if (!config.test)
    console.log('Plugin loaded: Lout');
});

// register Good for logging
server.register({
  register: Good,
  options: {
    opsInterval: 1000,
    reporters: reporters
  }
}, function (err) {
  if (err)
    throw new Error(err);
  if (!config.test)
    console.log('Plugin loaded: Good');
});

// In every environment except test, fire up the server
if (!config.test)
  server.start(function (err) { // oink
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

// Export the server for testing
module.exports = server;
