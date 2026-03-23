import { generatePhotos } from './photo.js';
import { renderPictures } from './pictures.js';
import { initUploadForm } from './upload-form.js';

const photos = generatePhotos();
renderPictures(photos);

initUploadForm();
