import storage from "./storage";
import Project from "./project";
import Task from "./task";

export default {
  projects: [],
  activeProject: null,

  initTodo() {
    this.projects = storage.getProjects();
    const inboxExists = this.projects.some((p) => p.id === "inbox");
    if (!inboxExists) {
      const inbox = new Project("Inbox");
      inbox.id = "inbox";
      this.projects.push(inbox);
      storage.saveProjects(this.projects);
    }
    this.setActiveProject("inbox");
  },

  setActiveProject(projectId) {
    this.activeProject = this.projects.find((p) => p.id === projectId);

    // логика для today и пр. :::
  },

  addProject(title) {
    const newProject = new Project(title);
    this.projects.push(newProject);
    storage.saveProjects(this.projects);
  },

  addTaskToProject(title, description, dueDate) {
    const newTask = new Task(
      this.activeProject.id,
      title,
      description,
      dueDate
    );
    this.activeProject.addTask(newTask);
    storage.saveProjects(this.projects);
  },

  removeProject() {
    const projectIndex = this.projects.indexOf(this.activeProject);
    this.projects.splice(projectIndex, 1);
    this.activeProject = this.projects[projectIndex - 1];
    storage.saveProjects(this.projects);
  },

  removeTask(taskId) {
    this.activeProject.removeTask(taskId);
    storage.saveProjects(this.projects);
  },

  editTask(taskId, title, description, dueDate) {
    const task = this.activeProject.tasks.find((t) => t.id === taskId);
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    storage.saveProjects(this.projects);
  },

  editProject(title) {
    this.activeProject.title = title;
    storage.saveProjects(this.projects);
  },

  toggleTaskComplete(taskId) {
    this.activeProject.tasks.find((t) => t.id === taskId).toggleCompleted();
    storage.saveProjects(this.projects);
  },

  toggleTaskPriority(taskId) {
    this.activeProject.tasks.find((t) => t.id === taskId).togglePriority();
    storage.saveProjects(this.projects);
  },
};
