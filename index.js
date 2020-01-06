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

class Commnad {
  constructor() {}
}

class ICommandBehavior {
  execute() {
    console.log("구현하세요");
  }
}

class Game {
  constructor() {
    this._isPlay = false;
  }

  play() {
    this._isPlay = true;
  }

  pause() {
    this._isPlay = false;
  }
}

//command Pattern
class Machine {
  //게임 레트로 게임팩 고증화
  constructor(g) {
    this._game = g;
    this._coins = 0;
    this._isPower = false;
  }

  powerOn() {
    console.log("Machine, powerOn");
    this._isPower = true;
    this._game.play();
  }
  powerOff() {
    console.log("Machine, powerOFF");
    this._isPower = false;
  }
}

const _machine = new Machine(new Game());
_machine.powerOn();
_machine.powerOff();
