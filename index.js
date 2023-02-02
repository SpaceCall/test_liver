const express = require('express');
const app = express();
const {createServer} = require('http');
const {Server} = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer);

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