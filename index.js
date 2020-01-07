const rps_game = require("rps-game");
const { HAND, RESULT, game, getGameResult, makePlayer } = rps_game;
import { coroutine, defer } from "./helper";

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

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
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

function controller() {}

class Game {
  constructor({ name }) {
    this._isPlay = false;
    this._name = name;
    this.start = this.start.bind(this);
    this.isPending = this.isPending.bind(this);
    this.loop = this.loop.bind(this);
  }

  isPending() {
    return this.userEvents.length;
  }

  loop() {
    console.log("loop");
    const { isPending, userEvents } = this;
    return function* loop() {
      while (this._isPlay) {
        yield delay(1000).then(() => {
          console.log("abcd");
        });
      }
    }.bind(this);
  }

  start() {
    const { loop } = this;
    const that = this;
    coroutine(
      function*() {
        yield delay(1000).then(() => {
          console.log("started()", this);
          that._isPlay = true;
          coroutine(loop());
        });
      }.bind(this)
    );
  }

  pause() {
    this._isPlay = false;
  }
}

//not use Class shape, use function composition to make flexible interface in js
function RpsCreator() {
  const _state = { name: "rps" };
  const game = new Game(_state);
  return {
    ...game,
    // ...rps(state)
    idle: function*() {},
    ...makeAnimation()
  };
}

function makeAnimation() {}
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
    this._game.start();
  }

  powerOff() {
    console.log("Machine, powerOFF");
    this._isPower = false;
  }
}

const _machine = new Machine(RpsCreator());
_machine.powerOn();
_machine.powerOff();

const gameEl = document.querySelector(".game");
