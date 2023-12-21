import storage from "./storage";
import Project from "./project";
import Task from "./task";

function addProject(title) {
  const newProject = new Project(title);
  storage.projects.push(newProject);
  storage.saveProjects();
}

function addTaskToProject(projectID, title, description, dueDate) {
  const project = storage.projects.find((p) => p.id === projectID);
  const newTask = new Task(title, description, dueDate);
  project.addTask(newTask);
  storage.saveProjects();
}

// -------------------------------------
// ---------------- TEST ---------------
// -------------------------------------

storage.initStorage();

// addProject('ye');
// addTaskToProject('ye', 'z');
// storage.clearStorage();

displayProjectsAndTasks();

function displayProjectsAndTasks() {
  console.log("Current projects:");
  storage.projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.title}`);

    project.tasks.forEach((task, index) => {
      console.log(`   ${index + 1}. ${task.title}`);
    });
  });
}
