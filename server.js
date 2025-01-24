const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8000;  // Change port to 80

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Read the data from data.json
const getData = () => {
  const data = fs.readFileSync('./data.json');
  return JSON.parse(data);
};

// Endpoint to get all data
app.get('/api/data', (req, res) => {
  const data = getData();
  res.json(data);
});

// Endpoint to add new row
app.post('/api/data', upload.single('file'), (req, res) => {
  const data = getData();
  const newRow = {
    id: (data.length + 1).toString(),
    name: req.body.name,
    version: req.body.version,
    description: req.body.description,
    file: req.file ? req.file.filename : null
  };
  data.push(newRow);
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
  res.status(201).json(newRow);
});

// Endpoint to update a row
app.put('/api/data/:id', upload.single('file'), (req, res) => {
  const data = getData();
  const id = req.params.id;
  const row = data.find(item => item.id === id);
  if (row) {
    row.name = req.body.name || row.name;
    row.version = req.body.version || row.version;
    row.description = req.body.description || row.description;
    if (req.file) row.file = req.file.filename;
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    res.json(row);
  } else {
    res.status(404).send('Row not found');
  }
});

// Endpoint to delete a row
app.delete('/api/data/:id', (req, res) => {
  let data = getData();
  data = data.filter(item => item.id !== req.params.id);
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
  res.status(204).send();
});

// Endpoint to download a file
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'uploads', req.params.filename);
  res.download(filePath);
});

// Bind the server to 192.168.0.170:80
const server = app.listen(port, '192.168.0.170', () => {
  console.log(`Server is running on http://192.168.0.170:${port}`);
});

// Listen for stop command to gracefully shut down the server
process.stdin.on('data', (input) => {
  const command = input.toString().trim();
  if (command === '#stop') {
    console.log('Server stopping...');
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  }
});
