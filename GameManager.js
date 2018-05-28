var Game = require("./Game");

var _ = require("lodash");

class GameManager {
    constructor(gameResponseProvider, databaseClientProvider, gameCreator) {
        this.__games = {};
        this.__gameResponseProvider = gameResponseProvider;

        this.__databaseClientProvider = databaseClientProvider;
        this.__gameCreator = gameCreator;

        this.play = this.play.bind(this);

        // TODO load ongoing games from database and initialize games collection
    }

    play(channelId, user, userInput) {
        return this.__prepareGame(channelId, user, userInput)
        .then((game) => {
            this.__updateGameInDatabase(game, channelId, user, userInput);

            return game;
        })
        .then(this.__gameResponseProvider.get);
    }

    __prepareGame(channelId, user, userInput) {
        if (_.has(this.__games, channelId)) {
            return this.__handleExistingGame(channelId, user, userInput);
        } else {
            return this.__createNewGame(channelId, user, userInput);
        }
    }

    __createNewGame(channelId, user, userInput) {
        return this.__registerGameInDatabase(user, userInput, channelId)
        .then( (result) => {
            var newGame = this.__gameCreator.create(result.insertedId, user, userInput);
            this.__games[channelId] = newGame;

            return newGame;
        });
    }

    __registerGameInDatabase(user, userInput, channelId) {
        return this.__databaseClientProvider.get()
        .then( (databaseClient) => {
            return databaseClient.collection("games").insertOne(
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

    __updateGameInDatabase(game, channelId, user, userInput) {
        return Promise.all([this.__databaseClientProvider.get(), game])
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
        var game = this.__games[channelId];
        
        if (game.isLost() || game.isGuessed() || game.isInvalid()) {
            return this.__createNewGame(user, userInput, channelId);
        } else {
            game.play(user, userInput);

            return Promise.resolve(game);
        }
    }
};

module.exports = GameManager;