const { response } = require("express");

let competidorCounter = 1;

document.getElementById("registroForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = {
        curp: document.getElementById("curp").value,
        genero: document.querySelector('input[name="genero"]:checked').value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        nombre: document.getElementById("nombre").value,
        apellidoPaterno: document.getElementById("apellidoPaterno").value,
        apellidoMaterno: document.getElementById("apellidoMaterno").value,
        edad: document.getElementById("edad").value,
        distancia: document.querySelector('input[name="distancia"]:checked').value,
        telefono: document.getElementById("telefono").value,
        categoria: document.getElementById("categoria").value,
        numeroCompetidor: competidorCounter // Asigna el número de competidor
    };

    const data = formData;

    // Aumenta el contador de competidores
    competidorCounter++;
    
    try {
        const response = await fetch('/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Exito', result);
        })
        .catch(error => {
            console.error('Error al guardar los datos: ', error);
        })

        const result = await response.json();

        if (result.mensaje === 'Datos guardados correctamente') {
            location.href = "race-info.html";
        }
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
});

function consultarCurp() {
    window.open("https://www.gob.mx/curp/", "_blank");
}
