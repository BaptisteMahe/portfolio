import P5 from "p5";

import { Boid } from "./boid";
import { QuadTree } from "./quadtree/quadtree";
import { Rectangle } from "./quadtree/shapes/rectangle";

const sketch = (p5: P5) => {

  const flock: Boid[] = [];

  const FLOCK_START_SIZE = 200;
  const FLOCK_MAX_SIZE = 1000;

  let alignSlider: P5.Element;
  let cohesionSlider: P5.Element;
  let separationSlider: P5.Element;

  let quadtree: QuadTree;

  p5.setup = () => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("app");

    alignSlider = createSliderWithLabel(p5, "Alignment", 0, 5, 1, 0.1);
    cohesionSlider = createSliderWithLabel(p5, "Cohesion", 0, 5, 1, 0.1);
    separationSlider = createSliderWithLabel(p5, "Separation", 0, 5, 1.5, 0.1);

    for (let index = 0; index < FLOCK_START_SIZE; index++)
      flock.push(new Boid(p5, { x: p5.random(p5.width), y: p5.random(p5.height) }));

    quadtree = new QuadTree(new Rectangle(p5.width / 2, p5.height / 2, p5.width / 2, p5.height / 2), 5);
  };

  p5.draw = () => {
    p5.background(0);

    quadtree.clear();
    for (let boid of flock) quadtree.insert({ x: boid.position.x, y: boid.position.y, data: boid });
    quadtree.show(p5);

    for (let boid of flock) {
      boid.edges();
      boid.flock(quadtree,
          alignSlider.value() as number,
          cohesionSlider.value() as number,
          separationSlider.value() as number);
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

function createSliderWithLabel(p5: P5, label: string, start: number, stop: number,
                               init: number, step: number): P5.Element {
  const labelDiv = p5.createDiv(label);
  labelDiv.addClass("slider")
  const slider = p5.createSlider(start, stop, init, step);
  slider.parent(labelDiv);
  return slider;
}
