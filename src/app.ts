import P5 from "p5";

import { Boid } from "./boid";
import { QuadTree } from "./quadtree/quadtree";
import { Rectangle } from "./quadtree/shapes/rectangle";

const sketch = (p5: P5) => {

  const flock: Boid[] = [];

  const FLOCK_START_SIZE = 200;
  const FLOCK_MAX_SIZE = 1000;

  let quadtree: QuadTree;

  p5.setup = () => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("app");

    for (let index = 0; index < FLOCK_START_SIZE; index++)
      flock.push(new Boid(p5, { x: p5.random(p5.width), y: p5.random(p5.height) }));

    quadtree = new QuadTree(new Rectangle(p5.width / 2, p5.height / 2, p5.width / 2, p5.height / 2), 5);
  };

  p5.draw = () => {
    p5.background(0);

    quadtree.clear();
    for (let boid of flock) quadtree.insert({ x: boid.position.x, y: boid.position.y, data: boid });

    for (let boid of flock) {
      boid.edges();
      boid.flock(quadtree);
      boid.update();
      boid.show();
    }

    if (p5.mouseIsPressed && p5.mouseX < p5.width && p5.mouseY < p5.height) {
      flock.push(new Boid(p5, { x: p5.mouseX, y: p5.mouseY }));
      if (flock.length > FLOCK_MAX_SIZE) flock.shift();
      console.log("Size: " + flock.length, "Frame rate: " + p5.frameRate());
    }
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    quadtree.resize(new Rectangle(p5.width / 2, p5.height / 2, p5.width / 2, p5.height / 2));
  };
};

new P5(sketch);
