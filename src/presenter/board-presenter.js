import { render, remove } from '../framework/render.js';
import FilmsComponentView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmSortView from '../view/film-sort-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmFilterView from '../view/film-filter-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import { updateItem } from '../utils/common.js';
import { generateFilter } from '../mock/filter.js';
import { FilterType, SortType } from '../const.js';
import { filter } from '../utils/filter.js';
import { sortFilmByDate, sortFilmByRating } from '../utils/film.js';

const FILM_COUNT_PER_STEP = 5;

const TextTitle = {
  ALL_MOVIES: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITE: 'There are no favorite movies now',
};

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsComponent = new FilmsComponentView();
  #filmsList = new FilmsListView();
  #filmListContainer = new FilmListContainerView();
  #buttonShowMore = new ButtonShowMoreView();
  #filmSort = new FilmSortView();
  #filtersFilm = null;
  #films = [];
  #sourcedBoardFilms = [];
  #filmPresenter = new Map();
  #filmDetailsPresenter = null;
  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;

  constructor(boardContainer, filmsModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];
    this.#sourcedBoardFilms = [...this.#filmsModel.films];

    this.#renderBoard();
  }

  #renderFilmSort() {
    render(this.#filmSort, this.#boardContainer);
    this.#filmSort.setSortTypeClickHandler(this.#handleSortType);
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmByRating);
        break;
      default:
        this.#films = [...this.#sourcedBoardFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleSortType = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderFilms();
  };

  #renderFilters() {
    const filters = generateFilter(this.#filmsModel.films);
    this.#filtersFilm = new FilmFilterView(filters);
    this.#filtersFilm.setFilterClickHandler(this.#handleChangeFilter);
    render(this.#filtersFilm, this.#boardContainer);
  }

  #renderFilmComponent(){
    render(this.#filmsComponent, this.#boardContainer);
  }

  #renderFilmList(){
    render(this.#filmsList, this.#filmsComponent.element);
  }

  #renderFilmListContainer() {
    render(this.#filmListContainer, this.#filmsList.element);
  }

  #renderButtonShowMore() {
    render(this.#buttonShowMore, this.#filmsList.element);
    this.#buttonShowMore.setClickHandler(this.#handleLoadMoreButton);
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter(
      this.#filmListContainer,
      this.#handleFilmChange,
      this.#renderFilmDetailsComponent
    );
    this.#filmPresenter.set(film.id, filmPresenter);
    filmPresenter.init(film);
  }

  #renderFilms() {
    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderButtonShowMore();
    }
  }

  #renderNoFilms() {
    this._filmListTitle = this.#filmsList.element.querySelector('.films-list__title');
    this._filmListTitle.classList.remove('visually-hidden');
    this._filmListTitle.textContent = TextTitle.ALL_MOVIES;
    this.#filmSort.element.classList.add('visually-hidden');
  }

  #renderFilmDetailsComponent = (film) => {
    this.#selectedFilm = film;
    if(!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#boardContainer, this.#commentsModel, this.#handleFilmChange);
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, this.#commentsModel);
    document.querySelector('body').classList.add('hide-overflow');
  };

  #changeFiltersValue () {
    const filters = generateFilter(this.#films);
    const filtersButton = this.#filtersFilm.element.querySelectorAll('a');

    for(let i = 0; i < filters.length; i++) {
      if (filtersButton[i].dataset.typeFilter === FilterType.ALL) {
        continue;
      }

      if (filtersButton[i].dataset.typeFilter === filters[i].name) {
        filtersButton[i].querySelector('.main-navigation__item-count').textContent = filters[i].count;
      }
    }
  }

  #handleFilmChange = (updatedItem) => {
    this.#films = updateItem(this.#films, updatedItem);
    this.#filmPresenter.get(updatedItem.id).init(updatedItem);
    this.#changeFiltersValue();
  };

  #filterFilms = (typeFilter) => {
    this.#films = [...this.#sourcedBoardFilms];
    this.#films = filter[typeFilter](this.#films);
    return this.#films;
  };

  #handleChangeFilter = (typeFilter) => {
    this.#filterFilms(typeFilter);
    this.#clearFilmList();
    this.#renderFilms();
  };

  // #handleModeChange = () => {
  //   this.#filmPresenter.forEach((presenter) => presenter.resetView());
  // };

  #clearFilmList() {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#buttonShowMore);
  }

  #handleLoadMoreButton = () => {
    for(let i = this.#renderedFilmCount; i < this.#renderedFilmCount + FILM_COUNT_PER_STEP; i++) {
      if (i >= this.#films.length) {
        remove(this.#buttonShowMore);
        break;
      }
      this.#renderFilm(this.#films[i]);
    }

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount === this.#films.length) {
      remove(this.#buttonShowMore);
    }
  };

  #renderBoard() {
    this.#renderFilmSort();
    this.#renderFilters();
    this.#renderFilmComponent();
    this.#renderFilmList();


    if (this.#films.length) {
      this.#renderFilmListContainer();
      this.#renderFilms();
    } else {
      this.#renderNoFilms();
    }
  }
}

