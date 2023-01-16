const socket_config = { transports: ['websocket']};
const adress = 'https://test-liver.vercel.app/';
const port = 3000;

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

}


