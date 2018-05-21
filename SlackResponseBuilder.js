var _ = require("lodash");

var SlackResponse = require("./SlackResponse.js");

class SlackResponseBuilder {
    constructor() {
        this.__text = null;
        this.__responseType = "ephemeral";
        this.__attachments = [];
    }

    setText(text) {
        this.__text = text;
    }

    setResponseType(responseType) {
        this.__responseType = responseType;
    }

    addImageAttachment(imageUrl, text = "") {
        var attachment = {
            text: text,
            image_url: imageUrl
        }

        this.__attachments.push(attachment);
    }

    addThumbAttachment(thumUrl, text = "") {
        var attachment = {
            text: text,
            thumb_url: thumUrl
        }

        this.__attachments.push(attachment);
    }

    build() {
        return new SlackResponse(this.__text, this.__responseType, this.__attachments);
    }
}

module.exports = SlackResponseBuilder;