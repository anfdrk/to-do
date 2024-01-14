/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v1.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v1.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ "./src/storage.js");
/* harmony import */ var _project__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./project */ "./src/project.js");
/* harmony import */ var _task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./task */ "./src/task.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  projects: [],
  activeProject: null,

  initTodo() {
    this.projects = _storage__WEBPACK_IMPORTED_MODULE_0__["default"].getProjects();
    const inboxExists = this.projects.some((p) => p.id === "inbox");
    if (!inboxExists) {
      const inbox = new _project__WEBPACK_IMPORTED_MODULE_1__["default"]("Inbox");
      inbox.id = "inbox";
      this.projects.push(inbox);
      _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
    }
    this.setActiveProject("inbox");
  },

  setActiveProject(projectId) {
    this.activeProject = this.projects.find((p) => p.id === projectId);

    // логика для today и пр. :::
  },

  addProject(title) {
    const newProject = new _project__WEBPACK_IMPORTED_MODULE_1__["default"](title);
    this.projects.push(newProject);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  addTaskToProject(title, description, dueDate) {
    const newTask = new _task__WEBPACK_IMPORTED_MODULE_2__["default"](this.activeProject.id, title, description, dueDate);
    this.activeProject.addTask(newTask);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  removeProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  removeTask(taskId) {
    // const project = this.projects.find((p) => p.id === projectId);
    this.activeProject.removeTask(taskId);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  editTask(taskId, title, description, dueDate) {
    const task = this.activeProject.tasks.find((t) => t.id === taskId);
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  toggleTaskComplete(taskId) {
    this.activeProject.tasks.find((t) => t.id === taskId).toggleCompleted();
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  toggleTaskPriority(taskId) {
    this.activeProject.tasks.find((t) => t.id === taskId).togglePriority();
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },
});


/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.js");
/* harmony import */ var _handlers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handlers */ "./src/handlers.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  formProjectTitle: document.getElementById("form-project-title"),
  formTaskTitle: document.getElementById("form-task-title"),
  deleteTaskBtn: document.getElementById("task-delete-btn"),
  formTaskDescription: document.getElementById("form-task-description"),
  formTaskDate: document.getElementById("form-task-date"),
  taskSubmitBtn: document.getElementById("task-submit"),
  modals: document.querySelectorAll(".modal"),
  cancelButtons: document.querySelectorAll(".modal-cancel"),
  submitButtons: document.querySelectorAll(".modal-submit"),
  addProjectBtn: document.getElementById("add-project-btn"),
  dropdownBtn: document.getElementById("project-options-btn"),
  dropdown: document.getElementById("project-options"),
  navItems: document.querySelectorAll(".nav-item"),
  projectViewTitle: document.getElementById("project-view-title"),
  tasksContainer: document.getElementById("task-list"),
  addTaskBtn: document.getElementById("add-task-btn"),
  userProjectsContainer: document.getElementById("user-projects"),
  taskForm: document.getElementById("task-form"),

  initUI() {
    this.initSystemListHandlers();
    this.renderProjects();
    this.renderTasks();
    this.highlightActiveProject();
    this.initModalHandlers();
    this.initDropdownHandlers();
  },

  renderProjects() {
    this.userProjectsContainer.innerHTML = "";
    const userProjects = _app__WEBPACK_IMPORTED_MODULE_0__["default"].projects.filter((p) => p.id !== "inbox");
    userProjects.forEach((project) => {
      const projectElement = this.createProjectElement(project);
      this.userProjectsContainer.appendChild(projectElement);
    });
  },

  createProjectElement(project) {
    const projectTitle = this.createHtmlElement("span", null, project.title);
    const projectIcon = document.createElement("img");
    projectIcon.src = "images/tag.svg";
    const projectElement = this.createHtmlElement("button", "nav-item", [
      projectIcon,
      projectTitle,
    ]);
    projectElement.dataset.projectId = project.id;

    projectElement.addEventListener("click", () =>
      _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].setActiveProject(project.id)
    );
    return projectElement;
  },

  renderTasks() {
    this.projectViewTitle.textContent = _app__WEBPACK_IMPORTED_MODULE_0__["default"].activeProject.title;
    this.tasksContainer.innerHTML = "";
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].activeProject.tasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      this.tasksContainer.appendChild(taskElement);
    });
    this.addTaskBtn.addEventListener("click", () => _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].openAddTaskModal());
  },

  createTaskElement(task) {
    const importantBtn = this.createImportantButton(task);
    const checkboxBtn = this.createHtmlElement("button", "task-checkbox");
    const titleParagraph = this.createHtmlElement(
      "p",
      "task-title",
      task.title
    );
    const taskInfoContainer = this.createHtmlElement("div", "task-info", [
      checkboxBtn,
      titleParagraph,
    ]);
    const taskElement = this.createHtmlElement("div", "task", [
      taskInfoContainer,
      importantBtn,
    ]);

    titleParagraph.classList.toggle("completed", task.completed);
    checkboxBtn.classList.toggle("checked", task.completed);

    if (task.dueDate) {
      const dueDateInfo = this.createHtmlElement(
        "span",
        "task-date",
        task.dueDate // ::: ф для преобразования формата даты
      );
      taskInfoContainer.appendChild(dueDateInfo);
    }
    if (task.description) {
      const descriptionIcon = document.createElement("img");
      descriptionIcon.src = "images/note.svg";
      taskInfoContainer.appendChild(descriptionIcon);
    }

    checkboxBtn.addEventListener("click", () =>
      _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].toggleTaskComplete(task.id)
    );
    taskElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".important-btn") &&
        !event.target.closest(".task-checkbox")
      )
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].openEditTaskModal(task.id);
    });

    return taskElement;
  },

  createImportantButton(task) {
    const button = this.createHtmlElement("button", "important-btn");

    const importantIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    importantIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    importantIcon.setAttribute("height", "24");
    importantIcon.setAttribute("width", "24");
    importantIcon.classList.add("important-icon");

    if (task.important) {
      importantIcon.setAttribute("viewBox", "0 0 24 24");
      importantIcon.setAttribute("fill", "#f92e65");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", "M0 0h24v24H0z");
      path.setAttribute("fill", "none");

      const filledPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      filledPath.setAttribute(
        "d",
        "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      );

      importantIcon.append(path, filledPath);
      button.classList.add("filled");
    } else {
      importantIcon.setAttribute("viewBox", "0 -960 960 960");
      importantIcon.setAttribute("fill", "#757575");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute(
        "d",
        "m354-247 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-350Z"
      );
      importantIcon.appendChild(path);
    }

    button.appendChild(importantIcon);
    button.addEventListener("click", () =>
      _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].toggleTaskPriority(task.id)
    );
    return button;
  },

  createHtmlElement(type, classes, content) {
    const element = document.createElement(type);

    if (classes) {
      if (Array.isArray(classes)) {
        element.classList.add(...classes);
      } else {
        element.classList.add(classes);
      }
    }

    if (content) {
      if (Array.isArray(content)) {
        content.forEach((child) => {
          if (child instanceof HTMLElement) {
            element.appendChild(child);
          }
        });
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      } else if (typeof content === "string") {
        element.innerHTML = content;
      }
    }

    return element;
  },

  highlightActiveProject() {
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].projects.forEach((project) => {
      const projectItem = document.querySelector(
        `[data-project-id="${project.id}"]`
      );
      if (project.id === _app__WEBPACK_IMPORTED_MODULE_0__["default"].activeProject.id) {
        projectItem.classList.add("active");
      } else {
        projectItem.classList.remove("active");
      }
    });
    // доп логика для базовых списков :::
  },

  initSystemListHandlers() {
    this.navItems.forEach((item) => {
      item.addEventListener("click", () =>
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].setActiveProject(item.dataset.projectId)
      );
    });
  },

  initModalHandlers() {
    document.addEventListener(
      "keydown",
      (event) => event.key === "Escape" && _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].closeModals()
    );

    document.addEventListener("click", (event) =>
      this.modals.forEach((item) => event.target === item && _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].closeModals())
    );

    this.cancelButtons.forEach((item) =>
      item.addEventListener("click", () => _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].closeModals())
    );

    this.addProjectBtn.addEventListener("click", () =>
      _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].openAddProjectModal());
  },

  initDropdownHandlers() {
    this.dropdownBtn.addEventListener("click", () =>
      _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].toggleDropdown(this.dropdown)
    );

    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !event.target.closest(".options-wrap")
      ) {
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].hideElement(this.dropdown);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].hideElement(this.dropdown);
      }
    });
  },
});


