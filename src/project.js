import { v4 as uuidv4 } from 'uuid';

export default class Project {
  constructor(title) {
    this.id = uuidv4();
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
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}
