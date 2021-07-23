let N = 9;

class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[1-9.]+$/ 

    if(!puzzleString) return false
    else if(!regex.test(puzzleString)) return false
    else if(puzzleString.length !== 81) return false
    else return true
  }

  letterToNumber(row){
    switch (row.toUpperCase()){
      case 'A':
        return 1
      case 'B':
        return 2
      case 'C':
        return 3
      case 'D':
        return 4
      case 'E':
        return 5
      case 'F':
        return 6
      case 'G':
        return 7
      case 'H':
        return 8
      case 'I':
        return 9
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString)
    row = this.letterToNumber(row)
    column = parseInt(column)
    //if there is a number other than 0 or value present at the current coordinate
    if(grid[row-1][column-1] !== 0 && grid[row-1][column-1] != value) return false

    //if value exists in the given row skipping the coordinate provided
    for(let i = 0; i < 9; i++) {
      if(i == column-1) continue
      if(grid[row-1][i] == value)
        return false
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString)
    row = this.letterToNumber(row)
    column = parseInt(column)
  
    if(grid[row - 1][column - 1] !== 0 && grid[row-1][column-1] != value)
      return false
    
    for(let i = 0; i < 9; i++){
      if(i == row-1) continue
      if(grid[i][column - 1] == value)
        return false
    }  
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString)
    row = this.letterToNumber(row)
    column = parseInt(column)
  
    if(grid[row - 1][column - 1] !== 0 && grid[row-1][column-1] != value)
      return false

    let startRow = row - (row  % 3)
    let startCol = column - (column % 3)

    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++) {
        if(grid[i + startRow][j + startCol] == value)
          return false
        }
      }
    return true 
  }

  isSafe(grid, row, col, num)
  {
      for(let x = 0; x <= 8; x++)
          if (grid[row][x] == num)
              return false;

      for(let x = 0; x <= 8; x++)
          if (grid[x][col] == num)
              return false;
  
      let startRow = row - row % 3,
          startCol = col - col % 3;
          
      for(let i = 0; i < 3; i++)
          for(let j = 0; j < 3; j++)
              if (grid[i + startRow][j + startCol] == num)
                  return false;
  
      return true;
  }

  solveSuduko(grid, row, col)
  {
    if (row == N - 1 && col == N)
        return grid;

    if (col == N){
        row++;
        col = 0;
    }
 
    if (grid[row][col] != 0)
        return this.solveSuduko(grid, row, col + 1);
 
    for(let num = 1; num < 10; num++)
    {
        if (this.isSafe(grid, row, col, num))
        {
            grid[row][col] = num;
            if (this.solveSuduko(grid, row, col + 1))
                return grid;
        }
        grid[row][col] = 0;
    }
    return false;
  }

  transform(puzzleString) {
    let i= 0, k = 0;
    let grid = [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ]

    if(puzzleString.length !== 81) return false //new

    let arr = puzzleString.split('')
    arr.forEach(elem => {
      if(/[a-z]/i.test(elem)) return false //new
      if (elem === '.') arr[i] = 0
      else arr[i] = parseInt(elem)
      i++
    })
    
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++) {
            if(arr[k] !== 0) grid[i][j] = arr[k] 
            k++
        }
    }
    return grid
  }

  transformBack(grid) {
    return grid.flat().join('')
  }

  solve(puzzleString) {
    let grid = this.transform(puzzleString)
    if(!grid) return false //new

    let solved = this.solveSuduko(grid, 0, 0)
    if(!solved) return false //new
    
    let solvedString = this.transformBack(solved)
    return solvedString
  }
}

module.exports = SudokuSolver;

