import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: '/movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const responce = await this._load({
      url: `/movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponce = await ApiService.parseResponse(responce);

    return parsedResponce;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      ['film_info']: {
        ...film.filmInfo,
        ['alternative_title']: film.filmInfo.alternativeTitle,
        ['age_rating']: film.filmInfo.ageRating,
        ['total_rating']: film.filmInfo.totalRating,
        ['release']: {
          ...film.filmInfo.release,
          ['release_country']: film.filmInfo.release.releaseCountry,
          ['date']: film.filmInfo.release.date instanceof Date ? film.filmInfo.release.date.toISOString() : null,
        }
      },
      ['user_details']: {
        ...film.userDetails,
        ['already_watched']: film.userDetails.alreadyWatched,
        ['watching_date']: film.userDetails.watchingDate instanceof Date ? film.userDetails.watchingDate.toISOString() : null,
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm['film_info'].alternativeTitle;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info']['release'].releaseCountry;
    delete adaptedFilm.userDetails;
    delete adaptedFilm['user_details'].alreadyWatched;
    delete adaptedFilm['user_details'].watchingDate;

    return adaptedFilm;
  };
}
