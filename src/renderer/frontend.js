// const os = window.require('os')

const url = window.require('url')
const path = window.require('path')

window.addEventListener("load", () => {
  addImagesEvents()
  searImageEvent()
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

function searImageEvent(){
  
  const searchBox = document.getElementById('search-box')

  searchBox.addEventListener('keyup',function(){
    const regex = new RegExp(this.value.toLowerCase(), 'gi' )
    if(this.value.length>0){
      const thumbs = [...document.querySelectorAll('li.list-group-item img')]
      thumbs.forEach(thumb=>{
        const fileUrl = url.parse(thumb.src)
        const fileName =  path.basename(fileUrl.pathname)
        console.log(fileName)
        if(fileName.match(regex)){
          thumb.parentNode.classList.remove('hidden')
        } else{
          thumb.parentNode.classList.add('hidden')
        }
      })
    } else {
      [...document.querySelectorAll('li.list-group-item.hidden')].forEach(thumb=>thumb.classList.remove('hidden'))
    }
    selectFirstImage()
  })
}

function selectFirstImage(){
  const image = document.querySelector('li.list-group-item:not(.hidden)');
  changeImage(image)
}