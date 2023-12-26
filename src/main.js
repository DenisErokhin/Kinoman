import {render} from './render.js';
import FilmBoardPresenter from './presenter/film-boart-presenter.js';
import FilmFilterView from './view/film-filter-view.js';
import ProfileView from './view/profile-view.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

const siteMainElement = document.querySelector('.main');
const pageHeader = document.querySelector('.header');
const filmBoardPresenter = new FilmBoardPresenter();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

render(new FilmFilterView(), siteMainElement);
render(new ProfileView(), pageHeader);
filmBoardPresenter.init(siteMainElement, filmsModel, commentsModel);
