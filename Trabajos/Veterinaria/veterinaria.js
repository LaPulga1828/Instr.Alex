(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();

            if (form.checkValidity()) {
                if (validaciones()) {
                    limpiarFormulario(form);

                    // Cierra el modal de Bootstrap 5 sin jQuery
                    const modalElement = document.getElementById('staticBackdrop');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                }
            } else {
                form.classList.add('was-validated');
            }
        }, false);
    });
})();

const storedData = localStorage.getItem("citasVeterinaria");
const dataArray = storedData ? JSON.parse(storedData) : [];
const namePet = document.getElementById("namePet");
const typePet = document.getElementById("typePet");
const nameOwner = document.getElementById("nameOwner");
const phone = document.getElementById("phone");
const date = document.getElementById("dateVisit");
const time = document.getElementById("timeVisit");
const symptoms = document.getElementById("symptoms");
const Pets = [
    { typePet: "Perro", urlPhoto: "./img/perro.jpg", urlGif: "./img/perro.gif" },
    { typePet: "Gato", urlPhoto: "./img/gato.webp", urlGif: "./img/gato.gif" },
    { typePet: "Pez", urlPhoto: "./img/pezkoi.webp", urlGif: "./img/pez.gif" },
    { typePet: "Capibara", urlPhoto: "./img/capibara.jpg", urlGif: "./img/capibara.webp" },
    { typePet: "Zorro", urlPhoto: "./img/zorro.jpeg", urlGif: "./img/zorro.gif" },
    { typePet: "Erizo", urlPhoto: "./img/erizo.avif", urlGif: "./img/erizo.webp" },
    { typePet: "Ave", urlPhoto: "./img/ave.jpg", urlGif: "./img/ave.gif" },
    { typePet: "Caballo", urlPhoto: "./img/caballo.jpg", urlGif: "./img/caballo.webp" },
    { typePet: "Hamster", urlPhoto: "./img/hamster.jpg", urlGif: "./img/hamster.webp" },
    { typePet: "Ajolote", urlPhoto: "./img/ajolote.jpg", urlGif: "./img/ajolote.webp" }
]
const statusColors = [
    { status: "Abierta", colorShadow: "#b0ff3aab", colorBadge: "#18d818" },
    { status: "Terminada", colorShadow: "#2e86ebab", colorBadge: "#4a90e2" },
    { status: "Anulada", colorShadow: "#e6150eab", colorBadge: "#dd1717" },
]

function limpiarFormulario(form) {
    // Restaurar título del modal
    const modalTitle = document.getElementById("staticBackdropLabel");
    modalTitle.textContent = "Cita Veterinaria";

    // Restaurar botón
    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.textContent = "Guardar Cita";
    btnGuardar.onclick = guardar;

    // Limpiar campo de ID de cita (si lo estás mostrando)
    const idCita = document.getElementById("idCita");
    if (idCita) {
        idCita.textContent = "";
    }

    // Limpiar el campo de estado (status)
    const statusDiv = document.getElementById("divStatus");
    statusDiv.innerHTML = "";

    form.reset();
    form.classList.remove("was-validated");
    const modalElement = document.getElementById('staticBackdrop');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide()
}

document.getElementById("btnCerrarModal").addEventListener("click", () => {
    const form = document.getElementById("formMascota");
    limpiarFormulario(form);
    document.getElementById("inputBuscar").value = "";
    document.getElementById("filter").value = "Todos"; // También reinicia el filtro
    filtrarYCargar();

});

function validaciones() {
    const today = new Date().toISOString().split('T')[0];

    if (namePet.value === "") {
        alertaCampo("Nombre de la mascota");
        return false;
    }

    if (typePet.value === "") {
        alertaCampo("Tipo de mascota");
        return false;
    }

    if (nameOwner.value === "") {
        alertaCampo("Nombre del dueño");
        return false;
    }

    if (phone.value === "") {
        alertaCampo("Teléfono");
        return false;
    }

    if (isNaN(phone.value)) {
        Swal.fire({
            icon: 'warning',
            title: 'Teléfono inválido',
            text: 'El número de teléfono debe contener solo dígitos.',
            timer: 4000
        });
        phone.value = "";
        return false;
    }

    if (date.value === "") {
        alertaCampo("Fecha de la visita");
        return false;
    }

    if (date.value <= today) {
        Swal.fire({
            icon: "warning",
            title: "Fecha inválida",
            text: "Debe ser posterior al día de hoy.",
            timer: 4000
        });
        return false;
    }

    if (time.value === "") {
        alertaCampo("Hora de la visita");
        return false;
    }

    if (time.value < "08:00" || time.value > "20:00") {
        Swal.fire({
            icon: "warning",
            title: "Hora inválida",
            text: "El horario de atención es de 8:00am a 8:00pm.",
            timer: 4000
        });
        return false;
    }

    if (symptoms.value === "") {
        alertaCampo("Síntomas");
        return false;
    }

    if (symptoms.value.length > 400) {
        Swal.fire({
            icon: "warning",
            title: "Texto muy largo",
            text: "Describe los síntomas con menos de 400 caracteres.",
            timer: 4000
        });
        return false;
    }

    return true;
}

