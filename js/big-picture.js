const bigPictureElement = document.querySelector('.big-picture');
const COMMENT_AVATAR_SIZE = 35;
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

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

function openBigPicture(photo) {
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  bigPictureImage.src = photo.url;
  bigPictureImage.alt = photo.description;
  likesCountElement.textContent = photo.likes;
  socialCommentShownCountElement.textContent = photo.comments.length;
  socialCommentTotalCountElement.textContent = photo.comments.length;
  socialCaptionElement.textContent = photo.description;

  // Добавлено: каждый раз полностью перерисовываем комментарии текущей фотографии.
  socialCommentsElement.innerHTML = '';
  const commentsFragment = document.createDocumentFragment();
  photo.comments.forEach((comment) => {
    commentsFragment.append(createCommentElement(comment));
  });
  socialCommentsElement.append(commentsFragment);

  // Добавлено: по требованиям задания скрываем блок со счётчиком и кнопку загрузки комментариев.
  socialCommentCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');

  // Добавлено: закрытие по клавише Esc.
  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

// Добавлено: закрытие по клику на кнопку-крестик.
const onCloseButtonClick = () => {
  closeBigPicture();
};

closeButtonElement.addEventListener('click', onCloseButtonClick);

export { openBigPicture };
