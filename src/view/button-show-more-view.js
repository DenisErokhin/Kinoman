import { createElement } from '../render.js';

const createButtonShowTemplate = () => `
  <button class="films-list__show-more">Show more</button>`;

export default class ButtonShowMoreView {
  #element = null;

  get template() {
    return createButtonShowTemplate();
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
