function applyFilter(filter, currentImage) {
  
  const imgObj = new Image();
  imgObj.src = currentImage.src;

  filterous // eslint-disable-line
    .importImage(imgObj, {})
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}


module.exports = applyFilter