import { getRandomInteger } from '../utils/common.js';

const EMOTIONS = ["smile", "sleeping", "puke", "angry"];

let i = 0;

const generateId = () => {
  let y = i + 1;
  i++;
  return y;
}

export const generateComment = () => ({
  "id": generateId(),
  "author": "Ilya O'Reilly",
  "comment": "a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.",
  "date": "2019-05-11T16:12:32.554Z",
  "emotion": EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
  }
);
