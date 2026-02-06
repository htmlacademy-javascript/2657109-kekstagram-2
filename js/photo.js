import { generateComments } from "./comment.js";
import { getRandomInteger } from "./functions.js";
import { MIN_LIKES, MAX_LIKES, PHOTO_COUNT } from "./constants.js";

const generatePhotos = () =>
  Array.from({ length: PHOTO_COUNT }, (_, index) => {
    const id = index + 1;

    return {
      id,
      url: `photos/${id}.jpg`,
      description: "Описание фотографии",
      likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
      comments: generateComments(),
    };
  });

export { generatePhotos };
