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

    // дописать логику для today и пр. :::
  },

  addProject(title) {
    const newProject = new _project__WEBPACK_IMPORTED_MODULE_1__["default"](title);
    this.projects.push(newProject);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  addTaskToProject(projectId, title, description, dueDate) {
    // ::: мб ид проекта не нужен
    const project = this.projects.find((p) => p.id === projectId);
    const newTask = new _task__WEBPACK_IMPORTED_MODULE_2__["default"](projectId, title, description, dueDate);
    project.addTask(newTask);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  removeProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  removeTask(projectId, taskId) {
    const project = this.projects.find((p) => p.id === projectId);
    project.removeTask(taskId);
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

  displayProjectsAndTasks() {
    // ::: тест
    console.log("Current projects:");
    this.projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);

      project.tasks.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title}`);
      });
    });
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
  initUI() {
    this.attachSystemListClickHandler();
    this.renderProjects();
    this.renderTasks();
    this.highlightActiveProject();
    this.initModalHandlers();
  },

  renderProjects() {
    const projectsContainer = document.getElementById("user-projects");
    projectsContainer.innerHTML = "";
    const userProjects = _app__WEBPACK_IMPORTED_MODULE_0__["default"].projects.filter((p) => p.id !== "inbox");
    userProjects.forEach((project) => {
      const projectElement = this.createProjectElement(project);
      projectsContainer.appendChild(projectElement);
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
    const projectHeader = document.getElementById("project-name");
    projectHeader.textContent = _app__WEBPACK_IMPORTED_MODULE_0__["default"].activeProject.title;
    const tasksContainer = document.getElementById("task-list");
    tasksContainer.innerHTML = "";
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].activeProject.tasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      tasksContainer.appendChild(taskElement);
    });
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
        task.dueDate // *** ф для преобразования формата даты
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
      _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].openEditTaskModal(event, task.id);
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

  attachSystemListClickHandler() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].setActiveProject(item.dataset.projectId);
      });
    });
  },

  initModalHandlers() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].closeModals();
      }
    });

    const modals = document.querySelectorAll('.modal');
    document.addEventListener("click", (event) => {
      modals.forEach(item => {
        if (event.target === item) {
          _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].closeModals();
        }
      });
    });

    const cancelButtons = document.querySelectorAll(".modal-cancel");
    cancelButtons.forEach((item) => {
      item.addEventListener("click", () => {
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].closeModals();
      });
    });

    const submitButtons = document.querySelectorAll(".modal-submit");
    submitButtons.forEach((item) => {
      item.addEventListener("click", () => {
        _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].closeModals();
        // ::: логика для обработки данных из формы
      });
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

  openEditTaskModal(event, taskId) {
    if (
      !event.target.closest(".important-btn") &&
      !event.target.closest(".task-checkbox")
    ) {
      const modal = document.getElementById("task-modal");
      const task = _app__WEBPACK_IMPORTED_MODULE_0__["default"].activeProject.tasks.find((t) => t.id === taskId);
      this.openModal(modal);

      modal.querySelector(".modal-title").textContent = "Edit task";
      modal.querySelector(".modal-submit").textContent = "Edit";
      document.getElementById("form-task-title").value = task.title;
      document.getElementById("form-task-description").value = task.description;
      document.getElementById("form-task-date").textContent = task.dueDate;
    }
  },

  openModal(element) {
    element.style.display = "flex";
    setTimeout(() => {
      element.querySelector(".modal-content").style.transform = "scale(1)";
    }, 50);
  },

  closeModals() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((item) => {
      item.style.display = 'none';
      setTimeout(() => {
        item.querySelector(".modal-content").style.transform = "scale(0)";
      }, 50);
    });
    // ::: стиль закрытия не работает

    // document.getElementById('form-task-title').value = '';
    // document.getElementById('form-task-description').value = '';
    // document.getElementById('form-task-date').value = '';
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBRztBQUM1QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0saURBQVE7QUFDZDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyw0Q0FBRztBQUNuQztBQUNBO0FBQ0EsSUFBSSw0Q0FBRztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0saURBQVE7QUFDZDtBQUNBO0FBQ0EsTUFBTSxpREFBUTtBQUNkLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGlEQUFRO0FBQ2Q7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRO0FBQ1I7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QWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOd0I7QUFDQTtBQUN4QjtBQUNBLDRDQUFHO0FBQ0gsNENBQUciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly90b2RvLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL3RvZG8vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3YxLmpzIiwid2VicGFjazovL3RvZG8vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvaGFuZGxlcnMuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL3NyYy9wcm9qZWN0LmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90b2RvLy4vc3JjL3Rhc2suanMiLCJ3ZWJwYWNrOi8vdG9kby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxubGV0IGdldFJhbmRvbVZhbHVlcztcbmNvbnN0IHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbmNvbnN0IGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zbGljZSgxKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICByZXR1cm4gYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV07XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgY29uc3QgdXVpZCA9IHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgeyB1bnNhZmVTdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7IC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxubGV0IF9ub2RlSWQ7XG5cbmxldCBfY2xvY2tzZXE7IC8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxuXG5cbmxldCBfbGFzdE1TZWNzID0gMDtcbmxldCBfbGFzdE5TZWNzID0gMDsgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCBmb3IgQVBJIGRldGFpbHNcblxuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgbGV0IGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIGNvbnN0IGIgPSBidWYgfHwgbmV3IEFycmF5KDE2KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxldCBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIGxldCBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7IC8vIG5vZGUgYW5kIGNsb2Nrc2VxIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gcmFuZG9tIHZhbHVlcyBpZiB0aGV5J3JlIG5vdFxuICAvLyBzcGVjaWZpZWQuICBXZSBkbyB0aGlzIGxhemlseSB0byBtaW5pbWl6ZSBpc3N1ZXMgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnRcbiAgLy8gc3lzdGVtIGVudHJvcHkuICBTZWUgIzE4OVxuXG4gIGlmIChub2RlID09IG51bGwgfHwgY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgIGNvbnN0IHNlZWRCeXRlcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgICAgIG5vZGUgPSBfbm9kZUlkID0gW3NlZWRCeXRlc1swXSB8IDB4MDEsIHNlZWRCeXRlc1sxXSwgc2VlZEJ5dGVzWzJdLCBzZWVkQnl0ZXNbM10sIHNlZWRCeXRlc1s0XSwgc2VlZEJ5dGVzWzVdXTtcbiAgICB9XG5cbiAgICBpZiAoY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbiAgICAgIGNsb2Nrc2VxID0gX2Nsb2Nrc2VxID0gKHNlZWRCeXRlc1s2XSA8PCA4IHwgc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcbiAgICB9XG4gIH0gLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG5cblxuICBsZXQgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogRGF0ZS5ub3coKTsgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuXG4gIGxldCBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTsgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuXG4gIGNvbnN0IGR0ID0gbXNlY3MgLSBfbGFzdE1TZWNzICsgKG5zZWNzIC0gX2xhc3ROU2VjcykgLyAxMDAwMDsgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuXG4gIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gIH0gLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuXG5cbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH0gLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuXG5cbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXVpZC52MSgpOiBDYW4ndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWNcIik7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7IC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwOyAvLyBgdGltZV9sb3dgXG5cbiAgY29uc3QgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmOyAvLyBgdGltZV9taWRgXG5cbiAgY29uc3QgdG1oID0gbXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwICYgMHhmZmZmZmZmO1xuICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bWggJiAweGZmOyAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjsgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG5cbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwOyAvLyBgY2xvY2tfc2VxX2xvd2BcblxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7IC8vIGBub2RlYFxuXG4gIGZvciAobGV0IG4gPSAwOyBuIDwgNjsgKytuKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCB1bnNhZmVTdHJpbmdpZnkoYik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHYxOyIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcblxuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlOyIsImltcG9ydCBzdG9yYWdlIGZyb20gXCIuL3N0b3JhZ2VcIjtcclxuaW1wb3J0IFByb2plY3QgZnJvbSBcIi4vcHJvamVjdFwiO1xyXG5pbXBvcnQgVGFzayBmcm9tIFwiLi90YXNrXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgcHJvamVjdHM6IFtdLFxyXG4gIGFjdGl2ZVByb2plY3Q6IG51bGwsXHJcblxyXG4gIGluaXRUb2RvKCkge1xyXG4gICAgdGhpcy5wcm9qZWN0cyA9IHN0b3JhZ2UuZ2V0UHJvamVjdHMoKTtcclxuICAgIGNvbnN0IGluYm94RXhpc3RzID0gdGhpcy5wcm9qZWN0cy5zb21lKChwKSA9PiBwLmlkID09PSBcImluYm94XCIpO1xyXG4gICAgaWYgKCFpbmJveEV4aXN0cykge1xyXG4gICAgICBjb25zdCBpbmJveCA9IG5ldyBQcm9qZWN0KFwiSW5ib3hcIik7XHJcbiAgICAgIGluYm94LmlkID0gXCJpbmJveFwiO1xyXG4gICAgICB0aGlzLnByb2plY3RzLnB1c2goaW5ib3gpO1xyXG4gICAgICBzdG9yYWdlLnNhdmVQcm9qZWN0cyh0aGlzLnByb2plY3RzKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0QWN0aXZlUHJvamVjdChcImluYm94XCIpO1xyXG4gIH0sXHJcblxyXG4gIHNldEFjdGl2ZVByb2plY3QocHJvamVjdElkKSB7XHJcbiAgICB0aGlzLmFjdGl2ZVByb2plY3QgPSB0aGlzLnByb2plY3RzLmZpbmQoKHApID0+IHAuaWQgPT09IHByb2plY3RJZCk7XHJcblxyXG4gICAgLy8g0LTQvtC/0LjRgdCw0YLRjCDQu9C+0LPQuNC60YMg0LTQu9GPIHRvZGF5INC4INC/0YAuIDo6OlxyXG4gIH0sXHJcblxyXG4gIGFkZFByb2plY3QodGl0bGUpIHtcclxuICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdCh0aXRsZSk7XHJcbiAgICB0aGlzLnByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XHJcbiAgICBzdG9yYWdlLnNhdmVQcm9qZWN0cyh0aGlzLnByb2plY3RzKTtcclxuICB9LFxyXG5cclxuICBhZGRUYXNrVG9Qcm9qZWN0KHByb2plY3RJZCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlKSB7XHJcbiAgICAvLyA6Ojog0LzQsSDQuNC0INC/0YDQvtC10LrRgtCwINC90LUg0L3Rg9C20LXQvVxyXG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMucHJvamVjdHMuZmluZCgocCkgPT4gcC5pZCA9PT0gcHJvamVjdElkKTtcclxuICAgIGNvbnN0IG5ld1Rhc2sgPSBuZXcgVGFzayhwcm9qZWN0SWQsIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSk7XHJcbiAgICBwcm9qZWN0LmFkZFRhc2sobmV3VGFzayk7XHJcbiAgICBzdG9yYWdlLnNhdmVQcm9qZWN0cyh0aGlzLnByb2plY3RzKTtcclxuICB9LFxyXG5cclxuICByZW1vdmVQcm9qZWN0KHByb2plY3RJZCkge1xyXG4gICAgdGhpcy5wcm9qZWN0cyA9IHRoaXMucHJvamVjdHMuZmlsdGVyKChwKSA9PiBwLmlkICE9PSBwcm9qZWN0SWQpO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlVGFzayhwcm9qZWN0SWQsIHRhc2tJZCkge1xyXG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMucHJvamVjdHMuZmluZCgocCkgPT4gcC5pZCA9PT0gcHJvamVjdElkKTtcclxuICAgIHByb2plY3QucmVtb3ZlVGFzayh0YXNrSWQpO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgdG9nZ2xlVGFza0NvbXBsZXRlKHRhc2tJZCkge1xyXG4gICAgdGhpcy5hY3RpdmVQcm9qZWN0LnRhc2tzLmZpbmQoKHQpID0+IHQuaWQgPT09IHRhc2tJZCkudG9nZ2xlQ29tcGxldGVkKCk7XHJcbiAgICBzdG9yYWdlLnNhdmVQcm9qZWN0cyh0aGlzLnByb2plY3RzKTtcclxuICB9LFxyXG5cclxuICB0b2dnbGVUYXNrUHJpb3JpdHkodGFza0lkKSB7XHJcbiAgICB0aGlzLmFjdGl2ZVByb2plY3QudGFza3MuZmluZCgodCkgPT4gdC5pZCA9PT0gdGFza0lkKS50b2dnbGVQcmlvcml0eSgpO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgZGlzcGxheVByb2plY3RzQW5kVGFza3MoKSB7XHJcbiAgICAvLyA6Ojog0YLQtdGB0YJcclxuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwcm9qZWN0czpcIik7XHJcbiAgICB0aGlzLnByb2plY3RzLmZvckVhY2goKHByb2plY3QsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGAke2luZGV4ICsgMX0uICR7cHJvamVjdC50aXRsZX1gKTtcclxuXHJcbiAgICAgIHByb2plY3QudGFza3MuZm9yRWFjaCgodGFzaywgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgICAgJHtpbmRleCArIDF9LiAke3Rhc2sudGl0bGV9YCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IGFwcCBmcm9tIFwiLi9hcHBcIjtcclxuaW1wb3J0IGhhbmRsZXJzIGZyb20gXCIuL2hhbmRsZXJzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgaW5pdFVJKCkge1xyXG4gICAgdGhpcy5hdHRhY2hTeXN0ZW1MaXN0Q2xpY2tIYW5kbGVyKCk7XHJcbiAgICB0aGlzLnJlbmRlclByb2plY3RzKCk7XHJcbiAgICB0aGlzLnJlbmRlclRhc2tzKCk7XHJcbiAgICB0aGlzLmhpZ2hsaWdodEFjdGl2ZVByb2plY3QoKTtcclxuICAgIHRoaXMuaW5pdE1vZGFsSGFuZGxlcnMoKTtcclxuICB9LFxyXG5cclxuICByZW5kZXJQcm9qZWN0cygpIHtcclxuICAgIGNvbnN0IHByb2plY3RzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLXByb2plY3RzXCIpO1xyXG4gICAgcHJvamVjdHNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIGNvbnN0IHVzZXJQcm9qZWN0cyA9IGFwcC5wcm9qZWN0cy5maWx0ZXIoKHApID0+IHAuaWQgIT09IFwiaW5ib3hcIik7XHJcbiAgICB1c2VyUHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBwcm9qZWN0RWxlbWVudCA9IHRoaXMuY3JlYXRlUHJvamVjdEVsZW1lbnQocHJvamVjdCk7XHJcbiAgICAgIHByb2plY3RzQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2plY3RFbGVtZW50KTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZVByb2plY3RFbGVtZW50KHByb2plY3QpIHtcclxuICAgIGNvbnN0IHByb2plY3RUaXRsZSA9IHRoaXMuY3JlYXRlSHRtbEVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHByb2plY3QudGl0bGUpO1xyXG4gICAgY29uc3QgcHJvamVjdEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgcHJvamVjdEljb24uc3JjID0gXCJpbWFnZXMvdGFnLnN2Z1wiO1xyXG4gICAgY29uc3QgcHJvamVjdEVsZW1lbnQgPSB0aGlzLmNyZWF0ZUh0bWxFbGVtZW50KFwiYnV0dG9uXCIsIFwibmF2LWl0ZW1cIiwgW1xyXG4gICAgICBwcm9qZWN0SWNvbixcclxuICAgICAgcHJvamVjdFRpdGxlLFxyXG4gICAgXSk7XHJcbiAgICBwcm9qZWN0RWxlbWVudC5kYXRhc2V0LnByb2plY3RJZCA9IHByb2plY3QuaWQ7XHJcblxyXG4gICAgcHJvamVjdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgIGhhbmRsZXJzLnNldEFjdGl2ZVByb2plY3QocHJvamVjdC5pZClcclxuICAgICk7XHJcbiAgICByZXR1cm4gcHJvamVjdEVsZW1lbnQ7XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyVGFza3MoKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0SGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9qZWN0LW5hbWVcIik7XHJcbiAgICBwcm9qZWN0SGVhZGVyLnRleHRDb250ZW50ID0gYXBwLmFjdGl2ZVByb2plY3QudGl0bGU7XHJcbiAgICBjb25zdCB0YXNrc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFzay1saXN0XCIpO1xyXG4gICAgdGFza3NDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIGFwcC5hY3RpdmVQcm9qZWN0LnRhc2tzLmZvckVhY2goKHRhc2spID0+IHtcclxuICAgICAgY29uc3QgdGFza0VsZW1lbnQgPSB0aGlzLmNyZWF0ZVRhc2tFbGVtZW50KHRhc2spO1xyXG4gICAgICB0YXNrc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0YXNrRWxlbWVudCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICBjcmVhdGVUYXNrRWxlbWVudCh0YXNrKSB7XHJcbiAgICBjb25zdCBpbXBvcnRhbnRCdG4gPSB0aGlzLmNyZWF0ZUltcG9ydGFudEJ1dHRvbih0YXNrKTtcclxuICAgIGNvbnN0IGNoZWNrYm94QnRuID0gdGhpcy5jcmVhdGVIdG1sRWxlbWVudChcImJ1dHRvblwiLCBcInRhc2stY2hlY2tib3hcIik7XHJcbiAgICBjb25zdCB0aXRsZVBhcmFncmFwaCA9IHRoaXMuY3JlYXRlSHRtbEVsZW1lbnQoXHJcbiAgICAgIFwicFwiLFxyXG4gICAgICBcInRhc2stdGl0bGVcIixcclxuICAgICAgdGFzay50aXRsZVxyXG4gICAgKTtcclxuICAgIGNvbnN0IHRhc2tJbmZvQ29udGFpbmVyID0gdGhpcy5jcmVhdGVIdG1sRWxlbWVudChcImRpdlwiLCBcInRhc2staW5mb1wiLCBbXHJcbiAgICAgIGNoZWNrYm94QnRuLFxyXG4gICAgICB0aXRsZVBhcmFncmFwaCxcclxuICAgIF0pO1xyXG4gICAgY29uc3QgdGFza0VsZW1lbnQgPSB0aGlzLmNyZWF0ZUh0bWxFbGVtZW50KFwiZGl2XCIsIFwidGFza1wiLCBbXHJcbiAgICAgIHRhc2tJbmZvQ29udGFpbmVyLFxyXG4gICAgICBpbXBvcnRhbnRCdG4sXHJcbiAgICBdKTtcclxuXHJcbiAgICB0aXRsZVBhcmFncmFwaC5jbGFzc0xpc3QudG9nZ2xlKFwiY29tcGxldGVkXCIsIHRhc2suY29tcGxldGVkKTtcclxuICAgIGNoZWNrYm94QnRuLmNsYXNzTGlzdC50b2dnbGUoXCJjaGVja2VkXCIsIHRhc2suY29tcGxldGVkKTtcclxuXHJcbiAgICBpZiAodGFzay5kdWVEYXRlKSB7XHJcbiAgICAgIGNvbnN0IGR1ZURhdGVJbmZvID0gdGhpcy5jcmVhdGVIdG1sRWxlbWVudChcclxuICAgICAgICBcInNwYW5cIixcclxuICAgICAgICBcInRhc2stZGF0ZVwiLFxyXG4gICAgICAgIHRhc2suZHVlRGF0ZSAvLyAqKiog0YQg0LTQu9GPINC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0YTQvtGA0LzQsNGC0LAg0LTQsNGC0YtcclxuICAgICAgKTtcclxuICAgICAgdGFza0luZm9Db250YWluZXIuYXBwZW5kQ2hpbGQoZHVlRGF0ZUluZm8pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRhc2suZGVzY3JpcHRpb24pIHtcclxuICAgICAgY29uc3QgZGVzY3JpcHRpb25JY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgZGVzY3JpcHRpb25JY29uLnNyYyA9IFwiaW1hZ2VzL25vdGUuc3ZnXCI7XHJcbiAgICAgIHRhc2tJbmZvQ29udGFpbmVyLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uSWNvbik7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tib3hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgIGhhbmRsZXJzLnRvZ2dsZVRhc2tDb21wbGV0ZSh0YXNrLmlkKVxyXG4gICAgKTtcclxuICAgIHRhc2tFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcclxuICAgICAgaGFuZGxlcnMub3BlbkVkaXRUYXNrTW9kYWwoZXZlbnQsIHRhc2suaWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRhc2tFbGVtZW50O1xyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZUltcG9ydGFudEJ1dHRvbih0YXNrKSB7XHJcbiAgICBjb25zdCBidXR0b24gPSB0aGlzLmNyZWF0ZUh0bWxFbGVtZW50KFwiYnV0dG9uXCIsIFwiaW1wb3J0YW50LWJ0blwiKTtcclxuXHJcbiAgICBjb25zdCBpbXBvcnRhbnRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxyXG4gICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXHJcbiAgICAgIFwic3ZnXCJcclxuICAgICk7XHJcbiAgICBpbXBvcnRhbnRJY29uLnNldEF0dHJpYnV0ZShcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIik7XHJcbiAgICBpbXBvcnRhbnRJY29uLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBcIjI0XCIpO1xyXG4gICAgaW1wb3J0YW50SWNvbi5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjI0XCIpO1xyXG4gICAgaW1wb3J0YW50SWNvbi5jbGFzc0xpc3QuYWRkKFwiaW1wb3J0YW50LWljb25cIik7XHJcblxyXG4gICAgaWYgKHRhc2suaW1wb3J0YW50KSB7XHJcbiAgICAgIGltcG9ydGFudEljb24uc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCBcIjAgMCAyNCAyNFwiKTtcclxuICAgICAgaW1wb3J0YW50SWNvbi5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwiI2Y5MmU2NVwiKTtcclxuXHJcbiAgICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXHJcbiAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxyXG4gICAgICAgIFwicGF0aFwiXHJcbiAgICAgICk7XHJcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0wIDBoMjR2MjRIMHpcIik7XHJcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XHJcblxyXG4gICAgICBjb25zdCBmaWxsZWRQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxyXG4gICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcclxuICAgICAgICBcInBhdGhcIlxyXG4gICAgICApO1xyXG4gICAgICBmaWxsZWRQYXRoLnNldEF0dHJpYnV0ZShcclxuICAgICAgICBcImRcIixcclxuICAgICAgICBcIk0xMiAxNy4yNyAxOC4xOCAyMWwtMS42NC03LjAzTDIyIDkuMjRsLTcuMTktLjYxTDEyIDIgOS4xOSA4LjYzIDIgOS4yNGw1LjQ2IDQuNzNMNS44MiAyMXpcIlxyXG4gICAgICApO1xyXG5cclxuICAgICAgaW1wb3J0YW50SWNvbi5hcHBlbmQocGF0aCwgZmlsbGVkUGF0aCk7XHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZmlsbGVkXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW1wb3J0YW50SWNvbi5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAtOTYwIDk2MCA5NjBcIik7XHJcbiAgICAgIGltcG9ydGFudEljb24uc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIiM3NTc1NzVcIik7XHJcblxyXG4gICAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxyXG4gICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcclxuICAgICAgICBcInBhdGhcIlxyXG4gICAgICApO1xyXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcclxuICAgICAgICBcImRcIixcclxuICAgICAgICBcIm0zNTQtMjQ3IDEyNi03NiAxMjYgNzctMzMtMTQ0IDExMS05Ni0xNDYtMTMtNTgtMTM2LTU4IDEzNS0xNDYgMTMgMTExIDk3LTMzIDE0M1pNMjMzLTgwbDY1LTI4MUw4MC01NTBsMjg4LTI1IDExMi0yNjUgMTEyIDI2NSAyODggMjUtMjE4IDE4OSA2NSAyODEtMjQ3LTE0OUwyMzMtODBabTI0Ny0zNTBaXCJcclxuICAgICAgKTtcclxuICAgICAgaW1wb3J0YW50SWNvbi5hcHBlbmRDaGlsZChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQoaW1wb3J0YW50SWNvbik7XHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgIGhhbmRsZXJzLnRvZ2dsZVRhc2tQcmlvcml0eSh0YXNrLmlkKVxyXG4gICAgKTtcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlSHRtbEVsZW1lbnQodHlwZSwgY2xhc3NlcywgY29udGVudCkge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XHJcblxyXG4gICAgaWYgKGNsYXNzZXMpIHtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2xhc3NlcykpIHtcclxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzZXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbnRlbnQpIHtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29udGVudCkpIHtcclxuICAgICAgICBjb250ZW50LmZvckVhY2goKGNoaWxkKSA9PiB7XHJcbiAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfSxcclxuXHJcbiAgaGlnaGxpZ2h0QWN0aXZlUHJvamVjdCgpIHtcclxuICAgIGFwcC5wcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHByb2plY3RJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBgW2RhdGEtcHJvamVjdC1pZD1cIiR7cHJvamVjdC5pZH1cIl1gXHJcbiAgICAgICk7XHJcbiAgICAgIGlmIChwcm9qZWN0LmlkID09PSBhcHAuYWN0aXZlUHJvamVjdC5pZCkge1xyXG4gICAgICAgIHByb2plY3RJdGVtLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJvamVjdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyDQtNC+0L8g0LvQvtCz0LjQutCwINC00LvRjyDQsdCw0LfQvtCy0YvRhSDRgdC/0LjRgdC60L7QsiA6OjpcclxuICB9LFxyXG5cclxuICBhdHRhY2hTeXN0ZW1MaXN0Q2xpY2tIYW5kbGVyKCkge1xyXG4gICAgY29uc3QgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdi1pdGVtXCIpO1xyXG4gICAgbmF2SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgaGFuZGxlcnMuc2V0QWN0aXZlUHJvamVjdChpdGVtLmRhdGFzZXQucHJvamVjdElkKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICBpbml0TW9kYWxIYW5kbGVycygpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4ge1xyXG4gICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiKSB7XHJcbiAgICAgICAgaGFuZGxlcnMuY2xvc2VNb2RhbHMoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsJyk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIG1vZGFscy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGl0ZW0pIHtcclxuICAgICAgICAgIGhhbmRsZXJzLmNsb3NlTW9kYWxzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vZGFsLWNhbmNlbFwiKTtcclxuICAgIGNhbmNlbEJ1dHRvbnMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgaGFuZGxlcnMuY2xvc2VNb2RhbHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzdWJtaXRCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tb2RhbC1zdWJtaXRcIik7XHJcbiAgICBzdWJtaXRCdXR0b25zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGhhbmRsZXJzLmNsb3NlTW9kYWxzKCk7XHJcbiAgICAgICAgLy8gOjo6INC70L7Qs9C40LrQsCDQtNC70Y8g0L7QsdGA0LDQsdC+0YLQutC4INC00LDQvdC90YvRhSDQuNC3INGE0L7RgNC80YtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgYXBwIGZyb20gXCIuL2FwcFwiO1xyXG5pbXBvcnQgZG9tIGZyb20gXCIuL2RvbVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHNldEFjdGl2ZVByb2plY3QocHJvamVjdElkKSB7XHJcbiAgICBhcHAuc2V0QWN0aXZlUHJvamVjdChwcm9qZWN0SWQpO1xyXG4gICAgZG9tLmhpZ2hsaWdodEFjdGl2ZVByb2plY3QoKTtcclxuICAgIGRvbS5yZW5kZXJUYXNrcygpO1xyXG4gIH0sXHJcblxyXG4gIHRvZ2dsZVRhc2tDb21wbGV0ZSh0YXNrSWQpIHtcclxuICAgIGFwcC50b2dnbGVUYXNrQ29tcGxldGUodGFza0lkKTtcclxuICAgIGRvbS5yZW5kZXJUYXNrcygpO1xyXG4gIH0sXHJcblxyXG4gIHRvZ2dsZVRhc2tQcmlvcml0eSh0YXNrSWQpIHtcclxuICAgIGFwcC50b2dnbGVUYXNrUHJpb3JpdHkodGFza0lkKTtcclxuICAgIGRvbS5yZW5kZXJUYXNrcygpO1xyXG4gIH0sXHJcblxyXG4gIG9wZW5FZGl0VGFza01vZGFsKGV2ZW50LCB0YXNrSWQpIHtcclxuICAgIGlmIChcclxuICAgICAgIWV2ZW50LnRhcmdldC5jbG9zZXN0KFwiLmltcG9ydGFudC1idG5cIikgJiZcclxuICAgICAgIWV2ZW50LnRhcmdldC5jbG9zZXN0KFwiLnRhc2stY2hlY2tib3hcIilcclxuICAgICkge1xyXG4gICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFzay1tb2RhbFwiKTtcclxuICAgICAgY29uc3QgdGFzayA9IGFwcC5hY3RpdmVQcm9qZWN0LnRhc2tzLmZpbmQoKHQpID0+IHQuaWQgPT09IHRhc2tJZCk7XHJcbiAgICAgIHRoaXMub3Blbk1vZGFsKG1vZGFsKTtcclxuXHJcbiAgICAgIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtdGl0bGVcIikudGV4dENvbnRlbnQgPSBcIkVkaXQgdGFza1wiO1xyXG4gICAgICBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLXN1Ym1pdFwiKS50ZXh0Q29udGVudCA9IFwiRWRpdFwiO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcm0tdGFzay10aXRsZVwiKS52YWx1ZSA9IHRhc2sudGl0bGU7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybS10YXNrLWRlc2NyaXB0aW9uXCIpLnZhbHVlID0gdGFzay5kZXNjcmlwdGlvbjtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXRhc2stZGF0ZVwiKS50ZXh0Q29udGVudCA9IHRhc2suZHVlRGF0ZTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBvcGVuTW9kYWwoZWxlbWVudCkge1xyXG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIikuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgxKVwiO1xyXG4gICAgfSwgNTApO1xyXG4gIH0sXHJcblxyXG4gIGNsb3NlTW9kYWxzKCkge1xyXG4gICAgY29uc3QgbW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tb2RhbFwiKTtcclxuICAgIG1vZGFscy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaXRlbS5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIikuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgwKVwiO1xyXG4gICAgICB9LCA1MCk7XHJcbiAgICB9KTtcclxuICAgIC8vIDo6OiDRgdGC0LjQu9GMINC30LDQutGA0YvRgtC40Y8g0L3QtSDRgNCw0LHQvtGC0LDQtdGCXHJcblxyXG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tdGFzay10aXRsZScpLnZhbHVlID0gJyc7XHJcbiAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS10YXNrLWRlc2NyaXB0aW9uJykudmFsdWUgPSAnJztcclxuICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLXRhc2stZGF0ZScpLnZhbHVlID0gJyc7XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IHsgdjEgYXMgdXVpZHYxIH0gZnJvbSBcInV1aWRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3Qge1xyXG4gIGNvbnN0cnVjdG9yKHRpdGxlKSB7XHJcbiAgICB0aGlzLmlkID0gdXVpZHYxKCkuc3BsaXQoJy0nKVswXTtcclxuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgIHRoaXMudGFza3MgPSBbXTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVRpdGxlKG5ld1RpdGxlKSB7XHJcbiAgICB0aGlzLnRpdGxlID0gbmV3VGl0bGU7XHJcbiAgfVxyXG5cclxuICBhZGRUYXNrKHRhc2spIHtcclxuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVRhc2sodGFza0lkKSB7XHJcbiAgICB0aGlzLnRhc2tzID0gdGhpcy50YXNrcy5maWx0ZXIoKHRhc2spID0+IHRhc2suaWQgIT09IHRhc2tJZCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBQcm9qZWN0IGZyb20gXCIuL3Byb2plY3RcIjtcclxuaW1wb3J0IFRhc2sgZnJvbSBcIi4vdGFza1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGdldFByb2plY3RzKCkge1xyXG4gICAgY29uc3QgcHJvamVjdHNGcm9tRGF0YSA9IHRoaXMubG9hZFByb2plY3RzKCk7XHJcbiAgICByZXR1cm4gcHJvamVjdHNGcm9tRGF0YS5tYXAodGhpcy5jcmVhdGVQcm9qZWN0RnJvbURhdGEuYmluZCh0aGlzKSk7XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlUHJvamVjdEZyb21EYXRhKHByb2plY3REYXRhKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IFByb2plY3QocHJvamVjdERhdGEudGl0bGUpO1xyXG4gICAgcHJvamVjdC5pZCA9IHByb2plY3REYXRhLmlkO1xyXG4gICAgaWYgKHByb2plY3REYXRhLnRhc2tzLmxlbmd0aCkge1xyXG4gICAgICBwcm9qZWN0LnRhc2tzID0gcHJvamVjdERhdGEudGFza3MubWFwKHRoaXMuY3JlYXRlVGFza0Zyb21EYXRhKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcm9qZWN0O1xyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZVRhc2tGcm9tRGF0YSh0YXNrRGF0YSkge1xyXG4gICAgY29uc3QgdGFzayA9IG5ldyBUYXNrKFxyXG4gICAgICB0YXNrRGF0YS5wcm9qZWN0SWQsXHJcbiAgICAgIHRhc2tEYXRhLnRpdGxlLFxyXG4gICAgICB0YXNrRGF0YS5kZXNjcmlwdGlvbixcclxuICAgICAgdGFza0RhdGEuZHVlRGF0ZVxyXG4gICAgKTtcclxuICAgIHRhc2suaWQgPSB0YXNrRGF0YS5pZDtcclxuICAgIHRhc2suaW1wb3J0YW50ID0gdGFza0RhdGEuaW1wb3J0YW50O1xyXG4gICAgdGFzay5jb21wbGV0ZWQgPSB0YXNrRGF0YS5jb21wbGV0ZWQ7XHJcbiAgICByZXR1cm4gdGFzaztcclxuICB9LFxyXG5cclxuICBsb2FkUHJvamVjdHMoKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0c0RhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInByb2plY3RzXCIpO1xyXG4gICAgcmV0dXJuIHByb2plY3RzRGF0YSA/IEpTT04ucGFyc2UocHJvamVjdHNEYXRhKSA6IFtdO1xyXG4gIH0sXHJcblxyXG4gIHNhdmVQcm9qZWN0cyhwcm9qZWN0cykge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcm9qZWN0c1wiLCBKU09OLnN0cmluZ2lmeShwcm9qZWN0cykpO1xyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCB7IHYxIGFzIHV1aWR2MSB9IGZyb20gXCJ1dWlkXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYXNrIHtcclxuICBjb25zdHJ1Y3Rvcihwcm9qZWN0SWQsIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSkge1xyXG4gICAgdGhpcy5pZCA9IHV1aWR2MSgpLnNwbGl0KCctJylbMF07XHJcbiAgICB0aGlzLnByb2plY3RJZCA9IHByb2plY3RJZDtcclxuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XHJcbiAgICB0aGlzLmltcG9ydGFudCA9IGZhbHNlO1xyXG4gICAgdGhpcy5jb21wbGV0ZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUNvbXBsZXRlZCgpIHtcclxuICAgIHRoaXMuY29tcGxldGVkID0gIXRoaXMuY29tcGxldGVkO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlUHJpb3JpdHkoKSB7XHJcbiAgICB0aGlzLmltcG9ydGFudCA9ICF0aGlzLmltcG9ydGFudDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVRpdGxlKHRpdGxlKSB7XHJcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRHVlRGF0ZShkdWVEYXRlKSB7XHJcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBhcHAgZnJvbSBcIi4vYXBwXCI7XHJcbmltcG9ydCBkb20gZnJvbSBcIi4vZG9tXCI7XHJcblxyXG5hcHAuaW5pdFRvZG8oKTtcclxuZG9tLmluaXRVSSgpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=