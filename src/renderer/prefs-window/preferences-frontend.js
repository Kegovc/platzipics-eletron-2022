const { encrypt, decrypt } = window.require("./utilities/crypto");
const store = window.require("./utilities/store");
const showDialog = window.require("./utilities/dialog");

window.addEventListener("load", () => {
  cancelButton();
  saveButton();
  hasCloudUp();
});

async function hasCloudUp() {
  if (await store.has("cloudup")) {
    const cloudup = await store.get("cloudup");
    document.getElementById("cloudup-user").value = cloudup.user;
    if (cloudup?.password) {
      document.getElementById("cloudup-passwd").value = decrypt(
        cloudup.password
      );
    }
  }
}

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
  const saveBtn = document.getElementById("save-button");
  saveBtn.addEventListener("click", function () {
    if (!prefsForm.reportValidity()) {
      showDialog(
        "error",
        "Platzipics",
        "Por favor complete los campos requeridos"
      );
    }
  });
  prefsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (prefsForm.reportValidity()) {
      console.log("submit", this);

      const formData = new FormData(this),
        { user, password } = {
          user: formData.get("cloudup-user"),
          password: formData.get("cloudup-passwd"),
        };
      store.set("cloudup", { user, password: encrypt(password) });
      closeCB();
    }
  });
}
