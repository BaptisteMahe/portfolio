import P5 from "p5";

import { Flock } from "./flock/flock";
import { Boid } from "./flock/boid";

const sketch = (p5: P5) => {

  const FLOCK_START_SIZE = 200;
  const FLOCK_MAX_SIZE = 1000;

  let flock: Flock;

  p5.setup = () => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("sketch");

    flock = new Flock(p5, FLOCK_START_SIZE, FLOCK_MAX_SIZE);
  };

  p5.draw = () => {
    p5.background(0);

    flock.update();

    if (p5.mouseIsPressed && p5.mouseX < p5.width && p5.mouseY < p5.height) {
      flock.add(new Boid(p5, { x: p5.mouseX, y: p5.mouseY }));
      console.log("Size: " + flock.size(), "Frame rate: " + p5.frameRate());
    }
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    flock.resizeTank(p5.windowWidth, p5.windowHeight);
  };
};

new P5(sketch);