function ordenarCitas() {
    dataArray.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));
    pintar();

}

function guardar() {
    if (validaciones()) {
        const statusElement = document.getElementById("status");
        const cita = {
            id: CreateId(),
            nombreMascota: namePet.value,
            especie: typePet.value,
            nombreDueño: nameOwner.value,
            telefono: phone.value,
            fecha: date.value,
            hora: time.value,
            sintomas: symptoms.value,
            estado: statusElement ? statusElement.value : "Abierta"
        };

        dataArray.push(cita);
        localStorage.setItem("citasVeterinaria", JSON.stringify(dataArray));
        ordenarCitas();
        Swal.fire({
            icon: "success",
            title: "Cita guardada exitosamente",
            timer: 4000
        });

        console.log(dataArray);
        document.getElementById("inputBuscar").value = "";
        document.getElementById("filter").value = "Todos"; // También reinicia el filtro
        filtrarYCargar();
    }

}

async function eliminar(i) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás deshacer esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        dataArray.splice(i, 1);
        localStorage.setItem("citasVeterinaria", JSON.stringify(dataArray));
        pintar();
        await Swal.fire(
            'Eliminado',
            'La cita ha sido eliminada.',
            'success'
        );
    }
    ordenarCitas();
}

function editar(i) {
    const cita = dataArray[i];
    namePet.value = cita.nombreMascota;
    typePet.value = cita.especie;
    nameOwner.value = cita.nombreDueño;
    phone.value = cita.telefono;
    date.value = cita.fecha;
    time.value = cita.hora;
    symptoms.value = cita.sintomas;

    // Actualiza el ID de la cita en el modal
    const idCita = document.getElementById("idCita");
    idCita.textContent = `#${cita.id}`;

    // Cambia el título del modal
    const modalTitle = document.getElementById("staticBackdropLabel");
    modalTitle.textContent = "Editar Cita Veterinaria";

    // Agrega el select de estado
    const statusDiv = document.getElementById("divStatus");
    statusDiv.innerHTML = `
        <div class="col-md-12 py-2">
            <label for="status" class="form-label">Estado de la Cita</label>
            <select class="form-select" id="status" required>
                <option value="Abierta">Abierta</option>
                <option value="Terminada">Terminada</option>
                <option value="Anulada">Anulada</option>
            </select>
        </div>
    `;


    document.getElementById("status").value = cita.estado;

    // Mostrar modal
    const modalElement = document.getElementById('staticBackdrop');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();

    // Cambia el botón a modo editar
    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.textContent = "Editar Cita";
    btnGuardar.onclick = function () {
        if (validaciones()) {
            cita.nombreMascota = namePet.value;
            cita.especie = typePet.value;
            cita.nombreDueño = nameOwner.value;
            cita.telefono = phone.value;
            cita.fecha = date.value;
            cita.hora = time.value;
            cita.sintomas = symptoms.value;
            cita.estado = document.getElementById("status").value;

            localStorage.setItem("citasVeterinaria", JSON.stringify(dataArray));
            ordenarCitas();
            limpiarFormulario(document.getElementById("formMascota"));
            Swal.fire({
                icon: "success",
                title: "Cita editada exitosamente",
                timer: 4000
            });
            document.getElementById("inputBuscar").value = "";
            document.getElementById("filter").value = "Todos"; // También reinicia el filtro
            filtrarYCargar();


        }
    };
}

function alertaCampo(nombreCampo) {
    Swal.fire({
        icon: 'warning',
        title: 'Campo obligatorio',
        text: `Por favor, completa el campo ${nombreCampo}.`,
        timer: 4000
    });
}

