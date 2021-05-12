const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const {findCategory} = require('./services/addNewTool');

const port = process.env.PORT || 5000;

// Init app
const app = express();

app.use(cors());

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, callback){
        callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('img');

function checkFileType(file, callback){
    // Allowed ext
    const filetypes = /svg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return callback(null,true);
    } else {
        callback('Error: Images Only!');
    }
}

let toolsData = {}
let login = {}
let toolsToAdd = {}

let rawData = fs.readFileSync('tools.json'); //czytamy jsona
toolsData = JSON.parse(rawData);    //zamieniamy go na obiekt

const saveToFile = (file) => {
    fs.writeFile('tools.json', file, 'utf-8', (err) => {
        if (err){
            alert(err);
        }
        console.log('Plik został zaktualizawny!');
    });
}

app.post('/addTool', (req, res) => {
    let requestAsJson = JSON.stringify(req.body); //przypisujemy pobrany plik do zmiennej jako json
    res.setHeader('Content-Type', 'application/json');

    console.log("Wczytane dane: " + requestAsJson);
    let newObject = JSON.parse(requestAsJson); //zamieniamy go na obiekt

    let categoryToFind = newObject.id;

    res.send(requestAsJson);
    findCategory(newObject, categoryToFind);
});

app.post('/uploadImg', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            if(req.file === undefined){
                console.log('Error: No File Selected!');
                res.send('Error: No File Selected!');
            } else {
                console.log(`File uploaded - path: uploads/${req.file.filename}`);
                res.send(`File uploaded - path: uploads/${req.file.filename}`)
            }
        }
    });
});

app.get('/getTools', function(req, res) {
    fs.readFile('tools.json', 'utf-8', function (err, data) {
        let readyToRead = JSON.parse(data);
        res.send( readyToRead );
    });
});

app.get('/getToolsToAdd', function(req, res) {
    fs.readFile('tools.json', 'utf-8', function (err, data) {
        let readyToRead = JSON.parse(data);
        res.send( readyToRead );
    });
});

app.listen(port, () => console.log(`Server started on port ${port}`));