const fs = window.require("fs");

function applyFilter(filter, currentImage) {
  const imgObj = new Image();
  imgObj.src = currentImage.src;

  filterous // eslint-disable-line
    .importImage(imgObj, {})
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}

function saveImage(filename) {
  return new Promise((resolver, reject) => {
    let fileSrc = document.getElementById("image-displayed").src;
    const cb = (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolver();
    };
    if (fileSrc.indexOf(";base64") === -1) {
      fileSrc = fileSrc.replace("file://", "");
      fs.copyFile(fileSrc, filename, fs.constants.COPYFILE_FICLONE, cb);
    }
    console.log(fileSrc);
    fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    console.log(fileSrc);

    fs.writeFile(filename, fileSrc, "base64", cb);
  });
}

module.exports = { applyFilter, saveImage };
