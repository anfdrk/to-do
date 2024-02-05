import { Task, Project } from './app';

export default {
  getProjects() {
    const projectsFromData = this.loadProjects();
    return projectsFromData.map(this.createProjectFromData.bind(this));
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
      taskData.projectId,
      taskData.title,
      taskData.description,
      taskData.dueDate,
    );
    task.id = taskData.id;
    task.important = taskData.important;
    task.completed = taskData.completed;
    return task;
  },

  loadProjects() {
    const projectsData = localStorage.getItem('projects');
    return projectsData ? JSON.parse(projectsData) : [];
  },

  saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  },
};
