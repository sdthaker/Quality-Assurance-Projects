'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert').get((req, res) => {

    let {input} = req.query

    if(input){
        let num = convertHandler.getNum(input)
        let unit = convertHandler.getUnit(input)
      
        if(num === 'invalid number' && unit === 'invalid unit') 
          return res.json('invalid number and unit')
        if(num === 'invalid number' && unit !== 'invalid unit')
          return res.json('invalid number')
        if(num !== 'invalid number' && unit === 'invalid unit')
          return res.json('invalid unit')

        let returnNum = convertHandler.convert(num,unit)
        let returnUnit = convertHandler.getReturnUnit(unit)

        return res.json(convertHandler.getString(num, unit, returnNum, returnUnit))
    }
  })
};
