var Phrase = require("./Phrase.js");
var Game = require("./Game.js");

var _ = require("lodash");

class GameManager {
    constructor(gameResponseProvider, phraseValidator) {
        this.__games = {};
        this.__gameResponseProvider = gameResponseProvider;
        this.__phraseValidator = phraseValidator;

        this.play = this.play.bind(this);
    }

    play(channelId, user, userInput) {
        if (_.has(this.__games, channelId)) {
            this.__handleExistingGame(channelId, user, userInput);
        } else {
            this.__games[channelId] = this.__createNewGame(user, userInput);
        }

        return this.__gameResponseProvider.get(this.__games[channelId]);
    }

    __createNewGame(user, userInput) {
        return new Game(user, new Phrase(userInput), this.__phraseValidator);
    }

    __handleExistingGame(channelId, user, userInput) {
        let game = this.__games[channelId];

        if (game.isLost() || game.isGuessed() || game.isInvalid()) {
            this.__games[channelId] = this.__createNewGame(user, userInput);
        } else {
            this.__games[channelId].play(user, userInput);
        }
    }
};

module.exports = GameManager;