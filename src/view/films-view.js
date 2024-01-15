import { createElement } from '../render.js';

const createFilmContainerTemplate = () => `
  <section class="films">
  </section>`;

export default class FilmsComponentView {
  #element = null;

  get template() {
    return createFilmContainerTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
