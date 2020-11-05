var ZY =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/createClass.js":
/*!*************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/createClass.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/defineProperty.js":
/*!****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!***********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazyload = lazyload;
exports.LSUser = LSUser;
exports.timingObject = timingObject;
exports.randomColor = randomColor;
exports.isMobile = isMobile;
exports.default = exports.ZY = exports.FloatBall = exports.LeftMenu = exports.Router = exports.Tip = exports.Inputer = exports.TR = exports.myAler = exports.myAler_defaultJson = void 0;

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "../node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "../node_modules/@babel/runtime/helpers/createClass.js"));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function lazyload() {
  var screenHeight = window.innerHeight || document.documentElement.clientHeight;

  function reload() {
    var imgs = document.querySelectorAll('img:not([src])');
    imgs.forEach(function (img) {
      var top = img.getBoundingClientRect().top;

      if (top > 0 && screenHeight - top >= 80) {
        img.src = img.dataset.src;
      }
    });
  }

  window.addEventListener('load', reload);
  document.onscroll = dedou(reload);

  function dedou(callback) {
    var timing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var freezing = false;
    return function () {
      if (freezing) return;
      freezing = true;
      setTimeout(function () {
        freezing = false;
      }, timing);
      callback.apply(void 0, arguments);
    };
  }
}

;

function LSUser() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'sporter';

  var base = function () {
    try {
      return JSON.parse(localStorage[key]);
    } catch (e) {
      return {};
    }
  }();

  var user = timingObject(base, function (target) {
    localStorage[key] = JSON.stringify(base);
  });
  return user;
}

function timingObject(object, onChange) {
  var handler = {
    get: function get(target, property, receiver) {
      try {
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty: function defineProperty(target, property, descriptor) {
      var res = Reflect.defineProperty(target, property, descriptor);
      onChange(object);
      return res;
    },
    deleteProperty: function deleteProperty(target, property) {
      var res = Reflect.deleteProperty(target, property);
      onChange(object);
      return res;
    }
  };
  return new Proxy(object, handler);
}

;
var myAler_defaultJson = {};
exports.myAler_defaultJson = myAler_defaultJson;

var myAler = function myAler() {
  var aler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'zy-aler';
  var defaultJson = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : myAler_defaultJson;
  var extre = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var body = document.body;
  return function () {
    var _this = this;

    var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultJson;
    var cb2 = arguments.length > 1 ? arguments[1] : undefined;

    var defaults = _objectSpread({}, this.__proto__.defaultJson, {}, defaultJson);

    if (typeof json == 'string') {
      this.json = defaults;
      this.json.text = json;
      this.json.callback = cb2 || defaults.callback;
    } else {
      this.json = _objectSpread({}, defaults, {}, json);
    }

    this.bool = false;
    var dom = document.createElement('div');
    dom.className = aler;
    var acover = document.createElement('div');
    acover.className = "zy-acover";
    acover.appendChild(dom);
    var atitle = document.createElement('div');
    atitle.innerText = this.json.title || 'title';
    atitle.className = 'title';
    dom.appendChild(atitle);
    var atext = document.createElement('div');
    atext.innerText = this.json.text || 'content';
    atext.className = 'text';
    dom.appendChild(atext);
    var abo1 = document.createElement('div');
    abo1.innerText = this.json.b1 || '确认';
    abo1.className = 'bo1';
    dom.appendChild(abo1);
    var abo2 = document.createElement('div');
    abo2.innerText = this.json.b2 || '取消';
    abo2.className = 'bo2';
    dom.appendChild(abo2);

    abo1.onclick = function () {
      _this.bool = true;

      _this.remove();
    };

    abo2.onclick = function () {
      _this.bool = false;

      _this.remove();
    };

    body.appendChild(acover);

    this.remove = function () {
      acover.remove();
      (_this.json.callback || function () {})(_this.bool);
    };

    this.cover = acover;
    this.aler = dom;
    this.text = atext;
    this.title = atitle;
    this.bo1 = abo1;
    this.bo2 = abo2;
    extre.call.apply(extre, [this].concat(Array.prototype.slice.call(arguments)));
  };
};

exports.myAler = myAler;
myAler.Question = myAler('zy-aler');
myAler.Loading = myAler('zy-aler zy-only');
myAler.Aler = myAler('zy-aler zy-maler');
var TR = {
  init: function init() {
    var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
    document.addEventListener('click', function (e) {
      var x = e.pageX,
          y = e.clientY;
      var dom = document.createElement('div');
      dom.className = 'zy-tr ' + className;
      dom.style.top = y + 'px';
      dom.style.left = x + 'px';
      dom.style.backgroundColor = randomColor();
      document.body.appendChild(dom);
      setTimeout(function () {
        dom.remove();
      }, 500);
    });
  }
};
exports.TR = TR;

function randomColor() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
}

var Inputer = myAler('zy-aler zy-inputer', {
  title: '请输入'
}, function () {
  var _this2 = this;

  this.title.innerText = this.json.text || this.json.title;
  this.input = this.json.textarea ? document.createElement('textarea') : document.createElement('input');
  var input = this.input;
  if (arguments[2]) input.value = arguments[2];
  input.className = 'zy-aler-input';

  input.onkeydown = function (_) {
    if (_.key == 'Enter') {
      _this2.bool = true;

      _this2.remove();
    }
  };

  this.aler.replaceChild(input, this.text);

  this.remove = function () {
    this.cover.remove();
    (this.json.callback || function () {})(this.bool, input.value);
  };

  input.focus();
});
exports.Inputer = Inputer;
var Tip = myAler('zy-aler zy-only zy-timer', {}, function () {
  var _this3 = this;

  setTimeout(function (n) {
    _this3.remove();
  }, 1000);
});
/**
 * 该版本所有router的path均视作不带#的 dom元素的path和target都要求没有#
 * 支持多层路由的实现！！！
 */

