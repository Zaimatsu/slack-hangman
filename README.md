Hangman game backend
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

### TODO
- help command `/hangman /help`
- validate guess phrases to be at least two words each three letters
- disable ability to guess you own phrases
- individual games (one challenge, but each player individualy guesses)
    - messages for all that someone has guessed or lost
    - ranking with time and misses
    - only one try to guess a phrase
    - condition; when the game is over?
        -  time
        -  challenger decision
- database (mogodb?)
    - possibility to restart server without loosing progress
- extract SlackResponse class with text and attachments (whould be used by DefaultGameResponseProvider.js)