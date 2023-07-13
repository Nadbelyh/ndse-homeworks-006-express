const express = require("express");
const { v4: uuid } = require("uuid");

class Book {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = ""
  ) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
  }
}

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
  user: {
    id: 1,
    mail: "test@mail.ru",
  },
};

const app = express();
app.use(express.json());

app.get("/api/books", (req, res) => {
  const { books } = stor;
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const { books } = stor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

app.post("/api/books/", (req, res) => {
  const { books } = stor;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.post("/api/user/login", (req, res) => {
  const { user } = stor;
  res.status(201);
  res.json(user);
});

app.put("/api/books/:id", (req, res) => {
  const { books } = stor;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };

    res.json(books[idx]);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

app.delete("/api/books/:id", (req, res) => {
  const { books } = stor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.json(true);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
