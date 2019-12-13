const rps_game = require("rps-game");
const { HAND, RESULT, game, getGameResult, makePlayer } = rps_game;
console.log("hello world");
const gameEl = document.querySelector(".game");

//will update in library
const makeComputers = n => {
  const players = [];
  for (let i = 0; i < n; i++) {
    players.push(makePlayer(Math.floor(Math.random() * 3)));
  }
  return players;
};

function gameStart() {
  console.log(game([makeComputers(1), makeComputers(1)]));
}

gameStart();

class Machine {
  constructor() {}
  idle() {}
  play() {
    console.log("play");
  }
  end() {}
}

const _machine = new Machine();
_machine.play();
