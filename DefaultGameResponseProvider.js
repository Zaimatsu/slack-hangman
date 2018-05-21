var _ = require("lodash");
var GameResponseProviderBase = require("./GameResponseProviderBase.js");

class DefaultGameResponseProvider extends GameResponseProviderBase {
    _getJustStartedResponse(game) {
        return { text: `<@${game.getChallenger()}> is challanging you to a hangman game!\n${game.getMaskedPhrase()}` };
    }

    _getInvalidTurnResponse(game) {
        throw new Error('Method not implemented.');
    }

    _getValidTurnResponse(game) {
        if (game.isGuessed())
            return {
                text: `Congratulations! Thats it!\n${game.getPhrase().get()}`
            }

        if (game.isLost())
            return {
                text: `The end. You've not managed to guess correctly! <@${game.getChallenger()}> has beaten you with:\n${game.getPhrase().get()}\nMisses: ${game.getMisses().join(", ")}`,
                attachments: [{
                    text: "",
                    image_url: `https://slack-hangman-zaimatsu.c9users.io/hangman_misses${game.getMaxMissCount()}.png`
                }]
            };

        return {
            text: game.getMaskedPhrase(),
            attachments: [{
                text: `${game.getMissCount()} / ${game.getMaxMissCount()}\nMisses: ${game.getMisses().join(", ")}`,
                thumb_url: `https://slack-hangman-zaimatsu.c9users.io/hangman_misses${game.getMissCount()}.png`
            }]
        };
    }
}

module.exports = DefaultGameResponseProvider;
