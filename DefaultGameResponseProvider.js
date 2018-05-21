var _ = require("lodash");

var GameResponseProviderBase = require("./GameResponseProviderBase");
var SlackResponseBuilder = require("./SlackResponseBuilder");

class DefaultGameResponseProvider extends GameResponseProviderBase {
    _getJustStartedResponse(game) {
        var responseBuilder = new SlackResponseBuilder();

        responseBuilder.setText(`<@${game.getChallenger()}> is challanging you to a hangman game!\n${game.getMaskedPhrase()}`);
        responseBuilder.setResponseType("in_channel");

        return responseBuilder.build();
    }

    _getInvalidTurnResponse(game) {
        var responseBuilder = new SlackResponseBuilder();

        responseBuilder.setText(`Invalid input.`);
        return responseBuilder.build();
    }

    _getValidTurnResponse(game) {
        if (game.isGuessed()) {
            return this.__getGameIsGuessedResponse(game);
        }

        if (game.isLost()) {
            return this.__getGameIsLostResponse(game);
        }

        return this.__getStandardResponse(game);
    }

    __getGameIsGuessedResponse(game) {
        var responseBuilder = new SlackResponseBuilder();

        responseBuilder.setText(`Congratulations! Thats it!\n${game.getPhrase().get()}`);
        responseBuilder.setResponseType("in_channel");

        return responseBuilder.build();
    }

    __getGameIsLostResponse(game) {
        var responseBuilder = new SlackResponseBuilder();

        let responseText = "";
        responseText += `The end. You've not managed to guess correctly! `;
        responseText += `<@${game.getChallenger()}> has beaten you with:\n${game.getPhrase().get()}\n`;
        responseText += `Misses: ${game.getMisses().join(", ")}`;

        responseBuilder.setText(responseText);
        responseBuilder.addImageAttachment(`https://zaimatsu.tk/hangman_misses${game.getMaxMissCount()}.png`);
        
        return responseBuilder.build();
    }

    __getStandardResponse(game) {
        var responseBuilder = new SlackResponseBuilder();

        responseBuilder.setText(game.getMaskedPhrase());

        var attachmentText = `${game.getMissCount()} / ${game.getMaxMissCount()}\nMisses: ${game.getMisses().join(", ")}`;
        var thumbUrl = `https://zaimatsu.tk/hangman_misses${game.getMissCount()}.png`;
        responseBuilder.addThumbAttachment(thumbUrl, attachmentText);

        return responseBuilder.build();
    }
}

module.exports = DefaultGameResponseProvider;
