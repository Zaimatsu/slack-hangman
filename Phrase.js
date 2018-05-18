var _ = require("lodash");

class Phrase {
    constructor(phrase) {
        this.__phrase = phrase.toUpperCase().trim().replace(/ +(?= )/g, '');
    }

    get() {
        return this.__phrase;
    }
    
    isEqual(value) {
        return _.isEqual(this.__phrase, value);
    }
};

module.exports = Phrase;