function CreateId(date = new Date()) {
    const colombiaTime = new Date(date.toLocaleString("en-US", { timeZone: "America/Bogota" }));
    const year = colombiaTime.getFullYear();
    const month = String(colombiaTime.getMonth() + 1).padStart(2, '0');
    const day = String(colombiaTime.getDate()).padStart(2, '0');
    const hours = String(colombiaTime.getHours()).padStart(2, '0');
    const minutes = String(colombiaTime.getMinutes()).padStart(2, '0');
    const seconds = String(colombiaTime.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function pintar(filtrado = dataArray) {
    document.getElementById("citas").textContent = ""
    filtrado.forEach((item, i) => {
        const typePetSelect = Pets.find(pet => pet.typePet === item.especie);
        console.log(typePetSelect);
        let background = `background: url(${typePetSelect.urlGif}) center/cover`
        const colorStatus = statusColors.find(pet => pet.status === item.estado);
        let colorBadge = colorStatus ? `background-color:${colorStatus.colorBadge} !important;` : "";
        let colorShadow = colorStatus ? `box-shadow: 4px 4px 20px 2px ${colorStatus.colorShadow}; ` : "";
        let colorborder = colorStatus ? `border: 4px solid ${colorStatus.colorBadge};` : "";



        document.getElementById("citas").innerHTML +=
            `
    <div class="card profile-card div position-relative" style="${colorShadow}">
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-success px-4 py-2 fs-6" style="${colorBadge}">${item.estado}</span>
        <div class="profile-header" style="${background}">
            <p class="text-body-tertiary fw-light position-absolute top-0 start-0 ms-2">#${item.id}</p>
        </div>
        <img src="${typePetSelect.urlPhoto}" alt="Profile" class="profile-img mx-auto" style="${colorborder}">
        <div class="card-body justify-content-center">
            <h5 class="card-title fst-italic fw-bold fs-3">${item.nombreMascota}</h5>
            <div class=" container   mb-3 ">
                <div class="row">
                    <div class="col-4  text-start">
                        <p class="text-secondary">Propietario:</p>
                    </div>
                    <div class="col-8 text-start">
                        <p class="">${item.nombreDueño}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 text-start ">
                        <p class="text-secondary">Telefono:</p>
                    </div>
                    <div class="col-9 text-start">
                        <p class="">${item.telefono}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 text-start">
                        <p class="text-secondary">Fecha:</p>
                    </div>
                    <div class="col-9 text-start">
                        <p class="">${item.fecha}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2  text-start">
                        <p class="text-secondary">Hora:</p>
                    </div>
                    <div class="col-10 text-start">
                        <p class="">${item.hora}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button id="btnSintomas" class="btn btn-outline-secondary p-1" onclick="toggleSintomas(this)">Síntomas</button>
                    </div>
                    <div class="col-12">
                        <div class="sintomas-content d-none">
                            <p>${item.sintomas}</p>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-sm btn-custom" onclick="editar(${i})"> <i class="bi bi-pencil-square"></i> Editar</button>
            <button class="btn btn-outline-danger btn-sm btn-custom" onclick="eliminar(${i})"><i class="bi bi-trash3-fill"></i> Eliminar</button>
        </div>
    </div>
        `
    })
}

function filtrarYCargar() {
    const estadoSeleccionado = document.getElementById("filter").value;
    const terminoBusqueda = document.getElementById("inputBuscar").value.toLowerCase().trim();

    let resultados = dataArray;

    // Filtrar por estado si no es "Todos"
    if (estadoSeleccionado !== "Todos" && estadoSeleccionado !== "All") {
        resultados = resultados.filter(cita => cita.estado === estadoSeleccionado);
    }

    // Filtrar por búsqueda si se ingresó algo
    if (terminoBusqueda !== "") {
        resultados = resultados.filter(cita =>
            cita.nombreMascota.toLowerCase().includes(terminoBusqueda) ||
            cita.nombreDueño.toLowerCase().includes(terminoBusqueda)
        );
    }

    pintar(resultados);
}

document.getElementById("filter").addEventListener("change", filtrarYCargar);

document.getElementById("btnBuscar").addEventListener("click", filtrarYCargar);

document.getElementById("inputBuscar").addEventListener("input", filtrarYCargar);



function toggleSintomas(button) {
    const sintomasDiv = button.closest('.row').querySelector('.sintomas-content');
    sintomasDiv.classList.toggle('d-none');
    if (sintomasDiv.classList.contains('d-none')) {
        button.textContent = "Síntomas";
    } else {
        button.textContent = "Ocultar síntomas";
    }
}

filtrarYCargar();
document.getElementById('staticBackdrop').addEventListener('hidden.bs.modal', () => {
    const form = document.getElementById("formMascota");
    limpiarFormulario(form);
});

