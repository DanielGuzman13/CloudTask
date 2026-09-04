# CloudTasks

Aplicación web para la gestión de tareas personales o de un equipo de trabajo, desarrollada como parte del **Laboratorio desafío** del Seminario de Ingeniería de Software (Universidad ICESI).

Este repositorio corresponde a la **Etapa 1: Diseño, desarrollo y control de versiones**. En etapas posteriores la aplicación evolucionará hacia una solución desplegada en la nube con Vercel, Supabase y Cloudflare.

## Funcionalidades (Etapa 1)

- Crear una tarea.
- Visualizar las tareas registradas.
- Marcar una tarea como completada.
- Eliminar una tarea.
- Editar una tarea existente.
- Filtrar tareas (todas / pendientes / completadas).
- Mostrar el estado de cada tarea (pendiente / completada) y si está vencida.
- Validar los datos introducidos por el usuario (título obligatorio, longitud máxima, fecha válida).

## Modelo de datos

Cada tarea contiene los siguientes campos:

| Campo         | Descripción           |
|---------------|------------------------|
| `id`          | Identificador único    |
| `title`       | Título de la tarea     |
| `description` | Descripción            |
| `completed`   | Estado de la tarea     |
| `created_at`  | Fecha de creación      |
| `deadline`    | Fecha límite           |
| `priority`    | Prioridad (low/medium/high) |

## Tecnologías utilizadas

- **HTML5** — estructura de la aplicación.
- **CSS3** — diseño y presentación.
- **JavaScript (vanilla)** — lógica de la aplicación e interacción con la interfaz.
- **Git / GitHub** — control de versiones y repositorio remoto.

En esta etapa la persistencia de datos es local, mediante `localStorage` del navegador. El acceso a los datos está aislado en el objeto `TaskStore` (ver `js/app.js`) para facilitar, en la Etapa 2, su reemplazo por llamadas a Supabase sin modificar el resto de la aplicación.

## Estructura del proyecto

```
cloudtasks/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── README.md
└── .gitignore
```

## Cómo ejecutar la aplicación localmente

No se requiere ningún framework ni proceso de build. Basta con abrir `index.html` en un navegador, o servirlo con un servidor estático simple:

```bash
# Opción 1: abrir directamente
# doble clic sobre index.html

# Opción 2: servidor local con Python
python3 -m http.server 5500

# Opción 3: extensión "Live Server" de Visual Studio Code
```

Luego visita `http://localhost:5500` (si usaste un servidor local).

## Autores

Equipo: _completar con los nombres de los integrantes_
Repositorio: `cloudtasks-equipoXX`

## Uso de Inteligencia Artificial

_Esta sección debe completarse por el equipo según lo solicitado en el punto 10 del enunciado del laboratorio (herramienta utilizada, propósito, prompts, cambios realizados, validación, errores encontrados y reflexión sobre las limitaciones de la IA)._
