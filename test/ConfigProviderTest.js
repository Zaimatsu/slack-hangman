var expect = require("chai").expect;
var _ = require("lodash");
var path = require("path");

var ConfigProvider = require("ConfigProvider");

var testConfigFilePath = path.join("test", "configForTest.json");
var invalidTestConfigFilePath = path.join("test", "invalidConfigForTest.json");

var configFileContents = {
    "testSection": {
        "testVar": "test1",
        "testBool": true
    }
}

var createSut = function() {
    return new ConfigProvider(testConfigFilePath);
}

describe("ConfigProvider", function() {
    describe("#constructor", function() {
        it("should throw if the config file doesn't exist", function() {
            expect(() => { new ConfigProvider("nosuchtest.json") })
            .to.throw("ENOENT");
        });

        it("should throw if the config file isn't json", function() {
            expect(() => { new ConfigProvider(invalidTestConfigFilePath) })
            .to.throw("Unexpected token");
        });
    });

    describe("#get", function() {
        it("should provide whole config json if there is no argument", function() {
            var sut = createSut();

            expect(sut.get())
            .to.be.deep.equal(configFileContents);
        });

        it("should return section of config if the path for this section is given", function() {
            var sut = createSut();

            expect(sut.get("testSection"))
            .to.be.deep.equal(configFileContents.testSection);
        });

        it("should throw if the path to config section doesn't point to existing section", function() {
            var sut = createSut();

            expect(() => sut.get("notExistingSection"))
            .to.throw("No such section in config file: 'notExistingSection'");
        });
    });
});