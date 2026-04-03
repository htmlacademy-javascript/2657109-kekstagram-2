import { getData } from './api.js';
import { initFilters } from './filters.js';
import { renderPictures } from './pictures.js';
import { initUploadForm } from './upload-form.js';

const DATA_ERROR_SHOW_TIME = 5000;
const dataErrorTemplate = document
  .querySelector('#data-error')
  .content.querySelector('.data-error');

const showDataError = () => {
  const dataErrorElement = dataErrorTemplate.cloneNode(true);
  document.body.append(dataErrorElement);

  setTimeout(() => {
    dataErrorElement.remove();
  }, DATA_ERROR_SHOW_TIME);
};

getData()
  .then((photos) => {
    renderPictures(photos);
    initFilters(photos);
  })
  .catch(() => {
    showDataError();
  });

initUploadForm();
