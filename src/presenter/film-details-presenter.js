import { render, remove } from '../framework/render.js';
import PopupFilmInfoView from '../view/popup-film-info-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class FilmDetailsPresenter {
  #boardContainer = null;
  #filmCartDetails = null;
  #commentsModel = null;
  mode = Mode.DEFAULT;

  constructor(boardContainer, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#commentsModel = commentsModel;
  }

  renderFilmDetails = (film) => {
    if(this.mode !== Mode.DEFAULT) {
      return;
      // this.closeFilmDetails();
    }

    this.mode = Mode.DETAILS;

    const comments = [...this.#commentsModel.comments];
    this.#filmCartDetails = new PopupFilmInfoView(film, comments);


    render(this.#filmCartDetails, this.#boardContainer.parentElement);
    this.#filmCartDetails.setClickHandler(this.closeFilmDetails);
    document.querySelector('body').classList.add('hide-overflow');
    document.addEventListener('keydown', this.onEscKeyDown);
  };

  closeFilmDetails = () => {
    this.mode = Mode.DEFAULT;
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
}
