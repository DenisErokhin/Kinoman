import { render } from '../render.js';
import FilmsComponentView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCartView from '../view/film-cart-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import PopupFilmInfoView from '../view/popup-film-info-view.js';
import FilmSortView from '../view/film-sort-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';

export default class FilmBoardPresenter {
  filmsComponent = new FilmsComponentView();
  filmsList = new FilmsListView();
  filmListContainer = new FilmListContainerView();

  init(boardContainer) {
    this.boardContainer = boardContainer;

    render(new FilmSortView(), boardContainer);
    render(this.filmsComponent, boardContainer);
    render(this.filmsList, this.filmsComponent.getElement());
    render(this.filmListContainer, this.filmsList.getElement());

    for(let i = 0; i < 5; i++) {
      render(new FilmCartView(), this.filmListContainer.getElement());
    }

    render(new ButtonShowMoreView(), this.filmsList.getElement());
    render(new PopupFilmInfoView(), document.querySelector('body'));
  }

}

