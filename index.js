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

function rpsGame({ state }) {
  const start = () => {
    const result = game([makePlayer(HAND.ROCK), [makeComputers(1)]]);
    return { ...state, result };
  };
  return {
    start
  };
}

function defer() {
  let res;
  let rej;

  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  promise.resolve = res;
  promise.reject = rej;

  return promise;
}

const coroutine = function(generatorFunction) {
  const promise = defer();
  const generator = generatorFunction();
  next();

  return promise;

  // Call next() or throw() on the generator as necessary
  function next(value, isError) {
    const response = isError ? generator.throw(value) : generator.next(value);

    if (response.done) {
      return promise.resolve(response);
    }

    handleAsync(response.value);
  }

  // Handle the result the generator yielded
  function handleAsync(async) {
    if (async && async.then) {
      handlePromise(async);
    } else if (typeof async === "function") {
      var v = async();
      next(v);
    } else if (async === undefined) {
      setTimeout(next, 0);
    } else {
      next(new Error(`Invalid yield ${async}`), true);
    }
  }

  // If the generator yielded a promise, call `.then()`
  function handlePromise(async) {
    async.then(next, error => next(error, true));
  }
};

class Machine {
  constructor(game) {
    this._game = game;
    this._isPause = true;
    this._count = 0;
  }

  get isPause() {
    return this._isPause;
  }

  set pause(f) {
    this._isPause = f;
  }

  start() {
    coroutine(function*() {}).then(() => {
      this._isPause = false;
      this.startLoop();
    });
    // return this._game.start();
  }

  startLoop() {
    coroutine(this.loop());
  }

  loop() {
    return function* loop() {};
  }

  end() {}
}
const g = new rpsGame({});
const machine = new Machine(g);

console.log(JSON.stringify(machine.start()));
