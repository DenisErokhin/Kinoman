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
  popupFilmInfoView = new PopupFilmInfoView();


  init(boardContainer, filmsModel, commentsModel) {
    this.boardContainer = boardContainer;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;
    this.films = [...this.filmsModel.getFilms()];
    this.comments = [...this.commentsModel.getComments()];

    render(new FilmSortView(), boardContainer);
    render(this.filmsComponent, boardContainer);
    render(this.filmsList, this.filmsComponent.getElement());
    render(this.filmListContainer, this.filmsList.getElement());

    for(let i = 1; i < this.films.length; i++) {
      render(new FilmCartView(this.films[i]), this.filmListContainer.getElement());
    }

    render(new ButtonShowMoreView(), this.filmsList.getElement());
    render(new PopupFilmInfoView(this.films[0], this.comments), this.boardContainer.parentElement);
  }

}

