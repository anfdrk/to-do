/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/uuid/dist/esm-browser/native.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/native.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  randomUUID
});

/***/ }),

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

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ "./node_modules/uuid/dist/esm-browser/native.js");
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");




function v4(options, buf, offset) {
  if (_native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID && !buf && !options) {
    return _native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

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

    // дописать логику для today и пр. ***
  },

  addProject(title) {
    const newProject = new _project__WEBPACK_IMPORTED_MODULE_1__["default"](title);
    this.projects.push(newProject);
    _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveProjects(this.projects);
  },

  addTaskToProject(projectId, title, description, dueDate) {
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
    const projectElement = document.createElement("button");
    const projectIcon = document.createElement("img");
    const projectTitle = document.createElement("span");
    projectIcon.src = "images/tag.svg";
    projectTitle.textContent = project.title;
    projectElement.append(projectIcon, projectTitle);
    projectElement.classList.add("nav-item");
    projectElement.addEventListener("click", () =>
      _handlers__WEBPACK_IMPORTED_MODULE_1__["default"].setActiveProject(project.id)
    );
    return projectElement;
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setActiveProject(projectId) {
    _app__WEBPACK_IMPORTED_MODULE_0__["default"].setActiveProject(projectId);
    // *** остальная логика
  }
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
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");


class Project {
  constructor(title) {
    this.id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])();
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
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");


class Task {
  constructor(projectId, title, description, dueDate) {
    this.id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])();
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
// app.addTaskToProject('inbox', 'ye');
// app.removeTask('inbox', 'bf475022-3d5c-437e-a772-6a61c05821ba');
_app__WEBPACK_IMPORTED_MODULE_0__["default"].displayProjectsAndTasks();
_dom__WEBPACK_IMPORTED_MODULE_1__["default"].renderProjects();



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0EsaUVBQWU7QUFDZjtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDSEQsaUVBQWUsY0FBYyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxHQUFHLHlDQUF5Qzs7Ozs7Ozs7Ozs7Ozs7QUNBcEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2pCcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsZ0JBQWdCLFNBQVM7QUFDekI7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU8sd0RBQVE7QUFDZjtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQ1M7QUFDTjtBQUNzQjs7QUFFakQ7QUFDQSxNQUFNLGtEQUFNO0FBQ1osV0FBVyxrREFBTTtBQUNqQjs7QUFFQTtBQUNBLGlEQUFpRCwrQ0FBRyxLQUFLOztBQUV6RDtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsU0FBUyw4REFBZTtBQUN4Qjs7QUFFQSxpRUFBZSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7QUM1QmM7O0FBRS9CO0FBQ0EscUNBQXFDLGlEQUFLO0FBQzFDOztBQUVBLGlFQUFlLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTlM7QUFDQTtBQUNOO0FBQzFCO0FBQ0EsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnREFBTztBQUMzQjtBQUNBO0FBQ0Esd0JBQXdCLGdEQUFPO0FBQy9CO0FBQ0E7QUFDQSxNQUFNLGdEQUFPO0FBQ2I7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQU87QUFDbEM7QUFDQSxJQUFJLGdEQUFPO0FBQ1gsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw2Q0FBSTtBQUM1QjtBQUNBLElBQUksZ0RBQU87QUFDWCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnREFBTztBQUNYLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0RBQU87QUFDWCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixVQUFVLElBQUksY0FBYztBQUNqRDtBQUNBO0FBQ0EsMEJBQTBCLFVBQVUsSUFBSSxXQUFXO0FBQ25ELE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RHNCO0FBQ1U7QUFDbEM7QUFDQSxpRUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qiw0Q0FBRztBQUM1QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxpREFBUTtBQUNkO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0JzQjtBQUN4QjtBQUNBLGlFQUFlO0FBQ2Y7QUFDQSxJQUFJLDRDQUFHO0FBQ1A7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ1BtQztBQUNwQztBQUNlO0FBQ2Y7QUFDQSxjQUFjLGdEQUFNO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCZ0M7QUFDTjtBQUMxQjtBQUNBLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx3QkFBd0IsZ0RBQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EscUJBQXFCLDZDQUFJO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkNrQztBQUNwQztBQUNlO0FBQ2Y7QUFDQSxjQUFjLGdEQUFNO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDaENBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTndCO0FBQ0E7QUFDeEI7QUFDQSw0Q0FBRztBQUNIO0FBQ0E7QUFDQSw0Q0FBRztBQUNILDRDQUFHO0FBQ0g7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL25hdGl2ZS5qcyIsIndlYnBhY2s6Ly90b2RvLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly90b2RvLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL3RvZG8vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL3RvZG8vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvaGFuZGxlcnMuanMiLCJ3ZWJwYWNrOi8vdG9kby8uL3NyYy9wcm9qZWN0LmpzIiwid2VicGFjazovL3RvZG8vLi9zcmMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90b2RvLy4vc3JjL3Rhc2suanMiLCJ3ZWJwYWNrOi8vdG9kby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmFuZG9tVVVJRCA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5yYW5kb21VVUlEICYmIGNyeXB0by5yYW5kb21VVUlELmJpbmQoY3J5cHRvKTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmFuZG9tVVVJRFxufTsiLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG5sZXQgZ2V0UmFuZG9tVmFsdWVzO1xuY29uc3Qgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxuY29uc3QgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIHJldHVybiBieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFyciwgb2Zmc2V0ID0gMCkge1xuICBjb25zdCB1dWlkID0gdW5zYWZlU3RyaW5naWZ5KGFyciwgb2Zmc2V0KTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgbmF0aXZlIGZyb20gJy4vbmF0aXZlLmpzJztcbmltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHsgdW5zYWZlU3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBpZiAobmF0aXZlLnJhbmRvbVVVSUQgJiYgIWJ1ZiAmJiAhb3B0aW9ucykge1xuICAgIHJldHVybiBuYXRpdmUucmFuZG9tVVVJRCgpO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gdW5zYWZlU3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCJpbXBvcnQgc3RvcmFnZSBmcm9tIFwiLi9zdG9yYWdlXCI7XHJcbmltcG9ydCBQcm9qZWN0IGZyb20gXCIuL3Byb2plY3RcIjtcclxuaW1wb3J0IFRhc2sgZnJvbSBcIi4vdGFza1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHByb2plY3RzOiBbXSxcclxuICBhY3RpdmVQcm9qZWN0OiBudWxsLFxyXG5cclxuICBpbml0VG9kbygpIHtcclxuICAgIHRoaXMucHJvamVjdHMgPSBzdG9yYWdlLmdldFByb2plY3RzKCk7XHJcbiAgICBjb25zdCBpbmJveEV4aXN0cyA9IHRoaXMucHJvamVjdHMuc29tZSgocCkgPT4gcC5pZCA9PT0gXCJpbmJveFwiKTtcclxuICAgIGlmICghaW5ib3hFeGlzdHMpIHtcclxuICAgICAgY29uc3QgaW5ib3ggPSBuZXcgUHJvamVjdChcIkluYm94XCIpO1xyXG4gICAgICBpbmJveC5pZCA9IFwiaW5ib3hcIjtcclxuICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKGluYm94KTtcclxuICAgICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldEFjdGl2ZVByb2plY3QoXCJpbmJveFwiKTtcclxuICB9LFxyXG5cclxuICBzZXRBY3RpdmVQcm9qZWN0KHByb2plY3RJZCkge1xyXG4gICAgdGhpcy5hY3RpdmVQcm9qZWN0ID0gdGhpcy5wcm9qZWN0cy5maW5kKChwKSA9PiBwLmlkID09PSBwcm9qZWN0SWQpO1xyXG5cclxuICAgIC8vINC00L7Qv9C40YHQsNGC0Ywg0LvQvtCz0LjQutGDINC00LvRjyB0b2RheSDQuCDQv9GALiAqKipcclxuICB9LFxyXG5cclxuICBhZGRQcm9qZWN0KHRpdGxlKSB7XHJcbiAgICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IFByb2plY3QodGl0bGUpO1xyXG4gICAgdGhpcy5wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgYWRkVGFza1RvUHJvamVjdChwcm9qZWN0SWQsIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSkge1xyXG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMucHJvamVjdHMuZmluZCgocCkgPT4gcC5pZCA9PT0gcHJvamVjdElkKTtcclxuICAgIGNvbnN0IG5ld1Rhc2sgPSBuZXcgVGFzayhwcm9qZWN0SWQsIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSk7XHJcbiAgICBwcm9qZWN0LmFkZFRhc2sobmV3VGFzayk7XHJcbiAgICBzdG9yYWdlLnNhdmVQcm9qZWN0cyh0aGlzLnByb2plY3RzKTtcclxuICB9LFxyXG5cclxuICByZW1vdmVQcm9qZWN0KHByb2plY3RJZCkge1xyXG4gICAgdGhpcy5wcm9qZWN0cyA9IHRoaXMucHJvamVjdHMuZmlsdGVyKChwKSA9PiBwLmlkICE9PSBwcm9qZWN0SWQpO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlVGFzayhwcm9qZWN0SWQsIHRhc2tJZCkge1xyXG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMucHJvamVjdHMuZmluZCgocCkgPT4gcC5pZCA9PT0gcHJvamVjdElkKTtcclxuICAgIHByb2plY3QucmVtb3ZlVGFzayh0YXNrSWQpO1xyXG4gICAgc3RvcmFnZS5zYXZlUHJvamVjdHModGhpcy5wcm9qZWN0cyk7XHJcbiAgfSxcclxuXHJcbiAgZGlzcGxheVByb2plY3RzQW5kVGFza3MoKSB7XHJcbiAgICAvLyA6Ojog0YLQtdGB0YJcclxuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwcm9qZWN0czpcIik7XHJcbiAgICB0aGlzLnByb2plY3RzLmZvckVhY2goKHByb2plY3QsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGAke2luZGV4ICsgMX0uICR7cHJvamVjdC50aXRsZX1gKTtcclxuXHJcbiAgICAgIHByb2plY3QudGFza3MuZm9yRWFjaCgodGFzaywgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgICAgJHtpbmRleCArIDF9LiAke3Rhc2sudGl0bGV9YCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IGFwcCBmcm9tIFwiLi9hcHBcIjtcclxuaW1wb3J0IGhhbmRsZXJzIGZyb20gXCIuL2hhbmRsZXJzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgcmVuZGVyUHJvamVjdHMoKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1wcm9qZWN0c1wiKTtcclxuICAgIHByb2plY3RzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBjb25zdCB1c2VyUHJvamVjdHMgPSBhcHAucHJvamVjdHMuZmlsdGVyKChwKSA9PiBwLmlkICE9PSBcImluYm94XCIpO1xyXG4gICAgdXNlclByb2plY3RzLmZvckVhY2goKHByb2plY3QpID0+IHtcclxuICAgICAgY29uc3QgcHJvamVjdEVsZW1lbnQgPSB0aGlzLmNyZWF0ZVByb2plY3RFbGVtZW50KHByb2plY3QpO1xyXG4gICAgICBwcm9qZWN0c0NvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9qZWN0RWxlbWVudCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICBjcmVhdGVQcm9qZWN0RWxlbWVudChwcm9qZWN0KSB7XHJcbiAgICBjb25zdCBwcm9qZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBjb25zdCBwcm9qZWN0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICBjb25zdCBwcm9qZWN0VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHByb2plY3RJY29uLnNyYyA9IFwiaW1hZ2VzL3RhZy5zdmdcIjtcclxuICAgIHByb2plY3RUaXRsZS50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XHJcbiAgICBwcm9qZWN0RWxlbWVudC5hcHBlbmQocHJvamVjdEljb24sIHByb2plY3RUaXRsZSk7XHJcbiAgICBwcm9qZWN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibmF2LWl0ZW1cIik7XHJcbiAgICBwcm9qZWN0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgaGFuZGxlcnMuc2V0QWN0aXZlUHJvamVjdChwcm9qZWN0LmlkKVxyXG4gICAgKTtcclxuICAgIHJldHVybiBwcm9qZWN0RWxlbWVudDtcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgYXBwIGZyb20gXCIuL2FwcFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHNldEFjdGl2ZVByb2plY3QocHJvamVjdElkKSB7XHJcbiAgICBhcHAuc2V0QWN0aXZlUHJvamVjdChwcm9qZWN0SWQpO1xyXG4gICAgLy8gKioqINC+0YHRgtCw0LvRjNC90LDRjyDQu9C+0LPQuNC60LBcclxuICB9XHJcbn07IiwiaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSBcInV1aWRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3Qge1xyXG4gIGNvbnN0cnVjdG9yKHRpdGxlKSB7XHJcbiAgICB0aGlzLmlkID0gdXVpZHY0KCk7XHJcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICB0aGlzLnRhc2tzID0gW107XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUaXRsZShuZXdUaXRsZSkge1xyXG4gICAgdGhpcy50aXRsZSA9IG5ld1RpdGxlO1xyXG4gIH1cclxuXHJcbiAgYWRkVGFzayh0YXNrKSB7XHJcbiAgICB0aGlzLnRhc2tzLnB1c2godGFzayk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVUYXNrKHRhc2tJZCkge1xyXG4gICAgdGhpcy50YXNrcyA9IHRoaXMudGFza3MuZmlsdGVyKCh0YXNrKSA9PiB0YXNrLmlkICE9PSB0YXNrSWQpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi9wcm9qZWN0XCI7XHJcbmltcG9ydCBUYXNrIGZyb20gXCIuL3Rhc2tcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBnZXRQcm9qZWN0cygpIHtcclxuICAgIGNvbnN0IHByb2plY3RzRnJvbURhdGEgPSB0aGlzLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgcmV0dXJuIHByb2plY3RzRnJvbURhdGEubWFwKHRoaXMuY3JlYXRlUHJvamVjdEZyb21EYXRhLmJpbmQodGhpcykpO1xyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZVByb2plY3RGcm9tRGF0YShwcm9qZWN0RGF0YSkge1xyXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBQcm9qZWN0KHByb2plY3REYXRhLnRpdGxlKTtcclxuICAgIHByb2plY3QuaWQgPSBwcm9qZWN0RGF0YS5pZDtcclxuICAgIGlmIChwcm9qZWN0RGF0YS50YXNrcy5sZW5ndGgpIHtcclxuICAgICAgcHJvamVjdC50YXNrcyA9IHByb2plY3REYXRhLnRhc2tzLm1hcCh0aGlzLmNyZWF0ZVRhc2tGcm9tRGF0YSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJvamVjdDtcclxuICB9LFxyXG5cclxuICBjcmVhdGVUYXNrRnJvbURhdGEodGFza0RhdGEpIHtcclxuICAgIGNvbnN0IHRhc2sgPSBuZXcgVGFzayhcclxuICAgICAgdGFza0RhdGEucHJvamVjdElkLFxyXG4gICAgICB0YXNrRGF0YS50aXRsZSxcclxuICAgICAgdGFza0RhdGEuZGVzY3JpcHRpb24sXHJcbiAgICAgIHRhc2tEYXRhLmR1ZURhdGVcclxuICAgICk7XHJcbiAgICB0YXNrLmlkID0gdGFza0RhdGEuaWQ7XHJcbiAgICB0YXNrLmltcG9ydGFudCA9IHRhc2tEYXRhLmltcG9ydGFudDtcclxuICAgIHRhc2suY29tcGxldGVkID0gdGFza0RhdGEuY29tcGxldGVkO1xyXG4gICAgcmV0dXJuIHRhc2s7XHJcbiAgfSxcclxuXHJcbiAgbG9hZFByb2plY3RzKCkge1xyXG4gICAgY29uc3QgcHJvamVjdHNEYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwcm9qZWN0c1wiKTtcclxuICAgIHJldHVybiBwcm9qZWN0c0RhdGEgPyBKU09OLnBhcnNlKHByb2plY3RzRGF0YSkgOiBbXTtcclxuICB9LFxyXG5cclxuICBzYXZlUHJvamVjdHMocHJvamVjdHMpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJvamVjdHNcIiwgSlNPTi5zdHJpbmdpZnkocHJvamVjdHMpKTtcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tIFwidXVpZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFzayB7XHJcbiAgY29uc3RydWN0b3IocHJvamVjdElkLCB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUpIHtcclxuICAgIHRoaXMuaWQgPSB1dWlkdjQoKTtcclxuICAgIHRoaXMucHJvamVjdElkID0gcHJvamVjdElkO1xyXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcclxuICAgIHRoaXMuaW1wb3J0YW50ID0gZmFsc2U7XHJcbiAgICB0aGlzLmNvbXBsZXRlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQ29tcGxldGVkKCkge1xyXG4gICAgdGhpcy5jb21wbGV0ZWQgPSAhdGhpcy5jb21wbGV0ZWQ7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVQcmlvcml0eSgpIHtcclxuICAgIHRoaXMuaW1wb3J0YW50ID0gIXRoaXMuaW1wb3J0YW50O1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlVGl0bGUodGl0bGUpIHtcclxuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEdWVEYXRlKGR1ZURhdGUpIHtcclxuICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGFwcCBmcm9tIFwiLi9hcHBcIjtcclxuaW1wb3J0IGRvbSBmcm9tIFwiLi9kb21cIjtcclxuXHJcbmFwcC5pbml0VG9kbygpO1xyXG4vLyBhcHAuYWRkVGFza1RvUHJvamVjdCgnaW5ib3gnLCAneWUnKTtcclxuLy8gYXBwLnJlbW92ZVRhc2soJ2luYm94JywgJ2JmNDc1MDIyLTNkNWMtNDM3ZS1hNzcyLTZhNjFjMDU4MjFiYScpO1xyXG5hcHAuZGlzcGxheVByb2plY3RzQW5kVGFza3MoKTtcclxuZG9tLnJlbmRlclByb2plY3RzKCk7XHJcblxyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9