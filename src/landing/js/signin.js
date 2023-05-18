
// Spinner
var spinner = function () {
    setTimeout(function () {
            document.getElementById('spinner').classList.remove('show');
    }, 1);
};
spinner();


async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

function setCookie(cname, cvalue, ex) {
    const d = new Date();
    d.setTime(d.getTime() + (ex*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//login
document.getElementById("singINbtn").addEventListener("click",(event)=>{
    let email = document.getElementById("floatingInput").value;
    let password = document.getElementById("floatingPassword").value;
    postData("/signin",{email:email,password:password}).then((data) => {
        if(data.errors) {
            console.log(data.errors[0].detail);
            document.getElementById("Errors").innerHTML = data.errors[0].detail
        }
        else{
            setCookie('token', data.access_token,data.expires_in);
            setCookie('id', data.id,data.expires_in);
            console.log("a");
            window.location.href = "/profile";
        }
    });
});

