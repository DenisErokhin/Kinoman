import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

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
}
