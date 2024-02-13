var currentUrl = $(location).attr("href");
const host = currentUrl.split("/login")[0]; //`http://127.0.0.1:5421`;  //чтобы работало на хостинге подставить потом вместо url выданый на хостинге
var loginForm = document.getElementById("loginform");

console.log();
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let formData = new FormData(loginForm);
  let login = formData.get("login");
  let password = formData.get("password");
  axios
    .post(
      `${host}/login`,
      {
        login: login,
        password: password,
      },
      { withCredentials: true }
    )
    .then(async function (response) {
      console.log(response);
      $(`#goodresult`).prop("hidden", true);
      $(`#badresult`).prop("hidden", true);
      if (response.data.isAuthorized == true) {
        $(`#goodresult`)
          .addClass(
            "bg-success opacity-10 text-light text-center rounded-start rounded-end p-2 mb-2"
          )
          .prop("hidden", false);
        $(document).ready(function () {
          window.location.href = `https://nice-pro-gecko.ngrok-free.app/exercises`;
        });
        await delay(700);
      } else {
        $(`#badresult`)
          .addClass(
            "bg-danger opacity-10 text-light text-center rounded-start rounded-end p-2 mb-2"
          )
          .prop("hidden", false);
      }
      console.log(response.data.isAuthorized);
    })
    .catch(function (error) {
      console.log(error);
    });
});
