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
    password: "pendanyou",
    database: "liver"
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
    for(let i=0;i<files.length;i++)
    {
        files[i] = "public"+`/${id}`+`/${patient_id}`+`/${files[i]}`;
    }
    //files.forEach((elem)=>{elem = __dirname+`/${id}`+ `/${patient_id}`+`/${elem}`});
    console.log(files[0]);
    let task_data = req.body.task;
    let Image_path = (__dirname + `/public/${id}/${patient_id}/`);
    let base64String = req.body.image;
    let base64Image = base64String.split(';base64,').pop();
    fs.writeFile(Image_path+"1.png", base64Image, {encoding: 'base64'}, function(err) {

    });
    PythonShell.run(__dirname+'/SystemBack/pythonfile.py', {args:[files[0],task_data]}).then(messages=>{

        console.log('results: %j', messages);
        console.log('results: %j', messages[0]);
        analyze = messages[0];
        res.send({task: task_data,answer:analyze});
    });


});

io.on('connection', function (socket) {
    console.log('New user connected');
    socket.on("send_auth_data",({email_data, pass_data})=>{
        console.log(email_data);
        console.log(pass_data);
        db.query("SELECT * FROM users",
            function(err, results, fields) {
                console.log(err);
                console.log(results); // собственно данные
                //console.log(fields); // мета-данные полей
                if(email_data == results[0]["Email"] && pass_data == results[0]["Password"])
                {
                    socket.emit('send_auth_data', results[0]["Users_id"]);
                }
            });

    })
});

httpServer.listen(8000);