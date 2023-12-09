import { v4 as uuidv4 } from 'uuid';

export default class Task {
  constructor(title, description, important, dueDate) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.important = important;
    this.completed = false;
    this.dueDate = dueDate;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  togglePriority() {
    this.important = !this.important;
  }

  updateTitle(title) {
    this.title = title;
  }

  updateDescription(description) {
    this.description = description;
  }

  updateDueDate(dueDate) {
    this.dueDate = dueDate;
  }
}
