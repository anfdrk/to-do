import app from "./app";
import dom from "./dom";

export default {
  setActiveProject(projectId) {
    app.setActiveProject(projectId);
    // *** остальная логика
  },

  toggleTaskPriority(taskId) {
    app.toggleTaskPriority(taskId);
    dom.renderTasks();
  },
};
