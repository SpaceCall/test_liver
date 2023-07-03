
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
    let patients_table_body = document.getElementById('patients_table_body');
    console.log(data);

    if(data.length!=0)
    {
        for(let i =0;i<data.length;i++){
            let patient_row = document.createElement("tr");

            let number_cell = document.createElement("th");
            number_cell.scope="row";
            number_cell.innerText = (i+1).toString();

            let name_cell = document.createElement("td");
            name_cell.innerText = data[i].Name;

            let edit_cell = document.createElement("td");
            let delete_cell = document.createElement("td");

            let edit_btn = document.createElement("button");
            let delete_btn = document.createElement("button");
            edit_btn.type = "button";
            edit_btn.classList.add("btn");
            edit_btn.classList.add("btn-primary");
            edit_btn.innerText = "Редагувати";

            delete_btn.type = "button";
            delete_btn.classList.add("btn");
            delete_btn.classList.add("btn-primary");
            delete_btn.innerText = "Видалити";

            edit_btn.addEventListener("click",()=>{
                setCookie("patient_id", data[i].Patients_id,1);
                window.location.href = "/patient";
            });

            edit_cell.appendChild(edit_btn);
            delete_cell.appendChild(delete_btn);
            patient_row.appendChild(number_cell);
            patient_row.appendChild(name_cell);
            patient_row.appendChild(edit_cell);
            patient_row.appendChild(delete_cell);
            patients_table_body.appendChild(patient_row);
        }
    }

});




