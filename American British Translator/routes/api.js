'use strict';

const translator = require('../components/translator.js');

module.exports = function (app) {

  app.route('/api/translate')
    .post((req, res) => {
      let {locale, text} = req.body

      if(!locale || text == undefined) return res.json({error: 'Required field(s) missing'})

      if(text == "") return res.json({error:'No text to translate' }) 

      if(locale === 'american-to-british'){
        let translated = translator(text,locale)
        if(translated) {
          if(text == translated[0] || !translated[0]) return res.json({text: text, translation: "Everything looks good to me!"})
          else return res.json({text: text, translation: translated[1]})
        }
        else return res.json({text: text, translation: "Everything looks good to me!"})
      }
      else if(locale === 'british-to-american') {
        let translated = translator(text,locale)
        if(translated) {
          if(text == translated[0] || !translated[0]) return res.json({text: text, translation: "Everything looks good to me!"})
          else return res.json({text: text, translation: translated[1]})
        }
        else return res.json({text: text, translation: "Everything looks good to me!"})
      }
      else return res.json({error: 'Invalid value for locale field'})
    });
};