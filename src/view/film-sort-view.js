import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortFilmTemplate = (currentSortType) => `<ul class="sort">
<li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : '' }" data-type-sort="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-type-sort="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-type-sort="${SortType.RATING}">Sort by rating</a></li>
</ul>`;

export default class FilmSortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;

  }

  get template() {
    return createSortFilmTemplate(this.#currentSortType);
  }

  setSortTypeClickHandler = (callback) => {
    this._callback.sortTypeClick = callback;
    this.element.addEventListener('click', this.#sortTypeClickHandler);
  };

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeClick(evt.target.dataset.typeSort);
  };
}
