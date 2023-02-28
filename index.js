const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const fileUpload = require('express-fileupload')
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const mysql = require('mysql2');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const {PythonShell} = require('python-shell');
const fs = require('fs');
const path = require('path');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pendanyou"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Data base connected");
});





app.use(express.json({limit: '50mb'}));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public' + '/auth_index.html');
});
app.get('/auth_style.css', function (req, res) {
    res.sendFile(__dirname + '/public'+ '/auth_style.css');
});
app.get('/auth_index.js', function (req, res) {
    res.sendFile(__dirname + '/public' + '/auth_index.js');
});
app.get('/cabinet', function (req, res) {
    res.sendFile(__dirname + '/public' + '/cabinet_index.html');
});
app.get('/cabinet_style.css', function (req, res) {
    res.sendFile(__dirname + '/public'+ '/cabinet_style.css');
});
app.get('/cabinet_index.js', function (req, res) {
    res.sendFile(__dirname + '/public' + '/cabinet_index.js');
});
app.get('/nav-open-im.png', function (req, res) {
    res.sendFile(__dirname + '/public' + '/nav-open-im.png');
});
app.get('/add-patient', function (req, res) {
    res.sendFile(__dirname + '/public' + '/add_patient_index.html');
});
app.get('/patients', function (req, res) {
    res.sendFile(__dirname + '/public' + '/patients_index.html');
});

app.post('/add-patient/upload-photo',jsonParser, (req, res) => {
    // Log the files to the console
    console.log("upload_photo");
    let id = req.body.id;
    let patient_id = req.body.patient_id;
    let name = Date.now().toString()+".png";
    let Image_path = (__dirname + `/public/${id}/${patient_id}/`);
    let base64String = req.body.image;
    let base64Image = base64String.split(';base64,').pop();
    fs.writeFile(Image_path+name, base64Image, {encoding: 'base64'}, function(err) {

    });
    res.sendStatus(200);
});
app.post('/add-patient/analyze',jsonParser, (req, res) => {
    let id = req.body.id;
    let patient_id = req.body.patient_id;
    let directoryPath = path.join(__dirname,`public`, `${id}`, `${patient_id}`);
    let files = fs.readdirSync(directoryPath);
    let analyze="";
    files.forEach((elem)=>{elem = path.join(__dirname, `${id}`, `${patient_id}`,`${elem}`)});
    PythonShell.run('/SystemBack/pythonfile.py', {args:files[0],1,}).then(messages=>{

        console.log('results: %j', messages);
        analyze = messages[0];
        res.send({answer:analyze});
    });


});

io.on('connection', function (socket) {
    console.log('New user connected');
    socket.on("send_auth_data",({email_data, pass_data})=>{
        console.log(email_data);
        console.log(pass_data);
        if(email_data == 'admin@admin' && pass_data == 'admin')
        {
            socket.emit('send_auth_data', true);
        }
    })
});

httpServer.listen(8000);