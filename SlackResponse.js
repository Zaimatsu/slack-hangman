const _ = require("lodash");

class SlackResponse {
    constructor(text, responseType, attachments) {
        this.__text = text;
        this.__responseType = _.isString(responseType) ? responseType : "ephemeral";
        this.__attachments = attachments;
    }

    get() {
        return {
            text: this.__text,
            response_type: this.__responseType,
            attachments: this.__attachments
        }
    }

    isInChannel() {
        return this.__responseType === "in_channel";
    }
}

module.exports = SlackResponse;