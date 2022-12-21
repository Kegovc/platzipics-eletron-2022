const os = window.require('os')

window.addEventListener("load", () => {
  console.log(os.cpus());
});
