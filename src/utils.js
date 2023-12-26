import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Преобразовываем дату в нужный формат

const humanizeFilmReleaseDate = (dueDate) => dayjs(dueDate).format('D MMMM YYYY');
const humanizeFilmReleaseDateInYear = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeCommentDate = (dueDate) => dayjs(dueDate).format('YYYY/MM/D HH:mm');

// Получаем время фильма в часах и минутах

const getTimeFilm = (time) => {
  if(time < 60) {
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

export {getRandomInteger, humanizeFilmReleaseDate, humanizeFilmReleaseDateInYear, humanizeCommentDate, getTimeFilm};
