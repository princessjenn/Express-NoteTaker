const express = require('express');
const path = require('path');


const PORT = process.env.PORT || 3001; // to assign deployment to heroku

const app = express();

app.use(express.json()); //content: application/json
app.use(express.urlencoded({ extended: true })); //content: urlencoded

app.use(express.static('public'));

// GET request for example
app.get('/api/example', (req, res) => {
  res.status(200).json({example:1});
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);