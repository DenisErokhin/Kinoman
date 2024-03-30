import { render, replace, remove } from '../framework/render.js';
import FilmCartView from '../view/film-cart-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #boardContainer = null;
  #filmCart = null;
  #film = null;
  #renderFilmDetails = null;
  #changeData = null;
  #changeMode = null;

  constructor(filmListContainer, renderFilmDetails, closeFilmDetails, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#renderFilmDetails = renderFilmDetails;
    this.#changeData = changeData;
    this.closeFilmDetails = closeFilmDetails;
  }

  init(film) {
    this.#film = film;
    const prevFilmCart = this.#filmCart;

    this.#filmCart = new FilmCartView(film);


    this.#filmCart.setFavoriteClickHandler(this.handleFavoriteClick);
    this.#filmCart.setWatchListClickHandler(this.handleWatchListClick);
    this.#filmCart.setAlreadyWatchClickHandler(this.handleAlreadyWatchedClick);

    if (prevFilmCart === null) {
      this.#filmCart.setClickHandler(() => {
        this.#renderFilmDetails(film);
      });

      render(this.#filmCart, this.#filmListContainer.element);
      return;
    }

    if(this.#filmListContainer.element.contains(prevFilmCart.element)) {
      replace(this.#filmCart, prevFilmCart);
    }

    remove(prevFilmCart);
  }

  // resetView() {
  //   if(this.#mode !== Mode.DEFAULT) {
  //     this.closeFilmDetails();
  //   }
  // }

  handleWatchListClick = () => {
    this.#changeData({...this.#film, watchList: !this.#film.userDetails.watchList});
  };

  handleFavoriteClick = () => {
    this.#changeData({...this.#film, favorite: !this.#film.userDetails.favorite});
  };

  handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#film, alreadyWatched: !this.#film.userDetails.alreadyWatched});
  };

  destroy() {
    remove(this.#filmCart);
  }
}
