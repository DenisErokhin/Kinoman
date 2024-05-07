import { createCommentTemplate } from './comments-film-template.js';
import { humanizeFilmReleaseDate, getMinutesToTime } from '../utils/film.js';
import { createNewCommentTemplate } from './new-comment-template.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;

const getGenreTemplate = (genre) => {
  let genreTemplate = '';

  for (let i = 0; i < genre.length; i++) {
    genreTemplate += createGenre(genre[i]);
  }

  return genreTemplate;
};


const createPopupInfoTemplate = (state) => {
  const {film, comments, checkedEmotion, commentText} = state;
  const {title, totalRating, release, runtime, genre, poster, description, ageRating, director, writers, actors} = film.filmInfo;

  return `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

        <p class="film-details__age">${ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">Original: ${title}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizeFilmReleaseDate(release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${getMinutesToTime(runtime)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${release.releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              ${getGenreTemplate(genre)}
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">
          ${description}
        </p>
      </div>
    </div>

    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${film.userDetails.watchList ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${film.userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${film.userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>

  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">${createCommentTemplate(comments)}</ul>

      ${createNewCommentTemplate(checkedEmotion, commentText)}
    </section>
  </div>
      </form>
    </section>`;
};


export default class PopupFilmInfoView extends AbstractStatefulView {
  #film = null;
  #comments = null;
  #changeData = null;
  #commentsLength = null;

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
    this.#commentsLength = this.#comments.length;
    this._state = PopupFilmInfoView.parseCommentToState(this.#film, this.#comments);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupInfoTemplate(this._state);
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  setAlreadyWatchClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchClickHandler);
  };

  #alreadyWatchClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    const deleteButtons = this.element.querySelectorAll('.film-details__comment-delete');
    deleteButtons.forEach((button) => button.addEventListener('click', this.#deleteCommentClickHandler));
  };

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    const deleteComment = evt.target.closest('.film-details__comment');
    const commentId = deleteComment.id;
    this._setState ({
      scrollPosition: this.element.scrollTop,
    });
    this._callback.deleteCommentClick(commentId);
  };

  getCommentInfo = () => {
    const commentField = this.element.querySelector('.film-details__comment-input');
    const checkedEmotion = this._state.checkedEmotion;
    return {commentField, checkedEmotion};
  };

  updateComments = (comments) => {
    this.#comments = comments;

    if (this.#comments.length < this.#commentsLength) {
      this.updateElement({comments});
    } else {
      this.updateElement({
        comments,
        checkedEmotion: null,
        commentText: null,
      });
    }

    this.element.scrollTop = this._state.scrollPosition;
    this.#commentsLength = this.#comments.length;
  };

  static parseCommentToState = (film, comments) => ({
    film,
    comments,
    commentText: null,
    checkedEmotion: null,
    scrollPosition: null,
  });

  // static parseStateToComment = (comment) => ({...comment});

  #emojiToggleHandler = (evt) => {

    this.updateElement({
      commentText: this.element.querySelector('.film-details__comment-input').value,
      checkedEmotion: evt.target.value,
      scrollPosition: this.element.scrollTop,
    });

    this.element.scrollTop = this._state.scrollPosition;
  };

  #commentInputHangler = (evt) => {
    this._setState({
      commentText: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHangler);
    this.element.querySelectorAll('.film-details__emoji-item').forEach((emotion) => emotion.addEventListener('change', this.#emojiToggleHandler));
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#deleteCommentClickHandler));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };
}
