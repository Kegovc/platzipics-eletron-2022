// const os = window.require('os')

const url = window.require("url");
const path = window.require("path");
const applyFilter = window.require("./filters");
const { setIpc, openDirectory } = window.require("./ipcRendererEvent");

window.addEventListener("load", () => {
  setIpc();
  addImagesEvents();
  searImageEvent();
  selectEvent();
  buttonEvent('open-directory', openDirectory)
});

function buttonEvent(id, func) {
  const btn = document.getElementById(id);
  btn.addEventListener("click", func);
}

function selectEvent() {
  const select = document.getElementById("filters");
  select.addEventListener("change", function () {
    console.log(this.value);
    applyFilter(this.value, document.getElementById("image-displayed"));
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

function searImageEvent() {
  const searchBox = document.getElementById("search-box");

  searchBox.addEventListener("keyup", function () {
    const regex = new RegExp(this.value.toLowerCase(), "gi");
    if (this.value.length > 0) {
      const thumbs = [...document.querySelectorAll("li.list-group-item img")];
      thumbs.forEach((thumb) => {
        const fileUrl = url.parse(thumb.src);
        const fileName = path.basename(fileUrl.pathname);
        if (fileName.match(regex)) {
          thumb.parentNode.classList.remove("hidden");
        } else {
          thumb.parentNode.classList.add("hidden");
        }
      });
    } else {
      [...document.querySelectorAll("li.list-group-item.hidden")].forEach(
        (thumb) => thumb.classList.remove("hidden")
      );
    }
    selectFirstImage();
  });
}

function selectFirstImage() {
  const image = document.querySelector("li.list-group-item:not(.hidden)");
  changeImage(image);
}
