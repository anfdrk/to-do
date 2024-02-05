import app from './app';
import dom from './dom';

export default {
  taskFormHandler: null,
  projectFormHandler: null,
  deleteTaskHandler: null,

  setActiveProject(projectId) {
    app.setActiveProject(projectId);
    dom.highlightActiveProject();
    dom.renderTasks();
    this.toggleAddTaskAndDropdown();
  },

  toggleAddTaskAndDropdown() {
    const isSystemList = ['today', 'upcoming', 'important'].includes(
      app.activeProject.id,
    );
    const isInbox = app.activeProject.id === 'inbox';

    dom.addTaskBtn.style.display = isSystemList ? 'none' : 'flex';
    dom.dropdownBtn.style.display = isSystemList || isInbox ? 'none' : 'flex';
  },

  toggleTaskComplete(taskId) {
    app.toggleTaskComplete(taskId);
    dom.renderTasks();
  },

  toggleTaskPriority(taskId) {
    app.toggleTaskPriority(taskId);
    app.setActiveProject(app.activeProject.id);
    dom.renderTasks();
  },

  openEditTaskModal(taskId, projectId) {
    dom.deleteTaskBtn.removeEventListener('click', this.deleteTaskHandler);
    dom.taskForm.removeEventListener('submit', this.taskFormHandler);
    const task = app.activeProject.tasks.find((t) => t.id === taskId);
    this.openModal('task', 'edit');
    dom.formTaskTitle.value = task.title;
    dom.formTaskDescription.value = task.description;
    dom.formTaskDate.value = task.dueDate;
    if (task.dueDate) {
      dom.formTaskDate.classList.add('date-specified');
    } else {
      dom.formTaskDate.classList.remove('date-specified');
    }
    dom.deleteTaskBtn.style.display = 'flex';
    this.deleteTaskHandler = () => this.deleteTask(taskId, projectId);
    dom.deleteTaskBtn.addEventListener('click', this.deleteTaskHandler);
    this.taskFormHandler = (event) => this.editTask(event, taskId);
    dom.taskForm.addEventListener('submit', this.taskFormHandler);
    dom.formTaskTitle.focus();
  },

  editTask(event, taskId) {
    event.preventDefault();
    const title = dom.formTaskTitle.value;
    const description = dom.formTaskDescription.value.trim();
    const dueDate = dom.formTaskDate.value;
    app.editTask(taskId, title, description, dueDate);
    this.closeModals();
    app.setActiveProject(app.activeProject.id);
    dom.renderTasks();
  },

  openAddTaskModal() {
    dom.taskForm.removeEventListener('submit', this.taskFormHandler);
    this.openModal('task', 'add');
    dom.formTaskTitle.value = '';
    dom.formTaskDescription.value = '';
    dom.formTaskDate.value = '';
    dom.formTaskDate.classList.remove('date-specified');

    this.taskFormHandler = (event) => this.addTask(event);
    dom.taskForm.addEventListener('submit', this.taskFormHandler);
    dom.formTaskTitle.focus();
  },

  addTask(event) {
    event.preventDefault();
    const title = dom.formTaskTitle.value;
    const description = dom.formTaskDescription.value.trim();
    const dueDate = dom.formTaskDate.value;
    app.addTaskToProject(title, description, dueDate);
    this.closeModals();
    dom.renderTasks();
  },

  deleteTask(taskId, projectId) {
    app.removeTask(taskId, projectId);
    this.closeModals();
    app.setActiveProject(app.activeProject.id);
    dom.renderTasks();
  },

  changeDateFormColor() {
    if (dom.formTaskDate.value) {
      dom.formTaskDate.classList.add('date-specified');
    } else {
      dom.formTaskDate.classList.remove('date-specified');
    }
  },

  openAddProjectModal() {
    dom.projectForm.removeEventListener('submit', this.projectFormHandler);
    this.openModal('project', 'add');
    dom.formProjectTitle.value = '';
    this.projectFormHandler = (event) => this.addProject(event);
    dom.projectForm.addEventListener('submit', this.projectFormHandler);
    dom.formProjectTitle.focus();
  },

  addProject(event) {
    event.preventDefault();
    app.addProject(dom.formProjectTitle.value);
    this.closeModals();
    dom.renderProjects();
    const newProject = app.projects[app.projects.length - 1];
    this.setActiveProject(newProject.id);
  },

  openEditProjectModal() {
    dom.projectForm.removeEventListener('submit', this.projectFormHandler);
    this.openModal('project', 'edit');
    dom.formProjectTitle.value = app.activeProject.title;
    this.projectFormHandler = (event) => this.editProject(event);
    dom.projectForm.addEventListener('submit', this.projectFormHandler);
    dom.formProjectTitle.focus();
  },

  editProject(event) {
    event.preventDefault();
    app.editProject(dom.formProjectTitle.value);
    this.closeModals();
    dom.renderProjects();
    dom.highlightActiveProject();
    dom.renderTasks();
  },

  deleteProject() {
    app.removeProject();
    dom.renderProjects();
    dom.highlightActiveProject();
    dom.renderTasks();
  },

  openModal(type, mode) {
    const modal = document.getElementById(`${type}-modal`);
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 50);

    if (mode === 'add') {
      modal.querySelector('.modal-title').textContent = `Add ${type}`;
      modal.querySelector('.modal-submit').textContent = 'Add';
    } else {
      modal.querySelector('.modal-title').textContent = `Edit ${type}`;
      modal.querySelector('.modal-submit').textContent = 'Edit';
    }
  },

  closeModals() {
    dom.modals.forEach((item) => {
      item.style.display = 'none';
      setTimeout(() => {
        item.querySelector('.modal-content').style.transform = 'scale(0)';
      }, 50);
    });

    this.hideElement(dom.deleteTaskBtn);
  },

  toggleDropdown(element) {
    element.style.display =
      element.style.display === 'block' ? 'none' : 'block';
  },

  hideElement(element) {
    element.style.display = 'none';
  },
};
