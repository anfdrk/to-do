import app from "./app";
import handlers from "./handlers";

export default {
  formProjectTitle: document.getElementById("form-project-title"),
  taskForm: document.getElementById("task-form"),
  formTaskTitle: document.getElementById("form-task-title"),
  formTaskDescription: document.getElementById("form-task-description"),
  formTaskDate: document.getElementById("form-task-date"),
  deleteTaskBtn: document.getElementById("task-delete-btn"),
  modals: document.querySelectorAll(".modal"),
  cancelButtons: document.querySelectorAll(".modal-cancel"),
  addProjectBtn: document.getElementById("add-project-btn"),
  dropdownBtn: document.getElementById("project-options-btn"),
  dropdown: document.getElementById("project-options"),
  navItems: document.querySelectorAll(".nav-item"),
  projectViewTitle: document.getElementById("project-view-title"),
  tasksContainer: document.getElementById("task-list"),
  addTaskBtn: document.getElementById("add-task-btn"),
  userProjectsContainer: document.getElementById("user-projects"),

  initUI() {
    this.initSystemListHandlers();
    this.renderProjects();
    this.renderTasks();
    this.highlightActiveProject();
    this.initModalHandlers();
    this.initDropdownHandlers();
  },

  renderProjects() {
    this.userProjectsContainer.innerHTML = "";
    const userProjects = app.projects.filter((p) => p.id !== "inbox");
    userProjects.forEach((project) => {
      const projectElement = this.createProjectElement(project);
      this.userProjectsContainer.appendChild(projectElement);
    });
  },

  createProjectElement(project) {
    const projectTitle = this.createHtmlElement("span", null, project.title);
    const projectIcon = document.createElement("img");
    projectIcon.src = "images/tag.svg";
    const projectElement = this.createHtmlElement("button", "nav-item", [
      projectIcon,
      projectTitle,
    ]);
    projectElement.dataset.projectId = project.id;

    projectElement.addEventListener("click", () =>
      handlers.setActiveProject(project.id)
    );
    return projectElement;
  },

  renderTasks() {
    this.projectViewTitle.textContent = app.activeProject.title;
    this.tasksContainer.innerHTML = "";
    app.activeProject.tasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      this.tasksContainer.appendChild(taskElement);
    });
    this.addTaskBtn.addEventListener("click", () => handlers.openAddTaskModal());
  },

  createTaskElement(task) {
    const importantBtn = this.createImportantButton(task);
    const checkboxBtn = this.createHtmlElement("button", "task-checkbox");
    const titleParagraph = this.createHtmlElement(
      "p",
      "task-title",
      task.title
    );
    const taskInfoContainer = this.createHtmlElement("div", "task-info", [
      checkboxBtn,
      titleParagraph,
    ]);
    const taskElement = this.createHtmlElement("div", "task", [
      taskInfoContainer,
      importantBtn,
    ]);

    titleParagraph.classList.toggle("completed", task.completed);
    checkboxBtn.classList.toggle("checked", task.completed);

    if (task.dueDate) {
      const dueDateInfo = this.createHtmlElement(
        "span",
        "task-date",
        task.dueDate // ::: ф для преобразования формата даты
      );
      taskInfoContainer.appendChild(dueDateInfo);
    }
    if (task.description) {
      const descriptionIcon = document.createElement("img");
      descriptionIcon.src = "images/note.svg";
      taskInfoContainer.appendChild(descriptionIcon);
    }

    checkboxBtn.addEventListener("click", () =>
      handlers.toggleTaskComplete(task.id)
    );
    taskElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".important-btn") &&
        !event.target.closest(".task-checkbox")
      )
        handlers.openEditTaskModal(task.id);
    });

    return taskElement;
  },

  createImportantButton(task) {
    const button = this.createHtmlElement("button", "important-btn");

    const importantIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    importantIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    importantIcon.setAttribute("height", "24");
    importantIcon.setAttribute("width", "24");
    importantIcon.classList.add("important-icon");

    if (task.important) {
      importantIcon.setAttribute("viewBox", "0 0 24 24");
      importantIcon.setAttribute("fill", "#f92e65");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", "M0 0h24v24H0z");
      path.setAttribute("fill", "none");

      const filledPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      filledPath.setAttribute(
        "d",
        "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      );

      importantIcon.append(path, filledPath);
      button.classList.add("filled");
    } else {
      importantIcon.setAttribute("viewBox", "0 -960 960 960");
      importantIcon.setAttribute("fill", "#757575");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute(
        "d",
        "m354-247 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-350Z"
      );
      importantIcon.appendChild(path);
    }

    button.appendChild(importantIcon);
    button.addEventListener("click", () =>
      handlers.toggleTaskPriority(task.id)
    );
    return button;
  },

  createHtmlElement(type, classes, content) {
    const element = document.createElement(type);

    if (classes) {
      if (Array.isArray(classes)) {
        element.classList.add(...classes);
      } else {
        element.classList.add(classes);
      }
    }

    if (content) {
      if (Array.isArray(content)) {
        content.forEach((child) => {
          if (child instanceof HTMLElement) {
            element.appendChild(child);
          }
        });
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      } else if (typeof content === "string") {
        element.innerHTML = content;
      }
    }

    return element;
  },

  highlightActiveProject() {
    app.projects.forEach((project) => {
      const projectItem = document.querySelector(
        `[data-project-id="${project.id}"]`
      );
      if (project.id === app.activeProject.id) {
        projectItem.classList.add("active");
      } else {
        projectItem.classList.remove("active");
      }
    });
    // доп логика для базовых списков :::
  },

  initSystemListHandlers() {
    this.navItems.forEach((item) => {
      item.addEventListener("click", () =>
        handlers.setActiveProject(item.dataset.projectId)
      );
    });
  },

  initModalHandlers() {
    document.addEventListener(
      "keydown",
      (event) => event.key === "Escape" && handlers.closeModals()
    );

    document.addEventListener("click", (event) =>
      this.modals.forEach((item) => event.target === item && handlers.closeModals())
    );

    this.cancelButtons.forEach((item) =>
      item.addEventListener("click", () => handlers.closeModals())
    );

    this.addProjectBtn.addEventListener("click", () =>
      handlers.openAddProjectModal());
  },

  initDropdownHandlers() {
    this.dropdownBtn.addEventListener("click", () =>
      handlers.toggleDropdown(this.dropdown)
    );

    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !event.target.closest(".options-wrap")
      ) {
        handlers.hideElement(this.dropdown);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        handlers.hideElement(this.dropdown);
      }
    });
  },
};
