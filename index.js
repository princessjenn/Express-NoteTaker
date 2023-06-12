const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001; // to assign deployment to heroku
const app = express();

app.use(express.json()); //content: application/json
app.use(express.urlencoded({ extended: true })); //content: urlencoded

app.use(express.static('public'));


const readNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
  return JSON.parse(data);
};

const writeNotes = (notes) => {
  fs.writeFileSync(
    path.join(__dirname, 'db', 'db.json'),
    JSON.stringify(notes),
    'utf8'
  );
};


// GET request for notes in 'notes.html'
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

//GET request for all in 'index.html' file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//GET request all saved notes
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});



/// POST request to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  const notes = readNotes();
  notes.push(newNote);
  writeNotes(notes);

  res.json(newNote);
});


// DELETE request for deleting a note by id
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db','db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
      return;
    }

    let notes = JSON.parse(data);

    // finds the index of the note with the specified id
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    // if the note is not found, return a 404 response
    if (noteIndex === -1) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    // Remove the note from the array
    notes.splice(noteIndex, 1);

    // writes the updated notes back to the db.json file
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
        return;
      }

      res.status(200).json({ success: true });
    });
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);