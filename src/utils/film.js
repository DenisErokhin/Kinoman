import dayjs from 'dayjs';

// Преобразовываем дату в нужный формат

const humanizeFilmReleaseDate = (dueDate) => dayjs(dueDate).format('D MMMM YYYY');

const humanizeFilmReleaseDateInYear = (dueDate) => dayjs(dueDate).format('YYYY');

const humanizeCommentDate = (dueDate) => dayjs(dueDate).format('YYYY/MM/D HH:mm');

// Получаем время фильма в часах и минутах

const getTimeFilm = (time) => {
  if (time < 60) {
    return `${time}m`;
  }

  const hours = Math.floor(time / 60);
  let minutes = Math.round((time / 60 - hours) * 60);
  minutes = minutes.toString().replace('0.', '');

  if (!minutes) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

const sortFilmByDate = (filmA, filmB) => new Date(filmB.filmInfo.release.date) - new Date(filmA.filmInfo.release.date);

const sortFilmByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export { humanizeFilmReleaseDate, humanizeFilmReleaseDateInYear, humanizeCommentDate, getTimeFilm, sortFilmByDate, sortFilmByRating };
