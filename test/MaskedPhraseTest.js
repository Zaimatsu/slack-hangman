var _ = require("lodash");
var expect = require("chai").expect;
var sinon = require("sinon");

var MaskedPhrase = require("MaskedPhrase");

var sandbox, phrase = {};

var createSut = function() {
    return new MaskedPhrase(phrase);
};

beforeEach(function() {
    sandbox = sinon.createSandbox();

    phrase.get = sandbox.stub().returns("VALID PHRASE");
    phrase.isEqual = sandbox.stub().returns(false);
});

afterEach(function() {
    sandbox.restore();
});

describe("MaskedPhrase", function() {
    describe("#get", function() {
        it("should return masked phrase", function() {
            phrase.get.returns("VALID PHRASE");
            var sut = createSut();

            expect(sut.get())
            .to.equals(" .  .  .  .  .  |  .  .  .  .  .  . ");
        });
    });

    describe("#reveal", function() {
        it("should revel one letter if the phrase includes it", function() {
            phrase.get.returns("VALID PHRASE");
            var sut = createSut();

            sut.reveal("A");

            expect(sut.get())
            .to.equals(" . A .  .  .  |  .  .  . A .  . ");
        });

        it("should revel all letters if user inputs is equal to phrase", function() {
            phrase.get.returns("VALID PHRASE");
            phrase.isEqual.returns(true);
            var sut = createSut();

            sut.reveal("VALID PHRASE");

            expect(sut.get())
            .to.equals("VALID | PHRASE");
        });
    });

    describe("#revealAll", function() {
        it("should reveal the phrase", function() {
            phrase.get.returns("VALID PHRASE");
            var sut = createSut();

            sut.revealAll();

            expect(sut.get())
            .to.equals("VALID | PHRASE");
        });

        it("should mark the phrase as guessed", function() {
            phrase.get.returns("VALID PHRASE");
            var sut = createSut();

            sut.revealAll();

            expect(sut.isGuessed())
            .to.equals(true);
        });
    });

    describe("#isGuessed", function() {
        it("should return false if there is at least one letter that is not guessed", function() {
            phrase.get.returns("VALID PHRASE");
            var sut = createSut();

            sut.reveal("V");
            sut.reveal("A");
            sut.reveal("L");
            sut.reveal("I");
            sut.reveal("D");
            sut.reveal("P");
            sut.reveal("H");
            sut.reveal("R");
            sut.reveal("S");

            expect(sut.isGuessed())
            .to.equals(false);
        });
    });

    describe("#getMissCount", function() {
        it("should return count of missed guesses", function() {
            phrase.get.returns("VALID PHRASE");
            var sut = createSut();

            sut.reveal("Q");

            expect(sut.getMissCount())
            .to.equals(1);

            sut.reveal("A");

            expect(sut.getMissCount())
            .to.equals(1);

            sut.reveal("W");

            expect(sut.getMissCount())
            .to.equals(2);
        });
    });

    describe("#getMisses", function() {
        it("should return collection of missed guesses", function() {
            phrase.get.returns("VALID PHRASE");
            var sut = createSut();

            sut.reveal("Q");

            expect(sut.getMisses())
            .to.deep.equals(["Q"]);

            sut.reveal("A");

            expect(sut.getMisses())
            .to.deep.equals(["Q"]);

            sut.reveal("W");

            expect(sut.getMisses())
            .to.deep.equals(["Q", "W"]);
        });
    });
});