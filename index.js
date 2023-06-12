const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001; // to assign deployment to heroku
const app = express();

app.use(express.json()); //content: application/json
app.use(express.urlencoded({ extended: true })); //content: urlencoded

app.use(express.static('public'));


// GET request for notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    const notes = JSON.parse(data);
    res.status(200).json(notes);
  });
});


//GET request for notes by id
app.get('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
      return;
    }

    const notes = JSON.parse(data);
    const note = notes.find((note) => note.id === noteId);

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.status(200).json(note);
  });
});


// POST request for notes
app.post('/api/notes', (req, res) => {
  const saveNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
      return;
    }

    const notes = JSON.parse(data);
    notes.push(saveNote);

    fs.writeFile(
      path.join(__dirname, 'db.json'),
      JSON.stringify(notes),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
          return;
        }

        res.status(200).json(newNote);
      }
    );
  });
});


//DELETE request by note id
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
      return;
    }

    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(
      path.join(__dirname, 'db.json'),
      JSON.stringify(updatedNotes),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
          return;
        }

        res.status(200).json({ success: true });
      }
    );
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);