class GameResponseProviderBase {
    get(game) {
        if (game.isJustStarted()) {
            return this._getJustStartedResponse(game);
        }
        else if (game.isLastTurnInvalid()) {
            return this._getInvalidTurnResponse(game);
        }

        return this._getValidTurnResponse(game);
    }

    _getJustStartedResponse(game) {
        throw new Error('Method not implemented.');
    }

    _getInvalidTurnResponse(game) {
        throw new Error('Method not implemented.');
    }

    _getValidTurnResponse(game) {
        throw new Error('Method not implemented.');
    }
};

module.exports = GameResponseProviderBase;
