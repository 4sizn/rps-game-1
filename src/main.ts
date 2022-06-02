import "./style.css";
import {
  Engine,
  MeshBuilder,
  Scene,
  Camera,
  UniversalCamera,
  Vector3,
  SceneLoader,
  ArcRotateCamera,
  HemisphericLight,
  Mesh,
  Sound,
  CreateBox,
  ActionManager,
  Color3,
  StandardMaterial,
  ExecuteCodeAction,
} from "@babylonjs/core";
import rpsGame from "rps-game";

const canvasEl = document.querySelector("canvas");
const engine = new Engine(canvasEl, true);

//render Process
const scene = new Scene(engine);
let box = CreateBox("box", {}, scene);
let sampleMaterial = new StandardMaterial("material", scene);
box.material = sampleMaterial;
box.actionManager = new ActionManager(scene);
box.actionManager?.registerAction(
  new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
    sampleMaterial.diffuseColor = Color3.Random();
  })
);
new HemisphericLight("light", new Vector3(0, 1, 0), scene);

let camera = new ArcRotateCamera(
  "camera",
  -Math.PI / 2,
  Math.PI / 2.5,
  5,
  new Vector3(0, 0, 0),
  scene
);
camera.attachControl(canvasEl, true);

engine.runRenderLoop(() => {
  // console.log(performance.now());
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

let sound = new Sound("music", "/assets/sound/auto_tick.mp3", scene);

canvasEl?.addEventListener("click", () => {
  sound.play();
});
