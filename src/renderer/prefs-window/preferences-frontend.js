const { encrypt, decrypt } = window.require("./utilities/crypto");
const store = window.require("./utilities/store");
const showDialog = window.require("./utilities/dialog");

window.addEventListener("load", () => {
  cancelButton();
  saveButton();
  hasCloudUp();
});

async function hasCloudUp() {
  if (await store.has("pcloud")) {
    const pcloud = await store.get("pcloud");
    document.getElementById("pcloud-client_id").value = pcloud.client_id;
  }
}
async function _hasCloudUp() {
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

function _saveButton() {
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
function saveButton() {
  const prefsForm = document.getElementById("pcloud-form");
  const saveBtn = document.getElementById("save-button");
  saveBtn.addEventListener("click", function () {
    if (!prefsForm.reportValidity()) {
      showDialog(
        "error",
        "Platzipics",
        "Por favor complete los campos requeridos"
      );
    }else{
        console.log("submit", prefsForm);

      const formData = new FormData(prefsForm),
      client_id = formData.get("pcloud-client_id");
      store.set("pcloud", { client_id });
      closeCB();
    }
  });
  prefsForm.addEventListener("submit", function (event) {
    console.log('submit')
    event.preventDefault();
    if (prefsForm.reportValidity()) {
      console.log("submit", this);

      const formData = new FormData(this),
      client_id = formData.get("pcloud-client_id");
      store.set("pcloud", { client_id });
      closeCB();
    }
  });
}
