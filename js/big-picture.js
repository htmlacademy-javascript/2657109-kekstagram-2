import { isEscapeKey } from './util.js';

const COMMENT_AVATAR_SIZE = 35;
const COMMENTS_BATCH_SIZE = 5;
const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const socialCommentShownCountElement = bigPictureElement.querySelector(
  '.social__comment-shown-count'
);
const socialCommentTotalCountElement = bigPictureElement.querySelector(
  '.social__comment-total-count'
);
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.social__comments-loader');
const closeButtonElement = bigPictureElement.querySelector('.big-picture__cancel');

let currentPhotoComments = [];
let renderedCommentsCount = 0;

const createCommentElement = ({ avatar, name, message }) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarElement = document.createElement('img');
  avatarElement.classList.add('social__picture');
  avatarElement.src = avatar;
  avatarElement.alt = name;
  avatarElement.width = COMMENT_AVATAR_SIZE;
  avatarElement.height = COMMENT_AVATAR_SIZE;

  const messageElement = document.createElement('p');
  messageElement.classList.add('social__text');
  messageElement.textContent = message;

  commentElement.append(avatarElement, messageElement);
  return commentElement;
};

const toggleCommentsLoader = () => {
  const isAllCommentsRendered = renderedCommentsCount >= currentPhotoComments.length;
  commentsLoaderElement.classList.toggle('hidden', isAllCommentsRendered);
};

const renderCommentsBatch = () => {
  const nextComments = currentPhotoComments.slice(
    renderedCommentsCount,
    renderedCommentsCount + COMMENTS_BATCH_SIZE
  );

  const commentsFragment = document.createDocumentFragment();
  nextComments.forEach((comment) => {
    commentsFragment.append(createCommentElement(comment));
  });
  socialCommentsElement.append(commentsFragment);

  renderedCommentsCount += nextComments.length;
  socialCommentShownCountElement.textContent = renderedCommentsCount;
  toggleCommentsLoader();
};

const onCommentsLoaderClick = () => {
  renderCommentsBatch();
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

function openBigPicture(photo) {
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  socialCommentCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  bigPictureImage.src = photo.url;
  bigPictureImage.alt = photo.description;
  likesCountElement.textContent = photo.likes;
  socialCaptionElement.textContent = photo.description;
  socialCommentTotalCountElement.textContent = photo.comments.length;

  currentPhotoComments = photo.comments;
  renderedCommentsCount = 0;
  socialCommentShownCountElement.textContent = renderedCommentsCount;
  socialCommentsElement.innerHTML = '';
  renderCommentsBatch();

  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

const onCloseButtonClick = () => {
  closeBigPicture();
};

commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
closeButtonElement.addEventListener('click', onCloseButtonClick);

export { openBigPicture };
