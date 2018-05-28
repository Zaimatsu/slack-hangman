var Phrase = require("./Phrase.js");
var MaskedPhrase = require("./MaskedPhrase.js");

var _ = require("lodash");

class Game {
    constructor(id, user, phrase, phraseValidator, maskedPhraseCreator) {
        this.__phrase = phrase;
        this.__maskedPhrase = maskedPhraseCreator.create(this.__phrase);
        this.__turns = 0;
        this.__isLastTurnInvalid = false;
        this.__challenger = user;
        this.__phraseValidator = phraseValidator;
        this.__maxMissCount = 8;
        this.__isInvalid = false;
        this.__id = id;

        if (!this.__validateUserInput(phrase)) {
            this.__isInvalid = true;
            this.__isLastTurnInvalid = true;
        }
    }

    play(user, userInput) {
        this.__turns += 1;
        this.__isLastTurnInvalid = false;

        if (!this.__validateUserInput(userInput)) {
            this.__isLastTurnInvalid = true;
            return;
        }

        this.__maskedPhrase.reveal(userInput);
    }

    isJustStarted() {
        return _.isEqual(this.__turns, 0);
    }

    /* istanbul ignore next */
    isLastTurnInvalid() {
        return this.__isLastTurnInvalid;
    }

    /* istanbul ignore next */
    getChallenger() {
        return this.__challenger;
    }

    /* istanbul ignore next */
    isGuessed() {
        return this.__maskedPhrase.isGuessed();
    }

    isLost() {
        return this.__maskedPhrase.getMissCount() >= this.__maxMissCount;
    }

    /* istanbul ignore next */
    isInvalid() {
        return this.__isInvalid;
    }

    /* istanbul ignore next */
    getMaskedPhrase() {
        return this.__maskedPhrase.get();
    }

    /* istanbul ignore next */
    getMissCount() {
        return this.__maskedPhrase.getMissCount();
    }

    /* istanbul ignore next */
    getPhrase() {
        return this.__phrase;
    }

    /* istanbul ignore next */
    getMisses() {
        return this.__maskedPhrase.getMisses();
    }

    /* istanbul ignore next */
    getMaxMissCount() {
        return this.__maxMissCount;
    }

    /* istanbul ignore next */
    getId() {
        return this.__id;
    }

    /* istanbul ignore next */
    __validateUserInput(userInput) {
        return this.__phraseValidator.validate(userInput);
    }
};

module.exports = Game;
