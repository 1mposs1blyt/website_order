var qrForm = document.getElementById("qr-form");

qrForm.addEventListener("submit", (event) => {
  event.preventDefault();
  axios
    .post("https://nice-pro-gecko.ngrok-free.app/genqr")
    .then((response) => {
      console.log(response.data.qr);
      $("#qr-result").html(
        `<img class="w-100 h-100" src="${response.data.qr}"/>`
      );
    })
    .catch(function (err) {
      console.log(err);
    });
});
const nameWrapper = document.querySelector(".js-link");
let link = "";
function setlink_znaki(name) {
  if (nameWrapper) {
    link = link + name;
    nameWrapper.textContent = link;link = "";
  }
}
function setlink_zifri(name) {
  if (nameWrapper) {
    link = link + name;
    nameWrapper.textContent = link;link = "";
  }
}
function setlink_chisla(name) {
  if (nameWrapper) {
    link = link + name;
    nameWrapper.textContent = link;link = "";
  }
}
function setlink_primery(name) {
  if (nameWrapper) {
    link = link + name;
    nameWrapper.textContent = link;link = "";
  }
}
function types(name) {
  if (nameWrapper) {
    link = link + name;
    nameWrapper.textContent = link;link = "";
  }
}
