import { isEscapeKey } from './util.js';

const uploadFormElement = document.querySelector('.img-upload__form');
const uploadFileElement = uploadFormElement.querySelector('#upload-file');
const uploadOverlayElement = uploadFormElement.querySelector('.img-upload__overlay');
const uploadCancelElement = uploadFormElement.querySelector('#upload-cancel');
const scaleSmallerElement = uploadFormElement.querySelector('.scale__control--smaller');
const scaleBiggerElement = uploadFormElement.querySelector('.scale__control--bigger');
const scaleValueElement = uploadFormElement.querySelector('.scale__control--value');
const effectsListElement = uploadFormElement.querySelector('.effects__list');
const effectLevelContainerElement = uploadFormElement.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = uploadFormElement.querySelector('.effect-level__slider');
const effectLevelValueElement = uploadFormElement.querySelector('.effect-level__value');
const uploadPreviewImageElement = uploadFormElement.querySelector('.img-upload__preview img');
const hashtagsElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionElement = uploadFormElement.querySelector('.text__description');

const MAX_HASHTAGS_COUNT = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_REGEXP = /^#[a-zа-яё0-9]{1,19}$/i;
const DEFAULT_SCALE = 100;
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

const EFFECTS = {
  none: {
    filter: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
};

let currentEffect = EFFECTS.none;

const pristine = new Pristine(uploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  successClass: 'img-upload__field-wrapper--success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'p',
  errorTextClass: 'img-upload__error',
});

const getHashtags = (value) => value.trim().split(/\s+/).filter(Boolean);

const validateHashtagsCount = (value) =>
  getHashtags(value).length <= MAX_HASHTAGS_COUNT;

const validateHashtagsPattern = (value) =>
  getHashtags(value).every((hashtag) => HASHTAG_REGEXP.test(hashtag));

const validateHashtagsUnique = (value) => {
  const hashtags = getHashtags(value).map((hashtag) => hashtag.toLowerCase());
  return hashtags.length === new Set(hashtags).size;
};

const validateDescriptionLength = (value) =>
  value.length <= MAX_DESCRIPTION_LENGTH;

pristine.addValidator(
  hashtagsElement,
  validateHashtagsCount,
  `Можно указать не больше ${MAX_HASHTAGS_COUNT} хэш-тегов`
);
pristine.addValidator(
  hashtagsElement,
  validateHashtagsPattern,
  'Хэш-тег должен начинаться с # и содержать только буквы или цифры'
);
pristine.addValidator(
  hashtagsElement,
  validateHashtagsUnique,
  'Хэш-теги не должны повторяться'
);
pristine.addValidator(
  descriptionElement,
  validateDescriptionLength,
  `Длина комментария не должна превышать ${MAX_DESCRIPTION_LENGTH} символов`
);

const isTextFieldFocused = () =>
  document.activeElement === hashtagsElement ||
  document.activeElement === descriptionElement;

const applyScale = (scaleValue) => {
  scaleValueElement.value = `${scaleValue}%`;
  uploadPreviewImageElement.style.transform = `scale(${scaleValue / 100})`;
};

const onScaleSmallerClick = () => {
  const currentScale = parseInt(scaleValueElement.value, 10);
  const nextScale = Math.max(currentScale - SCALE_STEP, MIN_SCALE);
  applyScale(nextScale);
};

const onScaleBiggerClick = () => {
  const currentScale = parseInt(scaleValueElement.value, 10);
  const nextScale = Math.min(currentScale + SCALE_STEP, MAX_SCALE);
  applyScale(nextScale);
};

const hideEffectSlider = () => {
  effectLevelContainerElement.classList.add('hidden');
};

const showEffectSlider = () => {
  effectLevelContainerElement.classList.remove('hidden');
};

const updateSliderOptions = () => {
  effectLevelSliderElement.noUiSlider.updateOptions({
    range: {
      min: currentEffect.min,
      max: currentEffect.max,
    },
    start: currentEffect.max,
    step: currentEffect.step,
  });

  if (currentEffect === EFFECTS.none) {
    hideEffectSlider();
  } else {
    showEffectSlider();
  }
};

const onEffectChange = (evt) => {
  const target = evt.target;

  if (!target.classList.contains('effects__radio')) {
    return;
  }

  currentEffect = EFFECTS[target.value];
  updateSliderOptions();
};

const resetEffects = () => {
  currentEffect = EFFECTS.none;
  uploadPreviewImageElement.style.filter = 'none';
  effectLevelValueElement.value = '';
  uploadFormElement.querySelector('#effect-none').checked = true;
  updateSliderOptions();
};

const closeUploadForm = () => {
  uploadOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  uploadFormElement.reset();
  pristine.reset();
  uploadFileElement.value = '';
};

const openUploadForm = () => {
  uploadOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  applyScale(DEFAULT_SCALE);
  resetEffects();
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !isTextFieldFocused()) {
    evt.preventDefault();
    closeUploadForm();
  }
}

const onUploadCancelClick = () => {
  closeUploadForm();
};

const onUploadFileChange = () => {
  if (uploadFileElement.files.length > 0) {
    openUploadForm();
  }
};

const onUploadFormSubmit = (evt) => {
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
  }
};

const initUploadForm = () => {
  window.noUiSlider.create(effectLevelSliderElement, {
    range: {
      min: EFFECTS.none.min,
      max: EFFECTS.none.max,
    },
    start: EFFECTS.none.max,
    step: EFFECTS.none.step,
    connect: 'lower',
  });

  effectLevelSliderElement.noUiSlider.on('update', () => {
    const sliderValue = effectLevelSliderElement.noUiSlider.get();
    effectLevelValueElement.value = sliderValue;
    uploadPreviewImageElement.style.filter =
      currentEffect === EFFECTS.none
        ? 'none'
        : `${currentEffect.filter}(${sliderValue}${currentEffect.unit})`;
  });

  uploadFileElement.addEventListener('change', onUploadFileChange);
  uploadCancelElement.addEventListener('click', onUploadCancelClick);
  scaleSmallerElement.addEventListener('click', onScaleSmallerClick);
  scaleBiggerElement.addEventListener('click', onScaleBiggerClick);
  effectsListElement.addEventListener('change', onEffectChange);
  uploadFormElement.addEventListener('submit', onUploadFormSubmit);

  applyScale(DEFAULT_SCALE);
  resetEffects();
};

export { initUploadForm };
