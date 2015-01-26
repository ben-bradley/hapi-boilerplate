var _ = require('lodash');

var properties = ['method', 'path', 'info', 'headers', 'payload', 'query'];

module.exports.register = function(server, options, next) {

  var api = server.select('api');

  api.route({
    method: '*',
    path: '/loopback/{p*}',
    config: {
      handler: function (request, reply) {
        var response = {
          ts: new Date(),
          params: (request.params.p) ? request.params.p.split('/') : []
        };
        reply(_.assign(response, _.pick(request, properties)));
      },
      description: 'Returns details about the request.'
    }
  });

  next();
}

module.exports.register.attributes = {
  pkg: require('./package.json')
}
