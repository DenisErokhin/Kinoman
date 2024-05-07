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

/* <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a> */

const createFilterTemplate = (filters, currentFilterType) => {
  const filtersTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<nav class="main-navigation">
    ${filtersTemplate}
    </nav>`;
};

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

  // checkChangeValue() {

  // }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.addEventListener('click', this.#filterClickHandler);
  };

  #filterClickHandler = (evt) => {
    if(evt.target.tagName === 'SPAN') {
      const activeLink = evt.target.closest('a');
      this._callback.filterClick(activeLink.dataset.typeFilter);
      return;
    }

    if(evt.target.tagName !==  'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.typeFilter);
  };
}
