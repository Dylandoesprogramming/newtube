const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const gulp = require('gulp');
const app = module.exports = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('www'));

app.listen(3000, () => console.log('listening port 3000'));