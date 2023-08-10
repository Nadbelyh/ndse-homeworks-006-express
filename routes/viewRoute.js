const express = require("express");
const Book = require("../models/book");
const router = express.Router();
const fileMiddleware = require("../middleware/file");
const { getCounter, setCounter } = require("./counterReq");

router.get("/view", async (_req, res) => {
  try {
    const books = await Book.find().select("-__v");
    res.render("books/index", { title: "Список книг", books: books });
  } catch (e) {
    res.status(404).redirect("../views/error/404");
  }
});

router.get("/view/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const books = await Book.findById(id).select("-__v");
    if (books !== -1) {
      getCounter(id, (resp) => {
        if (resp.statusCode !== 500) {
          resp.on("data", (d) => {
            const count = JSON.parse(d).count;
            console.log(`Запрос прошел успешно, count - ${count}`);
            res.render("books/view", {
              title: "Выбранная книга",
              book: books,
              count: count,
            });
          });
          setCounter(id);
        }
      });
    }
  } catch (e) {
    res.status(404).redirect("../views/error/404");
  }
});

router.get("/create", (_req, res) => {
  res.render("books/create", { title: "Добавить книгу", book: {} });
});

router.post("/create", fileMiddleware.single("file"), async (req, res) => {
  const { title, authors, description, favorite, fileCover, fileName } =
    req.body;
  const fileBook = req.file ? req.file : null;

  try {
    const newBook = new Book({
      title,
      authors,
      description,
      favorite,
      fileCover,
      fileName,
      fileBook,
    });
    await newBook.save();
    res.redirect("/books/view");
  } catch (e) {
    res.status(404);
    res.redirect("../views/error/404");
  }
});

router.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    res.render("books/update", {
      title: "Редактировать книгу",
      book: book,
    });
  } catch {
    res.status(404).redirect("../views/error/404");
  }
});

router.post("/update/:id", fileMiddleware.single("file"), async (req, res) => {
  const { id } = req.params;
  try {
    const { title, authors, description, favorite, fileCover, fileName } =
      req.body;
    const fileBook = req.file ? req.file : null;
    await Book.findByIdAndUpdate(id, {
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    });
    res.status(200).redirect("/books/view/" + id);
  } catch {
    res.status(404).redirect("../views/error/404");
  }
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Book.deleteOne({ _id: id });
    res.status(200).redirect("/books/view");
  } catch {
    res.status(404).redirect("../views/error/404");
  }
});

module.exports = router;
