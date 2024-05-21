import express from "express";
import Client from "ioredis";
import session, { Session } from "express-session";
import redisStorage from "connect-redis";
import bcrypt from "bcryptjs";
import { app } from "./server.js";
const client = new Client("redis://192.168.1.38:3131");
client.on("error", (err) => console.log("Redis Client Error", err));

app.use(
  session({
    store: new redisStorage({
      ttl: 21600,
      client: client,
      sessionid: bcrypt.genSaltSync(10),
    }),
    secret: "MySecret",
    secure: false,
    httpOnly: false,
  })
);
export { client };
