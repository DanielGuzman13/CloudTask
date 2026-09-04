/**
 * CloudTasks — Etapa 1
 * Aplicación de gestión de tareas (frontend puro).
 *
 * Estructura de una tarea:
 * {
 *   id: string,          // Identificador único
 *   title: string,       // Título de la tarea
 *   description: string, // Descripción
 *   completed: boolean,  // Estado de la tarea
 *   created_at: string,  // Fecha de creación (ISO)
 *   deadline: string|null, // Fecha límite (YYYY-MM-DD)
 *   priority: "low" | "medium" | "high" // Prioridad
 * }
 *
 * En esta etapa la persistencia es local (localStorage), ya que aún
 * no se ha integrado un backend administrado (eso ocurrirá en la Etapa 2
 * con Supabase). Las funciones de acceso a datos están aisladas en el
 * objeto TaskStore para que, en la siguiente etapa, sea sencillo
 * reemplazar su implementación por llamadas a Supabase sin tocar el
 * resto de la aplicación.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "cloudtasks.tasks";

  /* ------------------------------------------------------------------
   * Capa de acceso a datos (hoy: localStorage; mañana: Supabase)
   * ------------------------------------------------------------------ */
  const TaskStore = {
    getAll() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error("Error leyendo tareas de localStorage:", err);
        return [];
      }
    },

    saveAll(tasks) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    },

    create(task) {
      const tasks = this.getAll();
      tasks.unshift(task);
      this.saveAll(tasks);
      return task;
    },

    update(id, changes) {
      const tasks = this.getAll();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;
      tasks[index] = { ...tasks[index], ...changes };
      this.saveAll(tasks);
      return tasks[index];
    },

    remove(id) {
      const tasks = this.getAll().filter((t) => t.id !== id);
      this.saveAll(tasks);
    },
  };

  /* ------------------------------------------------------------------
   * Utilidades
   * ------------------------------------------------------------------ */
  function generateId() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "task-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(isoDate) {
    if (!isoDate) return null;
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  }

  function isOverdue(task) {
    if (!task.deadline || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(task.deadline + "T00:00:00");
    return deadline < today;
  }

  const PRIORITY_LABELS = { low: "Baja", medium: "Media", high: "Alta" };

  /* ------------------------------------------------------------------
   * Referencias al DOM
   * ------------------------------------------------------------------ */
  const form = document.getElementById("task-form");
  const idInput = document.getElementById("task-id");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const deadlineInput = document.getElementById("deadline");
  const priorityInput = document.getElementById("priority");
  const titleError = document.getElementById("title-error");
  const deadlineError = document.getElementById("deadline-error");
  const submitBtn = document.getElementById("submit-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const taskSummary = document.getElementById("task-summary");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let currentFilter = "all";

  /* ------------------------------------------------------------------
   * Validación
   * ------------------------------------------------------------------ */
  function validateForm() {
    let isValid = true;
    titleError.textContent = "";
    deadlineError.textContent = "";
    titleInput.classList.remove("is-invalid");
    deadlineInput.classList.remove("is-invalid");

    const title = titleInput.value.trim();
    if (!title) {
      titleError.textContent = "El título es obligatorio.";
      titleInput.classList.add("is-invalid");
      isValid = false;
    } else if (title.length > 80) {
      titleError.textContent = "El título no puede superar 80 caracteres.";
      titleInput.classList.add("is-invalid");
      isValid = false;
    }

    const deadline = deadlineInput.value;
    if (deadline) {
      const parsed = new Date(deadline + "T00:00:00");
      if (Number.isNaN(parsed.getTime())) {
        deadlineError.textContent = "La fecha límite no es válida.";
        deadlineInput.classList.add("is-invalid");
        isValid = false;
      }
    }

    return isValid;
  }

  /* ------------------------------------------------------------------
   * Renderizado
   * ------------------------------------------------------------------ */
  function getFilteredTasks() {
    const tasks = TaskStore.getAll();
    if (currentFilter === "pending") return tasks.filter((t) => !t.completed);
    if (currentFilter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }

  function renderSummary(allTasks) {
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.completed).length;
    taskSummary.textContent =
      total === 0
        ? ""
        : `${completed} de ${total} tarea(s) completadas.`;
  }

  function renderTasks() {
    const allTasks = TaskStore.getAll();
    const tasks = getFilteredTasks();

    renderSummary(allTasks);
    taskList.innerHTML = "";

    if (allTasks.length === 0) {
      emptyState.hidden = false;
      emptyState.textContent = "No hay tareas registradas todavía. ¡Agrega la primera!";
      return;
    }

    if (tasks.length === 0) {
      emptyState.hidden = false;
      emptyState.textContent = "No hay tareas que coincidan con este filtro.";
      return;
    }

    emptyState.hidden = true;

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " is-completed" : "");
      li.dataset.priority = task.priority || "medium";
      li.dataset.id = task.id;

      const overdue = isOverdue(task);
      const statusBadge = task.completed
        ? '<span class="badge badge--status-completed">Completada</span>'
        : '<span class="badge badge--status-pending">Pendiente</span>';
      const priorityBadge = `<span class="badge badge--priority-${task.priority}">Prioridad ${PRIORITY_LABELS[task.priority] || "Media"}</span>`;
      const deadlineBadge = task.deadline
        ? `<span class="badge${overdue ? " badge--overdue" : ""}">${overdue ? "Vencida: " : "Vence: "}${formatDate(task.deadline)}</span>`
        : "";

      li.innerHTML = `
        <input type="checkbox" class="task-item__checkbox" ${task.completed ? "checked" : ""} aria-label="Marcar tarea como completada" />
        <div class="task-item__body">
          <p class="task-item__title">${escapeHtml(task.title)}</p>
          ${task.description ? `<p class="task-item__description">${escapeHtml(task.description)}</p>` : ""}
          <div class="task-item__meta">
            ${statusBadge}
            ${priorityBadge}
            ${deadlineBadge}
          </div>
        </div>
        <div class="task-item__actions">
          <button type="button" class="icon-btn" data-action="edit">Editar</button>
          <button type="button" class="icon-btn icon-btn--danger" data-action="delete">Eliminar</button>
        </div>
      `;

      taskList.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------
   * Manejo del formulario (crear / editar)
   * ------------------------------------------------------------------ */
  function resetForm() {
    form.reset();
    idInput.value = "";
    priorityInput.value = "medium";
    submitBtn.textContent = "Agregar tarea";
    cancelEditBtn.hidden = true;
    titleError.textContent = "";
    deadlineError.textContent = "";
    titleInput.classList.remove("is-invalid");
    deadlineInput.classList.remove("is-invalid");
  }

  function startEdit(task) {
    idInput.value = task.id;
    titleInput.value = task.title;
    descriptionInput.value = task.description || "";
    deadlineInput.value = task.deadline || "";
    priorityInput.value = task.priority || "medium";
    submitBtn.textContent = "Guardar cambios";
    cancelEditBtn.hidden = false;
    titleInput.focus();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm()) return;

    const editingId = idInput.value;
    const payload = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      deadline: deadlineInput.value || null,
      priority: priorityInput.value,
    };

    if (editingId) {
      TaskStore.update(editingId, payload);
    } else {
      TaskStore.create({
        id: generateId(),
        title: payload.title,
        description: payload.description,
        completed: false,
        created_at: new Date().toISOString(),
        deadline: payload.deadline,
        priority: payload.priority,
      });
    }

    resetForm();
    renderTasks();
  });

  cancelEditBtn.addEventListener("click", resetForm);

  /* ------------------------------------------------------------------
   * Acciones sobre cada tarea (completar / editar / eliminar)
   * ------------------------------------------------------------------ */
  taskList.addEventListener("click", function (event) {
    const item = event.target.closest(".task-item");
    if (!item) return;
    const id = item.dataset.id;

    if (event.target.matches(".task-item__checkbox")) {
      TaskStore.update(id, { completed: event.target.checked });
      renderTasks();
      return;
    }

    const action = event.target.dataset.action;
    if (action === "delete") {
      const confirmed = window.confirm("¿Eliminar esta tarea? Esta acción no se puede deshacer.");
      if (confirmed) {
        TaskStore.remove(id);
        renderTasks();
      }
      return;
    }

    if (action === "edit") {
      const task = TaskStore.getAll().find((t) => t.id === id);
      if (task) startEdit(task);
    }
  });

  /* ------------------------------------------------------------------
   * Filtros
   * ------------------------------------------------------------------ */
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  /* ------------------------------------------------------------------
   * Inicialización
   * ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", renderTasks);
  // Por si el script se carga después de DOMContentLoaded
  if (document.readyState !== "loading") {
    renderTasks();
  }
})();
