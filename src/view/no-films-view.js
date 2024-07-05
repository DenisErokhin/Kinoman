import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const TextTitle = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmTemplate = (currentFilter) => `<h2 class="films-list__title">${TextTitle[currentFilter]}</h2>`;

export default class NoFilmView extends AbstractView {
  #currentFilter = null;

  constructor (currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createNoFilmTemplate(this.#currentFilter);
  }
}
