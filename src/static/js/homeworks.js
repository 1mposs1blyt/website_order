// var currentUrl = $(location).attr("href");
// const host = "https://nice-pro-gecko.ngrok-free.app";
var HWform = document.getElementById("homework-form");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function appendTeacherCard(homeworks, i, dateSrc) {
  $("#homeworks-result").append(`
                <div class="card border-info mt-3" style="max-width: 540px">
                  <div class="row g-0">
                    <div class="col-sm-4 col-md-4">
                      <img
                        src="${homeworks[i].image}"
                        class="img-fluid rounded-start rounded-end rounded-top"
                        alt="Картинка потерялась =("
                      />
                    </div>
                    <div class="col-sm-8 col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">${
                          homeworks[i].cardtitle
                        } <button type="button" class="btn btn-outline-danger btn-sm position-absolute end-0 me-2" onclick="DeleteHomeWork(${
    homeworks[i].id
  })">Удалить</button></h5>
                        <p class="card-text">${homeworks[i].cardtext}</p>
                        <p class="card-text"><small class="text-body-secondary">Задание пропадет ${dateSrc
                          .split(".")
                          .join(
                            "-"
                          )}<br/> Ссылка на задание №${homeworks[i].id}: <a class='' href="${ homeworks[i].href }?homework=true&hwid=${homeworks[i].id}">${homeworks[i].href}</a></small></p>
                      </div>
                    </div>
                  </div>
                </div>
              `);
}
function appendstudentCard(homeworks, i, dateSrc) {
  $("#homeworks-result").append(`<a href="${
    homeworks[i].href
  }?homework=true&hwid=${homeworks[i].id}" style="text-decoration: none">
          <div class="card border-info mt-3" style="max-width: 540px">
            <div class="row g-0">
              <div class="col-sm-4 col-md-4">
                <img
                  src="${homeworks[i].image}"
                  class="img-fluid rounded-start rounded-end rounded-top"
                  alt="Картинка потерялась =("
                />
              </div>
              <div class="col-sm-8 col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${homeworks[i].cardtitle}</h5>
                  <p class="card-text">${homeworks[i].cardtext}</p>
                  <p class="card-text"><small class="text-body-secondary">Задание пропадет ${dateSrc
                    .split(".")
                    .join("-")}</small></p>
                </div>
              </div>
            </div>
          </div>
        </a>`);
}
HWform.addEventListener("submit", (event) => {
  event.preventDefault();
  axios
    .post(`https://nice-pro-gecko.ngrok-free.app/homeworks`)
    .then(async function (response) {
      $("#homeworks-result").empty();
      let homeworks = response.data.homeworks;
      let usertype = JSON.parse(response.data.user).type;
      if (usertype == "teacher") {
        function notify() {
          alert("clicked");
        }
        $(".text-danger").on("click", notify);
        for (let i = 0; i < homeworks.length; i++) {
          const today = new Date(homeworks[i].created_at);
          today.setDate(
            today.getDate() +
              parseInt(homeworks[i].expires_in.split(" ")[0].split("-")[1])
          );
          const dateSrc = today.toLocaleString("ru-RU", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          console.log(homeworks[i].href);
          appendTeacherCard(homeworks, i, dateSrc);
        }
      } else {
        if (typeof response.data.resolve == "undefined") {
          for (let i = 0; i < homeworks.length; i++) {
            const today = new Date(homeworks[i].created_at);
            today.setDate(
              today.getDate() +
                parseInt(homeworks[i].expires_in.split(" ")[0].split("-")[1])
            );
            const dateSrc = today.toLocaleString("ru-RU", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            });
            appendstudentCard(homeworks, i, dateSrc);
          }
        } else {
          var arr = response.data.resolve[0].completedhomeworks.split(",");
          arr.pop();
          console.log(arr);
          for (let i = 0; i < homeworks.length; i++) {
            if (arr.includes(`${homeworks[i].id}`)) {
              console.log(homeworks[i].id);
              continue;
            }
            const today = new Date(homeworks[i].created_at);
            today.setDate(
              today.getDate() +
                parseInt(homeworks[i].expires_in.split(" ")[0].split("-")[1])
            );
            const dateSrc = today.toLocaleString("ru-RU", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            });
            appendstudentCard(homeworks, i, dateSrc);
          }
        }
        console.log($("#homeworks-result").length);
        if ($(".card.border-info.mt-3").length == 0) {
          $("#homeworks-result").html("Кажется все домашки выполнены!");
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
