var http = require("http");
var https = require("https");
var path = require("path");

var express = require("express");

var bodyParser = require("body-parser");
var request = require("request");
var _ = require("lodash");
const url = require("url");
const fs = require("fs");

var GameManager = require("./GameManager");
var DefaultGameResponseProvider = require("./DefaultGameResponseProvider");
var PhraseValidator = require("./PhraseValidator");
var SlackResponseSender = require("./SlackResponseSender");

var router = express();
var httpRouter = express();

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/zaimatsu.tk/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/zaimatsu.tk/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/zaimatsu.tk/chain.pem')
};

var server = https.createServer(options, router);

var httpServer = http.createServer(httpRouter);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static("public"));

httpRouter.use(express.static("public"));

if (_.isEmpty(process.env.VERIFICATION_TOKEN)) {
    // TODO add verification with other env vars
    console.error("[SERVER] The server could not start. Set VERIFICATION_TOKEN enviromental variable first.");
    process.exit(1);
}

var defaultGameResponseProvider = new DefaultGameResponseProvider();
var phraseValidator = new PhraseValidator();
var slackResponseSender = new SlackResponseSender();

var gameManager = new GameManager(defaultGameResponseProvider, phraseValidator);

httpRouter.get("/", function (req, res) {
    console.log("[HTTP SERVER] GET '/'", req.ip, JSON.stringify(req.query));
    res.redirect("https://github.com/Zaimatsu/slack-hangman");
});

router.get("/", function (req, res) {
    console.log("[HTTPS SERVER] GET '/'", req.ip, JSON.stringify(req.body));
    res.redirect("https://github.com/Zaimatsu/slack-hangman");
});

router.post("/", function (req, res) {
    console.log("[HTTPS SERVER] POST '/'", req.ip, JSON.stringify(req.body));
    var token = req.body.token;

    if (!_.isEqual(token, process.env.VERIFICATION_TOKEN)) {
        res.status(401);
        res.send();
        return;
    }

    var channelId = req.body.channel_id;
    var userInput = req.body.text.toUpperCase();
    var user = req.body.user_name;

    var slackResponse = gameManager.play(channelId, user, userInput);

    slackResponseSender.send(slackResponse, req, res);
});

router.get("/oauth", function (req, res) {
    var query = url.parse(req.url, true).query;
    var code = query.code;

    request.get({
        url: url.format({
            pathname: "https://slack.com/api/oauth.access",
            query: _.merge(req.query, {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            })
        }),
        callback: function (error, response, body) {
            // TODO store body.access_token and do somenthing with {
            // ok: true
            // access_token: """
            // scope: "identify,commands"
            // user_id: ""
            // team_name: ""
            // team_id: ""
            //}

            console.log("[SERVER]", body);

        },
        json: true
    });

    res.redirect("https://slack.com/app_redirect?app=AAMU50M2B");

});


const io = require('socket.io').listen(server);

io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if (_.isEqual(token, process.env.SOCKET_TOKEN)) {
        return next();
    }
    return next(new Error("authentication error"));
});


io.on("connection", (socket) => {
    socket.on("stop", () => {
        console.log("[SERVER] Stopping server by socket...");
        process.exit(0);
    });
});

server.listen(process.env.PORT || 443, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("[HTTPS SERVER] Listening at", addr.address + ":" + addr.port);
});

httpServer.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function () {
    var addr = httpServer.address();
    console.log("[HTTP SERVER] Listening at", addr.address + ":" + addr.port);
});
