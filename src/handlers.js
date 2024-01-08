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

  openEditTaskModal(event, taskId) {
    if (
      !event.target.closest(".important-btn") &&
      !event.target.closest(".task-checkbox")
    ) {
      const modal = document.getElementById("task-modal");
      const task = app.activeProject.tasks.find((t) => t.id === taskId);
      this.openModal(modal);

      modal.querySelector(".modal-title").textContent = "Edit task";
      modal.querySelector(".modal-submit").textContent = "Edit";
      document.getElementById("form-task-title").value = task.title;
      document.getElementById("form-task-description").value = task.description;
      document.getElementById("form-task-date").textContent = task.dueDate;
    }
  },

  openModal(element) {
    element.style.display = "flex";
    setTimeout(() => {
      element.querySelector(".modal-content").style.transform = "scale(1)";
    }, 50);
  },

  closeModals() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((item) => {
      item.style.display = 'none';
      setTimeout(() => {
        item.querySelector(".modal-content").style.transform = "scale(0)";
      }, 50);
    });
    // ::: стиль закрытия не работает

    // document.getElementById('form-task-title').value = '';
    // document.getElementById('form-task-description').value = '';
    // document.getElementById('form-task-date').value = '';
  },
};
