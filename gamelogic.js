/*
  Numerical game logic
*/
/*
//(this for console-only game)
$(document).ready(function(){

  game = new Game2048(); //Remove var to be a global visibility variable
  game._renderBoard();   //to see from console, from application.js

});
*/


  function Game2048() {

    this.board = [
      [null,null,null,null],
      [null,null,null,null],
      [null,null,null,null],
      [null,null,null,null]
    ];

    this.score  = 0;
    this.won   = false;
    this.lost  = false;
    this.message = "";
    this._generateTile();
    this._generateTile();

  }



  Game2048.prototype._generateTile = function () {
    var initialValue = (Math.random() < 0.8) ? 2 : 4;
    var emptyTile = this._getAvailablePosition();

    if (emptyTile) {
      this.board[emptyTile.x][emptyTile.y] = initialValue;
    }
  };


Game2048.prototype._getAvailablePosition = function () {
  var emptyTiles = [];

  this.board.forEach(function(row, rowIndex){
    row.forEach(function(elem, colIndex){
      if (!elem) emptyTiles.push({ x: rowIndex, y: colIndex });
    });
  });

  if (emptyTiles.length === 0)
    return false;

  var randomPosition = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomPosition];
};



Game2048.prototype._renderBoard = function () {
  this.board.forEach(function(row){ console.log(row); });
  console.log('Score: ' + this.score);
};

Game2048.prototype._arrayEquals = function (a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

Game2048.prototype._moveLeft = function () {
  console.log("en moveLeft");
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  ion.sound.play("snap");
  //debugger;
  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for(i = 0; i < newRow.length - 1; i++) {
      if (newRow[i+1] === newRow[i]) {
        ion.sound.play("tap");
        newRow[i]   = newRow[i] * 2;
        newRow[i+1] = null;

        that._updateScore(newRow[i]);
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.push(null);
    }

    if (!that._arrayEquals(merged,row)) boardChanged = true;

    newBoard.push(merged);

  });

  this.board = newBoard;
  return boardChanged;
};


Game2048.prototype._moveRight = function () {
  console.log("en _moveRight");
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  ion.sound.play("snap");

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for (i=newRow.length - 1; i>0; i--) {
      if (newRow[i-1] === newRow[i]) {
        newRow[i]   = newRow[i] * 2;
        newRow[i-1] = null;

        that._updateScore(newRow[i]);
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.unshift(null);
    }

    if (!that._arrayEquals(merged,row))  boardChanged = true;

    newBoard.push(merged);

  });

  this.board = newBoard;
  return boardChanged;
};


Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};

Game2048.prototype._moveUp = function () {
  this._transposeMatrix();
  var boardChanged = this._moveLeft();
  this._transposeMatrix();
  return boardChanged;
};

Game2048.prototype._moveDown = function () {
  this._transposeMatrix();
  var boardChanged = this._moveRight();
  this._transposeMatrix();
  return boardChanged;
};


Game2048.prototype._isGameFinished = function(){
  return (this.won || this.lost);

};

Game2048.prototype.move = function (direction) {
  if (!this._isGameFinished()) {
    switch (direction) {
      case "up":    boardChanged = this._moveUp();    break;
      case "down":  boardChanged = this._moveDown();  break;
      case "left":  boardChanged = this._moveLeft();  break;
      case "right": boardChanged = this._moveRight(); break;
    }

    if (boardChanged) {
      this._generateTile();
      this._isGamePlayable();
    }
  }
};


Game2048.prototype._updateScore = function(value) {
  this.score += value;
  if (value === 2048) {
    this.message = "Congratulations!!! ";
    this.won = true;
  }
};


Game2048.prototype.lose = function(){
  return this.lost;
};

Game2048.prototype.win = function () {
  return this.won;
};


Game2048.prototype._isGamePlayable = function () {

  if (this._getAvailablePosition())
    return;

  var that   = this;
  var isLost = true;
  /*Comprueba, si no hay AvailablePosition libre,
  si dos casillas adyaccentes son iguales y se puede mover */
  that.board.forEach(function (row, rowIndex) {
    row.forEach(function (cell, cellIndex) {
      var current = that.board[rowIndex][cellIndex];
      var top, bottom, left, right;

      if (that.board[rowIndex][cellIndex - 1]) {
        left  = that.board[rowIndex][cellIndex - 1];
      }
      if (that.board[rowIndex][cellIndex + 1]) {
        right = that.board[rowIndex][cellIndex + 1];
      }
      if (that.board[rowIndex - 1]) {
        top    = that.board[rowIndex - 1][cellIndex];
      }
      if (that.board[rowIndex + 1]) {
        bottom = that.board[rowIndex + 1][cellIndex];
      }

      if (current === top || current === bottom || current === left || current === right)
        isLost = false;
    });
  });

  this.lost = isLost;
  if (this.lost === true){this.message = "No movement possible!!"}
};


Game2048.prototype.getMessage = function(){
  return this.message;
}
