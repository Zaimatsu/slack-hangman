<a href="https://slack.com/oauth/authorize?client_id=12433638247.361957021079&scope=commands"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

Hangman game backend for slack
====================

Game integrated with [slack](https://slack.com) as [slash commands](https://api.slack.com/slash-commands).

### Installation

`npm install`

VERIFICATION_TOKEN enviromental variable must be set.
https://api.slack.com/docs/token-types#verification
NOTE: app uses verification tokens that are deprecated.

CLIENT_ID enviromental variable must be set.
CLIENT_SECRET enviromental variable must be set.
https://api.slack.com/methods/oauth.access

SOCKET_TOKEN enviromental variable must be set.
Used in server.stop.js

SSL must be setup. Currently it's hardcoded in `server.js` to look for:
    - key: '/etc/letsencrypt/live/zaimatsu.tk/privkey.pem'
    - cert: '/etc/letsencrypt/live/zaimatsu.tk/cert.pem'
    - ca: '/etc/letsencrypt/live/zaimatsu.tk/chain.pem'

MongoDb must be configured. Configure db endpoints in `hangmanConfig.json`.

### To start a game

`/hangman <PHRASE>`

e.g.
>/hangman GREAT AS CABBAGE

### To guess, after the game was started

`/hangman <LETTER/PHRASE>`

e.g.
> /hangman A

> /hangman GREAT AS LATTICE

### TODO

- sslOptions instructions
- extract ssl options to hangmanConfig
- server.stop.js instructions
- make SECRET_TOKEN optional
- github-webhooks.js instructions