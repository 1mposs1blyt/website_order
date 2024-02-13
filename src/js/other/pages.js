import { app } from "./../server.js";
import { client } from "./../sessions.js";
import { get_data } from "./../db.js";

app.get("/", async (req, res) => {
  console.log(client.sessionid);
  let userdata = JSON.parse(await client.get(`${req.session.id}`));
  console.log(userdata);
  if (userdata) {
    console.log("Nice");
    res.redirect("/exercises");
  } else {
    console.log("auth required");
    res.redirect("/login");
  }
});
app.get("/dashboard/", async (req, res) => {
  let RisAuthorized = await client.get(`${req.session.id}`);
  // console.log(`redis:`, await client.get(`${req.session.id}`));
  if (RisAuthorized) {
    let user = JSON.parse(await client.get(`${req.session.id}`));
    // get_data("FindUser", [user.id]).then((resolve) => { // });
    if (user.type == "teacher") {
      get_data("FindUserByType", ["student", user.group]).then((users) => {
        res.render("./src/pages/dashboard.html", {
          user,
          users,
          isAuthorized: user.isAuthorized,
        });
      });
    } else if (user.type == "student") {
      get_data("Dashboard", ["student"]).then((users) => {
        res.render("./src/pages/dashboard.html", {
          user,
          users,
          isAuthorized: user.isAuthorized,
        });
      });
    } else if (user.type == "admin") {
      get_data("users", []).then((users) => {
        res.render("./src/pages/dashboard.html", {
          user,
          users,
          isAuthorized: user.isAuthorized,
        });
      });
    }
  } else {
    res.redirect("/login");
  }
});
app.post("/homeworks", async (req, res) => {
  let user = await client.get(`${req.session.id}`);
  if (user) {
    let userid = JSON.parse(await client.get(`${req.session.id}`)).id;
    let usergroup = JSON.parse(await client.get(`${req.session.id}`)).group;
    console.log(userid);
    get_data("homeworks", [usergroup]).then((homeworks) => {
      get_data("homeworkComplit1", [userid]).then((resolve) => {
        if (resolve.length == 0) {
          res.send({ homeworks, user });
        } else {
          console.log(resolve);
          res.send({ homeworks, resolve, user });
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/createhomework", async (req, res) => {
  let RisAuthorized = await client.get(`${req.session.id}`);
  let groop = await JSON.parse(RisAuthorized).group;
  if (RisAuthorized) {
    if (req.body.image.length == 0) {
      var image =
        "https://img.freepik.com/free-vector/back-to-school-stationery-vector-set_53876-161382.jpg?w=826&t=st=1706689821~exp=1706690421~hmac=f8dd1f943a6ac08d0563a8db2dd6929d62bff218bde70cedb4f3a13f8d256d0c";
    } else {
      var image = req.body.image;
    }
    let cardtitle = req.body.cardtitle;
    let cardtext = req.body.cardtext;
    let href = req.body.link;
    let expiretime = `-${req.body.expiretime} day`;
    get_data("newHomework", [
      image,
      cardtitle,
      cardtext,
      href,
      expiretime,
      groop,
    ]).then((resolve) => {
      console.log(req.body);
      res.sendStatus(200);
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/deletehomework", async (req, res) => {
  console.log(req.body.id);
  get_data("deleteHomeworkById", [req.body.id]).then((homeworks) => {});
  let user = await client.get(`${req.session.id}`);
  if (user) {
    let userid = JSON.parse(await client.get(`${req.session.id}`)).id;
    let usergroup = JSON.parse(await client.get(`${req.session.id}`)).group;
    console.log({ userid, usergroup });
    get_data("homeworks", [usergroup]).then((homeworks) => {
      get_data("homeworkComplit1", [userid]).then((resolve) => {
        if (resolve.length == 0) {
          res.send({ homeworks, user });
        } else {
          console.log(resolve);
          res.send({ homeworks, resolve, user });
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});
