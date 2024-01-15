import { render } from '../render.js';
import FilmsComponentView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCartView from '../view/film-cart-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import PopupFilmInfoView from '../view/popup-film-info-view.js';
import FilmSortView from '../view/film-sort-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';

export default class FilmBoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmCartDetails = null;

  #filmsComponent = new FilmsComponentView();
  #filmsList = new FilmsListView();
  #filmListContainer = new FilmListContainerView();

  #films = [];
  #comments = [];


  init(boardContainer, filmsModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#films = [...this.#filmsModel.films];
    this.#comments = [...this.#commentsModel.comments];


    render(new FilmSortView(), this.#boardContainer);
    render(this.#filmsComponent, this.#boardContainer);
    render(this.#filmsList, this.#filmsComponent.element);
    render(this.#filmListContainer, this.#filmsList.element);

    for(let i = 0; i < this.#films.length; i++) {
      this.#renderFilm(this.#films[i]);
    }

    render(new ButtonShowMoreView(), this.#filmsList.element);
  }

  #renderFilm(film) {
    const filmCart = new FilmCartView(film);
    const filmCartLink = filmCart.element.querySelector('.film-card__link');

    filmCartLink.addEventListener('click', () => {
      this.#renderFilmDetails(film);
    });

    render(filmCart, this.#filmListContainer.element);
  }

  #renderFilmDetails(film) {
    this.#filmCartDetails = new PopupFilmInfoView(film, this.#comments);
    const buttonCloseFilmDetails = this.#filmCartDetails.element.querySelector('.film-details__close-btn');
    document.querySelector('body').classList.add('hide-overflow');

    buttonCloseFilmDetails.addEventListener('click', this.#closeFilmDetails);
    document.addEventListener('keydown', this.#onEscKeyDown);


    render(this.#filmCartDetails, this.#boardContainer.parentElement);
  }

  #closeFilmDetails = () => {
    this.#filmCartDetails.element.remove();
    this.#filmCartDetails.removeElement();
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

