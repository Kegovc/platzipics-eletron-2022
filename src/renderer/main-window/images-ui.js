const { applyFilter } = window.require("./main-window/filters");

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
  const img = document.getElementById("image-displayed");
  img.src = node.querySelector("img").src;
  console.log('changeImage')
  img.dataset.original = node.querySelector("img").src;
  document.getElementById("filters").selectedIndex = 0;
}

function selectFirstImage() {
  const image = document.querySelector("li.list-group-item:not(.hidden)");
  changeImage(image);
}

function clearImages() {
  const oldImages = [...document.querySelectorAll("li.list-group-item")];
  oldImages.forEach((oldImage) => {
    oldImage.parentNode.removeChild(oldImage);
  });
}

function loadImages(images) {
  const imagesList = document.querySelector("ul.list-group");
  
  images.sort((a,b)=>{
    console.log(isNaN(a.filenameExtlees),isNaN(b.filenameExtlees))
    if(isNaN(a.filenameExtlees)||isNaN(b.filenameExtlees)){
      return a.filenameExtlees.localeCompare(b.filenameExtlees)
    } else{
      console.log(Number(a.filenameExtlees)-Number(b.filenameExtlees))
      return Number(a.filenameExtlees)-Number(b.filenameExtlees)
    }
  }).forEach((img) => {
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

function selectEvent() {
  const select = document.getElementById("filters");
  select.addEventListener("change", function () {
    console.log(this.value);
    if (this.value)
      applyFilter(this.value, document.getElementById("image-displayed"));
  });
}

function searchImageEvent() {
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

function print(){
  window.print()
}

module.exports = {
  addImagesEvents,
  searchImageEvent,
  selectEvent,
  changeImage,
  selectFirstImage,
  clearImages,
  loadImages,
  print
};
