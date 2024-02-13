import express from "express";
import nunjucks from "nunjucks";


const app = express();
const port = process.env.PORT || 3030;
const host = "127.0.0.1";

app.use(express.static("./src"));
app.use(express.urlencoded());
app.use(express.json());

nunjucks.configure(".", {
  autoescape: true,
  express: app,
});

app.listen(port, function () {
  console.log(
    `Server stated on: http://${host}:${port}\n& on: https://nice-pro-gecko.ngrok-free.app/`
  );
});

export { app };
