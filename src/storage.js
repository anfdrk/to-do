export default {
  projects: [],
  tasks: [],

  initStorage() {
    this.projects = this.loadProjects();
    this.tasks = this.loadTasks();
  },

  loadProjects() {
    const projectsData = localStorage.getItem("projects");
    return projectsData ? JSON.parse(projectsData) : [];
  },

  loadTasks() {
    const tasksData = localStorage.getItem("tasks");
    return tasksData ? JSON.parse(tasksData) : [];
  },

  saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
  },

  saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },

  removeTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveTasks(this.tasks);
  },

  removeProject(id) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveProjects(this.projects);
  },
};
