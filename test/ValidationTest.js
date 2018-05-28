var expect = require("chai").expect;

var validation = require("Validation");

describe("Validation", function() {
    it("#isObject", function() {
        expect(() => validation.isObject("testObject", { test: 6 }))
        .to.not.throw();

        expect(() => validation.isObject("notAnObject", ""))
        .to.throw("is not an object");
    });

    it("#isFunction", function() {
        expect(() => validation.isFunction("testFunction", () => {}))
        .to.not.throw();

        expect(() => validation.isFunction("notAFunction", ""))
        .to.throw("is not a function");
    });

    it("#isNotEmpty", function() {
        expect(() => validation.isNotEmpty("testArray", [1]))
        .to.not.throw();

        expect(() => validation.isNotEmpty("testString", "z"))
        .to.not.throw();

        expect(() => validation.isNotEmpty("emptyObject", {}))
        .to.throw("is empty");

        expect(() => validation.isNotEmpty("emptyArray", []))
        .to.throw("is empty");

        expect(() => validation.isNotEmpty("emptyString", ""))
        .to.throw("is empty");
    });

    it("#isArray", function() {
        expect(() => validation.isArray("testArray", []))
        .to.not.throw();

        expect(() => validation.isArray("notAnArray", ""))
        .to.throw("is not an array");
    });

    it("#isObjectWithMethods", function() {
        var objectWithMethods = {
            testMethod1: () => {},
            testMethod2: () => {}
        }

        expect(() => validation.isObjectWithMethods("testObject", objectWithMethods, ["testMethod1", "testMethod2"]))
        .to.not.throw();

        var invalidObjectWithMethods = {
            testMethod1: () => {},
            testMethod2: "notAMethod"
        }

        expect(() => validation.isObjectWithMethods("testObject", invalidObjectWithMethods, ["testMethod1", "testMethod2"]))
        .to.throw("\'testMethod2\' is not a function.");

        invalidObjectWithMethods = {
            testMethod1: () => {}
        }

        expect(() => validation.isObjectWithMethods("testObject", invalidObjectWithMethods, ["testMethod1", "testMethod2"]))
        .to.throw("\'testMethod2\' is not a function.");

        expect(() => validation.isObjectWithMethods("testObject", "notAnObject", ["testMethod1", "testMethod2"]))
        .to.throw("\'testObject\' is not an object.");

        expect(() => validation.isObjectWithMethods("testObject", objectWithMethods, []))
        .to.throw("is empty.");

        expect(() => validation.isObjectWithMethods("testObject", objectWithMethods, "notAnArray"))
        .to.throw("is not an array.");
    });

    it("#isObjectWithParameters", function() {
        var objectWithParameters = {
            testParameter1: "testParameter1",
            testParameter2: { name: "testParameter2" }
        }

        expect(() => validation.isObjectWithParameters("objectWithParameters", objectWithParameters, ["testParameter1", "testParameter2"]))
        .to.not.throw();

        var invalidObjectWithParameters = {
            testParameter1: "testParameter1",
            testParameter2: null
        }

        expect(() => validation.isObjectWithParameters("invalidObjectWithParameters", invalidObjectWithParameters, ["testParameter1", "testParameter2"]))
        .to.throw("\'testParameter2\' is empty.");

        invalidObjectWithParameters = {
            testParameter1: "testParameter1"
        }

        expect(() => validation.isObjectWithParameters("invalidObjectWithParameters", invalidObjectWithParameters, ["testParameter1", "testParameter2"]))
        .to.throw("\'testParameter2\' is empty.");

        expect(() => validation.isObjectWithParameters("invalidObjectWithParameters2", "notAnObject", ["testParameter1", "testParameter2"]))
        .to.throw("\'invalidObjectWithParameters2\' is not an object.");

        expect(() => validation.isObjectWithParameters("objectWithParameters", objectWithParameters, []))
        .to.throw("is empty.");

        expect(() => validation.isObjectWithParameters("objectWithParameters", objectWithParameters, "notAnArray"))
        .to.throw("is not an array.");
    });
});