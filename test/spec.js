var should = require('should'),
  request = require('supertest'),
  config = require('config');

var server = require('..');

var API = request('http://localhost:' + config.api_port),
  UI = request('http://localhost:' + config.ui_port);

describe('Your App', function () {

  describe('The API', function () {

    beforeEach(function(done) {
      server.start(done);
    });

    it('GET /loopback should return data', function (done) {
      API.get('/loopback')
        .expect(200)
        .expect(function (res) {
          var json = res.body;
          (json).should.be.an.Object;
          (json).should.have.properties(['headers', 'info', 'method', 'params', 'path', 'payload', 'query', 'ts']);
          (json.path).should.equal('/loopback');
          (json.method).should.equal('get');
        })
        .end(done);
    });

  }); // end REST API

});
