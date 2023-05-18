
// Spinner
var spinner = function () {
    setTimeout(function () {
        document.getElementById('spinner').classList.remove('show');
    }, 1);
};
spinner();

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

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

document.getElementById("new_patient").addEventListener('click',()=>{
    setCookie("patient_id",0,1);
    window.location.href = "/patient";
});

let id = getCookie('id');
postData('/patients/getPatients',{id:id}).then((data) => {
    let patients_table = document.getElementById('patients_table');
    console.log(data);
    data.forEach((patient)=>{
        let div = document.createElement("button");
        div.className = "btn btn-lg btn-primary m-2";
        div.addEventListener("click",()=>{
            setCookie("patient_id", patient.Patients_id,1);
            window.location.href = "/patient";
        });
        div.innerHTML = patient.Name;
        patients_table.appendChild(div);
    });
});




