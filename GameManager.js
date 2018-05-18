var Phrase = require("./Phrase.js");
var Game = require("./Game.js");

var _ = require("lodash");

class GameManager {
  constructor(gameResponseProvider, phraseValidator) {
    this.__games = {};
    this.__gameResponseProvider = gameResponseProvider;
    this.__phraseValidator = phraseValidator;
    
    this.play = this.play.bind(this);
  }
  
  play(channelId, user, userInput) {
      
    //console.log(`User ${ user } plays with ${ userInput }...`);
      
    if(_.has(this.__games, channelId)) {
        //console.log(`and is playing existing game...`);
        let game = this.__games[channelId];
        
        if(game.isLost() || game.isGuessed()) {
            this.__games[channelId] = this.__createNewGame(user, userInput);
        } else {
            this.__games[channelId].play(user, userInput);
        }
    } else {
        //console.log(`and is creating a new game...`);
        this.__games[channelId] = this.__createNewGame(user, userInput);
    }

    //console.log(`then gets a response.`);
    return this.__gameResponseProvider.get(this.__games[channelId]);
  }
  
  __createNewGame(user, userInput) {
      return new Game(user, new Phrase(userInput), this.__phraseValidator);
  }
};

module.exports = GameManager;