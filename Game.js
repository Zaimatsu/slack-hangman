var Phrase = require("./Phrase.js");
var MaskedPhrase = require("./MaskedPhrase.js");

var _ = require("lodash");

class Game {
    constructor(user, phrase, phraseValidator) {
        this.__phrase = phrase;
        this.__maskedPhrase = new MaskedPhrase(this.__phrase);
        this.__turns = 0;
        this.__isLastTurnInvalid = false;
        this.__challenger = user;
        this.__phraseValidator = phraseValidator;
        this.__maxMissCount = 8;
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

    isLastTurnInvalid() {
        return this.__isLastTurnInvalid;
    }

    getChallenger() {
        return this.__challenger;
    }
    
    isGuessed() {
        return this.__maskedPhrase.isGuessed();
    }
    
    isLost() {
        return this.__maskedPhrase.getMissCount() >= this.__maxMissCount;
    }
    
    getMaskedPhrase() {
        return this.__maskedPhrase.get();
    }
    
    getMissCount() {
        return this.__maskedPhrase.getMissCount();
    }
    
    getPhrase() {
        return this.__phrase;
    }
    
    getMisses() {
        return this.__maskedPhrase.getMisses();
    }
    
    getMaxMissCount() {
        return this.__maxMissCount;
    }

    __validateUserInput(userInput) {
        return this.__phraseValidator.validate(userInput);
    }
};

module.exports = Game;
