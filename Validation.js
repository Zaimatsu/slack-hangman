var _ = require("lodash");

class Validation {
    /* istanbul ignore next */
    constructor() {
        this.isFunction = this.isFunction.bind(this);
        this.isNotEmpty = this.isNotEmpty.bind(this);
        this.isObject = this.isObject.bind(this);
        this.isObjectWithMethods = this.isObjectWithMethods.bind(this);
        this.isObjectWithParameters = this.isObjectWithParameters.bind(this);
    }

    static isObject(objectName, object) {
        if(!_.isObject(object)) {
            throw new Error(`'${objectName}' is not an object.`);
        }
    }

    static isFunction(functionName, func) {
        if(!_.isFunction(func)) {
            throw new Error(`'${functionName}' is not a function.`);
        }
    }

    static isNotEmpty(objectName, object) {
        if(_.isEmpty(object)) {
            throw new Error(`'${objectName}' is empty.`);
        }
    }

    static isArray(arrayName, array) {
        if(!_.isArray(array)) {
            throw new Error(`'${arrayName}' is not an array.`);
        }
    }

    static isObjectWithMethods(objectName, object, methodNames) {
        this.isObject(objectName, object);
        this.isArray("methodNames", methodNames);
        this.isNotEmpty("methodNames", methodNames);

        _.each(methodNames, (methodName) => {
            this.isFunction(methodName, object[methodName]);
        });
    }

    static isObjectWithParameters(objectName, object, parameterNames) {
        this.isObject(objectName, object);
        this.isArray("parameterNames", parameterNames);
        this.isNotEmpty("parameterNames", parameterNames);

        _.each(parameterNames, (parameterName) => {
            this.isNotEmpty(parameterName, object[parameterName]);
        });
    }
}

module.exports = Validation;