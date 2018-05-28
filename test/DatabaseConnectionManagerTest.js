var _ = require("lodash");
var sinon = require("sinon");
var expect = require("chai").expect;

var DatabaseConnectionManager = require("DatabaseConnectionManager");

describe('DatabaseConnectionManager', function () {

    var sandbox, connectedMongoClient = {}, mongoClient = {};

    var config = { url: "http://example.com", "database": "example" };

    var createSut = function(...args) {
        return new DatabaseConnectionManager(...args);
    }

    var createValidSut = function() {
        return new DatabaseConnectionManager(mongoClient, config);
    }

    beforeEach(function() {
        sandbox = sinon.createSandbox();

        connectedMongoClient.db = sandbox.stub();
        connectedMongoClient.close = sandbox.spy();

        mongoClient.connect = sandbox.stub().returns(Promise.resolve(connectedMongoClient));
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe("#constructor", function() {
        it("should throw if mongoClient is null", function() {
            var mongoClient = null;

            expect(function() { createSut(mongoClient); })
            .to.throw("not an object");
        });

        it("should throw if mongoClient is object without connect method", function() {
            var mongoClient = { test: () => {}};

            expect(function() { createSut(mongoClient); })
            .to.throw("not a function");
        });

        it("should throw if mongoClient is object with connect property which is not a function", function() {
            var mongoClient = { connect: 5 };

            expect(function() { createSut(mongoClient); })
            .to.throw("not a function");
        });

        it("should not throw if valid properties are provided", function() {
            expect(function() { createValidSut(); })
            .to.not.throw();
        });
    });

    describe("#connectDatabase", function() {
        it("should call a mongoClient connect method", function() {
            sut = createValidSut();
            sut.connectDatabase();

            expect(mongoClient.connect)
            .to.be.calledOnce;
        });

        it("should call a mongoClient connect method with config.url", function() {
            sut = createValidSut();
            sut.connectDatabase();

            expect(mongoClient.connect)
            .to.be.calledWith(config.url);
        });

        it("should call a connectedMongoClient db method", function() {
            sut = createValidSut();
            
            return sut.connectDatabase()
            .then(function() {
                return expect(connectedMongoClient.db)
                .to.be.calledOnce;
            });
        });

        
        it("should call a connectedMongoClient db method with config.database", function() {
            sut = createValidSut();
            
            return sut.connectDatabase()
            .then(function() {
                return expect(connectedMongoClient.db)
                .to.be.calledWithExactly(config.database);
            });
        });

        it("should return result of connectedMongoClient db method call", function() {
            connectedMongoClient.db
            .returns(Promise.resolve("mongoClient.db result"));

            sut = createValidSut();

            return sut.connectDatabase()
            .then(function(result) {
                return expect(result)
                .to.be.equal("mongoClient.db result");
            });
        });

        it("should return rejected promise of mongoClient connect method call", function() {
            mongoClient.connect
            .returns(Promise.reject("mongoClient.connect error"));

            sut = createValidSut();

            return expect(sut.connectDatabase())
            .to.eventually.be.rejectedWith("mongoClient.connect error");
        });

        it("should return rejected promise of mongoClient db method call", function() {
            connectedMongoClient.db
            .returns(Promise.reject("mongoClient.db error"));

            sut = createValidSut();

            return expect(sut.connectDatabase())
            .to.eventually.be.rejectedWith("mongoClient.db error");
        });
    });

    describe("#close", function() {
        it("should call the close method of connected mongoClient", function() {
            sut = createValidSut();

            return sut.connectDatabase()
            .then(function() {
                sut.close();

                return expect(connectedMongoClient.close)
                .to.be.calledOnce;
            });
        });

        it("should return undefined promise if there is no connection", function() {
            sut = createValidSut();

            return expect(sut.close())
            .to.eventually.be.undefined;
        });
    });
});