const request = require("request");

class SlackResponseSender {
    send(slackResponse, httpRequest, httpResponse) {
        let responseUrl = httpRequest.body.response_url;

        if (slackResponse.isInChannel()) {
            request.post(responseUrl,
                {
                    json: slackResponse.get()
                }
            );

            httpResponse.send();

            return;
        }

        httpResponse.send(slackResponse.get());
    }
}

module.exports = SlackResponseSender;
