<a href="https://slack.com/oauth/authorize?client_id=12433638247.361957021079&scope=commands"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

Hangman game backend for slack
====================

Game integrated with [slack](https://slack.com) as [slash commands](https://api.slack.com/slash-commands).

Integrate with slack as `\hangman` or/and `\hg` command.

### To start a game

`/hangman <PHRASE>`

e.g.
>/hangman GREAT AS CABBAGE

### To guess, after the game was started

`/hangman <LETTER/PHRASE>`

e.g.
> /hangman A

> /hangman GREAT AS LATTICE
