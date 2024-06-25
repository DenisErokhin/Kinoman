import { humanizeDate } from '../utils/film.js';
import he from 'he';

const createComment = (element, isDisabled, deletedCommentId) => {
  const {id, author, comment, date, emotion} = element;

  return `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeDate(date)}</span>
          <button class="film-details__comment-delete" ${isDisabled ? 'disabled' : ''}>${deletedCommentId === id ? 'Deleting' : 'Delete'}</button>
        </p>
    </div>
    </li>`;
};

export const createCommentTemplate = (elements, isDisabled, deletedCommentId,) => {


  if (elements.length === 0) {
    return '';
  }

  let newCommentsTemplate = '';

  for (let i = 0; i < elements.length; i++) {
    newCommentsTemplate += createComment(elements[i], isDisabled, deletedCommentId);
  }

  return newCommentsTemplate;
};
