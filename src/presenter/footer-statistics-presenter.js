import FooterStatisticsView from '../view/footer-statistics-view.js';
import { replace, render, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class FooterStatisticsPresenter {
  #container = null;
  #filmsModel = null;
  #footerStatisticsComponent = null;
  #filmCount = null;

  constructor(container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#filmCount = this.#filmsModel.films.length;
    const prevfooterStatisticsComponent = this.#footerStatisticsComponent;

    this.#footerStatisticsComponent = new FooterStatisticsView(this.#filmCount);

    if (prevfooterStatisticsComponent === null) {
      render(this.#footerStatisticsComponent, this.#container);
      return;
    }

    replace(this.#footerStatisticsComponent, prevfooterStatisticsComponent);
    remove(prevfooterStatisticsComponent);
  }

  #modelEventHandler = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
