import { generateFilm } from '../mock/film.js';

const FILM_COUNT = 14;

export default class FilmsModel {
  #films = Array.from({length: FILM_COUNT}, generateFilm);

  get films() {
    return this.#films;
  }
}
