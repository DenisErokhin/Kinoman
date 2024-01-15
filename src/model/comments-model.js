import { generateComment } from '../mock/comment.js';

const COMMENT_COUNT = 5;

export default class CommentsModel {
  #comments = Array.from({length: COMMENT_COUNT}, generateComment);

  get comments() {
    return this.#comments;
  }
}
