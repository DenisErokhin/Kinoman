import FilmsModel from '../model/films-model';
import { getRandomInteger } from '../utils';
import CommentsModel from '../model/comments-model';

const stringDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const generateNameFilm = () => {
  const nameFilms = [
    'Made for each other',
    'Popeye meets sinbad',
    'Sagebrush trail',
    'Santa claus bconquers the martians',
    'The dance of life',
    'The great flamarion',
    'The man with the golden arm',
  ];

  const randomIndex = getRandomInteger(0, nameFilms.length - 1);

  return nameFilms[randomIndex];
};

const generateDescription = () => {
  const descriptions = stringDescription.split('.');
  const newDescriptions = [];

  for (let i = 0; i <= getRandomInteger(0, 5); i++) {
    const newDescriprion = descriptions[getRandomInteger(0, descriptions.length - 1)];

    if(!newDescriptions.includes(newDescriprion)) {
      newDescriptions.push(newDescriprion);
    }
  }

  return newDescriptions.join();
}

let i = 0;

const getIdFilm = () => {

  let y = i + 1;
  i++;
  return y;
}

const commentsModel = new CommentsModel();
const comments = [...commentsModel.comments];

const hasComments = comments.length > 0;

const idComments = comments.map((comment, index) => {
  return index;
})

const genarateImg = () => {
  const adressesImg = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg'
  ];

  const randomIndex = getRandomInteger(0, adressesImg.length - 1);

  return adressesImg[randomIndex];
}

export const generateFilm = () => ({
  "id": getIdFilm(),
  "comments": hasComments ? idComments : [],
  "filmInfo": {
    "title": generateNameFilm(),
    "alternativeTitle": "Laziness Who Sold Themselves",
    "totalRating": 5.3,
    "poster": genarateImg(),
    "ageRating": 0,
    "director": "Tom Ford",
    "writers": [
      "Takeshi Kitano"
    ],
    "actors": [
      "Morgan Freeman"
    ],
    "release": {
      "date": "2019-05-11T00:00:00.000Z",
      "releaseCountry": "Finland"
    },
    "runtime": 77,
    "genre": [
      "Comedy"
    ],
    "description": generateDescription(),
  },
  "userDetails": {
    "watchlist": false,
    "alreadyWatched": true,
    "watchingDate": "2019-04-12T16:12:32.554Z",
    "favorite": false
  }
});
