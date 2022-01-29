import P5 from "p5";

import { Flock } from "./flock/flock";

const sketch = (p5: P5) => {

  const FLOCK_START_SIZE = 200;
  const FLOCK_MAX_SIZE = 400;

  let flock: Flock;

  let hideFlockButton: HTMLButtonElement;
  let hideFlock = false;

  let hideContentButton: HTMLButtonElement;
  let hideContent = false;

  let addBoidOnClick = true;

  let contentContainer: HTMLDivElement;
  let fadeInElements: HTMLElement[] = [];
  let contactLinks: NodeListOf<HTMLAnchorElement>;

  p5.setup = () => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("sketch");

    hideFlockButton = document.querySelector("#hide-flock-button");
    hideFlockButton.onclick = () => {
      hideFlock = !hideFlock;
      hideFlockButton.textContent = `${ hideFlock ? 'Show' : 'Hide' } flock`;
    }

    contentContainer = document.querySelector(".content-container");

    hideContentButton = document.querySelector("#hide-content-button");
    hideContentButton.onclick = () => {
      hideContent = !hideContent;
      hideContentButton.textContent = `${ hideContent ? 'Show' : 'Hide' } text`;
      hideContent ? contentContainer.classList.add('hidden') : contentContainer.classList.remove('hidden');
    }

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
    if (!hideFlock) flock.update(addBoidOnClick);
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    flock.resizeTank(p5.windowWidth, p5.windowHeight);
    setOpacityOnScroll(fadeInElements, contentContainer.scrollTop);
  };
};

new P5(sketch);

function setOpacityOnScroll(elements: HTMLElement[] | NodeListOf<HTMLElement>, currentScroll: number, heightCoef = 1) {
  elements.forEach(element => {
    element.style.opacity = String((currentScroll + window.innerHeight - element.offsetTop) / (heightCoef * element.scrollHeight))
  });
}
