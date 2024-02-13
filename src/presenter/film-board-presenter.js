// import { render } from '../render.js';
import { render, remove } from '../framework/render.js';
import FilmsComponentView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCartView from '../view/film-cart-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import PopupFilmInfoView from '../view/popup-film-info-view.js';
import FilmSortView from '../view/film-sort-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';

const FILM_COUNT_PER_STEP = 5;

const TextTitle = {
  ALL_MOVIES: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITE: 'There are no favorite movies now',
};

export default class FilmBoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmCartDetails = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsComponent = new FilmsComponentView();
  #filmsList = new FilmsListView();
  #filmListContainer = new FilmListContainerView();
  #buttonShowMore = new ButtonShowMoreView();
  #films = [];

  constructor(boardContainer, filmsModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];
    this.#renderFilmBoard();
  }

  #renderFilmBoard() {
    render(new FilmSortView(), this.#boardContainer);
    render(this.#filmsComponent, this.#boardContainer);
    render(this.#filmsList, this.#filmsComponent.element);


    if (this.#films.length) {
      render(this.#filmListContainer, this.#filmsList.element);

      for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#films[i]);
      }
    } else {
      this._filmListTitle = this.#filmsList.element.querySelector('.films-list__title');
      this._filmListTitle.classList.remove('visually-hidden');
      this._filmListTitle.textContent = TextTitle.ALL_MOVIES;
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#buttonShowMore, this.#filmsList.element);
      this.#buttonShowMore.setClickHandler(this.#handleLoadMoreButton);
    }
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

  #renderFilm(film) {
    const filmCart = new FilmCartView(film);
    filmCart.setClickHandler(() => {
      this.#renderFilmDetails(film);
    });

    render(filmCart, this.#filmListContainer.element);
  }

  #renderFilmDetails(film) {
    const comments = [...this.#commentsModel.comments];
    this.#filmCartDetails = new PopupFilmInfoView(film, comments);
    this.#filmCartDetails.setClickHandler(this.#closeFilmDetails);

    document.querySelector('body').classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    render(this.#filmCartDetails, this.#boardContainer.parentElement);
  }

  #closeFilmDetails = () => {
    remove(this.#filmCartDetails);
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeFilmDetails();
    }
  };
}

