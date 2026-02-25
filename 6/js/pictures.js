const picturesContainer = document.querySelector(".pictures");
const pictureTemplate = document
  .querySelector("#picture")
  .content.querySelector(".picture");

function renderPictures(photos) {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector(".picture__img").src = photo.url;
    pictureElement.querySelector(".picture__img").alt = photo.description;
    pictureElement.querySelector(".picture__likes").textContent = photo.likes;
    pictureElement.querySelector(".picture__comments").textContent =
      photo.comments.length;

    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
}

export { renderPictures };
