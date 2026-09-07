# CloudTasks

Aplicación web para la gestión de tareas personales o de un equipo de trabajo, desarrollada como parte del **Laboratorio desafío** del Seminario de Ingeniería de Software (Universidad ICESI).

Este repositorio incluye la **Etapa 1** (desarrollo local con HTML/CSS/JS y control de versiones) y la **Etapa 2** (persistencia con Supabase/PostgreSQL, lista para desplegar en Vercel). La Etapa 3 (Cloudflare) se documentará por separado.

## Funcionalidades

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

La persistencia de datos se realiza mediante **Supabase** (Backend as a Service) sobre una base de datos **PostgreSQL** administrada. El acceso a los datos está aislado en el objeto `TaskStore` (ver `js/app.js`), que expone `getAll`, `create`, `update` y `remove` como funciones `async` que llaman a `supabaseClient` (definido en `js/supabaseClient.js`).

## Estructura del proyecto

```
cloudtasks/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── supabaseClient.js
│   └── app.js
├── README.md
└── .gitignore
```

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (plan gratuito).
2. En el **SQL Editor**, crea la tabla `tasks`: (deben cambiar los atributos segun hayan creado sus tablas)

   ```sql
   create table tasks (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     description text,
     completed boolean not null default false,
     created_at timestamptz not null default now(),
     deadline date,
     priority text not null default 'medium' check (priority in ('low', 'medium', 'high'))
   );
   ```

3. Habilita Row Level Security y crea políticas que permitan al rol `anon` hacer `select`, `insert`, `update` y `delete` (necesario porque esta etapa no implementa autenticación de usuarios).
4. En **Project Settings → API**, copia el **Project URL** y la clave **anon public**.
5. Pégalos en `js/supabaseClient.js`, en `SUPABASE_URL` y `SUPABASE_ANON_KEY` respectivamente.

La anon key es pública por diseño (protegida por las políticas RLS), por lo que es seguro incluirla en el repositorio. La `service_role key` de Supabase, en cambio, es secreta y nunca debe usarse en este proyecto.

Si `js/supabaseClient.js` no está configurado correctamente, la aplicación muestra un aviso en pantalla indicando que no pudo conectarse a la base de datos.

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

# Opción 4: En la wed con vercel
```

Visita `https://cloud-task-hazel.vercel.app/`.

## Autores

Equipo: _completar con los nombres de los integrantes_
Repositorio: `cloudtasks-equipoXX`

## Uso de Inteligencia Artificial

_Esta sección debe completarse por el equipo según lo solicitado en el punto 10 del enunciado del laboratorio (herramienta utilizada, propósito, prompts, cambios realizados, validación, errores encontrados y reflexión sobre las limitaciones de la IA)._
