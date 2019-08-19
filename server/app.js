const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const users = require('./routes/users');
// const multer = require('multer');
const fileUpload = require('express-fileupload');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// Routes
app.use('/api/users', users);

// Static ***
app.use(express.static('./public'));

app.use(fileUpload());
// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  // console.log(req.files);
  const file = req.files.image;
  // console.log(file);

  file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'index.html'));
// });

const db = 'mongodb://localhost:27017/usarmy';
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  const host = server.address().address;
  console.log(`Server is running on host ${host}, port ${PORT}`);
});
