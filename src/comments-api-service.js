import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CommentsApiService extends ApiService {
  #comments = null;

  getComments = (film) => {
    const comments = this._load({url: `/comments/${film.id}`})
      .then(ApiService.parseResponse);

    return comments;
  };
}