/***/ }),

/***/ "./src/handlers.js":
/*!*************************!*\
  !*** ./src/handlers.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/dom.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  taskFormHandler: null,
  deleteTaskHandler: null,

  setActiveProject(projectId) {
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].setActiveProject(projectId);
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].highlightActiveProject();
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].renderTasks();
  },

  toggleTaskComplete(taskId) {
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].toggleTaskComplete(taskId);
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].renderTasks();
  },

  toggleTaskPriority(taskId) {
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].toggleTaskPriority(taskId);
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].renderTasks();
  },

  openEditTaskModal(taskId) {
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].deleteTaskBtn.removeEventListener("click", this.deleteTaskHandler);
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].taskForm.removeEventListener("submit", this.taskFormHandler);

    const task = _app__WEBPACK_IMPORTED_MODULE_0__["default"].activeProject.tasks.find((t) => t.id === taskId);
    this.openModal("task", "edit");
    
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskTitle.value = task.title;
    if (task.description) {
      _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDescription.value = task.description;
    } else {
      _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDescription.value = "";
    }
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDate.textContent = task.dueDate;

    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].deleteTaskBtn.style.display = "flex";
    this.deleteTaskHandler = () => this.deleteTask(taskId);
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].deleteTaskBtn.addEventListener("click", this.deleteTaskHandler);

    this.taskFormHandler = (event) => this.editTask(event, taskId);
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].taskForm.addEventListener("submit", this.taskFormHandler);
  },

  editTask(event, taskId) {
    event.preventDefault();
    const title = _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskTitle.value;
    const description = _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDescription.value;
    const dueDate = _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDescription.value;
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].editTask(taskId, title, description, dueDate);
    this.closeModals();
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].renderTasks();
  },

  openAddTaskModal() {
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].taskForm.removeEventListener("submit", this.taskFormHandler);
    this.openModal("task", "add");
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskTitle.value = "";
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDescription.value = "";
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDate.textContent = "";

    this.taskFormHandler = (event) => this.addTask(event);
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].taskForm.addEventListener("submit", this.taskFormHandler);
  },

  addTask(event) {
    event.preventDefault();
    const title = _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskTitle.value;
    const description = _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDescription.value;
    const dueDate = _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formTaskDescription.value;
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].addTaskToProject(title, description, dueDate);
    this.closeModals();
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].renderTasks();
  },

  openAddProjectModal() {
    this.openModal("project", "add");
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].formProjectTitle.value = "";
  },

  openModal(type, mode) {
    const modal = document.getElementById(`${type}-modal`);
    modal.style.display = "flex";
    setTimeout(() => {
      modal.querySelector(".modal-content").style.transform = "scale(1)";
    }, 50);

    if (mode === "add") {
      modal.querySelector(".modal-title").textContent = `Add ${type}`;
      modal.querySelector(".modal-submit").textContent = "Add";
    } else {
      modal.querySelector(".modal-title").textContent = `Edit ${type}`;
      modal.querySelector(".modal-submit").textContent = "Edit";
    }
  },

  closeModals() {
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].modals.forEach((item) => {
      item.style.display = "none";
      setTimeout(() => {
        item.querySelector(".modal-content").style.transform = "scale(0)";
      }, 50);
    });

    this.hideElement(_dom__WEBPACK_IMPORTED_MODULE_1__["default"].deleteTaskBtn);
  },

  toggleDropdown(element) {
    element.style.display =
      element.style.display === "block" ? "none" : "block";
  },

  hideElement(element) {
    element.style.display = "none";
  },

  deleteTask(taskId) {
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].removeTask(taskId);
    this.closeModals();
    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].renderTasks();
  },
});


/***/ }),

/***/ "./src/project.js":
/*!************************!*\
  !*** ./src/project.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Project)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v1.js");


class Project {
  constructor(title) {
    this.id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])().split('-')[0];
    this.title = title;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}


/***/ }),

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _project__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./project */ "./src/project.js");
/* harmony import */ var _task__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./task */ "./src/task.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getProjects() {
    const projectsFromData = this.loadProjects();
    return projectsFromData.map(this.createProjectFromData.bind(this));
  },

  createProjectFromData(projectData) {
    const project = new _project__WEBPACK_IMPORTED_MODULE_0__["default"](projectData.title);
    project.id = projectData.id;
    if (projectData.tasks.length) {
      project.tasks = projectData.tasks.map(this.createTaskFromData);
    }
    return project;
  },

  createTaskFromData(taskData) {
    const task = new _task__WEBPACK_IMPORTED_MODULE_1__["default"](
      taskData.projectId,
      taskData.title,
      taskData.description,
      taskData.dueDate
    );
    task.id = taskData.id;
    task.important = taskData.important;
    task.completed = taskData.completed;
    return task;
  },

  loadProjects() {
    const projectsData = localStorage.getItem("projects");
    return projectsData ? JSON.parse(projectsData) : [];
  },

  saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
  },
});


/***/ }),

