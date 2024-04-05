import { render, replace, remove } from '../framework/render.js';
import FilmCartView from '../view/film-cart-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #boardContainer = null;
  #filmCart = null;
  #film = null;
  #changeData = null;
  #changeMode = null;
  #mode = null;
  #renderFilmDetailsComponent = null;

  constructor(filmListContainer, changeData, renderFilmDetailsComponent) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#renderFilmDetailsComponent = renderFilmDetailsComponent;
  }

  init(film) {
    this.#film = film;
    const prevFilmCart = this.#filmCart;
    this.#filmCart = new FilmCartView(this.#film);

    this.#filmCart.setFavoriteClickHandler(this.handleFavoriteClick);
    this.#filmCart.setWatchListClickHandler(this.handleWatchListClick);
    this.#filmCart.setAlreadyWatchClickHandler(this.handleAlreadyWatchedClick);
    this.#filmCart.setClickHandler(() => {
      this.#renderFilmDetailsComponent(this.#film);
    });

    if (prevFilmCart === null) {
      render(this.#filmCart, this.#filmListContainer.element);
      return;
    }

    if(this.#filmListContainer.element.contains(prevFilmCart.element)) {
      replace(this.#filmCart, prevFilmCart);
    }

    remove(prevFilmCart);
  }

  // resetView = () => {
  //   // this.closeFilmDetails();
  // };

  handleWatchListClick = () => {
    this.#film.userDetails.watchList = !this.#film.userDetails.watchList;
    this.#changeData(this.#film);
  };

  handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(this.#film);
  };

  handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(this.#film);
  };

  destroy() {
    remove(this.#filmCart);
  }
}
