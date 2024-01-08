import app from "./app";
import handlers from "./handlers";

export default {
  initUI() {
    this.attachSystemListClickHandler();
    this.renderProjects();
    this.renderTasks();
    this.highlightActiveProject();
    this.initModalHandlers();
  },

  renderProjects() {
    const projectsContainer = document.getElementById("user-projects");
    projectsContainer.innerHTML = "";
    const userProjects = app.projects.filter((p) => p.id !== "inbox");
    userProjects.forEach((project) => {
      const projectElement = this.createProjectElement(project);
      projectsContainer.appendChild(projectElement);
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
    const projectHeader = document.getElementById("project-name");
    projectHeader.textContent = app.activeProject.title;
    const tasksContainer = document.getElementById("task-list");
    tasksContainer.innerHTML = "";
    app.activeProject.tasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      tasksContainer.appendChild(taskElement);
    });
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
        task.dueDate // *** ф для преобразования формата даты
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
      handlers.openEditTaskModal(event, task.id);
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

  attachSystemListClickHandler() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        handlers.setActiveProject(item.dataset.projectId);
      });
    });
  },

  initModalHandlers() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        handlers.closeModals();
      }
    });

    const modals = document.querySelectorAll('.modal');
    document.addEventListener("click", (event) => {
      modals.forEach(item => {
        if (event.target === item) {
          handlers.closeModals();
        }
      });
    });

    const cancelButtons = document.querySelectorAll(".modal-cancel");
    cancelButtons.forEach((item) => {
      item.addEventListener("click", () => {
        handlers.closeModals();
      });
    });

    const submitButtons = document.querySelectorAll(".modal-submit");
    submitButtons.forEach((item) => {
      item.addEventListener("click", () => {
        handlers.closeModals();
        // ::: логика для обработки данных из формы
      });
    });
  },
};