/***/ "./src/task.js":
/*!*********************!*\
  !*** ./src/task.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Task)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v1.js");


class Task {
  constructor(projectId, title, description, dueDate) {
    this.id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])().split('-')[0];
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/dom.js");



_app__WEBPACK_IMPORTED_MODULE_0__["default"].initTodo();
_dom__WEBPACK_IMPORTED_MODULE_1__["default"].initUI();

// app.setActiveProject('inbox');
// app.addTaskToProject('task x');
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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X21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JlZ2V4LmpzIiwid2VicGFjazovL3RvZG8vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JuZy5qcyIsIndlYnBhY2s6Ly90b2RvLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjEuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL3NyYy9hcHAuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vdG9kby8uL3NyYy9oYW5kbGVycy5qcyIsIndlYnBhY2s6Ly90b2RvLy4vc3JjL3Byb2plY3QuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL3NyYy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvdGFzay5qcyIsIndlYnBhY2s6Ly90b2RvL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG5sZXQgZ2V0UmFuZG9tVmFsdWVzO1xuY29uc3Qgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxuY29uc3QgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIHJldHVybiBieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFyciwgb2Zmc2V0ID0gMCkge1xuICBjb25zdCB1dWlkID0gdW5zYWZlU3RyaW5naWZ5KGFyciwgb2Zmc2V0KTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCB7IHVuc2FmZVN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJzsgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuLy9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9MaW9zSy9VVUlELmpzXG4vLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG5sZXQgX25vZGVJZDtcblxubGV0IF9jbG9ja3NlcTsgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG5cblxubGV0IF9sYXN0TVNlY3MgPSAwO1xubGV0IF9sYXN0TlNlY3MgPSAwOyAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkIGZvciBBUEkgZGV0YWlsc1xuXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBsZXQgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgY29uc3QgYiA9IGJ1ZiB8fCBuZXcgQXJyYXkoMTYpO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGV0IG5vZGUgPSBvcHRpb25zLm5vZGUgfHwgX25vZGVJZDtcbiAgbGV0IGNsb2Nrc2VxID0gb3B0aW9ucy5jbG9ja3NlcSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTsgLy8gbm9kZSBhbmQgY2xvY2tzZXEgbmVlZCB0byBiZSBpbml0aWFsaXplZCB0byByYW5kb20gdmFsdWVzIGlmIHRoZXkncmUgbm90XG4gIC8vIHNwZWNpZmllZC4gIFdlIGRvIHRoaXMgbGF6aWx5IHRvIG1pbmltaXplIGlzc3VlcyByZWxhdGVkIHRvIGluc3VmZmljaWVudFxuICAvLyBzeXN0ZW0gZW50cm9weS4gIFNlZSAjMTg5XG5cbiAgaWYgKG5vZGUgPT0gbnVsbCB8fCBjbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgY29uc3Qgc2VlZEJ5dGVzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAgIGlmIChub2RlID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxuICAgICAgbm9kZSA9IF9ub2RlSWQgPSBbc2VlZEJ5dGVzWzBdIHwgMHgwMSwgc2VlZEJ5dGVzWzFdLCBzZWVkQnl0ZXNbMl0sIHNlZWRCeXRlc1szXSwgc2VlZEJ5dGVzWzRdLCBzZWVkQnl0ZXNbNV1dO1xuICAgIH1cblxuICAgIGlmIChjbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxuICAgICAgY2xvY2tzZXEgPSBfY2xvY2tzZXEgPSAoc2VlZEJ5dGVzWzZdIDw8IDggfCBzZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuICAgIH1cbiAgfSAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cblxuXG4gIGxldCBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXNlY3MgOiBEYXRlLm5vdygpOyAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG5cbiAgbGV0IG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxOyAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG5cbiAgY29uc3QgZHQgPSBtc2VjcyAtIF9sYXN0TVNlY3MgKyAobnNlY3MgLSBfbGFzdE5TZWNzKSAvIDEwMDAwOyAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG5cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfSAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG5cblxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfSAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG5cblxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1dWlkLnYxKCk6IENhbid0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlY1wiKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTsgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG5cbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7IC8vIGB0aW1lX2xvd2BcblxuICBjb25zdCB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bCAmIDB4ZmY7IC8vIGB0aW1lX21pZGBcblxuICBjb25zdCB0bWggPSBtc2VjcyAvIDB4MTAwMDAwMDAwICogMTAwMDAgJiAweGZmZmZmZmY7XG4gIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRtaCAmIDB4ZmY7IC8vIGB0aW1lX2hpZ2hfYW5kX3ZlcnNpb25gXG5cbiAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmOyAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcblxuICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7IC8vIGBjbG9ja19zZXFfbG93YFxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjsgLy8gYG5vZGVgXG5cbiAgZm9yIChsZXQgbiA9IDA7IG4gPCA2OyArK24pIHtcbiAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IHVuc2FmZVN0cmluZ2lmeShiKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjE7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHN0b3JhZ2UgZnJvbSBcIi4vc3RvcmFnZVwiO1xyXG5pbXBvcnQgUHJvamVjdCBmcm9tIFwiLi9wcm9qZWN0XCI7XHJcbmltcG9ydCBUYXNrIGZyb20gXCIuL3Rhc2tcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBwcm9qZWN0czogW10sXHJcbiAgYWN0aXZlUHJvamVjdDogbnVsbCxcclxuXHJcbiAgaW5pdFRvZG8oKSB7XHJcbiAgICB0aGlzLnByb2plY3RzID0gc3RvcmFnZS5nZXRQcm9qZWN0cygpO1xyXG4gICAgY29uc3QgaW5ib3hFeGlzdHMgPSB0aGlzLnByb2plY3RzLnNvbWUoKHApID0+IHAuaWQgPT09IFwiaW5ib3hcIik7XHJcbiAgICBpZiAoIWluYm94RXhpc3RzKSB7XHJcbiAgICAgIGNvbnN0IGluYm94ID0gbmV3IFByb2plY3QoXCJJbmJveFwiKTtcclxuICAgICAgaW5ib3guaWQgPSBcImluYm94XCI7XHJcbiAgICAgIHRoaXMucHJvamVjdHMucHVzaChpbmJveCk7XHJcbiAgICAgIHN0b3JhZ2Uuc2F2ZVByb2plY3RzKHRoaXMucHJvamVjdHMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRBY3RpdmVQcm9qZWN0KFwiaW5ib3hcIik7XHJcbiAgfSxcclxuXHJcbiAgc2V0QWN0aXZlUHJvamVjdChwcm9qZWN0SWQpIHtcclxuICAgIHRoaXMuYWN0aXZlUHJvamVjdCA9IHRoaXMucHJvamVjdHMuZmluZCgocCkgPT4gcC5pZCA9PT0gcHJvamVjdElkKTtcclxuXHJcbiAgICAvLyDQu9C+0LPQuNC60LAg0LTQu9GPIHRvZGF5INC4INC/0YAuIDo6OlxyXG4gIH0sXHJcblxyXG4gIGFkZFByb2plY3QodGl0bGUpIHtcclxuICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdCh0aXRsZSk7XHJcbiAgICB0aGlzLnByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XHJcbiAgICBzdG9yYWdlLnNhdmVQcm9qZWN0cyh0aGlzLnByb2plY3RzKTtcclxuICB9LFxyXG5cclxuICBhZGRUYXNrVG9Qcm9qZWN0KHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSkge1xyXG4gICAgY29uc3QgbmV3VGFzayA9IG5ldyBUYXNrKHRoaXMuYWN0aXZlUHJvamVjdC5pZCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlKTtcclxuICAgIHRoaXMuYWN0aXZlUHJvamVjdC5hZGRUYXNrKG5ld1Rhc2spO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlUHJvamVjdChwcm9qZWN0SWQpIHtcclxuICAgIHRoaXMucHJvamVjdHMgPSB0aGlzLnByb2plY3RzLmZpbHRlcigocCkgPT4gcC5pZCAhPT0gcHJvamVjdElkKTtcclxuICAgIHN0b3JhZ2Uuc2F2ZVByb2plY3RzKHRoaXMucHJvamVjdHMpO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZVRhc2sodGFza0lkKSB7XHJcbiAgICAvLyBjb25zdCBwcm9qZWN0ID0gdGhpcy5wcm9qZWN0cy5maW5kKChwKSA9PiBwLmlkID09PSBwcm9qZWN0SWQpO1xyXG4gICAgdGhpcy5hY3RpdmVQcm9qZWN0LnJlbW92ZVRhc2sodGFza0lkKTtcclxuICAgIHN0b3JhZ2Uuc2F2ZVByb2plY3RzKHRoaXMucHJvamVjdHMpO1xyXG4gIH0sXHJcblxyXG4gIGVkaXRUYXNrKHRhc2tJZCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlKSB7XHJcbiAgICBjb25zdCB0YXNrID0gdGhpcy5hY3RpdmVQcm9qZWN0LnRhc2tzLmZpbmQoKHQpID0+IHQuaWQgPT09IHRhc2tJZCk7XHJcbiAgICB0YXNrLnRpdGxlID0gdGl0bGU7XHJcbiAgICB0YXNrLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0YXNrLmR1ZURhdGUgPSBkdWVEYXRlO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgdG9nZ2xlVGFza0NvbXBsZXRlKHRhc2tJZCkge1xyXG4gICAgdGhpcy5hY3RpdmVQcm9qZWN0LnRhc2tzLmZpbmQoKHQpID0+IHQuaWQgPT09IHRhc2tJZCkudG9nZ2xlQ29tcGxldGVkKCk7XHJcbiAgICBzdG9yYWdlLnNhdmVQcm9qZWN0cyh0aGlzLnByb2plY3RzKTtcclxuICB9LFxyXG5cclxuICB0b2dnbGVUYXNrUHJpb3JpdHkodGFza0lkKSB7XHJcbiAgICB0aGlzLmFjdGl2ZVByb2plY3QudGFza3MuZmluZCgodCkgPT4gdC5pZCA9PT0gdGFza0lkKS50b2dnbGVQcmlvcml0eSgpO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IGFwcCBmcm9tIFwiLi9hcHBcIjtcclxuaW1wb3J0IGhhbmRsZXJzIGZyb20gXCIuL2hhbmRsZXJzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZm9ybVByb2plY3RUaXRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXByb2plY3QtdGl0bGVcIiksXHJcbiAgZm9ybVRhc2tUaXRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXRhc2stdGl0bGVcIiksXHJcbiAgZGVsZXRlVGFza0J0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YXNrLWRlbGV0ZS1idG5cIiksXHJcbiAgZm9ybVRhc2tEZXNjcmlwdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXRhc2stZGVzY3JpcHRpb25cIiksXHJcbiAgZm9ybVRhc2tEYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcm0tdGFzay1kYXRlXCIpLFxyXG4gIHRhc2tTdWJtaXRCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFzay1zdWJtaXRcIiksXHJcbiAgbW9kYWxzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vZGFsXCIpLFxyXG4gIGNhbmNlbEJ1dHRvbnM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubW9kYWwtY2FuY2VsXCIpLFxyXG4gIHN1Ym1pdEJ1dHRvbnM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubW9kYWwtc3VibWl0XCIpLFxyXG4gIGFkZFByb2plY3RCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLXByb2plY3QtYnRuXCIpLFxyXG4gIGRyb3Bkb3duQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2plY3Qtb3B0aW9ucy1idG5cIiksXHJcbiAgZHJvcGRvd246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvamVjdC1vcHRpb25zXCIpLFxyXG4gIG5hdkl0ZW1zOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdi1pdGVtXCIpLFxyXG4gIHByb2plY3RWaWV3VGl0bGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvamVjdC12aWV3LXRpdGxlXCIpLFxyXG4gIHRhc2tzQ29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhc2stbGlzdFwiKSxcclxuICBhZGRUYXNrQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC10YXNrLWJ0blwiKSxcclxuICB1c2VyUHJvamVjdHNDb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1wcm9qZWN0c1wiKSxcclxuICB0YXNrRm9ybTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YXNrLWZvcm1cIiksXHJcblxyXG4gIGluaXRVSSgpIHtcclxuICAgIHRoaXMuaW5pdFN5c3RlbUxpc3RIYW5kbGVycygpO1xyXG4gICAgdGhpcy5yZW5kZXJQcm9qZWN0cygpO1xyXG4gICAgdGhpcy5yZW5kZXJUYXNrcygpO1xyXG4gICAgdGhpcy5oaWdobGlnaHRBY3RpdmVQcm9qZWN0KCk7XHJcbiAgICB0aGlzLmluaXRNb2RhbEhhbmRsZXJzKCk7XHJcbiAgICB0aGlzLmluaXREcm9wZG93bkhhbmRsZXJzKCk7XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyUHJvamVjdHMoKSB7XHJcbiAgICB0aGlzLnVzZXJQcm9qZWN0c0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgY29uc3QgdXNlclByb2plY3RzID0gYXBwLnByb2plY3RzLmZpbHRlcigocCkgPT4gcC5pZCAhPT0gXCJpbmJveFwiKTtcclxuICAgIHVzZXJQcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHByb2plY3RFbGVtZW50ID0gdGhpcy5jcmVhdGVQcm9qZWN0RWxlbWVudChwcm9qZWN0KTtcclxuICAgICAgdGhpcy51c2VyUHJvamVjdHNDb250YWluZXIuYXBwZW5kQ2hpbGQocHJvamVjdEVsZW1lbnQpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlUHJvamVjdEVsZW1lbnQocHJvamVjdCkge1xyXG4gICAgY29uc3QgcHJvamVjdFRpdGxlID0gdGhpcy5jcmVhdGVIdG1sRWxlbWVudChcInNwYW5cIiwgbnVsbCwgcHJvamVjdC50aXRsZSk7XHJcbiAgICBjb25zdCBwcm9qZWN0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICBwcm9qZWN0SWNvbi5zcmMgPSBcImltYWdlcy90YWcuc3ZnXCI7XHJcbiAgICBjb25zdCBwcm9qZWN0RWxlbWVudCA9IHRoaXMuY3JlYXRlSHRtbEVsZW1lbnQoXCJidXR0b25cIiwgXCJuYXYtaXRlbVwiLCBbXHJcbiAgICAgIHByb2plY3RJY29uLFxyXG4gICAgICBwcm9qZWN0VGl0bGUsXHJcbiAgICBdKTtcclxuICAgIHByb2plY3RFbGVtZW50LmRhdGFzZXQucHJvamVjdElkID0gcHJvamVjdC5pZDtcclxuXHJcbiAgICBwcm9qZWN0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgaGFuZGxlcnMuc2V0QWN0aXZlUHJvamVjdChwcm9qZWN0LmlkKVxyXG4gICAgKTtcclxuICAgIHJldHVybiBwcm9qZWN0RWxlbWVudDtcclxuICB9LFxyXG5cclxuICByZW5kZXJUYXNrcygpIHtcclxuICAgIHRoaXMucHJvamVjdFZpZXdUaXRsZS50ZXh0Q29udGVudCA9IGFwcC5hY3RpdmVQcm9qZWN0LnRpdGxlO1xyXG4gICAgdGhpcy50YXNrc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgYXBwLmFjdGl2ZVByb2plY3QudGFza3MuZm9yRWFjaCgodGFzaykgPT4ge1xyXG4gICAgICBjb25zdCB0YXNrRWxlbWVudCA9IHRoaXMuY3JlYXRlVGFza0VsZW1lbnQodGFzayk7XHJcbiAgICAgIHRoaXMudGFza3NDb250YWluZXIuYXBwZW5kQ2hpbGQodGFza0VsZW1lbnQpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmFkZFRhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGhhbmRsZXJzLm9wZW5BZGRUYXNrTW9kYWwoKSk7XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlVGFza0VsZW1lbnQodGFzaykge1xyXG4gICAgY29uc3QgaW1wb3J0YW50QnRuID0gdGhpcy5jcmVhdGVJbXBvcnRhbnRCdXR0b24odGFzayk7XHJcbiAgICBjb25zdCBjaGVja2JveEJ0biA9IHRoaXMuY3JlYXRlSHRtbEVsZW1lbnQoXCJidXR0b25cIiwgXCJ0YXNrLWNoZWNrYm94XCIpO1xyXG4gICAgY29uc3QgdGl0bGVQYXJhZ3JhcGggPSB0aGlzLmNyZWF0ZUh0bWxFbGVtZW50KFxyXG4gICAgICBcInBcIixcclxuICAgICAgXCJ0YXNrLXRpdGxlXCIsXHJcbiAgICAgIHRhc2sudGl0bGVcclxuICAgICk7XHJcbiAgICBjb25zdCB0YXNrSW5mb0NvbnRhaW5lciA9IHRoaXMuY3JlYXRlSHRtbEVsZW1lbnQoXCJkaXZcIiwgXCJ0YXNrLWluZm9cIiwgW1xyXG4gICAgICBjaGVja2JveEJ0bixcclxuICAgICAgdGl0bGVQYXJhZ3JhcGgsXHJcbiAgICBdKTtcclxuICAgIGNvbnN0IHRhc2tFbGVtZW50ID0gdGhpcy5jcmVhdGVIdG1sRWxlbWVudChcImRpdlwiLCBcInRhc2tcIiwgW1xyXG4gICAgICB0YXNrSW5mb0NvbnRhaW5lcixcclxuICAgICAgaW1wb3J0YW50QnRuLFxyXG4gICAgXSk7XHJcblxyXG4gICAgdGl0bGVQYXJhZ3JhcGguY2xhc3NMaXN0LnRvZ2dsZShcImNvbXBsZXRlZFwiLCB0YXNrLmNvbXBsZXRlZCk7XHJcbiAgICBjaGVja2JveEJ0bi5jbGFzc0xpc3QudG9nZ2xlKFwiY2hlY2tlZFwiLCB0YXNrLmNvbXBsZXRlZCk7XHJcblxyXG4gICAgaWYgKHRhc2suZHVlRGF0ZSkge1xyXG4gICAgICBjb25zdCBkdWVEYXRlSW5mbyA9IHRoaXMuY3JlYXRlSHRtbEVsZW1lbnQoXHJcbiAgICAgICAgXCJzcGFuXCIsXHJcbiAgICAgICAgXCJ0YXNrLWRhdGVcIixcclxuICAgICAgICB0YXNrLmR1ZURhdGUgLy8gOjo6INGEINC00LvRjyDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINGE0L7RgNC80LDRgtCwINC00LDRgtGLXHJcbiAgICAgICk7XHJcbiAgICAgIHRhc2tJbmZvQ29udGFpbmVyLmFwcGVuZENoaWxkKGR1ZURhdGVJbmZvKTtcclxuICAgIH1cclxuICAgIGlmICh0YXNrLmRlc2NyaXB0aW9uKSB7XHJcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgIGRlc2NyaXB0aW9uSWNvbi5zcmMgPSBcImltYWdlcy9ub3RlLnN2Z1wiO1xyXG4gICAgICB0YXNrSW5mb0NvbnRhaW5lci5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbkljb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICBoYW5kbGVycy50b2dnbGVUYXNrQ29tcGxldGUodGFzay5pZClcclxuICAgICk7XHJcbiAgICB0YXNrRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAhZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuaW1wb3J0YW50LWJ0blwiKSAmJlxyXG4gICAgICAgICFldmVudC50YXJnZXQuY2xvc2VzdChcIi50YXNrLWNoZWNrYm94XCIpXHJcbiAgICAgIClcclxuICAgICAgICBoYW5kbGVycy5vcGVuRWRpdFRhc2tNb2RhbCh0YXNrLmlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0YXNrRWxlbWVudDtcclxuICB9LFxyXG5cclxuICBjcmVhdGVJbXBvcnRhbnRCdXR0b24odGFzaykge1xyXG4gICAgY29uc3QgYnV0dG9uID0gdGhpcy5jcmVhdGVIdG1sRWxlbWVudChcImJ1dHRvblwiLCBcImltcG9ydGFudC1idG5cIik7XHJcblxyXG4gICAgY29uc3QgaW1wb3J0YW50SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcclxuICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxyXG4gICAgICBcInN2Z1wiXHJcbiAgICApO1xyXG4gICAgaW1wb3J0YW50SWNvbi5zZXRBdHRyaWJ1dGUoXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpO1xyXG4gICAgaW1wb3J0YW50SWNvbi5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgXCIyNFwiKTtcclxuICAgIGltcG9ydGFudEljb24uc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIyNFwiKTtcclxuICAgIGltcG9ydGFudEljb24uY2xhc3NMaXN0LmFkZChcImltcG9ydGFudC1pY29uXCIpO1xyXG5cclxuICAgIGlmICh0YXNrLmltcG9ydGFudCkge1xyXG4gICAgICBpbXBvcnRhbnRJY29uLnNldEF0dHJpYnV0ZShcInZpZXdCb3hcIiwgXCIwIDAgMjQgMjRcIik7XHJcbiAgICAgIGltcG9ydGFudEljb24uc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIiNmOTJlNjVcIik7XHJcblxyXG4gICAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxyXG4gICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcclxuICAgICAgICBcInBhdGhcIlxyXG4gICAgICApO1xyXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJNMCAwaDI0djI0SDB6XCIpO1xyXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xyXG5cclxuICAgICAgY29uc3QgZmlsbGVkUGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcclxuICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXHJcbiAgICAgICAgXCJwYXRoXCJcclxuICAgICAgKTtcclxuICAgICAgZmlsbGVkUGF0aC5zZXRBdHRyaWJ1dGUoXHJcbiAgICAgICAgXCJkXCIsXHJcbiAgICAgICAgXCJNMTIgMTcuMjcgMTguMTggMjFsLTEuNjQtNy4wM0wyMiA5LjI0bC03LjE5LS42MUwxMiAyIDkuMTkgOC42MyAyIDkuMjRsNS40NiA0LjczTDUuODIgMjF6XCJcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGltcG9ydGFudEljb24uYXBwZW5kKHBhdGgsIGZpbGxlZFBhdGgpO1xyXG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGltcG9ydGFudEljb24uc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCBcIjAgLTk2MCA5NjAgOTYwXCIpO1xyXG4gICAgICBpbXBvcnRhbnRJY29uLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCIjNzU3NTc1XCIpO1xyXG5cclxuICAgICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcclxuICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXHJcbiAgICAgICAgXCJwYXRoXCJcclxuICAgICAgKTtcclxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXHJcbiAgICAgICAgXCJkXCIsXHJcbiAgICAgICAgXCJtMzU0LTI0NyAxMjYtNzYgMTI2IDc3LTMzLTE0NCAxMTEtOTYtMTQ2LTEzLTU4LTEzNi01OCAxMzUtMTQ2IDEzIDExMSA5Ny0zMyAxNDNaTTIzMy04MGw2NS0yODFMODAtNTUwbDI4OC0yNSAxMTItMjY1IDExMiAyNjUgMjg4IDI1LTIxOCAxODkgNjUgMjgxLTI0Ny0xNDlMMjMzLTgwWm0yNDctMzUwWlwiXHJcbiAgICAgICk7XHJcbiAgICAgIGltcG9ydGFudEljb24uYXBwZW5kQ2hpbGQocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKGltcG9ydGFudEljb24pO1xyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICBoYW5kbGVycy50b2dnbGVUYXNrUHJpb3JpdHkodGFzay5pZClcclxuICAgICk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZUh0bWxFbGVtZW50KHR5cGUsIGNsYXNzZXMsIGNvbnRlbnQpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xyXG5cclxuICAgIGlmIChjbGFzc2VzKSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNsYXNzZXMpKSB7XHJcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc2VzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjb250ZW50KSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnQpKSB7XHJcbiAgICAgICAgY29udGVudC5mb3JFYWNoKChjaGlsZCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY29udGVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH0sXHJcblxyXG4gIGhpZ2hsaWdodEFjdGl2ZVByb2plY3QoKSB7XHJcbiAgICBhcHAucHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBwcm9qZWN0SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgYFtkYXRhLXByb2plY3QtaWQ9XCIke3Byb2plY3QuaWR9XCJdYFxyXG4gICAgICApO1xyXG4gICAgICBpZiAocHJvamVjdC5pZCA9PT0gYXBwLmFjdGl2ZVByb2plY3QuaWQpIHtcclxuICAgICAgICBwcm9qZWN0SXRlbS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByb2plY3RJdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8g0LTQvtC/INC70L7Qs9C40LrQsCDQtNC70Y8g0LHQsNC30L7QstGL0YUg0YHQv9C40YHQutC+0LIgOjo6XHJcbiAgfSxcclxuXHJcbiAgaW5pdFN5c3RlbUxpc3RIYW5kbGVycygpIHtcclxuICAgIHRoaXMubmF2SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgIGhhbmRsZXJzLnNldEFjdGl2ZVByb2plY3QoaXRlbS5kYXRhc2V0LnByb2plY3RJZClcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGluaXRNb2RhbEhhbmRsZXJzKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJrZXlkb3duXCIsXHJcbiAgICAgIChldmVudCkgPT4gZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiICYmIGhhbmRsZXJzLmNsb3NlTW9kYWxzKClcclxuICAgICk7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT5cclxuICAgICAgdGhpcy5tb2RhbHMuZm9yRWFjaCgoaXRlbSkgPT4gZXZlbnQudGFyZ2V0ID09PSBpdGVtICYmIGhhbmRsZXJzLmNsb3NlTW9kYWxzKCkpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuY2FuY2VsQnV0dG9ucy5mb3JFYWNoKChpdGVtKSA9PlxyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBoYW5kbGVycy5jbG9zZU1vZGFscygpKVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmFkZFByb2plY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgIGhhbmRsZXJzLm9wZW5BZGRQcm9qZWN0TW9kYWwoKSk7XHJcbiAgfSxcclxuXHJcbiAgaW5pdERyb3Bkb3duSGFuZGxlcnMoKSB7XHJcbiAgICB0aGlzLmRyb3Bkb3duQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICBoYW5kbGVycy50b2dnbGVEcm9wZG93bih0aGlzLmRyb3Bkb3duKVxyXG4gICAgKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAhdGhpcy5kcm9wZG93bi5jb250YWlucyhldmVudC50YXJnZXQpICYmXHJcbiAgICAgICAgIWV2ZW50LnRhcmdldC5jbG9zZXN0KFwiLm9wdGlvbnMtd3JhcFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBoYW5kbGVycy5oaWRlRWxlbWVudCh0aGlzLmRyb3Bkb3duKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHtcclxuICAgICAgICBoYW5kbGVycy5oaWRlRWxlbWVudCh0aGlzLmRyb3Bkb3duKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IGFwcCBmcm9tIFwiLi9hcHBcIjtcclxuaW1wb3J0IGRvbSBmcm9tIFwiLi9kb21cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB0YXNrRm9ybUhhbmRsZXI6IG51bGwsXHJcbiAgZGVsZXRlVGFza0hhbmRsZXI6IG51bGwsXHJcblxyXG4gIHNldEFjdGl2ZVByb2plY3QocHJvamVjdElkKSB7XHJcbiAgICBhcHAuc2V0QWN0aXZlUHJvamVjdChwcm9qZWN0SWQpO1xyXG4gICAgZG9tLmhpZ2hsaWdodEFjdGl2ZVByb2plY3QoKTtcclxuICAgIGRvbS5yZW5kZXJUYXNrcygpO1xyXG4gIH0sXHJcblxyXG4gIHRvZ2dsZVRhc2tDb21wbGV0ZSh0YXNrSWQpIHtcclxuICAgIGFwcC50b2dnbGVUYXNrQ29tcGxldGUodGFza0lkKTtcclxuICAgIGRvbS5yZW5kZXJUYXNrcygpO1xyXG4gIH0sXHJcblxyXG4gIHRvZ2dsZVRhc2tQcmlvcml0eSh0YXNrSWQpIHtcclxuICAgIGFwcC50b2dnbGVUYXNrUHJpb3JpdHkodGFza0lkKTtcclxuICAgIGRvbS5yZW5kZXJUYXNrcygpO1xyXG4gIH0sXHJcblxyXG4gIG9wZW5FZGl0VGFza01vZGFsKHRhc2tJZCkge1xyXG4gICAgZG9tLmRlbGV0ZVRhc2tCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGVsZXRlVGFza0hhbmRsZXIpO1xyXG4gICAgZG9tLnRhc2tGb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgdGhpcy50YXNrRm9ybUhhbmRsZXIpO1xyXG5cclxuICAgIGNvbnN0IHRhc2sgPSBhcHAuYWN0aXZlUHJvamVjdC50YXNrcy5maW5kKCh0KSA9PiB0LmlkID09PSB0YXNrSWQpO1xyXG4gICAgdGhpcy5vcGVuTW9kYWwoXCJ0YXNrXCIsIFwiZWRpdFwiKTtcclxuICAgIFxyXG4gICAgZG9tLmZvcm1UYXNrVGl0bGUudmFsdWUgPSB0YXNrLnRpdGxlO1xyXG4gICAgaWYgKHRhc2suZGVzY3JpcHRpb24pIHtcclxuICAgICAgZG9tLmZvcm1UYXNrRGVzY3JpcHRpb24udmFsdWUgPSB0YXNrLmRlc2NyaXB0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9tLmZvcm1UYXNrRGVzY3JpcHRpb24udmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgZG9tLmZvcm1UYXNrRGF0ZS50ZXh0Q29udGVudCA9IHRhc2suZHVlRGF0ZTtcclxuXHJcbiAgICBkb20uZGVsZXRlVGFza0J0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICB0aGlzLmRlbGV0ZVRhc2tIYW5kbGVyID0gKCkgPT4gdGhpcy5kZWxldGVUYXNrKHRhc2tJZCk7XHJcbiAgICBkb20uZGVsZXRlVGFza0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5kZWxldGVUYXNrSGFuZGxlcik7XHJcblxyXG4gICAgdGhpcy50YXNrRm9ybUhhbmRsZXIgPSAoZXZlbnQpID0+IHRoaXMuZWRpdFRhc2soZXZlbnQsIHRhc2tJZCk7XHJcbiAgICBkb20udGFza0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCB0aGlzLnRhc2tGb3JtSGFuZGxlcik7XHJcbiAgfSxcclxuXHJcbiAgZWRpdFRhc2soZXZlbnQsIHRhc2tJZCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHRpdGxlID0gZG9tLmZvcm1UYXNrVGl0bGUudmFsdWU7XHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvbS5mb3JtVGFza0Rlc2NyaXB0aW9uLnZhbHVlO1xyXG4gICAgY29uc3QgZHVlRGF0ZSA9IGRvbS5mb3JtVGFza0Rlc2NyaXB0aW9uLnZhbHVlO1xyXG4gICAgYXBwLmVkaXRUYXNrKHRhc2tJZCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlKTtcclxuICAgIHRoaXMuY2xvc2VNb2RhbHMoKTtcclxuICAgIGRvbS5yZW5kZXJUYXNrcygpO1xyXG4gIH0sXHJcblxyXG4gIG9wZW5BZGRUYXNrTW9kYWwoKSB7XHJcbiAgICBkb20udGFza0Zvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCB0aGlzLnRhc2tGb3JtSGFuZGxlcik7XHJcbiAgICB0aGlzLm9wZW5Nb2RhbChcInRhc2tcIiwgXCJhZGRcIik7XHJcbiAgICBkb20uZm9ybVRhc2tUaXRsZS52YWx1ZSA9IFwiXCI7XHJcbiAgICBkb20uZm9ybVRhc2tEZXNjcmlwdGlvbi52YWx1ZSA9IFwiXCI7XHJcbiAgICBkb20uZm9ybVRhc2tEYXRlLnRleHRDb250ZW50ID0gXCJcIjtcclxuXHJcbiAgICB0aGlzLnRhc2tGb3JtSGFuZGxlciA9IChldmVudCkgPT4gdGhpcy5hZGRUYXNrKGV2ZW50KTtcclxuICAgIGRvbS50YXNrRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMudGFza0Zvcm1IYW5kbGVyKTtcclxuICB9LFxyXG5cclxuICBhZGRUYXNrKGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgdGl0bGUgPSBkb20uZm9ybVRhc2tUaXRsZS52YWx1ZTtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZG9tLmZvcm1UYXNrRGVzY3JpcHRpb24udmFsdWU7XHJcbiAgICBjb25zdCBkdWVEYXRlID0gZG9tLmZvcm1UYXNrRGVzY3JpcHRpb24udmFsdWU7XHJcbiAgICBhcHAuYWRkVGFza1RvUHJvamVjdCh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUpO1xyXG4gICAgdGhpcy5jbG9zZU1vZGFscygpO1xyXG4gICAgZG9tLnJlbmRlclRhc2tzKCk7XHJcbiAgfSxcclxuXHJcbiAgb3BlbkFkZFByb2plY3RNb2RhbCgpIHtcclxuICAgIHRoaXMub3Blbk1vZGFsKFwicHJvamVjdFwiLCBcImFkZFwiKTtcclxuICAgIGRvbS5mb3JtUHJvamVjdFRpdGxlLnZhbHVlID0gXCJcIjtcclxuICB9LFxyXG5cclxuICBvcGVuTW9kYWwodHlwZSwgbW9kZSkge1xyXG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHt0eXBlfS1tb2RhbGApO1xyXG4gICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtY29udGVudFwiKS5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKDEpXCI7XHJcbiAgICB9LCA1MCk7XHJcblxyXG4gICAgaWYgKG1vZGUgPT09IFwiYWRkXCIpIHtcclxuICAgICAgbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC10aXRsZVwiKS50ZXh0Q29udGVudCA9IGBBZGQgJHt0eXBlfWA7XHJcbiAgICAgIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtc3VibWl0XCIpLnRleHRDb250ZW50ID0gXCJBZGRcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtdGl0bGVcIikudGV4dENvbnRlbnQgPSBgRWRpdCAke3R5cGV9YDtcclxuICAgICAgbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1zdWJtaXRcIikudGV4dENvbnRlbnQgPSBcIkVkaXRcIjtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjbG9zZU1vZGFscygpIHtcclxuICAgIGRvbS5tb2RhbHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaXRlbS5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIikuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgwKVwiO1xyXG4gICAgICB9LCA1MCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmhpZGVFbGVtZW50KGRvbS5kZWxldGVUYXNrQnRuKTtcclxuICB9LFxyXG5cclxuICB0b2dnbGVEcm9wZG93bihlbGVtZW50KSB7XHJcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPVxyXG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09IFwiYmxvY2tcIiA/IFwibm9uZVwiIDogXCJibG9ja1wiO1xyXG4gIH0sXHJcblxyXG4gIGhpZGVFbGVtZW50KGVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIH0sXHJcblxyXG4gIGRlbGV0ZVRhc2sodGFza0lkKSB7XHJcbiAgICBhcHAucmVtb3ZlVGFzayh0YXNrSWQpO1xyXG4gICAgdGhpcy5jbG9zZU1vZGFscygpO1xyXG4gICAgZG9tLnJlbmRlclRhc2tzKCk7XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IHsgdjEgYXMgdXVpZHYxIH0gZnJvbSBcInV1aWRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3Qge1xyXG4gIGNvbnN0cnVjdG9yKHRpdGxlKSB7XHJcbiAgICB0aGlzLmlkID0gdXVpZHYxKCkuc3BsaXQoJy0nKVswXTtcclxuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgIHRoaXMudGFza3MgPSBbXTtcclxuICB9XHJcblxyXG4gIGFkZFRhc2sodGFzaykge1xyXG4gICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlVGFzayh0YXNrSWQpIHtcclxuICAgIHRoaXMudGFza3MgPSB0aGlzLnRhc2tzLmZpbHRlcigodGFzaykgPT4gdGFzay5pZCAhPT0gdGFza0lkKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFByb2plY3QgZnJvbSBcIi4vcHJvamVjdFwiO1xyXG5pbXBvcnQgVGFzayBmcm9tIFwiLi90YXNrXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UHJvamVjdHMoKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0c0Zyb21EYXRhID0gdGhpcy5sb2FkUHJvamVjdHMoKTtcclxuICAgIHJldHVybiBwcm9qZWN0c0Zyb21EYXRhLm1hcCh0aGlzLmNyZWF0ZVByb2plY3RGcm9tRGF0YS5iaW5kKHRoaXMpKTtcclxuICB9LFxyXG5cclxuICBjcmVhdGVQcm9qZWN0RnJvbURhdGEocHJvamVjdERhdGEpIHtcclxuICAgIGNvbnN0IHByb2plY3QgPSBuZXcgUHJvamVjdChwcm9qZWN0RGF0YS50aXRsZSk7XHJcbiAgICBwcm9qZWN0LmlkID0gcHJvamVjdERhdGEuaWQ7XHJcbiAgICBpZiAocHJvamVjdERhdGEudGFza3MubGVuZ3RoKSB7XHJcbiAgICAgIHByb2plY3QudGFza3MgPSBwcm9qZWN0RGF0YS50YXNrcy5tYXAodGhpcy5jcmVhdGVUYXNrRnJvbURhdGEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByb2plY3Q7XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlVGFza0Zyb21EYXRhKHRhc2tEYXRhKSB7XHJcbiAgICBjb25zdCB0YXNrID0gbmV3IFRhc2soXHJcbiAgICAgIHRhc2tEYXRhLnByb2plY3RJZCxcclxuICAgICAgdGFza0RhdGEudGl0bGUsXHJcbiAgICAgIHRhc2tEYXRhLmRlc2NyaXB0aW9uLFxyXG4gICAgICB0YXNrRGF0YS5kdWVEYXRlXHJcbiAgICApO1xyXG4gICAgdGFzay5pZCA9IHRhc2tEYXRhLmlkO1xyXG4gICAgdGFzay5pbXBvcnRhbnQgPSB0YXNrRGF0YS5pbXBvcnRhbnQ7XHJcbiAgICB0YXNrLmNvbXBsZXRlZCA9IHRhc2tEYXRhLmNvbXBsZXRlZDtcclxuICAgIHJldHVybiB0YXNrO1xyXG4gIH0sXHJcblxyXG4gIGxvYWRQcm9qZWN0cygpIHtcclxuICAgIGNvbnN0IHByb2plY3RzRGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicHJvamVjdHNcIik7XHJcbiAgICByZXR1cm4gcHJvamVjdHNEYXRhID8gSlNPTi5wYXJzZShwcm9qZWN0c0RhdGEpIDogW107XHJcbiAgfSxcclxuXHJcbiAgc2F2ZVByb2plY3RzKHByb2plY3RzKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByb2plY3RzXCIsIEpTT04uc3RyaW5naWZ5KHByb2plY3RzKSk7XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IHsgdjEgYXMgdXVpZHYxIH0gZnJvbSBcInV1aWRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2sge1xyXG4gIGNvbnN0cnVjdG9yKHByb2plY3RJZCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlKSB7XHJcbiAgICB0aGlzLmlkID0gdXVpZHYxKCkuc3BsaXQoJy0nKVswXTtcclxuICAgIHRoaXMucHJvamVjdElkID0gcHJvamVjdElkO1xyXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcclxuICAgIHRoaXMuaW1wb3J0YW50ID0gZmFsc2U7XHJcbiAgICB0aGlzLmNvbXBsZXRlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQ29tcGxldGVkKCkge1xyXG4gICAgdGhpcy5jb21wbGV0ZWQgPSAhdGhpcy5jb21wbGV0ZWQ7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVQcmlvcml0eSgpIHtcclxuICAgIHRoaXMuaW1wb3J0YW50ID0gIXRoaXMuaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBhcHAgZnJvbSBcIi4vYXBwXCI7XHJcbmltcG9ydCBkb20gZnJvbSBcIi4vZG9tXCI7XHJcblxyXG5hcHAuaW5pdFRvZG8oKTtcclxuZG9tLmluaXRVSSgpO1xyXG5cclxuLy8gYXBwLnNldEFjdGl2ZVByb2plY3QoJ2luYm94Jyk7XHJcbi8vIGFwcC5hZGRUYXNrVG9Qcm9qZWN0KCd0YXNrIHgnKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=