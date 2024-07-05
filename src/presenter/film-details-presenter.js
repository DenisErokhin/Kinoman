import { render, replace, remove } from '../framework/render.js';
import PopupFilmInfoView from '../view/popup-film-info-view.js';
import { UserAction, UpdateType, UserDetailsValue } from '../const.js';

export default class FilmDetailsPresenter {
  #boardContainer = null;
  #filmCartDetails = null;
  #commentsModel = null;
  #changeData = null;
  #closeFilmDetails = null;
  #film = null;
  #comments = null;
  #deletedComment = null;
  #valueActiveButton = null;

  constructor(boardContainer, commentsModel, changeData, closeFilmDetails) {
    this.#boardContainer = boardContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#closeFilmDetails = closeFilmDetails;
    this.#commentsModel.addObserver(this.handleModelEvent);
  }

  init (film, comments, isCommentLoadingError) {
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

  handleModelEvent = (updateType, update) => {
    if (update) {
      this.#film = update;
    }

    this.#filmCartDetails.updatePopup(this.#film, this.#commentsModel.comments);
  };

  checkValidComment = (commentField, emotion) => {
    let warningText = '';

    if (!commentField.value.trim()) {
      warningText = 'Комментарий не может быть пустым';
    } else if (!emotion) {
      warningText = 'Выберите эмоцию';
    }

    commentField.setCustomValidity(warningText);
    return warningText;
  };

  destroy = () => {
    remove(this.#filmCartDetails);
  };

  handleWatchListClick = () => {
    this.#valueActiveButton = UserDetailsValue.WATCHLIST;
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  handleFavoriteClick = () => {
    this.#valueActiveButton = UserDetailsValue.FAVORITE;
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  handleAlreadyWatchedClick = () => {
    this.#valueActiveButton = UserDetailsValue.WATCHED;
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  createComment = () => {
    const {commentField, comment, emotion} = this.#filmCartDetails.getCommentInfo();

    if (this.checkValidComment(commentField, emotion)) {
      return;
    }

    const newComment = {
      comment,
      emotion,
    };

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this.#film,
      newComment);
  };

  handleCommentDeleteClick = (commentId) => {
    this.#deletedComment = this.#commentsModel.comments.find((comment) => comment.id === commentId);

    this.#changeData(
      UserAction.REMOVE_COMMENT,
      UpdateType.PATCH,
      this.#film,
      this.#deletedComment,
    );
  };

  setSaving = () => {
    this.#filmCartDetails.updateElement({
      isDisabled: true,
    });

    this.#filmCartDetails.fixScrollPosition();
  };

  setDeleting = () => {
    this.#filmCartDetails.updateElement({
      isDisabled: true,
      deletedCommentId: this.#deletedComment.id,
    });

    this.#filmCartDetails.fixScrollPosition();
  };

  setAborting = (userAction) => {
    const resetFormState = () =>  {
      this.#filmCartDetails.updateElement({
        isDisabled: false,
        deletedCommentId: null,
      });

      this.#filmCartDetails.fixScrollPosition();
    };

    switch (userAction) {
      case UserAction.UPDATE_FILM:
        this.#film.userDetails[this.#valueActiveButton] = !this.#film.userDetails[this.#valueActiveButton];
        resetFormState();
        document.querySelector('.film-details__controls').classList.add('shake');
        break;
      case UserAction.REMOVE_COMMENT:
        resetFormState();
        document.getElementById(this.#deletedComment.id).classList.add('shake');
        break;
      case UserAction.ADD_COMMENT:
        this.#filmCartDetails.shake(resetFormState);
        break;
    }
  };
}
