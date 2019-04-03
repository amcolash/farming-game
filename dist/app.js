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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! exports provided: FarmingGame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FarmingGame\", function() { return FarmingGame; });\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'phaser'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n/* harmony import */ var _gameScene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameScene */ \"./src/gameScene.ts\");\n\n\nconst config = {\n    title: 'Farming Game',\n    width: 480,\n    height: 720,\n    parent: 'game',\n    backgroundColor: '#000000',\n    scene: [_gameScene__WEBPACK_IMPORTED_MODULE_1__[\"GameScene\"]],\n    physics: {\n        default: 'arcade',\n        arcade: {\n            debug: false\n        }\n    }\n};\nclass FarmingGame extends Phaser.Game {\n    constructor(config) {\n        super(config);\n    }\n}\nwindow.onload = () => {\n    var game = new FarmingGame(config);\n};\n\n\n//# sourceURL=webpack:///./src/app.ts?");

/***/ }),

/***/ "./src/button.ts":
/*!***********************!*\
  !*** ./src/button.ts ***!
  \***********************/
/*! exports provided: TextButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TextButton\", function() { return TextButton; });\nclass TextButton extends Phaser.GameObjects.Text {\n    constructor(scene, x, y, text, callback) {\n        super(scene, x, y, text, {});\n        this.setInteractive({ useHandCursor: true })\n            .on('pointerover', () => this.enterButtonHoverState())\n            .on('pointerout', () => this.enterButtonRestState())\n            .on('pointerdown', () => this.enterButtonActiveState())\n            .on('pointerup', () => {\n            this.enterButtonHoverState();\n            callback();\n        });\n        this.setStyle({ fill: '#0f0', fontSize: 24 });\n        this.scene.add.existing(this);\n    }\n    enterButtonHoverState() {\n        this.setStyle({ fill: '#ff0' });\n    }\n    enterButtonRestState() {\n        this.setStyle({ fill: '#0f0' });\n    }\n    enterButtonActiveState() {\n        this.setStyle({ fill: '#0ff' });\n    }\n}\n\n\n//# sourceURL=webpack:///./src/button.ts?");

/***/ }),

/***/ "./src/gameScene.ts":
/*!**************************!*\
  !*** ./src/gameScene.ts ***!
  \**************************/
/*! exports provided: GameScene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GameScene\", function() { return GameScene; });\n/* harmony import */ var _hud__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hud */ \"./src/hud.ts\");\n/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ \"./src/player.ts\");\n\n\nclass GameScene extends Phaser.Scene {\n    constructor() {\n        super('GameScene');\n        this.tileSize = 64;\n    }\n    create() {\n        this.player = new _player__WEBPACK_IMPORTED_MODULE_1__[\"Player\"](this);\n        this.hud = new _hud__WEBPACK_IMPORTED_MODULE_0__[\"HUD\"](this, this.player);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/gameScene.ts?");

/***/ }),

/***/ "./src/hud.ts":
/*!********************!*\
  !*** ./src/hud.ts ***!
  \********************/
/*! exports provided: HUD */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HUD\", function() { return HUD; });\n/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ \"./src/button.ts\");\n\nclass HUD extends Phaser.GameObjects.Container {\n    constructor(scene, player) {\n        super(scene);\n        this.scene.sys.updateList.add(this);\n        var width = Number.parseInt(this.scene.game.config.width.toString());\n        var height = Number.parseInt(this.scene.game.config.height.toString());\n        this.player = player;\n        this.button = new _button__WEBPACK_IMPORTED_MODULE_0__[\"TextButton\"](this.scene, 60, height - 50, 'Shop', () => console.log('clicked'));\n        this.money = this.scene.add.text(width - 120, height - 50, '$', { fontSize: 24 });\n    }\n    preUpdate(time, delta) {\n        this.money.setText('$' + this.player.money.toString());\n    }\n}\n\n\n//# sourceURL=webpack:///./src/hud.ts?");

/***/ }),

/***/ "./src/player.ts":
/*!***********************!*\
  !*** ./src/player.ts ***!
  \***********************/
/*! exports provided: Player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Player\", function() { return Player; });\nclass Player extends Phaser.GameObjects.GameObject {\n    constructor(scene) {\n        super(scene, 'Player');\n        this.money = 300;\n        this.currentCrop = 0;\n        this.scene.sys.updateList.add(this);\n    }\n    preUpdate(time, delta) {\n        // console.log('pre')\n    }\n}\n\n\n//# sourceURL=webpack:///./src/player.ts?");

/***/ })

/******/ });