const express = require("express");
const router = require("./routes/bookRoute");
const error = require("./middleware/error-404");
const viewRoute = require("./routes/viewRoute.js");
const indexRoute = require("./routes/index");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/books", router);
app.use("/books", viewRoute);
app.use("/", indexRoute);
app.use(error);
app.set("view engine", "ejs");

async function start(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB);
    app.listen(PORT);
    console.log(
      `Сервер запущен: порту 8080, подключен к БД через порт ${UrlDB}`
    );
  } catch (e) {
    console.log("Ошибка подключения БД ", e);
  }
}

const UrlDB = process.env.UrlDB || "mongodb://root:example@mongo:27017/";
const PORT = process.env.PORT || 3000;
start(PORT, UrlDB);
