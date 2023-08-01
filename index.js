const express = require("express");
const router = require("./routes/bookRoute");
const error = require("./middleware/error-404");
const viewRoute = require("./routes/viewRoute.js");
const indexRoute = require("./routes/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/books", router);
app.use("/books", viewRoute);
app.use("/", indexRoute);
app.use(error);
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
