const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001; // to assign deployment to heroku
const app = express();

app.use(express.json()); //content: application/json
app.use(express.urlencoded({ extended: true })); //content: urlencoded

app.use(express.static('public'));

// GET request for notes
app.get('/api/notes', (req, res) => {
  //getNote

  //pull out data from req.header

  //write to file (db.json)
  res.status(200).json({example:1});
});

// POST request for notes
app.post('/api/notes', (req, res) => {
  //saveNote

  //pull out data from req.body

  //push to the db array (that we're importing)

  //write to file (db.json)

  res.status(200).json();
});

app.delete('/api/notes', (req, res) => {
  //deleteNote

  //pulling from the URL

  //removing item from the array (with whatever id is passed in {id})

  //write to file (db.json)

  res.status(200).json();
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);