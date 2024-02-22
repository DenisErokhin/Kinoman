import { render } from './framework/render.js';
import FilmBoardPresenter from './presenter/film-board-presenter.js';
import FilmFilterView from './view/film-filter-view.js';
import ProfileView from './view/profile-view.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import {generateFilter} from './mock/filter.js';
import { getUserStatus } from './utils/user.js';
import StatisticsFilmView from './view/footer-statistics-view.js';

const siteMainElement = document.querySelector('.main');
const pageHeader = document.querySelector('.header');
const pageFooter = document.querySelector('.footer');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, commentsModel);
const filters = generateFilter(filmsModel.films);
const userStatus = getUserStatus(filmsModel.films);
render(new StatisticsFilmView(filmsModel.films), pageFooter);

render(new FilmFilterView(filters), siteMainElement);
render(new ProfileView(userStatus), pageHeader);
filmBoardPresenter.init();


