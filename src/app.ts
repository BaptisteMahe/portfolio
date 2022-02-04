import P5 from "p5";

import { Flock } from "./flock/flock";
import {
  DEFAULT_ALIGN_COEFFICIENT, DEFAULT_ALIGN_RADIUS,
  DEFAULT_COHESION_COEFFICIENT, DEFAULT_COHESION_RADIUS, DEFAULT_MAX_FORCE, DEFAULT_MAX_SPEED,
  DEFAULT_SEPARATION_COEFFICIENT, DEFAULT_SEPARATION_RADIUS
} from "./flock/constant";

const sketch = (p5: P5) => {

  const FLOCK_START_SIZE = 200;
  const FLOCK_MAX_SIZE = 400;

  let flock: Flock;

  let hideFlockButton: HTMLButtonElement;
  let hideFlock = false;

  let announcementIcon: HTMLDivElement;
  let hideContentButton: HTMLButtonElement;
  let hideContent = false;

  let boidController: HTMLDivElement;

  let alignCoefficientSlider: P5.Element;
  let cohesionCoefficientSlider: P5.Element;
  let separationCoefficientSlider: P5.Element;

  let alignRadiusSlider: P5.Element;
  let cohesionRadiusSlider: P5.Element;
  let separationRadiusSlider: P5.Element;

  let maxSpeedSlider: P5.Element;
  let maxForceSlider: P5.Element;

  let addBoidOnClickButton: HTMLButtonElement;
  let addBoidOnClick = true;

  let showRadiusButton: HTMLButtonElement;
  let showRadius = false;

  let showQuadtreeButton: HTMLButtonElement;
  let showQuadtree = false;

  let hideBoidControllerButton: HTMLButtonElement;
  let hideBoidController = false;

  let contentContainer: HTMLDivElement;
  let fadeInElements: HTMLElement[] = [];
  let contactLinks: NodeListOf<HTMLAnchorElement>;

  p5.setup = () => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("sketch");

    alignCoefficientSlider = createSlider("align-coefficient-slider", DEFAULT_ALIGN_COEFFICIENT);
    cohesionCoefficientSlider = createSlider("cohesion-coefficient-slider", DEFAULT_COHESION_COEFFICIENT);
    separationCoefficientSlider = createSlider("separation-coefficient-slider", DEFAULT_SEPARATION_COEFFICIENT);

    alignRadiusSlider = createSlider("align-radius-slider", DEFAULT_ALIGN_RADIUS);
    cohesionRadiusSlider = createSlider("cohesion-radius-slider", DEFAULT_COHESION_RADIUS);
    separationRadiusSlider = createSlider("separation-radius-slider", DEFAULT_SEPARATION_RADIUS);

    maxSpeedSlider = createSlider("max-speed-slider", DEFAULT_MAX_SPEED);
    maxForceSlider = createSlider("max-force-slider", DEFAULT_MAX_FORCE);

    hideFlockButton = document.querySelector("#hide-flock-button");
    hideFlockButton.onclick = () => {
      hideFlock = !hideFlock;
      hideFlockButton.textContent = `${ hideFlock ? 'Show' : 'Hide' } flock`;
    };

    announcementIcon = document.querySelector(".mat-announcement-icon");
    hideContentButton = document.querySelector("#hide-content-button");
    hideContentButton.onclick = () => {
      hideContent = !hideContent;
      hideContentButton.textContent = `${ hideContent ? 'Show' : 'Hide' } text`;
      if (hideContent) {
        contentContainer.classList.add('hidden');
        announcementIcon.classList.add('hidden');
        boidController.classList.remove('hidden');
      } else {
        contentContainer.classList.remove('hidden');
        boidController.classList.add('hidden');
      }
    };

    addBoidOnClickButton = document.querySelector("#add-boid-button");
    addBoidOnClickButton.onclick = () => {
      addBoidOnClick = !addBoidOnClick;
      addBoidOnClickButton.textContent = `${ addBoidOnClick ? 'Stop add': 'Add' } boid on click`;
    };

    showRadiusButton = document.querySelector("#show-radius-button");
    showRadiusButton.onclick = () => {
      showRadius = !showRadius;
      showRadiusButton.textContent = `${ showRadius ? 'Hide' : 'Show' } radius`;
    };

    showQuadtreeButton = document.querySelector("#show-quadtree-button");
    showQuadtreeButton.onclick = () => {
      showQuadtree = !showQuadtree;
      showQuadtreeButton.textContent = `${ showQuadtree ? 'Hide' : 'Show' } quadtree`;
    };

    boidController = document.querySelector(".boid-controller");

    hideBoidControllerButton = document.querySelector(".hide-boid-controller-button");
    hideBoidControllerButton.onclick = () => {
      if (hideBoidController) {
        boidController.style.transform = ("translateY(0px)");
        setTimeout(() => hideBoidControllerButton.textContent = "Hide controller", 2500);
      } else {
        boidController.style.transform = (`translateY(-${boidController.scrollHeight - 30}px)`);
        setTimeout(() => hideBoidControllerButton.textContent = "Show controller", 2500);
      }
      hideBoidController = !hideBoidController;
    };

    contentContainer = document.querySelector(".content-container");

    document.querySelectorAll(".stacks-content > a > img")
        .forEach(elem => fadeInElements.push(elem as HTMLElement));
    document.querySelectorAll(".projects-list > a")
        .forEach(elem => fadeInElements.push(elem as HTMLElement));
    fadeInElements.push(document.querySelector("#clean-code-img"));
    contactLinks = document.querySelectorAll(".social-networks > a");

    contentContainer.onscroll = () => {
      setOpacityOnScroll(fadeInElements, contentContainer.scrollTop);
      setOpacityOnScroll(contactLinks, contentContainer.scrollTop);

      if (contentContainer.scrollTop + window.innerHeight >= contentContainer.scrollHeight)
        contactLinks.forEach(contactLink => contactLink.classList.add("contact-link-animation"));
      else contactLinks.forEach(contactLink => contactLink.classList.remove("contact-link-animation"));
    }
    setOpacityOnScroll(fadeInElements, contentContainer.scrollTop);


    flock = new Flock(p5, FLOCK_START_SIZE, FLOCK_MAX_SIZE);
  };

  p5.draw = () => {
    p5.background(0);
    if (!hideFlock) flock.update({
      addBoidOnClick,
      showQuadtree,
      showRadius,
      alignCoefficient: alignCoefficientSlider.value() as number,
      cohesionCoefficient: cohesionCoefficientSlider.value() as number,
      separationCoefficient: separationCoefficientSlider.value() as number,
      alignRadius: alignRadiusSlider.value() as number,
      cohesionRadius: cohesionRadiusSlider.value() as number,
      separationRadius: separationRadiusSlider.value() as number,
      maxSpeed: maxSpeedSlider.value() as number,
      maxForce: maxForceSlider.value() as number
    });
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    flock.resizeTank(p5.windowWidth, p5.windowHeight);
    setOpacityOnScroll(fadeInElements, contentContainer.scrollTop);
  };

  function createSlider(parent: string, value: number): P5.Element {
    const slider = p5.createSlider(0, value * 2, value, value / 10);
    slider.parent(parent);
    displaySliderValue(`#${parent}-value`, slider.value());
    slider.size(p5.windowWidth > 600 ? 250 : 150);
    // @ts-ignore
    slider.input(() => displaySliderValue(`#${parent}-value`, slider.value()));
    return slider;
  }
};

window.onload = () => {
  new P5(sketch);
};

function setOpacityOnScroll(elements: HTMLElement[] | NodeListOf<HTMLElement>, currentScroll: number, heightCoef = 1) {
  elements.forEach(element => {
    element.style.opacity = String((currentScroll + window.innerHeight - element.offsetTop) / (heightCoef * element.scrollHeight))
  });
}

function displaySliderValue(placeholderQuerySelector: string, value: number | string) {
  document.querySelector(placeholderQuerySelector).textContent = value as string;
}
