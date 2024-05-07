import Observable from '../framework/observable';
import { FilterType } from '../const';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter () {
    return this.#filter;
  }

  setFilter = (updateType, update) => {
    this.#filter = update;

    this._notify(updateType, update);
  };
}
