import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

// Преобразовываем дату в нужный формат

const humanizeFilmReleaseDate = (dueDate) => dayjs(dueDate).format('D MMMM YYYY');

const humanizeFilmReleaseDateInYear = (dueDate) => dayjs(dueDate).format('YYYY');

// Получаем время фильма в часах и минутах

const getMinutesToTime = (minutes) => dayjs.duration(minutes, 'minutes').format('H[h] mm[m]');

// Вывод даты в человеческом формате, как давно оставлен комментарий

const humanizeDate = (date) => {
  const timeDiff = dayjs(date).diff(dayjs());
  return dayjs.duration(timeDiff).humanize(true);
};

// Сортировка фильмов по дате

const sortFilmByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

// Сортировка фильмов по рейтингу

const sortFilmByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export { humanizeFilmReleaseDate, humanizeFilmReleaseDateInYear, getMinutesToTime, humanizeDate, sortFilmByDate, sortFilmByRating };
