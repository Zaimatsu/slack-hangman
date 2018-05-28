var _ = require("lodash");
var expect = require("chai").expect;
var sinon = require("sinon");

var Phrase = require("Phrase");

var sandbox;

var createSut = function(phrase) {
    return new Phrase(phrase);
};

describe("Phrase", function() {
    describe("#constructor", function() {
        it("should upper case user input", function() {
            var sut = createSut("upper case");

            expect(sut.get())
            .to.equals("UPPER CASE");
        });
    });

    describe("#isEqual", function() {
        it("should return true if phrases are equal", function() {
            var sut1 = createSut("eqUaL");

            expect(sut1.isEqual("EQUAL"))
            .to.equals(true);
        });
    });
});