import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count} = filter;

  if (name === FilterType.ALL) {
    return `<a href="#${name}" class="main-navigation__item ${currentFilterType === name ? 'main-navigation__item--active' : ''}" data-type-filter="${name}">${name}</a>`;
  }

  return `<a href="#${name}" class="main-navigation__item ${currentFilterType === name ? 'main-navigation__item--active' : ''}
  " data-type-filter="${name}">${name}
  <span class="main-navigation__item-count">${count}</span>
  </a>`;
};

const createFilterTemplate = (filters, currentFilterType) =>`
  <nav class="main-navigation">
  ${filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('')}
  </nav>`;

export default class FilmFilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterClickHandler = (cb) => {
    this._callback.filterClick = cb;
    this.element.addEventListener('click', this.#filterClickHandler);
  };

  #filterClickHandler = (evt) => {
    if (evt.target.tagName === 'SPAN') {
      this._callback.filterClick(evt.target.closest('a').dataset.typeFilter);
      return;
    }

    if (evt.target.tagName ===  'A') {
      evt.preventDefault();
      this._callback.filterClick(evt.target.dataset.typeFilter);
    }
  };
}
