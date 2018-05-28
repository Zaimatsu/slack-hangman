var _ = require("lodash");

var validation = require("Validation");

class DatabaseConnectionManager {
    constructor(mongoClient, config) {
        validation.isObjectWithMethods("mongoClient", mongoClient, ["connect"]);
        validation.isObjectWithParameters("config", config, ["url", "database"]);

        this.__mongoClient = mongoClient;
        this.__config = config;
        this.__connectedMongoClient = null;

        this.__onConnectionError = this.__onConnectionError.bind(this);
        this.__onConnection = this.__onConnection.bind(this);
    }

    connectDatabase() {
        return this.__mongoClient.connect(this.__config.url)
        .then(this.__onConnection)
        .catch(this.__onConnectionError);
    }

    __onConnection(connectedMongoClient) {
        this.__connectedMongoClient = connectedMongoClient;

        return this.__connectedMongoClient.db(this.__config.database)
    }

    __onConnectionError(error) {
        this.__connectedMongoClient = null;
        console.error(`Failed to connect to mongoDb at ${this.__config.url} with ${this.__config.database}`);
        throw error;
    }

    close() {
        if(!_.isNull(this.__connectedMongoClient)) {
            return this.__connectedMongoClient.close();
        } else {
            console.warn("Closing connection failed. MongoClient not connected.");
            return Promise.resolve();
        }
    }
}

module.exports = DatabaseConnectionManager;