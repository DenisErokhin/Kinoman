import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);

    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  addFilm = (updateType, update) => {

    this.#films =  [
      ...this.#films,
      update,
    ];

    this._notify(updateType, update);
  };

  updateFilm  = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      return this.#films;
    }

    try {
      const responce = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(responce);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update task');
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
