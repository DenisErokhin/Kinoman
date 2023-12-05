import {render} from './render.js';
import FilmBoardPresenter from './presenter/film-boart-presenter.js';
import FilmFilterView from './view/film-filter-view.js';
import ProfileView from './view/profile-view.js';

const siteMainElement = document.querySelector('.main');
const pageHeader = document.querySelector('.header');
const filmBoardPresenter = new FilmBoardPresenter();

render(new FilmFilterView(), siteMainElement);
render(new ProfileView(), pageHeader);
filmBoardPresenter.init(siteMainElement);
