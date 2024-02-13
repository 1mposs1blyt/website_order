var form = document.getElementById("checkAnswersForm");
var currentUrl = $(location).attr("href");

const host = currentUrl.split("/exercises")[0];
form.addEventListener("submit", (event) => {
  var currentUrl = $(location).attr("href"); //http://127.0.0.1:3030/exercises/mathEasy/10
  var type = currentUrl.split("/")[4];
  var digits = currentUrl.split("/")[6];
  var type = currentUrl.split("/")[4];
  console.log({ type, digits });
  event.preventDefault();
  let formData = new FormData(form);
  let answer = formData.getAll("answer");
  let correctAnswer = formData.getAll("correctAnswer");
  let CorrectAnswers = 0;
  let WrongAnswers = 0;
  for (let i = 0; i < correctAnswer.length; i++) {
    if (answer[i] == correctAnswer[i]) {
      CorrectAnswers++;
    } else {
      WrongAnswers++;
    }
  }
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  axios
    .post(`${host}/checkanswers`, {
      correctAnswers: CorrectAnswers,
      wrongAnswers: WrongAnswers,
      type: type,
      digits: digits,
      url: currentUrl,
    })
    .then(async function (response) {
      console.log(response.data.CHW);
      $("body,html").animate({ scrollTop: 0 }, 500);
      await delay(700);
      let UserScore = response.data.score;
      $("input.form-control").prop("disabled", true);
      $("#submit-btn").prop("hidden", true);
      console.log(correctAnswer, answer);
      for (let i = 0; i < correctAnswer.length; i++) {
        console.log(answer[i], " <---> ", correctAnswer[i]);
        if (answer[i] == correctAnswer[i]) {
          $(`input#${i}`).addClass("bg-success bg-opacity-50 text-light ");
          $(`div#card${i}`)
            .removeClass("card border-info")
            .addClass("card border-success");
        } else {
          $(`input#${i}`).addClass("bg-danger bg-opacity-50 text-light");
          $(`input#correctAnswer${i}`)
            .prop("hidden", false)
            .prop("disabled", true);
          $(`#card${i}`).addClass("card border-danger");
        }
        await delay(120);
      }
      $("div#result")
        .html(
          `Решено верно: ${CorrectAnswers}<br/>
        Решено неверно: ${WrongAnswers}<br/>
        Твой счёт: ${UserScore}
        `
        )
        .prop("hidden", false);
      console.log({ CorrectAnswers, WrongAnswers });
    })
    .catch(function (error) {
      console.log(error);
    });
});
