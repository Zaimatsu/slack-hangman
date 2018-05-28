var _ = require("lodash");
var expect = require("chai").expect;
var sinon = require("sinon");

var Game = require("Game");

var sandbox, phraseValidator = {}, phrase = {}, maskedPhraseCreator = {}, maskedPhrase;

var createSut = function() {
    return new Game("gameId", "challenger", phrase, phraseValidator, maskedPhraseCreator);
};

beforeEach(function() {
    sandbox = sinon.createSandbox();

    phraseValidator.validate = sandbox.stub().returns(true);
    maskedPhrase = {
        reveal: () => {},
        getMissCount: sandbox.stub().returns(0)
    };
    maskedPhraseCreator.create = sandbox.stub().returns(maskedPhrase);
});

afterEach(function() {
    sandbox.restore();
});

describe("Game", function() {
    describe("#constructor", function() {
        it("should validate user input", function() {
            var sut = createSut();

            expect(sut.isInvalid())
            .to.equals(false);

            phraseValidator.validate.returns(false);

            sut = createSut();

            expect(sut.isInvalid())
            .to.equals(true);
        });
    });

    describe("#isJustStarted", function() {
        it("should return true if the game was just created", function() {
            var sut = createSut();

            expect(sut.isJustStarted())
            .to.equals(true);
        });

        it("should return false if the game was played at least one", function() {
            var sut = createSut();

            sut.play();

            expect(sut.isJustStarted())
            .to.equals(false);
        });
    });

    describe("#isLost", function() {
        it("should return true if miss count is greater then valid max", function() {
            var sut = createSut();

            maskedPhrase.getMissCount.returns(8);

            expect(sut.isLost())
            .to.equals(true);
        });
    });

    describe("#play", function() {
        it("should mark last turn as invalid if play phrase wasn't valid", function() {
            var sut = createSut();

            phraseValidator.validate.returns(false);

            sut.play();

            expect(sut.isLastTurnInvalid())
            .to.equals(true);
        });
    });
});