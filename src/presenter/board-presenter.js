import { render, remove, RenderPosition } from '../framework/render.js';
import FilmsComponentView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmSortView from '../view/film-sort-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import { SortType } from '../const.js';
import { filter } from '../utils/filter.js';
import { sortFilmByDate, sortFilmByRating } from '../utils/film.js';
import { UserAction, UpdateType, FilterType } from '../const.js';
import NoFilmView from '../view/no-films-view.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const FILM_COUNT_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsComponent = new FilmsComponentView();
  #filmsList = new FilmsListView();
  #filmListContainer = new FilmListContainerView();
  #loadingComponent = new LoadingView();
  #loadMoreButtonComponent = null;
  #sortComponent = null;
  #filmPresenter = new Map();
  #filmDetailsPresenter = null;
  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #filtersModel = null;
  #noFilmComponent = null;
  #isLoading = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(boardContainer, filmsModel, filtersModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#commentsModel = commentsModel;
    this.#isLoading = true;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const films = this.#filmsModel.films;
    const typeFilter = this.#filtersModel.filter;
    const filteredFilms = filter[typeFilter](films);

    if (this.#currentFilterType !== typeFilter) {
      this.#currentSortType = SortType.DEFAULT;
      this.#currentFilterType = typeFilter;
      return filteredFilms;
    }

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmByRating);
    }

    return filteredFilms;
  }

  init() {
    this.#renderBoard();
  }

  #renderFilmSort() {
    this.#sortComponent = new FilmSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeClickHandler(this.#handleSortType);
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortType = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  };

  #renderFilmComponent() {
    render(this.#filmsComponent, this.#boardContainer);
  }

  #renderFilmList() {
    render(this.#filmsList, this.#filmsComponent.element);
  }

  #renderFilmListContainer() {
    render(this.#filmListContainer, this.#filmsList.element);
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter(
      this.#filmListContainer,
      this.#handleViewAction,
      this.#renderFilmDetailsComponent,
      this.onEscKeyDown
    );
    this.#filmPresenter.set(film.id, filmPresenter);
    filmPresenter.init(film);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#filtersModel.filter);
    render(this.#noFilmComponent, this.#filmsList.element);
  };

  #renderFilmDetailsComponent = async (film) => {
    const comments = await this.#commentsModel.init(film);
    const isCommentLoadingError = !comments;

    if (!isCommentLoadingError) {
      document.addEventListener('keydown', this.onCtrlEnterDown);
    }

    this.#selectedFilm = film;
    if(this.#filmDetailsPresenter) {
      return;
    }
    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#boardContainer, this.#commentsModel, this.#handleViewAction, this.#closeFilmDetailsComponent);
    this.#filmDetailsPresenter.init(this.#selectedFilm, comments, isCommentLoadingError);
    document.querySelector('body').classList.add('hide-overflow');
    document.addEventListener('keydown', this.onEscKeyDown);
  };

  #closeFilmDetailsComponent = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;


    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.onCtrlEnterDown);
    document.removeEventListener('keydown', this.onEscKeyDown);
  };

  onEscKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeFilmDetailsComponent();
    }
  };

  onCtrlEnterDown = (evt) => {
    if (evt.keyCode === 13 && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.createComment();
    }
  };

  #handleViewAction = async (userAction, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    switch (userAction) {
      case UserAction.UPDATE_FILM:
        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.setSaving();
        } else {
          this.#filmPresenter.get(updateFilm.id).setSaving();
        }
        try {
          await this.#filmsModel.updateFilm(updateType, updateFilm);
        } catch (err) {
          if (this.#filmDetailsPresenter) {
            this.#filmDetailsPresenter.setAborting(userAction);
          } else {
            this.#filmPresenter.get(updateFilm.id).setAborting();
          }
        }
        break;
      case (UserAction.ADD_COMMENT):
        this.#filmDetailsPresenter.setSaving();
        try {
          await this.#commentsModel.addComment(updateType, updateComment);
        } catch (err) {
          this.#filmDetailsPresenter.setAborting();
        }
        break;
      case UserAction.REMOVE_COMMENT:
        this.#filmDetailsPresenter.setDeleting();
        try {
          await this.#commentsModel.removeComment(updateType, updateFilm, updateComment);
        } catch (err) {
          this.#filmDetailsPresenter.setAborting(userAction);
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        if(this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.handleModelEvent(update);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoadMoreButton () {
    this.#loadMoreButtonComponent = new ButtonShowMoreView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButton);
    render(this.#loadMoreButtonComponent, this.#filmsList.element);
  }

  #handleLoadMoreButton = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);
    this.#renderFilms(films);

    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#filmsList.element);
  }

  #clearBoard = (resetRenderedFilmCount = false, resetSortType = false) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#loadMoreButtonComponent);
    remove(this.#noFilmComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {

    const films = this.films;
    const filmCount = films.length;

    this.#renderFilmComponent();
    this.#renderFilmList();

    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmSort();
    this.#renderFilmListContainer();
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  };
}
