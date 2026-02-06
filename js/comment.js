import { NAMES, MESSAGES } from "./data.js";
import { getRandomInteger, getRandomArrayElement } from "./functions.js";
import {
  MIN_AVATAR_NUMBER,
  MAX_AVATAR_NUMBER,
  MAX_COMMENTS,
} from "./constants.js";

const generateComments = () => {
  let commentId = 1;
  const commentsCount = getRandomInteger(0, MAX_COMMENTS);

  return Array.from({ length: commentsCount }, () => ({
    id: commentId++,
    avatar: `img/avatar-${getRandomInteger(
      MIN_AVATAR_NUMBER,
      MAX_AVATAR_NUMBER
    )}.svg`,
    message: getRandomArrayElement(MESSAGES),
    name: getRandomArrayElement(NAMES),
  }));
};

export { generateComments };
