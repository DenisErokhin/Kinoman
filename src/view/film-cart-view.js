import { humanizeFilmReleaseDateInYear, getTimeFilm } from '../utils/task.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilmCartTemplate = (film) => {
  const {comments, filmInfo} = film;
  const {title, totalRating, release, runtime, genre, poster, description} = filmInfo;
  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
       <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeFilmReleaseDateInYear(release.date)}</span>
        <span class="film-card__duration">${getTimeFilm(runtime)}</span>
        <span class="film-card__genre">${genre.join(', ')}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCartView extends AbstractView{
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCartTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this._filmCartLink = this.element.querySelector('.film-card__link');
    this._filmCartLink.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
