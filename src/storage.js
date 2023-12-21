import Project from "./project";
import Task from "./task";

export default {
  projects: [],

  initStorage() {
    const projectsFromData = this.loadProjects();
    this.projects = projectsFromData.map(this.createProjectFromData.bind(this));
  },

  createProjectFromData(projectData) {
    const project = new Project(projectData.title);
    project.id = projectData.id;

    if (projectData.tasks.length) {
      project.tasks = projectData.tasks.map(this.createTaskFromData);
    }

    return project;
  },

  createTaskFromData(taskData) {
    const task = new Task(
      taskData.title,
      taskData.description,
      taskData.dueDate
    );
    task.id = taskData.id;
    task.important = taskData.important;
    task.completed = taskData.completed;
    return task;
  },

  loadProjects() {
    const projectsData = localStorage.getItem("projects");
    return projectsData ? JSON.parse(projectsData) : [];
  },

  saveProjects() {
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  removeProject(id) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveProjects();
  },

  // TEST
  clearStorage() {
    this.projects = [];
    this.saveProjects();
  },
};
