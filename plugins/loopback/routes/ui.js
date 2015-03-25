var Handlebars = require('handlebars');

var PATHS = {
  dist: __dirname + '/../ui/dist'
}

module.exports = function(server, options) {
  var ui = server.select('ui'),
    api = server.select('api');

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
          appFile: (server.app.config.development) ? 'app.js' : 'app.min.js',
          api: api.info.uri
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
}
