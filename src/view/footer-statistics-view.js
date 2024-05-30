import AbstractView from '../framework/view/abstract-view';

const getStatisticsTemplate = (filmCount) => `<section class="footer__statistics"><p>${filmCount} movies inside</p></section>`;

export default class FooterStatisticsView extends AbstractView {
  #filmCount = null;

  constructor(filmCount) {
    super();
    this.#filmCount = filmCount;
  }

  get template() {
    return getStatisticsTemplate(this.#filmCount);
  }
}

