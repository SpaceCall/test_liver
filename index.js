const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const fileUpload = require('express-fileupload')
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


app.use(fileUpload());

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

app.post('/add-patient/upload', (req, res) => {
    // Log the files to the console
    console.log(req);
    console.log(req.files);

    // All good
    res.sendStatus(200);
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