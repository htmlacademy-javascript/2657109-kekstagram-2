import { generatePhotos } from "./photo.js";
import { renderPictures } from "./pictures.js";

const photos = generatePhotos();
renderPictures(photos);
