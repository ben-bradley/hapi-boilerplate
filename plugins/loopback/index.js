var _ = require('lodash'),
  Handlebars = require('handlebars');

var properties = ['method', 'path', 'info', 'headers', 'payload', 'query'];

module.exports.register = function(server, options, next) {

  // config can be accessed like this
//  console.log(server.app.config.loopback.foo);

  var ui = server.select('ui');

  ui.views({
    engines: {
      html: Handlebars
    },
    path: __dirname+ '/views'
  });

  ui.route({
    method: 'get',
    path: '/',
    config: {
      description: 'Serve the loopback index.html',
      handler: function(request, reply) {
        reply.view('index', {
          title: 'Loopback UI',
          someContent: 'This is templated content'
        });
      }
    }
  })

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
