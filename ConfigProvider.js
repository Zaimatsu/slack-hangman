var _ = require("lodash");
var fs = require("fs");

class ConfigProvider {
    constructor(configPath = "hangmanConfig.json") {
        this.__config = JSON.parse(fs.readFileSync(configPath));
    }

    get(section) {
        if(_.isUndefined(section))
            return this.__config;    
        
        if(_.has(this.__config, section))
            return _.get(this.__config, section);

        throw new Error(`No such section in config file: '${section}'`);
    }
}

module.exports = ConfigProvider;