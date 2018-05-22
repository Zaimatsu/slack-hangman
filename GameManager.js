var Phrase = require("./Phrase.js");
var Game = require("./Game.js");

var _ = require("lodash");

class GameManager {
    constructor(gameResponseProvider, phraseValidator, dbClientPromise) {
        this.__games = {};
        this.__gameResponseProvider = gameResponseProvider;
        this.__phraseValidator = phraseValidator;
        this.__dbClientPromise = dbClientPromise;

        this.play = this.play.bind(this);
    }

    play(channelId, user, userInput) {
        if (_.has(this.__games, channelId)) {
            this.__handleExistingGame(channelId, user, userInput);
        } else {
            this.__games[channelId] = this.__createNewGame(user, userInput, channelId);
        }

        this.__updateGameInDatabase(this.__games[channelId], channelId, user, userInput);

        return this.__gameResponseProvider.get(this.__games[channelId]);
    }

    __createNewGame(user, userInput, channelId) {
        return this.__addNewGameToDatabase(user, userInput, channelId)
        .then((result) => {
            return new Game(result.insertedId, user, new Phrase(userInput), this.__phraseValidator);
        });
    }

    __addNewGameToDatabase(user, userInput, channelId) {
        return this.__dbClientPromise.then((dbClient) => {
            dbClient.collection("games").insertOne(
                {
                    phrase: userInput,
                    channelId: channelId,
                    challenger: user,
                    ongoing: true,
                    creationTime: Date.now(),
                    turns: []
                }
            );
        });
    }

    __updateGameInDatabase(gamePromise, channelId, user, userInput) {
        Promise.all([this.__dbClientPromise, gamePromise])
        .then(([dbClient, game]) => {
            dbClient.collection("games").findOneAndUpdate({ _id: game.getId() }, {
                $set: {
                    ongoing: !(game.isGuessed() || game.isLost() || game.isInvalid())
                },
                $push: {
                    turns: {
                        time: Date.now(),
                        user: user,
                        input: userInput,
                        isInvalid: game.isLastTurnInvalid()
                    }
                }
            });
        });
    }

    __handleExistingGame(channelId, user, userInput) {
        this.__games[channelId]
        .then((game) => {
            if (game.isLost() || game.isGuessed() || game.isInvalid()) {
                this.__games[channelId] = this.__createNewGame(user, userInput, channelId);
            } else {
                this.__games[channelId].play(user, userInput);
            }
        });
    }
};

module.exports = GameManager;