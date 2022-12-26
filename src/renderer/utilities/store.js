const { ipcRenderer } = window.require("electron");

function set(key, val) {
  return ipcRenderer.invoke("setStore", key, val);
}
function get(key) {
  return ipcRenderer.invoke("getStore", key);
}
function has(key) {
  return ipcRenderer.invoke("hasStore", key);
}

module.exports = {
  set,
  get,
  has,
};
