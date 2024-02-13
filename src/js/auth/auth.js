import { app } from "./../server.js";
import { client } from "./../sessions.js";
import { get_data } from "./../db.js";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import axios from "axios";

app.post("/genqr", async (req, res) => {
  // console.log(req.cookies["connect.sid"]);
  let RisAuthorized = await client.get(`${req.session.id}`);
  if (RisAuthorized) {
    let user = {
      id: JSON.parse(await client.get(`${req.session.id}`)).id,
      auth_token: JSON.parse(await client.get(`${req.session.id}`)).auth_token,
      isAuthorized: JSON.parse(await client.get(`${req.session.id}`))
        .isAuthorized,
      type: JSON.parse(await client.get(`${req.session.id}`)).type,
      name: JSON.parse(await client.get(`${req.session.id}`)).name,
      group: JSON.parse(await client.get(`${req.session.id}`)).group,
    };
    // Переделать на логин и пароль, с фронта делать axios.post(/login,{password,login})
    get_data("FindUser", [user.id]).then(async (users) => {
      let login = users[0].login;
      let password = users[0].password;
      console.log({ login, password });
      const url = `https://nice-pro-gecko.ngrok-free.app/qrauth?login=${login}&password=${password}`;
      if (!url) {
        return res.status(400).send("URL не указан.");
      }
      try {
        const qr = await QRCode.toDataURL(url);
        res.send({ qr });
      } catch (err) {
        res.status(500).send("Ошибка при создании QR-кода.");
      }
    });
  } else {
    console.log("auth required");
    res.redirect("/login");
  }
});
app.get("/qrauth", async (req, res) => {
  let login = req.query.login;
  let password = req.query.password;
  axios
    .post(
      `https://nice-pro-gecko.ngrok-free.app/login`,
      {
        login: login,
        password: password,
      },
      { withCredentials: true }
    )
    .then(async (response) => {
      let isAuthorized = response.data.isAuthorized;
      let user = response.data.user;
      if (isAuthorized === true) {
        console.log("succes", { isAuthorized });
        await client.set(`${req.session.id}`, JSON.stringify(user));
        res.redirect("/exercises");
      } else if (isAuthorized === false) {
        res.redirect("/login");
        console.log("failed", { isAuthorized });
      } else {
        console.log("shit happens");
      }
      console.log(response.data.user);
    });
});
app.post("/qrauth", async (req, res) => {
  console.log("qr отсканирован");
  let user = req.body.user;
  res.send({ user });
});
app.get("/login", async (req, res) => {
  let RisAuthorized = await client.get(`${req.session.id}`);
  // console.log(`redis:`, await client.get(`${req.session.id}`));
  if (RisAuthorized) {
    res.redirect("/exercises");
  } else {
    res.render("./src/pages/login.html");
  }
});
app.post("/login", async (req, res) => {
  let password = req.body.password;
  let login = req.body.login;
  console.log({ login, password });
  get_data("auth", [login]).then(async (users) => {
    console.log(users);
    if (users.length == 0) {
      console.log("Auth failed 1");
      res.send({ isAuthorized: false });
    } else {
      console.log(users[0]);
      if (users[0].password == password) {
        console.log("Succes");
        let user = {
          id: users[0].id,
          auth_token: req.session.id,
          isAuthorized: true,
          type: users[0].type,
          name: users[0].name,
          group: users[0].groop,
        };
        await client.set(`${req.session.id}`, JSON.stringify(user));
        console.log(await client.get(`${req.session.id}`));
        res.send({ isAuthorized: true, user: user });
      } else {
        console.log("Auth failed 2");
        await client.del(`${req.session.id}`);
        res.send({ isAuthorized: false });
      }
    }
  });
});
app.post("/logout", async (req, res) => {
  await client.del(`${req.session.id}`);
  res.redirect("/login");
});
