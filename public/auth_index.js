const socket_config = { transports: ['websocket']};
const adress = 'test-liver.vercel.app';
const port = 3000;
const socket = io( `http://${ adress }:${ port }` , socket_config );

socket.on('connect', ()=>{
    console.log( 'socket connected' );

});
const form_auth = document.getElementById('form_auth');
form_auth.addEventListener("submit",get_form_auth_value);
function get_form_auth_value(event)
{
    event.preventDefault();
    const auth_email = form_auth.querySelector('[name="auth_email"]'),
        auth_pass = form_auth.querySelector('[name="auth_pass"]');
    const auth_data = {
        email : auth_email.value,
        pass : auth_pass.value,
    };
    socket.emit("auth_data",auth_data);
}

socket.connect();
