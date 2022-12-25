

window.addEventListener('load',()=>{
    console.log('load')
    console.log(require("@electron/remote"))
    console.log(window.require("@electron/remote"))
    cancelButton()
})

function cancelButton(){
    const cancelBtn = document.getElementById('cancel-button')
    cancelBtn.addEventListener('click',()=>{
        const {getCurrentWindow} = window.require("@electron/remote");
        const prefsWindow = getCurrentWindow()
        prefsWindow.close()
    })
}