exports.Tip = Tip;

var Router = /*#__PURE__*/function () {
  (0, _createClass2.default)(Router, [{
    key: "default",
    value: function _default(path) {
      this.defaultPage = path;
      return this;
    }
  }, {
    key: "nowPath",
    value: function nowPath() {
      return Router.nowPaths[this.index];
    }
  }, {
    key: "prevent",
    value: function prevent(path) {
      var _this4 = this;

      var all = this;
      return function (newPreventer) {
        _this4.preventFunction[path] = newPreventer;
        return all;
      };
    }
  }, {
    key: "init",
    value: function init(path) {
      var _this5 = this;

      var all = this;
      return function (newIniter) {
        _this5.initFunction[path] = newIniter;
        return all;
      };
    }
  }, {
    key: "refresh",
    value: function refresh(path) {
      var _this6 = this;

      var all = this;
      return function (newRefresher) {
        _this6.refreshFunction[path] = newRefresher;
        return all;
      };
    }
  }, {
    key: "change",
    value: function change(path) {
      var _this7 = this;

      var all = this;
      return function (newChanger) {
        _this7.changeFunction[path] = newChanger;
        return all;
      };
    }
  }, {
    key: "disolve",
    value: function disolve(path) {
      var _this8 = this;

      var all = this;
      return function (newDisolver) {
        _this8.disolveFunction[path] = newDisolver;
        return all;
      };
    } //供Router内部调用的一系列函数

  }, {
    key: "preventer",
    value: function preventer(path) {
      try {
        return (this.preventFunction[path] || this.defaultPreventer)(path, this.data[path]);
      } catch (e) {
        Router.debuger('prevent false->', e);
      }
    }
  }, {
    key: "initer",
    value: function initer(path) {
      try {
        return (this.initFunction[path] || this.defaultIniter)(path, this.data[path]);
      } catch (e) {
        Router.debuger('init false->', e);
      }
    }
  }, {
    key: "refresher",
    value: function refresher(path) {
      try {
        return (this.refreshFunction[path] || this.defaultRefresher)(path, this.data[path]);
      } catch (e) {
        Router.debuger('refresh false->', e);
      }
    }
  }, {
    key: "changer",
    value: function changer(path) {
      try {
        return (this.changeFunction[path] || this.defaultChanger)(path, this.data[path]);
      } catch (e) {
        Router.debuger('change false->', e);
      }
    }
  }, {
    key: "disolver",
    value: function disolver(path) {
      try {
        return (this.disolveFunction[path] || this.defaultDisolver)(path, this.data[path]);
      } catch (e) {
        Router.debuger('disolve false->', e);
      }
    } //初始化router的基本信息

  }], [{
    key: "debuger",
    value: function debuger() {
      var _console;

      if (!this.debug) return;

      (_console = console).log.apply(_console, arguments);
    }
  }, {
    key: "init",
    value: function init() {
      this.INSTANCES = [];
      this.len = 0;
      this.index = this.nowPaths = [];
      this.exstate = false;
      this.stoNext = [];
      this.history = [];
    }
  }]);

  function Router(dom) {
    var _this9 = this;

    (0, _classCallCheck2.default)(this, Router);
    if (Router.len === undefined) Router.init();
    this.index = Router.len;
    Router.len = this.index + 1;
    this.rootDom = dom;
    this.page = {};
    this.data = {};
    this.defaultPage = 'main';

    this.defaultPreventer = function (p) {
      return false;
    };

    this.defaultIniter = function (p) {};

    this.defaultChanger = function (path) {
      return _this9.page[path].classList.remove('hide');
    };

    this.defaultRefresher = function (p) {};

    this.defaultDisolver = function (path) {
      return _this9.page[path].classList.add('hide');
    };

    this.preventFunction = {};
    this.changeFunction = {};
    this.initFunction = {};
    this.disolveFunction = {};
    this.refreshFunction = {};
    Router.INSTANCES.push(this);
  }

  (0, _createClass2.default)(Router, [{
    key: "use",
    value: function use(func) {
      func(this);
      return this;
    }
  }, {
    key: "checkPath",
    //检查path在该实例中的合法性
    value: function checkPath(path) {
      return this.page[path] !== undefined;
    } //检查整个hash的合法性

  }, {
    key: "getSinglePath",
    //从当前hash中得到当前router对应的path
    value: function getSinglePath() {
      try {
        return Router.nowPaths[this.index];
      } catch (e) {
        return null;
      }
    } //从前期router的path得到全局的location.hash

  }, {
    key: "setSinglePath",
    value: function setSinglePath(path) {
      try {
        var paths = Object.assign([], Router.nowPaths);
        paths[this.index] = path;
        return paths;
      } catch (e) {
        Router.debuger("!!! router err ".concat(e));
        return Router.nowPaths;
      }
    } //用于router的跳转 在外部调用

  }, {
    key: "to",
    value: function to(path) {
      if (!this.checkPath(path)) return Router.debuger('path false');
      Router.to(this.setSinglePath(path));
    } // static exstate = false;

  }], [{
    key: "page",
    value: function page(router) {
      var pages = router.rootDom.querySelectorAll('[path]');
      pages.forEach(function (page) {
        var path = page.attributes.path.value;
        router.page[path] = page;
        router.data[path] = {};
      });
    }
  }, {
    key: "state",
    value: function state(router) {
      router.page['show'] = router.rootDom;
      router.page['hide'] = router.rootDom;
    } //做完所有初始化后才能调用，完成页面hash层面的初始化

  }, {
    key: "run",
    value: function run() {
      this.initListen();
      var npath = location.hash || '#';
      var paths = this.path2arr(npath);
      var noOneChanged = true;

      for (var i = 0; i < this.len; i++) {
        if (!paths[i] || !this.INSTANCES[i].checkPath(paths[i])) {
          paths[i] = this.INSTANCES[i].defaultPage;
          noOneChanged = false;
        }
      }

      if (noOneChanged) Router.history.push(paths);
      this.INSTANCES.forEach(function (instance) {
        for (var key in instance.page) {
          instance.disolver(key);
        }
      });
      this.nowPaths = this.path2arr(location.hash);
      Router.to(paths); // location.hash = this.arr2path(paths);
      // this.history.push(paths);
      // this.nowPaths = paths;
    }
  }, {
    key: "checkPath",
    value: function checkPath(paths) {
      var _this10 = this;

      try {
        paths.forEach(function (path, index) {
          if (!_this10.INSTANCES[index].checkPath(path)) return false;
        });
        return true;
      } catch (e) {
        Router.debuger(e);
        return false;
      }
    } //初始化hash监听 

  }, {
    key: "initListen",
    value: function initListen() {
      var _this11 = this;

      this.INSTANCES.forEach(function (dom, index) {
        dom.rootDom.querySelectorAll('[target]').forEach(function (d) {
          var value = d.attributes.target.value;

          if (value.indexOf('.') === -1) {
            d.attributes.target.value = index + '.' + value;
          }
        });
      });
      document.addEventListener('click', function (e) {
        var dom = e.target;
        var target = dom.attributes.target;
        var back = dom.attributes.back;

        if (target) {
          var tar = target.value.split('.');
          Router.INSTANCES[tar[0]].to(tar[1]);
        } else if (back) {
          Router.back();
        }
      });

      window.onhashchange = function (e) {
        var nowHash = location.hash;

        var nowPaths = _this11.path2arr(nowHash);

        for (var index in _this11.stoNext) {
          try {
            // Router.debuger(Router.history[Router.history.length - 1][index]);
            Router.INSTANCES[index].disolver(Router.history[Router.history.length - 1][index]);
          } catch (e) {
            Router.debuger(e);
            Router.debuger('disover false, not important');
          }
        }

        if (nowHash === '#last' || nowHash === '#next') {
          Router.exstate = !Router.exstate;
          Router.debuger(Router.exstate, nowHash);

          if (Router.exstate === (nowHash === '#last')) {
            Router.debuger('back');
            history.go(-1);
          } else {
            // Router.debuger('next');
            // Router.debuger(Router.stoNext2path(this.stoNext));
            location.hash = Router.stoNext2path(_this11.stoNext);
          }

          return;
        }

        try {
          _this11.getChanged(nowPaths, Router.history[Router.history.length - 1]).forEach(function (c) {
            _this11.stoNext[c] = nowPaths[c];
          });
        } catch (e) {
          Router.debuger('dynamic getChanged false');
        }

        for (var _index in _this11.stoNext) {
          Router.debuger(_this11.history.toString(), _this11.history.length, _index, _this11.stoNext[_index]);
          Router.debuger(_this11.indexOFbinArr(_this11.history, _this11.stoNext[_index]));

          _this11.INSTANCES[_index].changer(_this11.stoNext[_index]);

          if (_this11.indexOFbinArr(_this11.history, _this11.stoNext[_index]) === -1) {
            _this11.INSTANCES[_index].initer(_this11.stoNext[_index]);
          }

          _this11.INSTANCES[_index].changer(_this11.stoNext[_index]);

          _this11.INSTANCES[_index].refresher(_this11.stoNext[_index]);
        }

        Router.nowPaths = nowPaths;
        Router.history.push(nowPaths);
      };
    }
  }, {
    key: "indexOFbinArr",
    value: function indexOFbinArr(arr, el) {
      var res = -1;
      arr.forEach(function (ele, index) {
        var ind = ele.indexOf(el);

        if (ind !== -1) {
          res = [index, ind];
        }
      });
      return res;
    }
  }, {
    key: "arr2path",
    value: function arr2path() {
      var paths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return '#' + paths.join('&');
    }
  }, {
    key: "path2arr",
    value: function path2arr() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#';
      return path.substring(1).split('&');
    }
  }, {
    key: "stoNext2path",
    value: function stoNext2path(stoN) {
      var paths = Object.assign([], this.nowPaths); // Router.debuger(paths, this.nowPaths);

      for (var index in stoN) {
        paths[index] = stoN[index];
      }

      return this.arr2path(paths);
    }
  }, {
    key: "to",
    value: function to() {
      var _this12 = this;

      var paths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.nowPaths;
      if (!this.checkPath(paths)) return Router.debuger('path false');
      var changed = this.getChanged(paths); //没有一个path改变的情况

      if (changed.length === 0) {
        this.INSTANCES.forEach(function (router) {
          if (router.preventer(router.nowPath())) window.open(location.href.split('#')[0], '_self');
          router.changer(router.nowPath());
          router.initer(router.nowPath());
          router.refresher(router.nowPath());
        });
        return;
      }

      this.stoNext = {};
      changed.forEach(function (c) {
        _this12.stoNext[c] = paths[c];
      });
      location.hash = Router.exstate ? '#last' : '#next';
    }
  }, {
    key: "back",
    value: function back() {
      window.history.back();
    }
  }, {
    key: "getChanged",
    value: function getChanged(paths) {
      var oldPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Router.nowPaths;

      try {
        var changed = [];
        var newPath = paths;
        newPath.forEach(function (p, index) {
          if (p !== oldPath[index]) changed.push(index);
        });
        return changed;
      } catch (e) {
        Router.debuger(e);
        return [];
      }
    } // static stoNext = {};

  }]);
  return Router;
}();

