var _ = require("lodash");
var bodyParser = require("body-parser");
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var MongoClient = require('mongodb').MongoClient;
var path = require("path");
var request = require("request");
var url = require("url");

var DefaultGameResponseProvider = require("./DefaultGameResponseProvider");
var GameManager = require("./GameManager");
var PhraseValidator = require("./PhraseValidator");
var SlackResponseSender = require("./SlackResponseSender");

var app = express();
var httpApp = express();

var sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/zaimatsu.tk/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/zaimatsu.tk/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/zaimatsu.tk/chain.pem')
};

var server = https.createServer(sslOptions, app);
var httpServer = http.createServer(httpApp);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

if (_.isEmpty(process.env.VERIFICATION_TOKEN)) {
    console.error("[SERVER] The server could not start. Set VERIFICATION_TOKEN enviromental variable first.");
    process.exit(1);
}

if (_.isEmpty(process.env.CLIENT_ID)) {
    console.error("[SERVER] The server could not start. Set CLIENT_ID enviromental variable first.");
    process.exit(1);
}

if (_.isEmpty(process.env.CLIENT_SECRET)) {
    console.error("[SERVER] The server could not start. Set CLIENT_SECRET enviromental variable first.");
    process.exit(1);
}

if (_.isEmpty(process.env.SOCKET_TOKEN)) {
    console.error("[SERVER] The server could not start. Set SOCKET_TOKEN enviromental variable first.");
    process.exit(1);
}

var url = "mongodb://localhost:27017";
const dbName = "slack-hangman";


connectToDatabase = function(resolve, reject) {
    MongoClient.connect(url, function(err, client) {
        if(err !== null) {
            reject(err);
        }
    
        console.log("[SERVER] Connected successfully to database.");
    
        resolve(client.db(dbName));
    
        client.close();
    });
}

dbClientPromise = new Promise(connectToDatabase);

var defaultGameResponseProvider = new DefaultGameResponseProvider();
var phraseValidator = new PhraseValidator();
var slackResponseSender = new SlackResponseSender();
var gameManager = new GameManager(defaultGameResponseProvider, phraseValidator, dbClientPromise);

httpApp.get("/", function (req, res) {
    console.log("[HTTP SERVER] GET '/'", req.ip, JSON.stringify(req.query));
    res.redirect("https://github.com/Zaimatsu/slack-hangman");
});

app.get("/", function (req, res) {
    console.log("[HTTPS SERVER] GET '/'", req.ip, JSON.stringify(req.body));
    res.redirect("https://github.com/Zaimatsu/slack-hangman");
});

app.post("/", function (req, res) {
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

app.get("/oauth", function (req, res) {
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

server.listen(443, "0.0.0.0", function () {
    var addr = server.address();
    console.log("[HTTPS SERVER] Listening at", addr.address + ":" + addr.port);
});

httpServer.listen(80, "0.0.0.0", function () {
    var addr = httpServer.address();
    console.log("[HTTP SERVER] Listening at", addr.address + ":" + addr.port);
});
