var http = require("http");
var path = require("path");

var express = require("express");

var bodyParser = require("body-parser");
var request = require("request");
var _ = require("lodash");
const url = require("url");

var GameManager = require("./GameManager.js");
var DefaultGameResponseProvider = require("./DefaultGameResponseProvider.js");
var PhraseValidator = require("./PhraseValidator.js");

var router = express();
var server = http.createServer(router);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));

if (_.isEmpty(process.env.VERIFICATION_TOKEN)) {
  console.error("The server could not start. Set VERIFICATION_TOKEN enviromental variable first.");
  process.exit(1);
}

var defaultGameResponseProvider = new DefaultGameResponseProvider();
var phraseValidator = new PhraseValidator();

var gameManager = new GameManager(defaultGameResponseProvider, phraseValidator);

router.post('/', function(req, res) {
  var token = req.body.token;

  if (!_.isEqual(token, process.env.VERIFICATION_TOKEN)) {
    res.status(401);
    res.send();
    return;
  }

  var channelId = req.body.channel_id;
  var userInput = req.body.text.toUpperCase();
  var user = req.body.user_name;

  //console.log(`Got message from ${ user } at channel ${ channelId } with phrase ${ userInput }`);

  var response = gameManager.play(channelId, user, userInput);

  // channel response
  request.post(
    req.body.response_url, {
      json: {
        text: response.text,
        response_type: "in_channel",
        attachments: response.attachments
      }
    }
  );

  // individual response
  res.send();
});

router.get('/oauth', function(req, res) {
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
    callback: function(error, response, body) {
      // TODO store body.access_token and do somenthing with {
        // ok: true
        // access_token: """
        // scope: "identify,commands"
        // user_id: ""
        // team_name: ""
        // team_id: ""
      //}
      
      console.log(body);

    },
    json: true
  });
  
  res.redirect("https://slack.com/app_redirect?app=AAMU50M2B");
  
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
