'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let {value, coordinate, puzzle} = req.body
      
      let alphaTest = /[a-i]/gi
      let numberTest =  /^[1-9]$/g
      const regex = /^[1-9.]+$/ 
      
      if(!value || !coordinate || !puzzle) return res.json({error: 'Required field(s) missing'})
      if(!regex.test(puzzle)) return res.json({error: 'Invalid characters in puzzle'})
      if(puzzle.length !== 81) return res.json({error: 'Expected puzzle to be 81 characters long'})
      
      const splitCoord = coordinate.split('')
      if(splitCoord.length > 2 || splitCoord.length === 1 || !alphaTest.test(splitCoord[0]) || !numberTest.test(splitCoord[1])) return res.json({error: 'Invalid coordinate'})
      if(!value.match(numberTest)) return res.json({error: 'Invalid value'})

      let rowPlace = solver.checkRowPlacement(puzzle, splitCoord[0], splitCoord[1],value)
      let colPlace = solver.checkColPlacement(puzzle, splitCoord[0], splitCoord[1],value)
      let regionPlace = solver.checkRegionPlacement(puzzle, splitCoord[0], splitCoord[1],value)
      let conflicts = []

      if(rowPlace && colPlace && regionPlace) return res.json({valid: true})
      else{
        if(!rowPlace) conflicts.push('row')
        if(!colPlace) conflicts.push('column')
        if(!regionPlace) conflicts.push('region')
        return res.json({valid: false, conflict: conflicts})
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body
      const regex = /^[1-9.]+$/ 

      if(!puzzle) return res.json({error: 'Required field missing'})
      if(!regex.test(puzzle)) return res.json({error: 'Invalid characters in puzzle'})
      if(puzzle.length !== 81) return res.json({error: 'Expected puzzle to be 81 characters long'})
      
      let solvedString = solver.solve(puzzle)
      if(!solvedString) res.json({error: 'Puzzle cannot be solved'})
      else return res.json({solution: solvedString})
    });
};
