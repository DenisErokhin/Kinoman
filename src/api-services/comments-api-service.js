import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {
  #film = null;

  getComments = async (film) => {
    this.#film = film;

    const comments = await this._load({url: `/comments/${film.id}`})
      .then(ApiService.parseResponse)
      .catch(() => null);

    return comments;
  };

  addComment = async (comment) => {
    const responce = await this._load({
      url: `/comments/${this.#film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });


    const parsedResponce = await ApiService.parseResponse(responce);

    return parsedResponce;
  };

  removeComment = async (comment) => {
    await this._load({
      url: `/comments/${comment.id}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': 'application/json'}),
    });
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


