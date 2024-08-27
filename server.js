const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el formulario
app.post('/guardar', async (req, res) => {
    const { curp, genero, fechaNacimiento, nombre, apellidoPaterno, apellidoMaterno, edad, distancia, telefono, categoria, numeroCompetidor } = req.body;

    const filePath = path.join(__dirname, 'Competidores.txt');
    const header = `Competidor\tCURP\t\tGénero\t\tFecha Nac.\tNombre\tApellido Paterno\tApellido Materno\tEdad\tDistancia\tTeléfono\tCategoría\n`;
    const competidorData = `${numeroCompetidor}\t${curp}\t${genero}\t\t${fechaNacimiento}\t${nombre}\t${apellidoPaterno}\t${apellidoMaterno}\t${edad}\t${distancia}\t${telefono}\t${categoria}\n`;

    if (!fs.existsSync(filePath)) {
        // Si no existe, primero agregamos la cabecera y luego los datos
        fs.writeFile(filePath, header + competidorData, (err) => {
            if (err) {
                console.error('Error al crear el archivo de texto:', err);
                return res.status(500).json({ mensaje: "Error al guardar los datos" });
            }
            res.json({ mensaje: "Datos guardados correctamente" });
        });
    } else {
        // Si ya existe, simplemente agregamos los datos (sin cabecera)
        fs.appendFile(filePath, competidorData, (err) => {
            if (err) {
                console.error('Error al agregar datos al archivo de texto:', err);
                return res.status(500).json({ mensaje: "Error al guardar los datos" });
            }
            res.json({ mensaje: "Datos guardados correctamente" });
        });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});