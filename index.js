const GLOBAL = {
  pause: false,
  count: 0,
  platform: "node"
};

const isPaused = () => GLOBAL.pause === true;
