var HWAddform = document.getElementById("AddHomework-form");
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.querySelector("#cardlink_href"); // ищем наш единственный input
  const maskOptions = {
    // создаем объект параметров
    // regex : /\+ - \* \*\* :/i,
    mask: `{0}/{0}/{0}/{000}`, //'+{7}(000)000-00-00' // задаем единственный параметр mask ///+ - * ** :/i
  };
  IMask(inputElement, maskOptions); // запускаем плагин с переданными параметрами
});

HWAddform.addEventListener("submit", (event) => {
  let formData = new FormData(HWAddform);
  let cardtitle = formData.get("cardtitle");
  let cardtext = formData.get("cardtext");
  let link = formData.get("cardlink");
  let znaki = formData.get("cardlink_symbols");
  let image = formData.get("cardimage");
  let expiretime = formData.get("expiretime");
  event.preventDefault();
  axios
    .post(`https://nice-pro-gecko.ngrok-free.app/createhomework`, {
      cardtitle: cardtitle,
      cardtext: cardtext,
      image: image,
      link: "/exercises/" + znaki + "/" + link,
      expiretime: expiretime,
    })
    
    .then(async function (response) {
      $("#AddHomework-form")[0].reset();
      $("#hwgoodresult")
        .addClass(
          "bg-success opacity-10 text-light text-center rounded-start rounded-end p-2 mb-2"
        )
        .prop("hidden", false);
      await delay(1500);
      $("#hwgoodresult").prop("hidden", true);
    })
    .catch(function (error) {
      $("#AddHomework-form")[0].reset();
      $("#hwbadresult")
        .addClass(
          "bg-danger opacity-10 text-light text-center rounded-start rounded-end p-2 mb-2"
        )
        .prop("hidden", false);
      console.log(error);
    });
  console.log({ cardtitle, cardtext, link, expiretime, image });
});
// hwbadresult
// hwgoodresult
// /exercises/:type/:digits/:quantity/:exercisequantity
// /exercises/easy/2/2/10
// /exercises/normal/1/3/15
// /exercises/hard/1/3/25
