import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import ProfileView from './view/profile-view.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import { getUserStatus } from './utils/user.js';
import StatisticsFilmView from './view/footer-statistics-view.js';
import FilterModel from './model/filters-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
// import FilmDetailsPresenter from './presenter/film-details-presenter.js';

const siteMainElement = document.querySelector('.main');
const pageHeader = document.querySelector('.header');
const pageFooter = document.querySelector('.footer');

const filmsModel = new FilmsModel();
const filtersModel = new FilterModel();
const commentsModel = new CommentsModel();
const userStatus = getUserStatus(filmsModel.films);
render(new StatisticsFilmView(filmsModel.films), pageFooter);

render(new ProfileView(userStatus), pageHeader);

const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filtersModel);
filterPresenter.init();

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filtersModel, commentsModel);
boardPresenter.init();


export {boardPresenter, commentsModel};


