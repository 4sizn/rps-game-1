const clear = require("clear");
const keypress = require("keypress");
const HAND = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2
};

const RESULT = {
  WIN: 0,
  LOSE: 1,
  DRAW: 2
};

const WEB2_MAN_NUM = 11;

let uuid = 0;
const makePlayer = hand => {
  assert(hand >= 0 && hand < 3, "player hands problem...");
  return { id: uuid++, hand };
};

const makeComputers = n => {
  const players = [];
  for (let i = 0; i < n; i++) {
    players.push(makePlayer(Math.floor(Math.random() * 3)));
  }
  return players;
};

const getGameResult = (myHand, otherHand) => {
  return [RESULT.WIN, RESULT.LOSE, RESULT.DRAW][(myHand - otherHand + 2) % 3];
};

/**
 *
 * @param  {{hand:string, id:int}[]} players
 */
const game = players => {
  const pHands = [...new Set(players.map(p => p.hand))];
  if (pHands.length !== 2) return { draw: true };

  const winned =
    getGameResult(pHands[0], pHands[1]) === RESULT.WIN ? pHands[0] : pHands[1];

  return { winners: players.filter(p => p.hand === winned) };
};

const rpsSimulation = players =>
  players.map(p => game([p, ...makeComputers(WEB2_MAN_NUM - 1)]));

const dailyQueue = makeComputers;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

(function gameStart() {
  const global = {
    state: { isPause: false, coin: 0, key: null }
  };

  keypress(process.stdin);
  process.stdin.on("keypress", (ch, key) => {
    if (key && key.name === "q") {
      process.exit();
    }
    if (key && key.name === "r") {
      global.state = {
        ...global.state,
        coin: global.state.coin + 1
      };
    }
    if ([HAND.ROCK, HAND.PAPER, HAND.SCISSORS].includes(Number(ch))) {
      global.state = {
        ...global.state,
        key: Number(ch)
      };
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();

  const timer = setInterval(() => {
    clear();
    console.log(global.state);
    console.log(
      [HAND.ROCK, HAND.PAPER, HAND.SCISSORS][Math.floor(Math.random() * 3)]
    );
    console.log("[주먹 : 0, 보 : 1, 가위, 2] : ");
  }, 100);
})();
