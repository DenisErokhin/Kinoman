import {getRandomInteger} from '../utils/common.js';
import {EMOTIONS} from '../const.js';
import { nanoid } from 'nanoid';


// let i = 0;

// // const generateId = () => {
// //   let y = i + 1;
// //   i++;
// //   return y;
// // }

export const generateComment = () => ({
  "id": nanoid(),
  "author": "Ilya O'Reilly",
  "comment": "a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.",
  "date": "2024-04-11T06:12:32.554Z",
  "emotion": EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
  }
);
