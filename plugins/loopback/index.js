var _ = require('lodash'),
  Handlebars = require('handlebars');

var PATHS = {
  dist: __dirname + '/dist'
}

var properties = ['method', 'path', 'info', 'headers', 'payload', 'query'];

module.exports.register = function(server, options, next) {

  var ui = server.select('ui');

  ui.views({
    engines: {
      html: Handlebars
    },
    path: PATHS.dist,
    isCached: !server.app.config.development
  });

  ui.route({
    method: 'get',
    path: '/', // ends up being "/loopback"
    config: {
      description: 'Serve the loopback index.html',
      handler: function(request, reply) {
        reply.view('index', {
          title: 'Loopback UI',
          someContent: 'This is templated content',
          appFile: (server.app.config.development) ? 'app.js' : 'app.min.js'
        });
      }
    }
  });

  ui.route({
    method: 'get',
    path: '/{p*}',
    config: {
      description: 'Path to serve the loopback assets',
      handler: {
        directory: {
          path: PATHS.dist
        }
      }
    }
  });

  // select the API server
  var api = server.select('api');

  // Add a route to the API
  api.route({
    method: '*', // all methods
    path: '/{p*}', // all routes beginning with "/loopback"
    config: {

      // this is the fn that finally deals with the request
      handler: function (request, reply) {
        var response = {
          ts: new Date(),
          params: (request.params.p) ? request.params.p.split('/') : []
        };

        // this is how you can log things
        server.log('loopback', 'message here')

        reply(_.assign(response, _.pick(request, properties)));
      },

      // This appears in the "/docs" route
      description: 'Returns details about the request.'
    }
  });

  next();
}

module.exports.register.attributes = {
  pkg: require('./package.json')
}
