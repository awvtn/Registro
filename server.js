const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el formulario
app.post('/guardar', async (req, res) => {
    const { curp, genero, fechaNacimiento, nombre, apellidoPaterno, apellidoMaterno, edad, distancia, telefono, categoria } = req.body;

    const filePath = path.join(__dirname, 'Competidores.xlsx');

    let workbook;
    let worksheet;

    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
        // Cargar el archivo existente
        workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const oldWorksheet = workbook.getWorksheet(1);
        console.log(oldWorksheet.name);

        worksheet = workbook.addWorksheet('Competidores - nueva');
        worksheet.columns = [
            { header: 'Número de Competidor', key: 'numCompetidor', width: 20 },
            { header: 'CURP', key: 'curp', width: 30 },
            { header: 'Género', key: 'genero', width: 10 },
            { header: 'Fecha de Nacimiento', key: 'fechaNacimiento', width: 20 },
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Apellido Paterno', key: 'apellidoPaterno', width: 20 },
            { header: 'Apellido Materno', key: 'apellidoMaterno', width: 20 },
            { header: 'Edad', key: 'edad', width: 10 },
            { header: 'Distancia', key: 'distancia', width: 10 },
            { header: 'Telefono', key: 'telefono', width: 20},
            { header: 'Categoria', key: 'categoria', width: 10}
        ];

        oldWorksheet.eachRow((row, rowNumber) => {
            if(rowNumber !== 1) {
                worksheet.addRow(row.values.slice(1));
            }
        });

        workbook.removeWorksheet(oldWorksheet.id);
        
        if (worksheet){
            worksheet.name = 'Competidores';
        }

        await workbook.xlsx.writeFile(filePath);
        console.log('Hola renombrada correctamente');

    } else {
        // Crear un nuevo archivo y agregar un encabezado
        workbook = new ExcelJS.Workbook();
        workbook.creator = 'Diana Herrera';
        workbook.created = new Date();
        worksheet = workbook.addWorksheet('Competidores');
        worksheet.columns = [
            { header: 'Número de Competidor', key: 'numCompetidor', width: 20 },
            { header: 'CURP', key: 'curp', width: 30 },
            { header: 'Género', key: 'genero', width: 10 },
            { header: 'Fecha de Nacimiento', key: 'fechaNacimiento', width: 20 },
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Apellido Paterno', key: 'apellidoPaterno', width: 20 },
            { header: 'Apellido Materno', key: 'apellidoMaterno', width: 20 },
            { header: 'Edad', key: 'edad', width: 10 },
            { header: 'Distancia', key: 'distancia', width: 10 },
            { header: 'Telefono', key: 'telefono', width: 20},
            { header: 'Categoria', key: 'categoria', width: 10}
        ];
    }

    // Obtener el número de competidor
    const numCompetidor = worksheet.rowCount;

    // Agregar una nueva fila con los datos del competidor
    worksheet.addRow({
        numCompetidor: numCompetidor,
        curp,
        genero,
        fechaNacimiento,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        edad,
        distancia,
        telefono,
        categoria
    });

    // Ordenar las filas por apellido paterno
    worksheet.autoFilter = 'A1:K1';
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        }
    });

    // Guardar el archivo Excel
    await workbook.xlsx.writeFile(filePath);

    // Enviar respuesta al cliente
    res.json({ mensaje: "Datos guardados correctamente", numeroCompetidor: numCompetidor });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});