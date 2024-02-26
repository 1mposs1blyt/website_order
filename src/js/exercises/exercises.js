import { app } from "./../server.js";
import { generateProblems, generateProblems2 } from "./../generator.js";
import { client } from "./../sessions.js";
import { get_data } from "./../db.js";

app.get("/exercises", async (req, res) => {
  console.log(req.sessionID);
  let RisAuthorized = await client.get(`${req.session.id}`);
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    console.log(user);
    get_data("subjects", []).then((subjects) => {
      console.log(subjects);
      res.render("./src/pages/main.html", {
        subjects,
        user,
      });
    });
  } else {
    res.redirect("/login");
  }
});
app.get("/exercises/:type", async (req, res) => {
  let type = req.params["type"];
  console.log(type);
  let RisAuthorized = await client.get(`${req.session.id}`);
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    if (type == "audio") {
      let exnumber = Math.floor(Math.random() * 10);

      res.render("./src/pages/routes/audio.html", { user, exnumber });
    } else {
      res.render("./src/pages/routes/digits.html", {
        user,
        type,
      });
    }
  } else {
    res.redirect("/login");
  }
});
app.get("/exercises/:type/:digits", async (req, res) => {
  let type = req.params["type"];
  let digits = req.params["digits"];
  let RisAuthorized = await client.get(`${req.session.id}`);
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    res.render(`./src/pages/routes/quantityes.html`, {
      user,
      digits,
      type,
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/exercises/:type/:digits/:quantity", async (req, res) => {
  let type = req.params["type"];
  let digits = req.params["digits"];
  let quantity = req.params["quantity"];
  let isfloat = req.params["digits"];
  let RisAuthorized = await client.get(`${req.session.id}`);
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    res.render(`./src/pages/routes/exercisequantity.html`, {
      user,
      digits,
      type,
      quantity,
      isfloat,
    });
  } else {
    res.redirect("/login");
  }
});
app.get(
  "/exercises/:type/:digits/:quantity/:exercisequantity",
  async (req, res) => {
    let type = req.params["type"];
    let digits = req.params["digits"];
    let exercisequantity = req.params["exercisequantity"];
    let isfloat = req.params["digits"];
    let quantity = req.params["quantity"];
    let RisAuthorized = await client.get(`${req.session.id}`);
    if (RisAuthorized) {
      let user = JSON.parse(await client.get(`${req.session.id}`));
      res.render(`./src/pages/routes/isfloat.html`, {
        user,
        digits,
        type,
        isfloat,
        quantity,
        exercisequantity,
      });
    } else {
      res.redirect("/login");
    }
  }
);
app.get(
  "/exercises/:type/:digits/:quantity/:exercisequantity/:float",
  async (req, res) => {
    function send(type, problems, user, isfloat, exercisequantity) {
      // get_data("addScore", [user.id]).then(() => {
      get_data("FindScore", [user.id]).then((resolve) => {
        let score = resolve[0].score;
        res.render(`./src/pages/exercise.html`, {
          problems,
          user,
          score,
          type,
          isfloat,
          exercisequantity,
        });
      });
      // });
    }
    let type = req.params["type"];
    let digits = req.params["digits"];
    let quantity = req.params["quantity"];
    let exercisequantity = req.params["exercisequantity"];
    let RisAuthorized = await client.get(`${req.session.id}`);
    let isfloat = req.params["float"];
    console.log(`redis:`, await client.get(`${req.session.id}`));
    if (RisAuthorized) {
      let user = JSON.parse(await client.get(`${req.session.id}`));
      if (type == "audio") {
        let filename = `./src/audiofiles/D${digits}Q${quantity}E${exercisequantity}.mp3`;
        res.send("pagewith audio files" + ` ${filename}`);
      } else {
        if (isfloat == 0) {
          let znaki = type.split(",");
          znaki[znaki.indexOf(":")] = "/";
          let problems = generateProblems(
            type,
            exercisequantity,
            digits,
            quantity,
            znaki
          );
          send(type, problems, user);
        } else {
          let znaki = type.split(",");
          znaki[znaki.indexOf(":")] = "/";
          let problems = generateProblems2(
            type,
            exercisequantity,
            digits,
            quantity,
            znaki,
            isfloat
          );
          send(type, problems, user);
        }

        // let znaki = type.split(",");
        // if (isfloat == "true") {
        //   let problems = generateProblems2(
        //     type,
        //     exercisequantity,
        //     digits,
        //     quantity,
        //     znaki,
        //     toFixed
        //   );
        //   send(type, problems, user);
        // } else {
        //   let problems = generateProblems(
        //     type,
        //     exercisequantity,
        //     digits,
        //     quantity,
        //     znaki
        //   );
        //   znaki[znaki.indexOf(":")] = "/";
        //   send(type, problems, user);
        // }
      }
    } else {
      res.redirect("/login");
    }
  }
);
app.post("/checkanswers", async (req, res) => {
  let url = req.body.url.split("?")[1];
  let RisAuthorized = await client.get(`${req.session.id}`);
  console.log(`redis:`, await client.get(`${req.session.id}`));
  function send(userid, newscore) {
    get_data("addScore", [newscore, userid]);
    get_data("addScoreEx", [userid]);
    get_data("FindScore", [userid]).then((resolve1) => {
      if (typeof url != "undefined") {
        let HWID = req.body.url.split("?")[1].split("&")[1].split("=")[1];
        console.log(HWID);
        get_data("homeworkComplit1", [userid]).then((CompletedHomeworks) => {
          if (CompletedHomeworks[0].completedhomeworks == null) {
            let newHWID = HWID + ",";
            get_data("homeworkComplit2", [newHWID, userid]);
            let score = resolve1[0].score;
            let CHW = resolve1[0].completedhomeworks;
            res.send({ body, score, CHW, newscore });
          } else {
            let newHWID = CompletedHomeworks[0].completedhomeworks + HWID + ",";
            get_data("homeworkComplit2", [newHWID, userid]);
            let score = resolve1[0].score;
            let CHW = resolve1[0].completedhomeworks;

            res.send({ body, score, CHW, newscore });
          }
        });
      } else {
        let score = resolve1[0].score;
        res.send({ body, score, newscore });
      }
    });
  }
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    let userid = user.id;
    var body = req.body;
    var correctAnswers = req.body.correctAnswers;
    var wrongAnswers = req.body.wrongAnswers;
    var type = req.body.type;
    var digits = req.body.digits;
    console.log({ correctAnswers, wrongAnswers, type, digits });
    let ScoreForProblem = type.split(",").length;
    let newscore =
      correctAnswers * ScoreForProblem - wrongAnswers * ScoreForProblem;
    send(userid, newscore);
  } else {
    res.sendStatus(401);
  }
});
