var MaskedPhrase = require("./MaskedPhrase");

class MaskedPhraseCreator {
    create(phrase) {
        return new MaskedPhrase(phrase);
    }
};

module.exports = GameCreator;