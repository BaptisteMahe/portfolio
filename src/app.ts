import P5 from "p5";

import { Flock } from "./flock/flock";

const sketch = (p5: P5) => {

  const FLOCK_START_SIZE = 200;
  const FLOCK_MAX_SIZE = 400;

  let flock: Flock;

  let hideFlockButton: HTMLButtonElement;
  let hideFlock = false;

  let addOnClick = true;

  p5.setup = () => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("sketch");

    hideFlockButton = document.querySelector("#hide-flock-button");
    hideFlockButton.onclick = () => {
      hideFlock = !hideFlock;
      hideFlockButton.textContent = `${ hideFlock ? 'Show' : 'Hide' } flock`
    }

    flock = new Flock(p5, FLOCK_START_SIZE, FLOCK_MAX_SIZE);
  };

  p5.draw = () => {
    p5.background(0);

    if (!hideFlock) flock.update(addOnClick);
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    flock.resizeTank(p5.windowWidth, p5.windowHeight);
  };
};

new P5(sketch);
