export default {
  projects: [],

  initStorage() {
    this.projects = this.loadProjects();
  },

  loadProjects() {
    const projectsData = localStorage.getItem('projects');
    return projectsData ? JSON.parse(projectsData) : [];
  },

  saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  },

  removeProject(id) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveProjects(this.projects);
  },
};