import app from "./app";
import dom from "./dom";

export default {
  setActiveProject(projectId) {
    app.setActiveProject(projectId);
    dom.highlightActiveProject();
    dom.renderTasks();
  },

  toggleTaskComplete(taskId) {
    app.toggleTaskComplete(taskId);
    dom.renderTasks();
  },

  toggleTaskPriority(taskId) {
    app.toggleTaskPriority(taskId);
    dom.renderTasks();
  },

  openEditTaskModal(taskId) {
    this.openModal('task', 'edit');
    const task = app.activeProject.tasks.find((t) => t.id === taskId);
    document.getElementById("form-task-title").value = task.title;
    document.getElementById("form-task-description").value = task.description;
    document.getElementById("form-task-date").textContent = task.dueDate;
  },

  openAddTaskModal() {
    this.openModal('task', 'add');
    document.getElementById("form-task-title").value = "";
    document.getElementById("form-task-description").value = "";
    document.getElementById("form-task-date").textContent = "";
  },

  openAddProjectModal() {
    this.openModal('project', 'add');
    document.getElementById("form-project-title").value = "";
  },

  openModal(type, mode) {
    const modal = document.getElementById(`${type}-modal`);
    modal.style.display = "flex";
    setTimeout(() => {
      modal.querySelector(".modal-content").style.transform = "scale(1)";
    }, 50);

    if (mode === 'add') {
      modal.querySelector(".modal-title").textContent = `Add ${type}`;
      modal.querySelector(".modal-submit").textContent = "Add";
    } else {
      modal.querySelector(".modal-title").textContent = `Edit ${type}`;
      modal.querySelector(".modal-submit").textContent = "Edit";
    }
  },

  closeModals() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((item) => {
      item.style.display = "none";
      setTimeout(() => {
        item.querySelector(".modal-content").style.transform = "scale(0)";
      }, 50);
    });
  },
};
