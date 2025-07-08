const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('assets'));
app.use(express.json());

// Path to JSON file
const dataFile = path.join(__dirname, 'data', 'properties.json');

// GET: return all properties
app.get('/api/properties', (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to read data.');
    res.json(JSON.parse(data));
  });
});

// POST: add new property
app.post('/api/properties', (req, res) => {
  const newProperty = req.body;

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to read file.');

    let properties = JSON.parse(data);
    newProperty.id = properties.length + 1;
    properties.push(newProperty);

    fs.writeFile(dataFile, JSON.stringify(properties, null, 2), (err) => {
      if (err) return res.status(500).send('Failed to save property.');
      res.status(201).json({ message: 'Property added successfully.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
