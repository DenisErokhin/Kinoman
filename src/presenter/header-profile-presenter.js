import HeaderProfileView from '../view/header-profile-view.js';
import { getUserStatus } from '../utils/user.js';
import { remove, render, replace } from '../framework/render';

export default class HeaderProfilePresenter {
  #container = null;
  #headerProfileComponent = null;
  #filmsModel = null;
  #userStatus = null;

  constructor (container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#userStatus = getUserStatus(this.#filmsModel.films);
    const prevHeaderProfileComponent = this.#headerProfileComponent;
    this.#headerProfileComponent = new HeaderProfileView(this.#userStatus);

    if (prevHeaderProfileComponent === null) {
      render(this.#headerProfileComponent, this.#container);
      return;
    }

    replace( this.#headerProfileComponent, prevHeaderProfileComponent);
    remove(prevHeaderProfileComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };
}


