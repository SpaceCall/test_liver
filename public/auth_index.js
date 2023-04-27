'use strict';

const socket = io();

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

socket.on('connect', ()=>{
    console.log( 'socket connected' );
    socket.on('send_auth_data', (ans)=>{
        console.log(ans);
        if(ans)
        {
            setCookie('id', ans,1);
            setTimeout(function(){
                window.location.href = "/cabinet";
            },  1000)
        }
    });

});

// подключаемся к серверу
socket.connect();

// отправка данных
function send_authData(){
    const email_data = document.getElementById('email').value;
    const pass_data = document.getElementById('pass').value;
    socket.emit('send_auth_data', {email_data, pass_data});
}
document.getElementById("submit_button").addEventListener('click', send_authData);










