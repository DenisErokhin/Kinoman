import AbstractView from '../framework/view/abstract-view';

const getStatisticsTemplate = (amountFilms) => `<section class="footer__statistics"><p>${amountFilms} movies inside</p></section>`;

export default class StatisticsFilmView extends AbstractView {
  #amountFilms = null;

  constructor(films) {
    super();
    this.#amountFilms = films.length;
  }

  get template() {
    return getStatisticsTemplate(this.#amountFilms);
  }
}

