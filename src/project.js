import { v1 as uuidv1 } from "uuid";

export default class Project {
  constructor(title) {
    this.id = uuidv1().split('-')[0];
    this.title = title;
    this.tasks = [];
  }

  updateTitle(newTitle) {
    this.title = newTitle;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}
