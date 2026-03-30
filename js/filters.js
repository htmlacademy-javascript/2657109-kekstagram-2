import { renderPictures } from './pictures.js';
import { debounce } from './util.js';

const RANDOM_PICTURES_COUNT = 10;
const RERENDER_DELAY = 500;
const FilterId = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filtersElement = document.querySelector('.img-filters');
const filtersFormElement = filtersElement.querySelector('.img-filters__form');
const filterButtons = filtersFormElement.querySelectorAll('.img-filters__button');

const sortByCommentsCount = (photoA, photoB) =>
  photoB.comments.length - photoA.comments.length;

const shufflePhotos = (photos) => {
  const shuffledPhotos = [...photos];

  for (let index = shuffledPhotos.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentPhoto = shuffledPhotos[index];
    shuffledPhotos[index] = shuffledPhotos[randomIndex];
    shuffledPhotos[randomIndex] = currentPhoto;
  }

  return shuffledPhotos;
};

const getFilteredPhotos = (photos, filterId) => {
  switch (filterId) {
    case FilterId.RANDOM:
      return shufflePhotos(photos).slice(0, RANDOM_PICTURES_COUNT);
    case FilterId.DISCUSSED:
      return [...photos].sort(sortByCommentsCount);
    default:
      return [...photos];
  }
};

const setActiveFilterButton = (activeButton) => {
  filterButtons.forEach((buttonElement) => {
    buttonElement.classList.toggle(
      'img-filters__button--active',
      buttonElement === activeButton
    );
  });
};

const initFilters = (photos) => {
  const debouncedRenderPictures = debounce(renderPictures, RERENDER_DELAY);

  filtersElement.classList.remove('img-filters--inactive');

  filtersFormElement.addEventListener('click', (evt) => {
    const targetButton = evt.target.closest('.img-filters__button');

    if (!targetButton || targetButton.classList.contains('img-filters__button--active')) {
      return;
    }

    setActiveFilterButton(targetButton);
    debouncedRenderPictures(getFilteredPhotos(photos, targetButton.id));
  });
};

export { initFilters };
