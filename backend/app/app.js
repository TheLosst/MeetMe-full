const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const argon2 = require("argon2");

var cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors()); 
const port = 5000;
const routes = require('./routes');
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const router = express.Router();

app.use('/api', routes);
