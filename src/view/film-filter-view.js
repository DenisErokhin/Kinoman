import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  if (name === FilterType.ALL) {
    return `<a href="#${name}" class="main-navigation__item" data-type-filter="${name}">${name}</a>`;
  }

  return `<a href="#${name}" class="main-navigation__item" data-type-filter="${name}">${name}
  <span class="main-navigation__item-count">${count}</span>
  </a>`;
};

/* <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a> */

const createFilterTemplate = (filters) => {
  const filtersTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join('');

  return `<nav class="main-navigation">
    ${filtersTemplate}
    </nav>`;
};

export default class FilmFilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  // checkChangeValue() {

  // }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.addEventListener('click', this.#filterClickHandler);
  };

  #filterClickHandler = (evt) => {
    if(evt.target.tagName !==  'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.typeFilter);
  };
}
