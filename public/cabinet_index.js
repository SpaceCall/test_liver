alert(document.cookie);
let new_patient_load_images = [];
function loadFile(event) {

    let image = document.createElement("img");
    image.src = URL.createObjectURL(event.target.files[0]);
    let table = document.getElementById("photo-table");
    table.appendChild(image);
    new_patient_load_images.append(event.target.files[0]);
};