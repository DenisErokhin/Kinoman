import { generateComment } from '../mock/comment.js';
import Observable from '../framework/observable.js';

const COMMENT_COUNT = 5;

export default class CommentsModel extends Observable {
  #comments = Array.from({length: COMMENT_COUNT}, generateComment);

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      ...this.#comments,
      update
    ];

    this._notify();
  };

  removeComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error ('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify();
  };
}

