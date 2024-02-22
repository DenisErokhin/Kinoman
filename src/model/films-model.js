import { generateFilm } from '../mock/film.js';

const FILM_COUNT = 21;

export default class FilmsModel {
  #films = Array.from({length: FILM_COUNT}, generateFilm);

  get films() {
    return this.#films;
  }
}
