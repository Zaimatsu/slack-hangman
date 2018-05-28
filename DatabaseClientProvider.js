class DatabaseClientProvider {
    constructor(databaseConnectionManager) {
        this.__databaseClientPromise = databaseConnectionManager.connectDatabase();
    }

    get() {
        return this.__databaseClientPromise;
    }
};

module.exports = GameCreator;