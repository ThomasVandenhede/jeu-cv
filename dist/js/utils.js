/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/utils.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/utils.js":
/*!*********************!*\
  !*** ./js/utils.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  toFixedPrecision: function(number, precision) {
    return +number.toFixed(precision || 0);
  },

  noop: function() {},

  randInt: function(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
  },

  lerp: function(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  },

  show: function(el) {
    el.classList.remove("hidden");
  },

  hide: function(el) {
    el.classList.add("hidden");
  },

  incrementID: (function() {
    var id = -1;
    return function() {
      id = id + 1;
      return id;
    };
  })(),

  h: function(type, props, children) {
    var el = document.createElement(type);
    var nodes, node;
    for (var key in props) {
      el.setAttribute(key, props[key]);
    }
    if (Array.isArray(children)) {
      nodes = children;
    } else {
      nodes = [children];
    }
    for (var i = 0; i < nodes.length; i++) {
      if (typeof nodes[i] === "string") {
        node = document.createTextNode(nodes[i]);
      } else {
        node = nodes[i];
      }
      el.appendChild(node);
    }
    return el;
  },

  /**
   * Build DOM from virtual DOM tree.
   * @param {Object} dom
   */
  render: function(vdom) {
    return (function renderNode(vdom) {
      if (vdom.split) return document.createTextNode(vdom);

      const element = document.createElement(vdom.type);
      const props = vdom.props || {};

      Object.keys(props).forEach(function(key) {
        // treat events separately
        if (typeof props[key] !== "function") {
          element.setAttribute(key, props[key]);
        }

        // events
        if (typeof props[key] === "function") {
          var eventType = key.substring(2); // remove the 'on' part
          element.addEventListener(eventType, props[key]);
        }
      });

      (vdom.children || []).forEach(function(vNode) {
        return element.appendChild(renderNode(vNode));
      });
      return element;
    })(vdom);
  },

  h: function() {
    var vNode = {};
    var type = arguments[0];
    var props = arguments[1];
    var children = Array.prototype.slice.call(arguments, 2);

    vNode.type = type;
    vNode.props = props;

    if (children.length) {
      vNode.children = children.reduce((acc, item) => {
        return Array.isArray(item) ? [...acc, ...item] : [...acc, item];
      }, []);
    } else {
      vNode.children = null;
    }

    return vNode;
  },

  emptyElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
};


/***/ })

/******/ });
//# sourceMappingURL=utils.js.map