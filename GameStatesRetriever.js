var _ = require("lodash");

var Game = require("Game");

class GameStatesRetriever {
    constructor(databaseClientProvider, gameCreator) {
        this.__databaseClientProvider = databaseClientProvider;
        this.__gameCreator = gameCreator;
    }

    get() {
        return this.__databaseClientProvider.get()
        .then( (databaseClient) => {
            return databaseClient.collection("games").find({ ongoing: true }).toArray();
        })
        .then ( (ongoingGames) => {
            var games = {};

            ongoingGames.forEach( (ongoingGame) => {
                var game = this.__gameCreator.create(ongoingGame.__id, ongoingGame.user, userInput);
                _.forEach(ongoingGame.turns, (turn) => {
                    if(!turn.isInvalid) {
                        game.play(turn.user, turn.input);
                    }
                });

                games[ongoingGame.channelId] = game;
            });

            return games;
        });
    }
};

module.exports = GameStatesRetriever;