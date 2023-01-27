'use strict';

const socket = io();

let auth_data = document.getElementById('form');
socket.on('connect', ()=>{
    console.log( 'socket connected' );
});

// подключаемся к серверу
socket.connect();











