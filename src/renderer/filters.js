
const fs = window.require("fs");

function applyFilter(filter, currentImage) {
  
  const imgObj = new Image();
  imgObj.src = currentImage.src;

  filterous // eslint-disable-line
    .importImage(imgObj, {})
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}

function saveImage (filename){
  let fileSrc = document.getElementById('image-displayed').src
  console.log(fileSrc)
  fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/,'')
  console.log(fileSrc)
  fs.writeFile(filename, fileSrc, 'base64', err=>{
    if(err){
      console.log(err)
    }
  })
}


module.exports = {applyFilter, saveImage}