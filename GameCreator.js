var Phrase = require("./Phrase");

class GameCreator {
    constructor(phraseValidator, maskedPhraseCreator) {
        this.__phraseValidator = phraseValidator;
        this.__maskedPhraseCreator = maskedPhraseCreator;
    }

    create(gameId, challenger, phraseText) {
        return new Game(gameId, challenger, new Phrase(phraseText), this.__phraseValidator, this.__maskedPhraseCreator);
    }
};

module.exports = GameCreator;