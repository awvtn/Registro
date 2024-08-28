import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = await import('pg').then(pg => pg.default);

const app = express();
const PORT = 3000;

// Configura la conexión a PostgreSQL
const pool = new Pool({
    user: 'Diana_Herrera',
    host: 'dpg-cr77vhjv2p9s73e9k380-a',
    database: 'registro-carrera',
    password: 'KugswiSVuTxx2JENebXmomIY1KPB3y31',
    port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el formulario
app.post('/guardar', async (req, res) => {
    const { numeroCompetidor, nombre, curp, genero, fechaNacimiento, apellidoPaterno, apellidoMaterno, edad, distancia, telefono, categoria } = req.body;

    try {
        // Insertar los datos en la base de datos
        const result = await pool.query(
            `INSERT INTO competidores (
                numero_competidor, nombre, curp, genero, fecha_nacimiento, 
                apellido_paterno, apellido_materno, edad, distancia, telefono, categoria
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [numeroCompetidor, nombre, curp, genero, fechaNacimiento, apellidoPaterno, apellidoMaterno, edad, distancia, telefono, categoria]
        );

        res.json({ mensaje: "Datos guardados correctamente", id: result.rows[0].id });
    } catch (err) {
        console.error('Error al guardar los datos en la base de datos:', err);
        res.status(500).json({ mensaje: "Error al guardar los datos" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
