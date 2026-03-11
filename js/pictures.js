import { openBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document
  .querySelector('#picture')
  .content.querySelector('.picture');

function renderPictures(photos) {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const commentsCount = photo.comments.length;
    const pictureElement = pictureTemplate.cloneNode(true);
    const pictureImageElement = pictureElement.querySelector('.picture__img');
    const pictureLikesElement = pictureElement.querySelector('.picture__likes');
    const pictureCommentsElement = pictureElement.querySelector('.picture__comments');

    pictureImageElement.src = photo.url;
    pictureImageElement.alt = photo.description;
    pictureLikesElement.textContent = photo.likes;
    pictureCommentsElement.textContent = commentsCount;

    // Добавлено: открываем полноразмерный просмотр по клику на миниатюру.
    const onPictureClick = (evt) => {
      evt.preventDefault();
      openBigPicture(photo);
    };
    pictureElement.addEventListener('click', onPictureClick);

    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
}

export { renderPictures };
