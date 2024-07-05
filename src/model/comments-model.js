import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor (commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (film) => {
    try {
      this.#comments = await this.#commentsApiService.getComments(film);
    } catch (err) {
      throw new Error('can\'t get comments');
    }

    return this.#comments;
  };

  addComment = async (updateType, update) => {
    try {
      const {movie, comments} = await this.#commentsApiService.addComment(update);
      this.#comments = [...comments];
      this._notify(updateType, this.#adaptToClient(movie));
    } catch (err) {
      throw new Error('can\'t add comment');
    }
  };

  removeComment = async (updateType, film, deletedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === deletedComment.id);

    if (index === -1) {
      throw new Error ('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.removeComment(deletedComment);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      film.comments = [
        ...film.comments.slice(0, index),
        ...film.comments.slice(index + 1),
      ];

      this._notify(updateType, film);

    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (film) => {

    const adaptedFilm = {
      ...film,
      'filmInfo': {
        ...film['film_info'],
        'alternativeTitle': film['film_info']['alternative_title'],
        'ageRating': film['film_info']['age_rating'],
        'totalRating': film['film_info']['total_rating'],
        'release': {
          ...film['film_info']['release'],
          'releaseCountry': film['film_info']['release']['release_country'],
          'date': film['film_info']['release']['date'] !== null ? new Date(film['film_info']['release']['date']) : film['film_info']['release']['date'],
        }
      },
      'userDetails': {
        ...film['user_details'],
        'alreadyWatched': film['user_details']['already_watched'],
        'watchingDate': film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : film['user_details']['watching_date'],
      },
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo.release['release_country'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  };
}
