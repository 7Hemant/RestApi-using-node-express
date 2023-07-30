import express from "express";
import path from "path";
import * as sqlite3 from "sqlite3";
import bodyParser from "body-parser";
sqlite3.verbose(); //The ".verbose()" method allows you to have more information in case of a problem.
const app = express();

// Parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
// Parse JSON payloads
app.use(bodyParser.json());

//The database will be saved in the "data" folder, under the name "apptest.db".
// It is created automatically if it does not exist yet.
const db_name = path.join(__dirname, "data", "appdata.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) return console.error("e1", err.message);

  console.log("Successful connection to the database 'apptest.db'");
});

//write a sql query to create such a table
const sql_create = `CREATE TABLE IF NOT EXISTS Books (
    Book_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title VARCHAR(100) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Comments TEXT
  );`;

db.run(sql_create, (err) => {
  if (err) {
    return console.error("e2", err.message);
  }
  console.log("Successful creation of the 'first' table");
});
const sql_insert = `INSERT INTO Books (Book_ID, Title, Author, Comments) VALUES
(1, 'Mrs. Bridge', 'Evan S. Connell', 'First in the serie'),
(2, 'Mr. Bridge', 'Evan S. Connell', 'Second in the serie'),
(3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`;
db.run(sql_insert, (err) => {
  if (err) {
    return console.error("e3", err.message);
  }
  console.log("Successful creation of 3 books");
});

//get api or Reading data from data base
app.get("/", (req, res) => {
  const sql = "SELECT * FROM Books ORDER BY Title";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error("e4", err.message);
    }
    res.json({
      books: rows,
    });
  });
});

// creating items and storing in db
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Books (Title, Author, Comments) VALUES (?, ?, ?)";
  const book = [req.body.Title, req.body.Author, req.body.Comments];
  db.run(sql, book, (err) => {
    if (err) return console.log("e5", err.message);
    res.json({
      message: "created",
    });
  });
});

//post api or update data
app.post("/edit/:id", (req, res) => {
  const id = req?.params?.id;

  const book = [req.body.Title, req.body.Author, req.body.Comments, id];
  const sql =
    "UPDATE Books SET Title = ?, Author = ?, Comments = ? WHERE (Book_ID = ?)";
  db.run(sql, book, (err) => {
    if (err) return console.log("e6", err.message);
    res.json({
      message: "update",
    });
  });
});

//delete item or row from database

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Books WHERE Book_ID = ?";
  db.run(sql, id, (err) => {
    if (err) return console.log("e7", err.message);
    res.json({
      message: "delete",
    });
  });
});

app.listen(3000, () => console.log("server is running"));
