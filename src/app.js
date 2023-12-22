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

    // дописать логику для today и пр. ***
  },

  addProject(title) {
    const newProject = new Project(title);
    this.projects.push(newProject);
    storage.saveProjects(this.projects);
  },

  addTaskToProject(projectId, title, description, dueDate) {
    const project = this.projects.find((p) => p.id === projectId);
    const newTask = new Task(projectId, title, description, dueDate);
    project.addTask(newTask);
    storage.saveProjects(this.projects);
  },

  removeProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId);
    storage.saveProjects(this.projects);
  },

  removeTask(projectId, taskId) {
    const project = this.projects.find((p) => p.id === projectId);
    project.removeTask(taskId);
    storage.saveProjects(this.projects);
  },

  displayProjectsAndTasks() {
    // ::: тест
    console.log("Current projects:");
    this.projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);

      project.tasks.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title}`);
      });
    });
  },
};
