import { EMOTIONS } from '../const.js';

const createSmileTemplate = (emotion, checkedEmotion, isDisabled) =>
  `<input class="film-details__emoji-item visually-hidden" ${emotion === checkedEmotion ? 'checked': ''} ${isDisabled ? 'disabled' : '' }
    name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
  </label>`;


const createNewCommentTemplate = (checkedEmotion, commentText, isDisabled) =>
  `<div class="film-details__new-comment">
  <div class="film-details__add-emoji-label">
    ${checkedEmotion ? `<img src="./images/emoji/${checkedEmotion}.png" width="55" height="55" alt="emoji">` : ''}
  </div>

  <label class="film-details__comment-label">
    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"
      value="dddd" ${isDisabled ? 'disabled' : '' }>${commentText ? commentText :''}</textarea>
  </label>

  <div class="film-details__emoji-list">
    ${EMOTIONS.map((emotion) => createSmileTemplate(emotion, checkedEmotion, isDisabled)).join('')}
  </div>
  </div>`;

export { createNewCommentTemplate };
