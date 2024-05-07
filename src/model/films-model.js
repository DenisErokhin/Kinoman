import { generateFilm } from '../mock/film.js';
import Observable from '../framework/observable.js';

const FILM_COUNT = 19;

export default class FilmsModel extends Observable {
  #films = Array.from({length: FILM_COUNT}, generateFilm);

  get films() {
    return this.#films;
  }

  addFilm = (updateType, update) => {

    this.#films =  [
      ...this.#films,
      update,
    ];

    this._notify(updateType, update);
  };

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      return this.#films;
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  // removeFilm = (updateType, update) => {
  //   const index = this.#films.findIndex((film) => film.id === update.id);

  //   if (index === -1) {
  //     return this.#films;
  //   }

  //   this.#films = [
  //     ...this.#films.slice(0, index),
  //     ...this.#films.slice(index + 1),
  //   ];

  //   this._notify(updateType, update);
  // };
}
