import AbstractView from '../framework/view/abstract-view.js';

const createFilmListTemplate = () => `
<section class="films-list">
</section>`;

export default class FilmsListView extends AbstractView {

  get template() {
    return createFilmListTemplate();
  }
}

/* <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2> */
