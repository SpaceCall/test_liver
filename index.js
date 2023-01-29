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
io.on('connection', function (socket) {
    console.log('New user connected');
    socket.on("send_auth_data",({email_data, pass_data})=>{
        console.log(email_data);
        console.log(pass_data);
        if(email_data == 'admin@admin' && pass_data == 'admin')
        {
            console.log("Problem");
            socket.emit('send_auth_data', true);
        }
    })
});

httpServer.listen(5000);