var _ = require("lodash");

module.exports = {
    isValid: () => {
        if (_.isEmpty(process.env.VERIFICATION_TOKEN)) {
            throw new Error("[SERVER] The server could not start. Set VERIFICATION_TOKEN enviromental variable first.");
        }
        
        if (_.isEmpty(process.env.CLIENT_ID)) {
            throw new Error("[SERVER] The server could not start. Set CLIENT_ID enviromental variable first.");
        }
        
        if (_.isEmpty(process.env.CLIENT_SECRET)) {
            throw new Error("[SERVER] The server could not start. Set CLIENT_SECRET enviromental variable first.");
        }
        
        if (_.isEmpty(process.env.SOCKET_TOKEN)) {
            throw new Error("[SERVER] The server could not start. Set SOCKET_TOKEN enviromental variable first.");
        }

        return true;
    }
};

