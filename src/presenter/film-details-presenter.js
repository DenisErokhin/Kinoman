import { render, replace, remove } from '../framework/render.js';
import PopupFilmInfoView from '../view/popup-film-info-view.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class FilmDetailsPresenter {
  #boardContainer = null;
  #filmCartDetails = null;
  #commentsModel = null;
  #changeData = null;
  #closeFilmDetails = null;
  #film = null;
  #comments = null;
  #onCtrlEnterDown = null;

  constructor(boardContainer, commentsModel, changeData, closeFilmDetails) {
    this.#boardContainer = boardContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#closeFilmDetails = closeFilmDetails;
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init(film, comments, isCommentLoadingError) {
    this.#film = film;
    this.#comments = (!isCommentLoadingError) ? comments : [];

    const prevFilmCartDetails = this.#filmCartDetails;
    this.#filmCartDetails = new PopupFilmInfoView(film, this.#comments);

    this.#filmCartDetails.setCloseClickHandler(() => {
      this.#closeFilmDetails();
    });
    this.#filmCartDetails.setFavoriteClickHandler(this.handleFavoriteClick);
    this.#filmCartDetails.setWatchListClickHandler(this.handleWatchListClick);
    this.#filmCartDetails.setAlreadyWatchClickHandler(this.handleAlreadyWatchedClick);
    this.#filmCartDetails.setDeleteCommentClickHandler(this.handleCommentDeleteClick);

    if(prevFilmCartDetails === null || !this.#boardContainer.parentElement.contains(prevFilmCartDetails.element)) {
      render(this.#filmCartDetails, this.#boardContainer.parentElement);
      return;
    }

    replace(this.#filmCartDetails, prevFilmCartDetails);
    remove(prevFilmCartDetails);
  }

  #handleModelEvent = () => {
    this.#filmCartDetails.updateComments(this.#commentsModel.comments);
  };

  checkValidComment = (commentField, checkedEmotion) => {
    if (commentField.value.trim() === '') {
      commentField.setCustomValidity('Комментарий не может быть пустым');
      return false;
    }

    if (checkedEmotion === null) {
      commentField.setCustomValidity('Выберите эмоцию');
      return false;
    }

    return true;
  };

  destroy = () => {
    remove(this.#filmCartDetails);
  };

  handleWatchListClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  createComment = () => {
    const {commentField, checkedEmotion} = this.#filmCartDetails.getCommentInfo();

    if(!this.checkValidComment(commentField, checkedEmotion)) {
      return;
    }

    const newCommentId = nanoid();

    const newComment = {
      id: newCommentId,
      author: 'random',
      comment: commentField.value,
      date: new Date(),
      emotion: checkedEmotion,
    };

    this.#film.comments = [...this.#film.comments, newCommentId];

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this.#film,
      newComment);
  };

  handleCommentDeleteClick = (commentId) => {
    const index = this.#commentsModel.comments.findIndex((comment) => comment.id === commentId);
    const deletedComment = this.#commentsModel.comments.find((comment) => comment.id === commentId);
    this.#film.comments = [
      ...this.#film.comments.slice(0, index),
      ...this.#film.comments.slice(index + 1)
    ];

    this.#changeData(
      UserAction.REMOVE_COMMENT,
      UpdateType.PATCH,
      this.#film,
      deletedComment
    );
  };
}
