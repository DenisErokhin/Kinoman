import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortFilmTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-type-sort="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" data-type-sort="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button" data-type-sort="${SortType.RATING}">Sort by rating</a></li>
</ul>`;

export default class FilmSortView extends AbstractView {

  get template() {
    return createSortFilmTemplate();
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
    const links = this.element.querySelectorAll('a');

    links.forEach((link) => {
      if (link !== evt.target && link.classList.contains('sort__button--active')) {
        link.classList.remove('sort__button--active');
      }
    });

    evt.target.classList.add('sort__button--active');
  };
}
