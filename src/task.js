import { v1 as uuidv1 } from "uuid";

export default class Task {
  constructor(projectId, title, description, dueDate) {
    this.id = uuidv1().split('-')[0];
    this.projectId = projectId;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.important = false;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  togglePriority() {
    this.important = !this.important;
  }
}