exports.Router = Router;
Router.debug = true;
var LeftMenu = {
  setCover: function setCover(dom) {
    LeftMenu.cover = dom;
    dom.classList.add('lm_cover');
    LeftMenu.cover.style.display = 'none';
    LeftMenu.cover.onclick = LeftMenu.shouldHide;
    return LeftMenu;
  },
  setCoverClick: function setCoverClick(callback) {
    LeftMenu.cover.onclick = callback;
    return LeftMenu;
  },
  init: function init(dom, main, cover) {
    LeftMenu.body = main;
    if (cover) LeftMenu.setCover(cover);
    LeftMenu.example = dom;
    dom.classList.add('zy-lm');
    var rebo = document.querySelectorAll('.lm-hide');
    Array.prototype.forEach.call(rebo, function (ele) {
      ele.onclick = LeftMenu.shouldHide;
    });
    var tolm = document.querySelectorAll('.lm-show');
    Array.prototype.forEach.call(tolm, function (ele) {
      ele.onclick = LeftMenu.shouldShow;
    });
    LeftMenu.state = false;
    LeftMenu.refresh();
    var timer;
    document.body.addEventListener('touchstart', function (e) {
      if (!LeftMenu.state) {
        timer = setTimeout(function () {
          LeftMenu.shouldShow();
        }, 1000);
      } else {
        LeftMenu.x = e.changedTouches[0].pageX;
      }
    });
    document.body.addEventListener('touchmove', function (e) {
      if (LeftMenu.timer) return;

      if (!LeftMenu.state) {
        clearTimeout(timer);
        return;
      }

      LeftMenu.timer = true;
      setTimeout(function () {
        LeftMenu.timer = false;
      }, 20);
      var x = e.changedTouches[0].pageX;
      var per = LeftMenu.per = LeftMenu.center(0, 1)((LeftMenu.x - x) * LeftMenu.width);
      LeftMenu.body.style.transform = "translate(".concat(45 * (1 - per), "vw,0)scale(").concat(0.85 + 0.15 * per, ")");
    });
    document.body.addEventListener('touchend', function (e) {
      if (!LeftMenu.state) {
        clearTimeout(timer);
        return;
      }

      LeftMenu.body.style = '';

      if (LeftMenu.per > 0.85) {
        LeftMenu.shouldHide();
        LeftMenu.per = 0;
      }
    });

    window.oncontextmenu = function (e) {
      e.preventDefault();
    };

    return LeftMenu;
  },
  append: function append(text, callback) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var dom = document.createElement('div');
    dom.className = 'bo';
    dom.innerText = text;
    if (opt.id) dom.id = opt.id;

    dom.onclick = function () {
      callback();
      LeftMenu.hide();
    };

    LeftMenu.wrap.appendChild(dom);
    return dom;
  },
  dappend: function dappend(text, callback) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var dom = document.createElement('div');
    dom.className = opt.className || 'bo';
    dom.innerText = text;
    if (opt.id) dom.id = opt.id;

    dom.onclick = function () {
      callback();
      LeftMenu.hide();
    };

    LeftMenu.example.appendChild(dom);
    return dom;
  },
  show: function show() {
    if (LeftMenu.state) return;
    LeftMenu.body.classList.add('lm-small');
    LeftMenu.state = true;
    LeftMenu.refresh();
  },
  hide: function hide() {
    if (!LeftMenu.state) return;
    LeftMenu.body.classList.remove('lm-small');
    LeftMenu.state = false;
    LeftMenu.refresh();
  },
  toggle: function toggle() {
    LeftMenu.body.classList.toggle('lm-small');
    LeftMenu.state = !LeftMenu.state;
    LeftMenu.refresh();
  },
  refreshFunction: [],
  refresh: function refresh() {
    LeftMenu.refreshFunction.forEach(function (func) {
      func();
    });
    LeftMenu.cover.style.display = LeftMenu.state ? 'block' : 'none';

    if (LeftMenu.state) {
      document.querySelector('html').style.position = 'fixed';
    } else {
      document.querySelector('html').style.position = 'relative';
    }
  },
  x: 0,
  width: 1 / (document.querySelector('html').clientWidth * 0.2),
  timer: false,
  center: function center(min, max) {
    return function (x) {
      return Math.max(min, Math.min(x, max));
    };
  },
  shouldShow: function shouldShow() {
    LeftMenu.show();
  },
  shouldHide: function shouldHide() {
    LeftMenu.hide();
  }
};
exports.LeftMenu = LeftMenu;

