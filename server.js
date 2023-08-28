const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const notesData = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to get reviews`);
  res.status(200).json(notesData);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to get reviews`);
  const { title, text } = req.body;

  if( title && text ) {
    const newNote = {
      title,
      text,
      id: uuid()
    };
    
    console.log(newNote);
    notesData.push(newNote);
    console.log(notesData);

    const noteString = JSON.stringify(notesData);

    fs.writeFile(`./db/db.json`, noteString, (err) => 
      err
        ? console.error(err)
        : console.log(`New note added for ${newNote.title}`)
    );

    const response = {
      status: 'success',
      body: newNote
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);