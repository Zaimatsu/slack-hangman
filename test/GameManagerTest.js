var _ = require("lodash");
var expect = require("chai").expect;
var sinon = require("sinon");

var GameManager = require("GameManager");

var sandbox, gameResponseProvider = {}, databaseClientProvider = {}, gameCreator = {}, game1 = {}, gameStatesRetriever = {};

var createSut = function() {
    return new GameManager(gameResponseProvider, databaseClientProvider, gameCreator, gameStatesRetriever);
}

beforeEach(function() {
    sandbox = sinon.createSandbox();
    
    databaseClientCollection = {
        insertOne: sandbox.stub().returns({
            insertedId: "newGameId"
        }),
        findOneAndUpdate: sandbox.spy()
    };
    
    databaseClient = {
        collection: sandbox.stub()
    };
    databaseClient.collection.withArgs("games").returns(databaseClientCollection);
    databaseClientProvider.get = sandbox.stub().returns(Promise.resolve(databaseClient));

    game1 = {
        __id: "newGameId",
        getId: () => this.__id,
        isGuessed: sandbox.stub().returns(false),
        isLost: sandbox.stub().returns(false),
        isInvalid: sandbox.stub().returns(false),
        isLastTurnInvalid: sandbox.stub().returns(false),
        play: sandbox.stub()
    }

    gameCreator.create = sandbox.stub().returns(game1);

    gameStatesRetriever.get = sandbox.stub().returns(Promise.resolve({}));
});

afterEach(function() {
    sandbox.restore();
});

describe("GameManager", function() {
    describe("#play", function() {
        it("should return promise", function() {
            var sut = createSut();

            return expect(sut.play("channelId", "testUser", "Test user input"))
            .to.be.fulfilled;
        });

        it("should create new game if game on given channel wasn't started", function() {
            var sut = createSut();

            return sut.play("channelId", "testUser", "Test user input")
            .then(() => {
                return expect(gameCreator.create)
                .to.be.called;
            });
        });

        it("should play existing game if game on given channel was started", function() {
            var sut = createSut();

            return sut.play("channelId", "testUser1", "Test user input")
            .then( () => {
                return sut.play("channelId", "testUser2", "A")
            })
            .then(() => {
                expect(gameCreator.create)
                .to.be.calledOnce;

                return expect(game1.play)
                .to.be.calledOnce;
            });
        });

        it("should create new game if game was finished", function() {
            var sut = createSut();

            return sut.play("channelId", "testUser1", "Test user input")
            .then( () => {
                return sut.play("channelId", "testUser2", "A");
            })
            .then( () => {
                game1.isLost.returns(true);
                return sut.play("channelId", "testUser2", "B");
            })
            .then(() => {
                expect(gameCreator.create)
                .to.be.calledTwice;

                return expect(game1.play)
                .to.be.calledOnce;
            });
        });
    });
});
