const express = require('express');
const path = require('node:path');
const expressLayouts = require('express-ejs-layouts');
const { leerMascotas } = require('./archivos.js');

const PORT = 3000;
const rutaDatos = path.join(__dirname, '..', 'datos', 'mascotas.json');

async function main() {
    try {
        // Carga inicial de datos
        const mascotas = await leerMascotas(rutaDatos);
        
        const app = express();

        // Configuración de EJS y Layouts
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '..', 'views'));
        app.use(expressLayouts);
        app.set('layout', 'layouts/main');

        // Configuración de archivos estáticos y lectura de formularios
        app.use(express.static(path.join(__dirname, '..', 'public')));
        app.use(express.urlencoded({ extended: false }));

        // GET / - Página inicial
        app.get('/', (req, res) => {
            res.render('inicio', { titulo: 'Inicio - Refugio de Mascotas' });
        });

        // GET /mascotas - Listado
        app.get('/mascotas', (req, res) => {
            res.render('mascotas/lista', { 
                titulo: 'Mascotas en Adopción',
                mascotas: mascotas
            });
        });

        // GET /mascotas/nueva - Formulario (Debe ir antes del :id)
        app.get('/mascotas/nueva', (req, res) => {
            res.render('mascotas/nueva', { 
                titulo: 'Agregar Mascota',
                error: null,
                valores: {} 
            });
        });

        // GET /mascotas/:id - Detalle
        app.get('/mascotas/:id', (req, res) => {
            const id = Number(req.params.id);
            const mascota = mascotas.find(m => m.id === id);

            if (!mascota) {
                return res.status(404).render('no-encontrado', { titulo: 'Mascota no encontrada' });
            }

            res.render('mascotas/detalle', { 
                titulo: `Detalle de ${mascota.nombre}`,
                mascota: mascota 
            });
        });

        // POST /mascotas - Procesamiento del formulario
        app.post('/mascotas', (req, res) => {
            const { nombre, especie, edad, estado, descripcion } = req.body;
            const edadNum = Number(edad);

            // Validación
            if (!nombre || !especie || !edad || !estado || !descripcion || isNaN(edadNum) || edadNum < 0) {
                return res.status(400).render('mascotas/nueva', {
                    titulo: 'Agregar Mascota',
                    error: 'Todos los campos son obligatorios y la edad debe ser un número válido mayor o igual a cero.',
                    valores: req.body // Conservar valores
                });
            }

            const ultimoId = mascotas.length > 0 ? mascotas[mascotas.length - 1].id : 0;
            
            const nuevaMascota = {
                id: ultimoId + 1,
                nombre,
                especie,
                edad: edadNum,
                descripcion,
                estado,
                imagen: '/img/mascota.svg'
            };

            mascotas.push(nuevaMascota);
            res.redirect('/mascotas');
        });

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error crítico al iniciar el servidor:", error.message);
        process.exitCode = 1;
    }
}

main();