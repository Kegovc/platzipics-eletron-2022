// const os = window.require('os')

window.addEventListener("load", () => {
  addImagesEvents()
});


function addImagesEvents () {
  const thumbs = [...document.querySelectorAll('li.list-group-item')]
  thumbs.forEach(thumb=>{
    thumb.addEventListener('click',function(){
      changeImage(this)
    })
  })
}


function changeImage(node){
  document.querySelector('li.list-group-item.selected')?.classList?.remove('selected')
  node.classList.add('selected')
  document.getElementById('image-displayed').src = node.querySelector('img').src
}