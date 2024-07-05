import { UserStatusValue, UserStatusTitle } from '../const.js';

const getUserStatus = (films) => {
  const watchedFilmsCount = films.filter((film) => film.userDetails.alreadyWatched);

  if (watchedFilmsCount.length >= UserStatusValue.MOVIE_BUFF) {
    return UserStatusTitle.MOVIE_BUFF;
  }

  if (watchedFilmsCount.length >= UserStatusValue.FAN) {
    return UserStatusTitle.FAN;
  }

  if (watchedFilmsCount.length < UserStatusValue.FAN) {
    return UserStatusTitle.NOVICE;
  }

  return null;
};

export { getUserStatus };
