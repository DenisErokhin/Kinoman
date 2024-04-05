import { render, replace, remove } from '../framework/render.js';
import PopupFilmInfoView from '../view/popup-film-info-view.js';

export default class FilmDetailsPresenter {
  #boardContainer = null;
  #filmCartDetails = null;
  #commentsModel = null;
  #changeData = null;
  #film = null;

  constructor(boardContainer, commentsModel, changeData) {
    this.#boardContainer = boardContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
  }

  init(film, commentsModel) {
    this.#film = film;
    this.#commentsModel = commentsModel;
    const comments = [...this.#commentsModel.comments];

    const prevFilmCartDetails = this.#filmCartDetails;
    this.#filmCartDetails = new PopupFilmInfoView(film, comments);

    this.#filmCartDetails.setClickHandler(this.closeFilmDetails);
    document.addEventListener('keydown', this.onEscKeyDown);
    this.#filmCartDetails.setFavoriteClickHandler(this.handleFavoriteClick);
    this.#filmCartDetails.setWatchListClickHandler(this.handleWatchListClick);
    this.#filmCartDetails.setAlreadyWatchClickHandler(this.handleAlreadyWatchedClick);

    if(prevFilmCartDetails === null || !this.#boardContainer.parentElement.contains(prevFilmCartDetails.element)) {
      render(this.#filmCartDetails, this.#boardContainer.parentElement);
      return;
    }

    replace(this.#filmCartDetails, prevFilmCartDetails);
    remove(prevFilmCartDetails);
  }

  closeFilmDetails = () => {
    remove(this.#filmCartDetails);
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.onEscKeyDown);
  };

  onEscKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closeFilmDetails();
    }
  };

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
}
