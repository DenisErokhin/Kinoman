import { FilterType, UpdateType  } from '../const.js';
import { filter } from '../utils/filter.js';
import FilmFilterView from '../view/film-filter-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filmsModel = null;
  #filtersModel = null;
  #filterComponent = null;

  constructor (filterContainer, filmsModel, filtersModel) {
    this.#filterContainer = filterContainer;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters () {
    const films = this.#filmsModel.films;

    return [
      {
        name: FilterType.ALL,
        count: filter[FilterType.ALL](films).length,
      },
      {
        name: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        name: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
      {
        name: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      }];
  }

  init () {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilmFilterView(filters, this.#filtersModel.filter);
    this.#filterComponent.setFilterClickHandler(this.#handleChangeFilter);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleChangeFilter = (typeFilter) => {
    if (this.#filtersModel.filter === typeFilter) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, typeFilter);
  };
}
