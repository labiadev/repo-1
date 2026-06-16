Actúa como un Desarrollador Full-Stack Senior y experto en arquitectura web. Necesito que generes el código completo, limpio y documentado para una aplicación web que cumpla con los siguientes requerimientos y especificaciones técnicas:

### 🎯 OBJETIVO DE LA APLICACIÓN
Crear una herramienta web que permita buscar un personaje de Star Wars, extraer sus datos desde una API pública, inyectar esa información en una plantilla Markdown con placeholders y, finalmente, generar un documento PDF descargable que incluya un código QR de validación.

### 🛠️ STACK TECNOLÓGICO RECOMENDADO
- Frontend: [Especificar aquí tu preferencia, ej: React.js con Tailwind CSS / HTML5 + JavaScript nativo / Vue.js].
- Backend (si es necesario para la generación de PDF/QR o manejo de API): [Especificar aquí, ej: Node.js con Express / Next.js API Routes / No requerido, todo en Frontend].
- Librerías clave a utilizar:
  - Consumo de API: Fetch API o Axios.
  - Renderizado Markdown: Una librería para procesar Markdown a HTML.
  - Generación de PDF: [ej: html2pdf.js / Puppeteer / pdfmake].
  - Generación de QR: [ej: qrcode o qrcode.react].

### 📋 REQUERIMIENTOS FUNCIONALES DEL SISTEMA

#### 1. Formulario de Búsqueda (Interfaz de Usuario)
- Crear una interfaz limpia y responsiva (puedes usar Tailwind o CSS moderno).
- Debe incluir un campo de texto (input) para ingresar o buscar el nombre de un personaje de Star Wars.
- Incluir un botón de "Buscar y Generar".
- Implementar estados visuales de "Cargando..." (loading), "Éxito" y "Error" (por si el personaje no existe).

#### 2. Consumo de la API (Integración de Datos)
- Al enviar el formulario, la aplicación debe consultar la API pública de Star Wars: `https://swapi.info/api/people`.
- Nota de desarrollo: Dado que el endpoint devuelve una lista, implementa una lógica para filtrar los personajes por el nombre ingresado en el formulario (búsqueda exacta o coincidencia parcial).
- Extraer los datos clave del personaje (ej: `name`, `height`, `mass`, `hair_color`, `skin_color`, `eye_color`, `birth_year`, `gender`).

#### 3. Procesamiento de Plantilla Markdown
- Define internamente una plantilla base en formato Markdown que actúe como "Certificado de Personaje" o "Ficha Técnica".
- La plantilla debe usar placeholders/variables con una sintaxis clara (ej: `{{name}}`, `{{height}}`, `{{birth_year}}`).
- El sistema debe reemplazar automáticamente los placeholders de la plantilla con los datos reales obtenidos de la API.

#### 4. Generación de PDF y Código QR
- El sistema debe renderizar el Markdown ya procesado a un formato visualmente atractivo (HTML/CSS).
- **Código QR:** Generar dinámicamente un código QR que contenga una URL de validación ficticia (ej: `https://tuapp.com/validar?name=[Nombre_Personaje]`) o el string con los datos del personaje. Este QR debe incrustarse visualmente dentro del documento antes de exportarlo.
- **Exportación:** Ofrecer un botón para descargar directamente el resultado final en formato **PDF** con una maquetación profesional (márgenes correctos, tipografía limpia y el QR bien posicionado).

### 📐 ENTREGABLES REQUERIDOS
1. Estructura de archivos del proyecto.
2. Código fuente completo de los componentes (HTML, CSS/Tailwind, JavaScript).
3. Explicación breve de cómo levantar/ejecutar el proyecto localmente y qué dependencias instalar.

Por favor, escribe el código priorizando las buenas prácticas, modularidad y manejo de errores.
