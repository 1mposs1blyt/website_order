function DeleteHomeWork(id) {
  axios
    .post(`https://nice-pro-gecko.ngrok-free.app/deletehomework`, {
      id: id,
    })
    .then(async function (response) {
      console.log(response.data);
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
}
