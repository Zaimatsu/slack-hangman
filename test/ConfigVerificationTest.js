var expect = require("chai").expect;
var _ = require("lodash");

var ConfigVerification = require("ConfigVerification");

var defaultEnviromentalVariablesConfig = {
    VERIFICATION_TOKEN: "verificationToken",
    CLIENT_ID: "clientId",
    CLIENT_SECRET: "clientSecret",
    SOCKET_TOKEN: "socketToken"
}

var initEnviromentalVariables = function (enviromentalVariablesConfig) {
    _.each(enviromentalVariablesConfig, (value, key) => {
        process.env[key] = value;
    });
}

describe('ConfigVerification', function () {
    beforeEach(function () {
        initEnviromentalVariables(defaultEnviromentalVariablesConfig);
    });

    describe('#isValid()', function () {
        _.each(defaultEnviromentalVariablesConfig, function (value, key) {
            it(`should throw if ${key} enviromental variable is not set`, function () {
                initEnviromentalVariables(_.set(_.clone(defaultEnviromentalVariablesConfig), key, ""));

                expect(ConfigVerification.isValid).to.throw();
            });
        });

        it("should return true if all enviromental variables are set", function() {
            expect(ConfigVerification.isValid()).to.equal(true);
        })
    });
});