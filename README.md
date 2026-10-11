# Trabajo práctico 04

## Descripción

Esta es una aplicación web renderizada en el servidor con Express y EJS para un refugio de mascotas. Permite visualizar un catálogo de mascotas en adopción, ver el detalle de cada una y registrar nuevas mascotas temporalmente mediante un formulario.

## Instalación

Para instalar las dependencias necesarias, ejecuta el siguiente comando en la terminal:
\`\`\`bash
npm install
\`\`\`

## Ejecución

Para verificar la sintaxis de los archivos:
\`\`\`bash
npm run check
\`\`\`
Para iniciar el servidor web:
\`\`\`bash
npm start
\`\`\`

## Páginas y rutas

- **GET /**: Página de inicio con la presentación del refugio.
- **GET /mascotas**: Listado completo de las mascotas en adopción (o un mensaje si está vacío).
- **GET /mascotas/nueva**: Formulario para registrar una nueva mascota.
- **GET /mascotas/:id**: Vista de detalle de una mascota específica.
- **POST /mascotas**: Ruta de procesamiento que recibe los datos del formulario.

## Estructura de vistas

- **Layout**: Es la plantilla principal (`main.ejs`) que contiene la estructura básica del documento HTML (doctype, head, body) y envuelve a las demás vistas. Sirve para no repetir código.
- **Parciales**: Son pequeños fragmentos de código HTML reutilizables, como el `encabezado.ejs` (navegación) y el `pie.ejs` (footer).
- **Vista**: Es el contenido específico de cada página (como el catálogo o el formulario) que se inserta dinámicamente dentro del layout (en la etiqueta `<%- body %>`).
- **Datos enviados con res.render**: Cuando usamos `res.render('vista', { datos })`, enviamos información desde el servidor (como el arreglo de mascotas) para que el motor EJS la incruste en el HTML antes de enviarlo al navegador.

## Recursos estáticos

La función `express.static` indica a Express qué carpeta contiene los archivos públicos (como CSS, imágenes SVG o archivos JS estáticos). Esto permite que el navegador acceda a ellos directamente sin tener que programar una ruta específica para cada archivo.

## Formulario

La función `express.urlencoded({ extended: false })` permite a Express leer, procesar y decodificar los datos de texto que el usuario envía a través de un formulario HTML (en este caso, cuando se hace el POST a `/mascotas`), guardándolos en el objeto `req.body`.

**Recorrido POST, redirección y GET**:

1. El usuario envía el formulario con los datos de la mascota (POST).
2. El servidor valida y guarda el registro.
3. En lugar de devolver una página HTML directamente en esa ruta, el servidor responde con una redirección (`res.redirect('/mascotas')`).
4. El navegador del usuario recibe la instrucción y hace automáticamente una nueva petición GET a `/mascotas`, lo que garantiza que se cargue el listado actualizado y evita que se reenvíe el formulario si el usuario recarga la página.

## Persistencia de los datos

**Por qué el nuevo registro desaparece al reiniciar:**
Las mascotas se cargan inicialmente desde el archivo JSON hacia un arreglo en la memoria RAM del servidor. Al usar el formulario, el método POST (`push`) agrega la nueva mascota exclusivamente a ese arreglo en memoria, sin reescribir ni modificar el archivo `mascotas.json`. Por lo tanto, al detener o reiniciar el servidor, la memoria volátil se limpia, el archivo se vuelve a leer en su estado original y los registros agregados manualmente se pierden.
