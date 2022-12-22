const { ipcRenderer } = window.require("electron");

function clearImages() {
  const oldImages = [...document.querySelectorAll("li.list-group-item")];
  oldImages.forEach((oldImage) => {
    oldImage.parentNode.removeChild(oldImage);
  });
}

function loadImages(images) {
  const imagesList = document.querySelector("ul.list-group");
  images.forEach((img) => {
    const node = `<li class="list-group-item">
    <img
      class="media-object pull-left"
      src="${img.src}"
      height="32"
    />
    <div class="media-body">
      <strong>${img.filename}</strong>
      <p>${img.size}</p>
    </div>
  </li>`;
    imagesList.insertAdjacentHTML("beforeend", node);
  });
}

function addImagesEvents() {
  const thumbs = [...document.querySelectorAll("li.list-group-item")];
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      changeImage(this);
    });
  });
}

function changeImage(node) {
  if (!node) {
    document.getElementById("image-displayed").src = "";
    return;
  }
  document
    .querySelector("li.list-group-item.selected")
    ?.classList?.remove("selected");
  node.classList.add("selected");
  document.getElementById("image-displayed").src =
    node.querySelector("img").src;
}

function selectFirstImage() {
  const image = document.querySelector("li.list-group-item:not(.hidden)");
  changeImage(image);
}

function setIpc() {
  ipcRenderer.on("load-images", (event, images) => {
    clearImages();
    console.log(`load-images recibido - `, images);
    loadImages(images);
    addImagesEvents();
    selectFirstImage()
  });
}

function openDirectory() {
  ipcRenderer.send("open-directory");
}

module.exports = {
  setIpc,
  openDirectory,
};
