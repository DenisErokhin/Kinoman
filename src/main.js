import BoardPresenter from './presenter/board-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filters-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsApiService from './films-api-service.js';
import CommentsApiService from './comments-api-service.js';
import HeaderProfilePresenter from './presenter/header-profile-presenter.js';
import FooterStatisticsPresenter from './presenter/footer-statistics-presenter.js';

const AUTHORIZATION = 'Basic sdgfasdgdgdgdgeded';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict';


const siteMainElement = document.querySelector('.main');
const pageHeader = document.querySelector('.header');
const pageFooter = document.querySelector('.footer');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filtersModel = new FilterModel(filmsModel);
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const headerProfilePresenter = new HeaderProfilePresenter(pageHeader, filmsModel);
const footerStatisticsPresenter = new FooterStatisticsPresenter(pageFooter, filmsModel);

const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filtersModel);
filterPresenter.init();

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filtersModel, commentsModel);

filmsModel.init();
headerProfilePresenter.init();
footerStatisticsPresenter.init();
boardPresenter.init();

export {boardPresenter, commentsModel};


