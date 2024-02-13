import { app } from "./../server.js";
import { generateProblems } from "./../generator.js";
import { client } from "./../sessions.js";
import { get_data } from "./../db.js";
import localStorage from "localStorage";

app.get("/exercises", async (req, res) => {
  console.log(req.sessionID);
  let RisAuthorized = await client.get(`${req.session.id}`);
  // console.log(`redis:`, await client.get(`${req.session.id}`));
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    console.log(user);
    get_data("subjects", []).then((resolve) => {
      res.render("./src/pages/main.html", {
        resolve,
        user,
      });
    });
  } else {
    res.redirect("/login");
  }
});
app.get("/exercises/:type", async (req, res) => {
  let type = req.params["type"];
  let RisAuthorized = await client.get(`${req.session.id}`);
  console.log(`redis:`, await client.get(`${req.session.id}`));
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    res.render("./src/pages/routes/digits.html", {
      user,
      type,
    });
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
  let RisAuthorized = await client.get(`${req.session.id}`);
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    res.render(`./src/pages/routes/exercisequantity.html`, {
      user,
      digits,
      type,
      quantity,
    });
  } else {
    res.redirect("/login");
  }
});
app.get(
  "/exercises/:type/:digits/:quantity/:exercisequantity",
  async (req, res) => {
    function send(type, problems, user) {
      get_data("addScore", [user.id]).then(() => {
        get_data("FindScore", [user.id]).then((resolve) => {
          let score = resolve[0].score;
          res.render(`./src/pages/exercise.html`, {
            problems,
            user,
            score,
            type,
          });
        });
      });
    }
    let type = req.params["type"];
    let digits = req.params["digits"];
    let quantity = req.params["quantity"];
    let exercisequantity = req.params["exercisequantity"];
    let RisAuthorized = await client.get(`${req.session.id}`);
    console.log(`redis:`, await client.get(`${req.session.id}`));
    if (RisAuthorized) {
      let user = JSON.parse(await client.get(`${req.session.id}`));
      if (type == "easy") {
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["+", "-"]
        );
        send(type, problems, user);
      } else if (type == "norm") {
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["*", "/"]
        );
        send(type, problems, user);
      } else if (type == "medi") {
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["/", "-"]
        );
        send(type, problems, user);
      } else if (type == "hard") {
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["+", "*"]
        );
        send(type, problems, user);
      } else if (type == "ultr") {
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["+", "*", "/", "-"]
        );
        send(type, problems, user);
      } else if (type == "ultramegahard") {
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["+", "*", "/", "-", "%", "**"]
        );
        send(type, problems, user);
      } else if (type == "mlow") {
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["*", "/"]
        );
        send(type, problems, user);
      } else if (type == "audio") {
        let filename = `./src/audiofiles/D${digits}Q${quantity}E${exercisequantity}.mp3`;
        res.send("pagewith audio files" + ` ${filename}`);
      } else {
        console.log(type);
        let problems = generateProblems(
          type,
          exercisequantity,
          digits,
          quantity,
          ["+", "-", "*", "-"]
        );
        send(type, problems, user);
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
  function send(newscore, userid) {
    get_data("addScore", [newscore, userid]);
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
            res.send({ body, score, CHW });
          } else {
            let newHWID = CompletedHomeworks[0].completedhomeworks + HWID + ",";
            get_data("homeworkComplit2", [newHWID, userid]);
            let score = resolve1[0].score;
            let CHW = resolve1[0].completedhomeworks;
            res.send({ body, score, CHW });
          }
        });
      } else {
        let score = resolve1[0].score;
        res.send({ body, score });
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
    if (type == "easy") {
      let score = correctAnswers * digits - wrongAnswers * 1;
      send(score, userid);
    } else if (type == "normal") {
      let score = correctAnswers * (digits + 1) - wrongAnswers * 1;
      send(score, userid);
    } else if (type == "medium") {
      let score = correctAnswers * (digits + 2) - wrongAnswers * 2;
      send(score, userid);
    } else if (type == "hard") {
      let score = correctAnswers * (digits + 3) - wrongAnswers * 3;
      send(score, userid);
    } else if (type == "ultrahard") {
      let score = correctAnswers * (digits + 4) - wrongAnswers * 4;
      send(score, userid);
    } else if (type == "ultramegahard") {
      let score = correctAnswers * (digits + 5) - wrongAnswers * 5;
      send(score, userid);
    } else {
      let score = correctAnswers * digits - wrongAnswers;
      send(score, userid);
    }
  } else {
    res.sendStatus(401);
  }
});