var FloatBall = /*#__PURE__*/function () {
  // rootDom
  // targetDom
  function FloatBall(dom) {
    (0, _classCallCheck2.default)(this, FloatBall);
    this.rootDom = dom;
    FloatBall.canDrag(dom);
  }

  (0, _createClass2.default)(FloatBall, [{
    key: "link",
    value: function link(dom) {
      var _this13 = this;

      var all = this;
      this.targetDom = dom;
      this.rootDom.addEventListener('click', function (e) {
        if (e.target !== _this13.rootDom) return;
        if (all.rootDom.moving) return;
        dom.classList.toggle('hide');
      });
      return this;
    }
  }], [{
    key: "canDragMobile",
    value: function canDragMobile(dom) {
      var dragging = false,
          freezing = false;
      var basex, basey, x0, y0;
      dom.addEventListener('touchstart', function (e) {
        if (e.target !== dom) return;
        dragging = true;
        x0 = e.changedTouches[0].pageX;
        y0 = e.changedTouches[0].pageY;
        basex = dom.offsetLeft;
        basey = dom.offsetTop;
        document.addEventListener('touchmove', touching, false);
      });
      dom.addEventListener('touchend', function (e) {
        dragging = false;
        document.removeEventListener('touchmove', touching);
        setTimeout(function (e) {
          dom.moving = false;
        }, 0);
      });

      function touching(e) {
        e.preventDefault();
        if (!dragging || freezing) return;
        dom.moving = true;
        dom.style.left = basex + e.changedTouches[0].pageX - x0 + 'px';
        dom.style.top = basey + e.changedTouches[0].pageY - y0 + 'px';
        freezing = true;
        setTimeout(function (n) {
          freezing = false;
        }, 15);
      }
    }
  }, {
    key: "canDragPC",
    value: function canDragPC(dom) {
      var dragging = false,
          freezing = false;
      var basex, basey, x0, y0;
      dom.addEventListener('mousedown', function (e) {
        if (e.target !== dom) return;
        dragging = true;
        x0 = e.pageX;
        y0 = e.pageY;
        basex = dom.offsetLeft;
        basey = dom.offsetTop;
        document.addEventListener('mousemove', touching);
      });
      document.addEventListener('mouseup', function (e) {
        dragging = false;
        document.removeEventListener('mousemove', touching);
        setTimeout(function (e) {
          dom.moving = false;
        }, 0);
      });

      function touching(e) {
        if (!dragging || freezing) return;
        dom.moving = true;
        dom.style.left = basex + e.pageX - x0 + 'px';
        dom.style.top = basey + e.pageY - y0 + 'px';
        freezing = true;
        setTimeout(function (n) {
          freezing = false;
        }, 15);
      }
    }
  }, {
    key: "canDrag",
    value: function canDrag(dom) {
      return isMobile() ? FloatBall.canDragMobile(dom) : FloatBall.canDragPC(dom);
    }
  }]);
  return FloatBall;
}();

exports.FloatBall = FloatBall;

function isMobile() {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
}

var ZY = {
  lazyload: lazyload,
  TR: TR,
  LSUser: LSUser,
  timingObject: timingObject,
  Router: Router,
  LeftMenu: LeftMenu,
  isMobile: isMobile,
  FloatBall: FloatBall,
  myAler: myAler,
  Inputer: Inputer,
  Tip: Tip,
  myAler_defaultJson: myAler_defaultJson,
  randomColor: randomColor
};
exports.ZY = ZY;
var _default2 = ZY;
exports.default = _default2;

/***/ })

/******/ });
//# sourceMappingURL=build.js.map