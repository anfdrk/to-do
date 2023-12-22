import app from "./app";
import handlers from "./handlers";

export default {
  renderProjects() {
    const projectsContainer = document.getElementById("user-projects");
    projectsContainer.innerHTML = "";
    const userProjects = app.projects.filter((p) => p.id !== "inbox");
    userProjects.forEach((project) => {
      const projectElement = this.createProjectElement(project);
      projectsContainer.appendChild(projectElement);
    });
  },

  createProjectElement(project) {
    const projectElement = document.createElement("button");
    const projectIcon = document.createElement("img");
    const projectTitle = document.createElement("span");
    projectIcon.src = "images/tag.svg";
    projectTitle.textContent = project.title;
    projectElement.append(projectIcon, projectTitle);
    projectElement.classList.add("nav-item");
    projectElement.addEventListener("click", () =>
      handlers.setActiveProject(project.id)
    );
    return projectElement;
  },
};
