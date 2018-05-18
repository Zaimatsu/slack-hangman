var _ = require("lodash");

class PhraseValidator {
    validate(phrase) {
        if(_.isObject(phrase)) phrase = phrase.get();
        
        let re = /^[A-ZĄĆĘŁŃÓŚŻŹ ]+$/g;
        return re.test(phrase);
    }
};

module.exports = PhraseValidator;
