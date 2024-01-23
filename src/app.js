import storage from "./storage";
import Project from "./project";
import Task from "./task";
import { isToday, addDays, isAfter, isBefore, compareAsc } from "date-fns";

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
    const sortFunctions = {
      today: () => this.getTodayTasks(),
      upcoming: () => this.getUpcomingTasks(),
      important: () => this.getImportantTasks(),
    };

    this.activeProject = sortFunctions[projectId]
      ? sortFunctions[projectId]()
      : this.projects.find((p) => p.id === projectId);
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

  getProjectTitle(projectId) {
    return this.projects.find((p) => p.id === projectId).title;
  },

  getTodayTasks() {
    const allTasks = this.projects.flatMap((project) => project.tasks);

    return {
      id: "today",
      title: "Today",
      tasks: allTasks.filter((task) => isToday(new Date(task.dueDate))),
    };
  },

  getUpcomingTasks() {
    const allTasks = this.projects.flatMap((project) => project.tasks);
    const next10DaysTasks = allTasks.filter((task) => {
      const taskDueDate = new Date(task.dueDate);
      const tenDaysLater = addDays(new Date(), 10);
      return (
        isAfter(taskDueDate, new Date()) && isBefore(taskDueDate, tenDaysLater)
      );
    });

    return {
      id: "upcoming",
      title: "Upcoming",
      tasks: next10DaysTasks.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return compareAsc(dateA, dateB);
      }),
    };
  },

  getImportantTasks() {
    const allTasks = this.projects.flatMap((project) => project.tasks);

    return {
      id: "important",
      title: "Important",
      tasks: allTasks.filter((task) => task.important),
    };
  },
};
