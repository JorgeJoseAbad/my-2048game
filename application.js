var game;

window.onload = function () {
  game = new Game2048();
  renderTiles();
  loadSounds ();
};



function renderTiles () {
  game.board.forEach(function(row, rowIndex){
    row.forEach(function (cell, cellIndex) {
      if (cell) {
        var tileContainer = document.getElementById("tile-container");
        var newTile       = document.createElement("div");

        newTile.classList  = "tile val-" + cell;
        newTile.classList += " tile-position-" + rowIndex + "-" + cellIndex;
        newTile.innerHTML  = (cell);

        tileContainer.appendChild(newTile);
      }
    });
  });
}

function resetTiles () {
  var tilesContainer = document.getElementById("tile-container");
  var tiles          = tilesContainer.getElementsByClassName("tile");

  Array.prototype.slice.call(tiles).forEach(function (tile) {
    tilesContainer.removeChild(tile);
  });
}

function updateScore () {
  var score          = game.score;
  var scoreContainer = document.getElementsByClassName("js-score");

  Array.prototype.slice.call(scoreContainer).forEach(function (span) {
    span.innerHTML = score;
  });
}

function gameStatus () {
  if (game.win()) {
    document.getElementById("game-over").classList = "show-won";
    document.getElementById("game-over").innerHTML="You´ve won!!";
    setTimeout(function(){
      document.getElementById("game-over").innerHTML = game.getMessage();
    },1000);
  } else if (game.lose()) {
    document.getElementById("game-over").classList = "show-lost";
    document.getElementById("game-over").innerHTML='You´ve lost, sorry!!';
    setTimeout(function(){
      document.getElementById("game-over").innerHTML = game.getMessage();
    },1000);
  }
}

function moveListeners (event) {
  var keys = [37, 38, 39, 40];

  if (keys.indexOf(event.keyCode) < 0)
    return;

  switch (event.keyCode) {
    case 37: game.move("left");  break;
    case 38: game.move("up");    break;
    case 39: game.move("right"); break;
    case 40: game.move("down");  break;
  }

  resetTiles();
  renderTiles();
  updateScore();
  gameStatus();
}

function loadSounds () {
  ion.sound({
    sounds: [{name: "snap"}, {name: "tap"}],
    path: "/my-2048game/lib/ion.sound-3.0.7/sounds/", //path for deployed app
    preload: true,
    volume: 1.0
  });
}

document.addEventListener("keydown", moveListeners);
