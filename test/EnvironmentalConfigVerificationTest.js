var expect = require("chai").expect;
var _ = require("lodash");

var EnvironmentalConfigVerification = require("EnvironmentalConfigVerification");

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

describe('EnvironmentalConfigVerification', function () {
    beforeEach(function () {
        initEnviromentalVariables(defaultEnviromentalVariablesConfig);
    });

    describe('#isValid()', function () {
        _.each(defaultEnviromentalVariablesConfig, function (value, key) {
            it(`should throw if ${key} enviromental variable is not set`, function () {
                initEnviromentalVariables(_.set(_.clone(defaultEnviromentalVariablesConfig), key, ""));

                expect(EnvironmentalConfigVerification.isValid).to.throw();
            });
        });

        it("should return true if all enviromental variables are set", function() {
            expect(EnvironmentalConfigVerification.isValid()).to.equal(true);
        })
    });
});