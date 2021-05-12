const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const cors = require('cors');



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
}).single('myImage');

// Check File Type
function checkFileType(file, callback){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
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

// Init app
const app = express();

const port = process.env.PORT || 8080;
app.use(cors());

// Public Folder
app.use(express.static('./public'));

app.post('/upload', (req, res) => {


    let file = req.body;
    let data = req.body.name.data;

    let requestAsJson = JSON.stringify(data); //przypisujemy pobrany plik do zmiennej jako json
    res.setHeader('Content-Type', 'application/json');

    console.log("Wczytane dane: " + requestAsJson);

    let newObject = JSON.parse(requestAsJson); //zamieniamy go na obiekt
    let categoryToFind = newObject.id;
    res.send(requestAsJson);
    findCategory(newObject, categoryToFind);

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

app.listen(port, () => console.log(`Server started on port ${port}`));