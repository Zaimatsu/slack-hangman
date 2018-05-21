var _ = require("lodash");

class MaskedPhrase {
    constructor(phrase) {
        this.__phrase = phrase;
        this.__guesses = {};
        this.__maskedPhrase = this.__maskPhrase(this.__phrase);

        this.guess = this.guess.bind(this);
    }

    get() {
        return this.__maskedPhrase;
    }

    reveal(userInput) {
        if (this.__phrase.isEqual(userInput)) {
            this.revealAll();
            return;
        }

        this.guess(userInput);
    }

    revealAll() {
        let allLetters = _.uniq(this.__phrase.get().replace(" ", ""));
        _.each(this.__phrase.get(), this.guess);
    }

    guess(letter) {
        this.__guesses[letter] = {
            isMiss: !_.includes(this.__phrase.get(), letter)
        };

        this.__maskedPhrase = this.__maskPhrase(this.__phrase);
    }

    isGuessed() {
        let phraseText = this.__phrase.get();

        let guesses = _.keys(this.__guesses);

        let notYetGuessed = _.map(phraseText, (letter) => {
            if (_.includes(guesses, letter)) return;

            return letter;
        }).join("").trim();

        return _.isEqual(_.size(notYetGuessed), 0);
    }

    getMissCount() {
        return _.size(_.filter(_.values(this.__guesses), { isMiss: true }));
    }

    getMisses() {
        let misses = [];
        _.each(this.__guesses, (guess, letter) => {
            if (guess.isMiss)
                misses.push(letter);
        });

        return misses;
    }

    __maskPhrase(phrase) {
        let maskedPhrase = phrase.get();

        maskedPhrase = _.map(maskedPhrase, (letter) => {
            if (_.has(this.__guesses, letter)) return letter;

            if (_.isEqual(letter, " ")) return " ";

            return ".";
        }).join("");

        return maskedPhrase.replace(/ /g, " | ").replace(/\./g, " . ");
    }
};


module.exports = MaskedPhrase;
