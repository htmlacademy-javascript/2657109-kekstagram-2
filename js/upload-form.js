import { sendData } from './api.js';
import { isEscapeKey } from './util.js';

const MAX_HASHTAGS_COUNT = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_REGEXP = /^#[a-zа-яё0-9]{1,19}$/i;
const DEFAULT_SCALE = 100;
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const MESSAGE_SELECTOR = '.success, .error';
const FILE_TYPES = ['jpg', 'jpeg', 'png', 'webp'];

const SUBMIT_BUTTON_TEXT = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикую...',
};

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

const uploadFormElement = document.querySelector('.img-upload__form');
const uploadFileElement = uploadFormElement.querySelector('#upload-file');
const uploadOverlayElement = uploadFormElement.querySelector('.img-upload__overlay');
const uploadCancelElement = uploadFormElement.querySelector('#upload-cancel');
const submitButtonElement = uploadFormElement.querySelector('.img-upload__submit');
const scaleSmallerElement = uploadFormElement.querySelector('.scale__control--smaller');
const scaleBiggerElement = uploadFormElement.querySelector('.scale__control--bigger');
const scaleValueElement = uploadFormElement.querySelector('.scale__control--value');
const effectsListElement = uploadFormElement.querySelector('.effects__list');
const effectNoneElement = uploadFormElement.querySelector('#effect-none');
const effectLevelContainerElement = uploadFormElement.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = uploadFormElement.querySelector('.effect-level__slider');
const effectLevelValueElement = uploadFormElement.querySelector('.effect-level__value');
const uploadPreviewImageElement = uploadFormElement.querySelector('.img-upload__preview img');
const effectPreviewElements = uploadFormElement.querySelectorAll('.effects__preview');
const hashtagsElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionElement = uploadFormElement.querySelector('.text__description');
const successTemplateElement = document
  .querySelector('#success')
  .content.querySelector('.success');
const errorTemplateElement = document
  .querySelector('#error')
  .content.querySelector('.error');

let currentEffect = EFFECTS.none;
const defaultPreviewImageSource = uploadPreviewImageElement.src;
let currentPreviewImageUrl = null;

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

const isMessageOpen = () => document.querySelector(MESSAGE_SELECTOR) !== null;

const toggleSubmitButtonState = (isDisabled) => {
  submitButtonElement.disabled = isDisabled;
  if (isDisabled) {
    submitButtonElement.setAttribute('disabled', 'disabled');
  } else {
    submitButtonElement.removeAttribute('disabled');
  }
  submitButtonElement.textContent = isDisabled
    ? SUBMIT_BUTTON_TEXT.SENDING
    : SUBMIT_BUTTON_TEXT.IDLE;
};

const normalizeSliderValue = (value) => Number(value).toString();

const updatePreviewImage = () => {
  const file = uploadFileElement.files[0];

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matchesFileType = FILE_TYPES.some((fileType) => fileName.endsWith(`.${fileType}`));

  if (!matchesFileType) {
    return;
  }

  if (currentPreviewImageUrl) {
    URL.revokeObjectURL(currentPreviewImageUrl);
  }

  const previewImageUrl = URL.createObjectURL(file);
  currentPreviewImageUrl = previewImageUrl;

  uploadPreviewImageElement.src = previewImageUrl;
  effectPreviewElements.forEach((effectPreviewElement) => {
    effectPreviewElement.style.backgroundImage = `url("${previewImageUrl}")`;
  });
};

const resetPreviewImage = () => {
  if (currentPreviewImageUrl) {
    URL.revokeObjectURL(currentPreviewImageUrl);
    currentPreviewImageUrl = null;
  }

  uploadPreviewImageElement.src = defaultPreviewImageSource;
  effectPreviewElements.forEach((effectPreviewElement) => {
    effectPreviewElement.style.backgroundImage = '';
  });
};

const applyScale = (scaleValue) => {
  scaleValueElement.value = `${scaleValue}%`;
  uploadPreviewImageElement.style.transform = `scale(${scaleValue / 100})`;
};

const resetScale = () => {
  applyScale(DEFAULT_SCALE);
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
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  currentEffect = EFFECTS[evt.target.value];
  updateSliderOptions();
};

const resetEffects = () => {
  currentEffect = EFFECTS.none;
  uploadPreviewImageElement.style.filter = 'none';
  effectLevelValueElement.value = '';
  effectNoneElement.checked = true;
  updateSliderOptions();
};

const resetUploadFormState = () => {
  uploadFormElement.reset();
  pristine.reset();
  uploadFileElement.value = '';
  resetPreviewImage();
  resetScale();
  resetEffects();
};

const closeUploadForm = () => {
  uploadOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetUploadFormState();
};

const openUploadForm = () => {
  toggleSubmitButtonState(false);
  uploadOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  resetScale();
  resetEffects();
};

const showMessage = ({ templateElement, innerSelector, buttonSelector }) => {
  const messageElement = templateElement.cloneNode(true);
  const messageInnerElement = messageElement.querySelector(innerSelector);
  const messageButtonElement = messageElement.querySelector(buttonSelector);

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentMessageKeydown);
    document.removeEventListener('click', onDocumentMessageClick);
  };

  function onDocumentMessageKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeMessage();
    }
  }

  function onDocumentMessageClick(evt) {
    if (!messageInnerElement.contains(evt.target)) {
      closeMessage();
    }
  }

  messageButtonElement.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onDocumentMessageKeydown);
  document.addEventListener('click', onDocumentMessageClick);
  document.body.append(messageElement);
};

const showSuccessMessage = () =>
  showMessage({
    templateElement: successTemplateElement,
    innerSelector: '.success__inner',
    buttonSelector: '.success__button',
  });

const showErrorMessage = () =>
  showMessage({
    templateElement: errorTemplateElement,
    innerSelector: '.error__inner',
    buttonSelector: '.error__button',
  });

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !isTextFieldFocused() && !isMessageOpen()) {
    evt.preventDefault();
    closeUploadForm();
  }
}

const onUploadCancelClick = (evt) => {
  evt.preventDefault();
  closeUploadForm();
};

const onUploadFileChange = () => {
  if (uploadFileElement.files.length > 0) {
    updatePreviewImage();
    openUploadForm();
  }
};

const onUploadFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  toggleSubmitButtonState(true);
  sendData(new FormData(uploadFormElement))
    .then(() => {
      closeUploadForm();
      showSuccessMessage();
    })
    .catch(() => {
      toggleSubmitButtonState(false);
      showErrorMessage();
    });
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
    const sliderValue = normalizeSliderValue(effectLevelSliderElement.noUiSlider.get());
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

  resetScale();
  resetEffects();
};

export { initUploadForm };
