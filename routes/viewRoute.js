const express = require("express");
const Book = require("../Book/book");
const router = express.Router();
const fileMiddleware = require("../middleware/file");
const { getCounter, setCounter } = require("./counterReq");

const stor = {
  books: [
    new Book(
      "Ангелы и демоны",
      "Контейнер с опасной антиматерией похищен. И за этим преступлением, по мнению профессора Роберта Лэнгдона, стоит тайный оккультный орден иллюминатов, восставший из небытия.",
      "Дэн Браун"
    ),
    new Book(
      "Код да Винчи",
      "Страшное преступление совершается в стенах Лувра: куратор Жан Соньер жестоко убит, на его обнаженном теле начертаны странные знаки, а рядом с его трупом виднеются пурпурные буквы и цифры. В качестве помощника в расследовании полиция приглашает профессора Гарвардского университета по истории культуры и религии Роберта Лэнгдона.",
      "Дэн Браун"
    ),
    new Book(
      "Утраченный символ",
      "Приключения Роберта Лэнгдона продолжаются. На этот раз ему предстоит разгадать величайшую тайну масонов, которая способна изменить мир.",
      "Дэн Браун"
    ),
  ],
};

router.get("/view", (_req, res) => {
  res.render("books/index", { title: "Список книг", books: stor.books });
});

router.get("/view/:id", (req, res) => {
  const { id } = req.params;
  const book = stor.books.findIndex((book) => book.id === id);
  if (book !== -1) {
    getCounter(id, (resp) => {
      if (resp.statusCode !== 500) {
        resp.on("data", (d) => {
          const count = JSON.parse(d).count;
          console.log(`Запрос прошел успешно, cnt - ${count}`);
          res.render("books/view", {
            title: "Выбранная книга",
            book: stor.books[book],
            count: count,
          });
        });
        setCounter(id);
      } else {
        res.status(404).redirect("../views/error/404");
      }
    });
  }
});

router.get("/create", (req, res) => {
  res.render("books/create", { title: "Добавить книгу", book: {} });
});

router.post("/create", fileMiddleware.single("file"), (req, res) => {
  const { title, authors, description, favorite, fileCover, fileName } =
    req.body;
  const fileBook = req.file ? req.file : null;
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );

  stor.books.push(newBook);

  res.redirect("/books/view");
});

router.get("/update/:id", (req, res) => {
  const { id } = req.params;
  const book = stor.books.find((el) => el.id === id);

  if (book) {
    res.render("books/update", {
      title: "Редактировать книгу",
      book: book,
    });
  } else {
    res.status(404).redirect("../views/error/404");
  }
});

router.post("/update/:id", fileMiddleware.single("file"), (req, res) => {
  const { id } = req.params;
  const book = stor.books.findIndex((el) => el.id === id);
  const { title, authors, description, favorite, fileCover, fileName } =
    req.body;
  const fileBook = req.file ? req.file : null;
  if (book !== -1) {
    stor.books[book] = {
      ...stor.books[book],
      title,
      authors,
      description,
      favorite,
      fileCover,
      fileName,
      fileBook,
    };
    res.status(200).redirect("/books/view/" + id);
  } else {
    res.status(404).redirect("/404");
  }
});

router.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const book = stor.books.findIndex((el) => el.id === id);
  if (book !== -1) {
    stor.books.splice(book, 1);
    res.status(200).redirect("/books/view/");
  } else {
    res.status(404).redirect("/404");
  }
});

module.exports = router;
