const store = window.require("./utilities/store");

window.addEventListener("load", () => {
  console.log("load");
  console.log(require("@electron/remote"));
  console.log(window.require("@electron/remote"));
  cancelButton();
  saveButton();
  store.get('cloudup').then((cloudup) => {
    document.getElementById("cloudup-user").value = cloudup.user
    document.getElementById("cloudup-passwd").value = cloudup.password
  });
});

function closeCB() {
  const { getCurrentWindow } = window.require("@electron/remote");
  const prefsWindow = getCurrentWindow();
  prefsWindow.close();
}

function cancelButton() {
  const cancelBtn = document.getElementById("cancel-button");
  cancelBtn.addEventListener("click", closeCB);
}
function saveButton() {
  const prefsForm = document.getElementById("preferences-form");
  prefsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (prefsForm.reportValidity()) {
      console.log("submit", this);

      const formData = new FormData(this),
        { user, password } = {
          user: formData.get("cloudup-user"),
          password: formData.get("cloudup-passwd"),
        };

        store.set("cloudup", { user, password });
        closeCB();
    }
  });

}
