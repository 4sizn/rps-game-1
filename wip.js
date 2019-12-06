//inGame
function rpsGame({ state }) {
  const play = () => {
    const result = game([makePlayer(HAND.ROCK), [makeComputers(1)]]);
    return { ...state, result };
  };

  const idle = () => {
    function* process() {
      yield console.log("state 상태에 따른 결과판 표시");
    }

    return process.call(this);
  };

  return {
    play,
    idle
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

//Game Machine
class Machine {
  constructor(game) {
    this._game = game;
    this._isPause = true;
    this._count = 0;
    this._coin = 0;
  }

  get isPause() {
    return this._isPause;
  }

  set pause(f) {
    this._isPause = f;
  }

  //power on
  start() {
    coroutine(function*() {}).then(() => {
      this._isPause = false;
      this.startLoop();
    });
    // return this._game.play();
  }

  startLoop() {
    coroutine(this.loop());
  }

  loop() {
    const game = this._game;
    return function* loop() {
      let done = false;
      let idle = game.idle();
      while (!done) {
        const next = idle.next();
        done = next.done;
        yield next.value;
      }

      idle = game.idle();
      done = false;
    };
  }

  end() {}
}

// const g = new rpsGame({});
// const machine = new Machine(g);
// console.log(JSON.stringify(machine.start()));
