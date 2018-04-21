const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const MongoClient = require('mongodb').MongoClient;
const wait4MongoDB = require('../src/wait4mongodb');

chai.use(chaiAsPromised);

describe('wait4mongodb', function () {
  
  let sandbox;
  let MongoClientConnectStub;
  let callback;
  let mongoUrl;
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    callback = sandbox.spy();
    mongoUrl = 'mongodb://dummy:27017';
  });
  
  afterEach(function() {
    sandbox.restore();
  });
  
  describe('tryConnect() using callback', function () {
    it('should call to callback without errors and passing client if MongoDB is ready at first call', async function () {
      MongoClientConnectStub = sandbox
        .stub(MongoClient, 'connect')
        .resolves({ client: 'dummyClient' });
      await wait4MongoDB.tryConnect(mongoUrl, 3, 200, callback);
      expect(callback.calledOnce).to.be.true;
      expect(callback.args[0][0]).to.be.null;
      expect(callback.args[0][1]).to.deep.equal({client: 'dummyClient'});
      expect(MongoClientConnectStub.called).to.be.true;
      expect(MongoClientConnectStub.callCount).to.equal(1);
      expect(MongoClientConnectStub.args[0][0]).to.equal(mongoUrl);
    });
    
    it('should call to callback without errors and passing client if MongoDB is ready at second call', function (done) {
      MongoClientConnectStub = sandbox
        .stub(MongoClient, 'connect')
        .onCall(0)
        .rejects(new Error('MongoDB is down'))
        .onCall(1)
        .resolves({ client: 'dummyClient' });
      wait4MongoDB.tryConnect(mongoUrl, 3, 200, (err, client) => {
        expect(client).to.deep.equal({client: 'dummyClient'});
        expect(MongoClientConnectStub.callCount).to.equal(2);
        expect(MongoClientConnectStub.args[0][0]).to.equal(mongoUrl);
        done();
      });
    });
    
    it('should call to callback with an error if MongoDB is not ready and reaches timeout', function (done) {
      MongoClientConnectStub = sandbox
        .stub(MongoClient, 'connect')
        .rejects(new Error('MongoDB is down'));
      wait4MongoDB.tryConnect(mongoUrl, 3, 200, (err, client) => {
        expect(err.message).to.equal('MongoDB is down');
        expect(client).to.be.undefined;
        expect(MongoClientConnectStub.callCount).to.equal(3);
        expect(MongoClientConnectStub.args[0][0]).to.equal(mongoUrl);
        done();
      });

    });
  });
  
  describe('tryConnect() using Promises', function () {
    it('should reject if MongoDB is down and reaches timeout', function(done) {
      MongoClientConnectStub = sandbox
        .stub(MongoClient, 'connect')
        .rejects(new Error('MongoDB is down'));
      wait4MongoDB.tryConnect(mongoUrl, 3, 200).then(client => {
        // never
      }).catch(err => {
        expect(err.message).to.equal('MongoDB is down');
        expect(MongoClientConnectStub.callCount).to.equal(3);
        expect(MongoClientConnectStub.args[0][0]).to.equal(mongoUrl);
        done();
      });
    });
    
    it('should resolve if MongoDB is up at first call', function(done) {
      MongoClientConnectStub = sandbox
        .stub(MongoClient, 'connect')
        .resolves('Ready!');
      wait4MongoDB.tryConnect(mongoUrl, 3, 200).then(client => {
        expect(client).to.equal('Ready!');
        expect(MongoClientConnectStub.callCount).to.equal(1);
        expect(MongoClientConnectStub.args[0][0]).to.equal(mongoUrl);
        done();
      }).catch(err => {
        // never
      });
    });
    
    it('should resolve if MongoDB is up at second call', function(done) {
      MongoClientConnectStub = sandbox
        .stub(MongoClient, 'connect')
        .onCall(0)
        .rejects(new Error('MongoDB is down'))
        .onCall(1)
        .resolves('Ready!');
      wait4MongoDB.tryConnect(mongoUrl, 3, 200).then(client => {
        expect(client).to.equal('Ready!');
        expect(MongoClientConnectStub.callCount).to.equal(2);
        expect(MongoClientConnectStub.args[0][0]).to.equal(mongoUrl);
        done();
      }).catch(err => {
        // never
      });
    });
  });
});