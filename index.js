const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const gulp = require('gulp');
const formidable = require('formidable');
const config = require("./config");
const homeCtrl = require("./controllers/homeCtrl")
const app = module.exports = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('www'));

massive(config.connectionString).then(db => {
    app.set('db', db)
})

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/www/index.html');
})

app.post('/', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function(name, file) {
        file.path = __dirname + '/www/uploads/' + file.name;
    });

    form.on('file', function(name, file) {
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/www/index.html');
});


app.get('/dashboard/video', homeCtrl.getAnalytics);
app.get('/video/:id', homeCtrl.getComments);
app.get("/search", homeCtrl.getUsers);
app.listen(3001, () => console.log('listening port 3001'));