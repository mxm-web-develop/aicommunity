"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/(root)/layout",{

/***/ "(app-pages-browser)/./src/components/ToggleTheme.tsx":
/*!****************************************!*\
  !*** ./src/components/ToggleTheme.tsx ***!
  \****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeToggle: () => (/* binding */ ThemeToggle)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _barrel_optimize_names_Moon_Sun_lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! __barrel_optimize__?names=Moon,Sun!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/sun.js\");\n/* harmony import */ var _barrel_optimize_names_Moon_Sun_lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! __barrel_optimize__?names=Moon,Sun!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/moon.js\");\n/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-themes */ \"(app-pages-browser)/./node_modules/next-themes/dist/index.mjs\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* __next_internal_client_entry_do_not_use__ ThemeToggle auto */ \nvar _s = $RefreshSig$();\n\n\n\nfunction ThemeToggle() {\n    _s();\n    const { theme, setTheme } = (0,next_themes__WEBPACK_IMPORTED_MODULE_1__.useTheme)();\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);\n    // 等待组件挂载，避免服务端渲染时的 hydration 不匹配\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)({\n        \"ThemeToggle.useEffect\": ()=>{\n            setMounted(true);\n        }\n    }[\"ThemeToggle.useEffect\"], []);\n    if (!mounted) {\n        return null;\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n        onClick: ()=>setTheme(theme === 'dark' ? 'light' : 'dark'),\n        className: \"rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800\",\n        children: [\n            theme === 'dark' ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Moon_Sun_lucide_react__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                className: \"h-5 w-5 text-yellow-500\"\n            }, void 0, false, {\n                fileName: \"/Users/zhanghanfeng/Desktop/mxm/codes/aicommunity/src/components/ToggleTheme.tsx\",\n                lineNumber: 26,\n                columnNumber: 9\n            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Moon_Sun_lucide_react__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                className: \"h-5 w-5 text-gray-600\"\n            }, void 0, false, {\n                fileName: \"/Users/zhanghanfeng/Desktop/mxm/codes/aicommunity/src/components/ToggleTheme.tsx\",\n                lineNumber: 28,\n                columnNumber: 9\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                className: \"sr-only\",\n                children: \"Toggle theme\"\n            }, void 0, false, {\n                fileName: \"/Users/zhanghanfeng/Desktop/mxm/codes/aicommunity/src/components/ToggleTheme.tsx\",\n                lineNumber: 30,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/zhanghanfeng/Desktop/mxm/codes/aicommunity/src/components/ToggleTheme.tsx\",\n        lineNumber: 21,\n        columnNumber: 5\n    }, this);\n}\n_s(ThemeToggle, \"uGU5l7ciDSfqFDe6wS7vfMb29jQ=\", false, function() {\n    return [\n        next_themes__WEBPACK_IMPORTED_MODULE_1__.useTheme\n    ];\n});\n_c = ThemeToggle;\nvar _c;\n$RefreshReg$(_c, \"ThemeToggle\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL1RvZ2dsZVRoZW1lLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFd0M7QUFDRjtBQUNLO0FBRXBDLFNBQVNLOztJQUNkLE1BQU0sRUFBRUMsS0FBSyxFQUFFQyxRQUFRLEVBQUUsR0FBR0wscURBQVFBO0lBQ3BDLE1BQU0sQ0FBQ00sU0FBU0MsV0FBVyxHQUFHTCwrQ0FBUUEsQ0FBQztJQUV2QyxpQ0FBaUM7SUFDakNELGdEQUFTQTtpQ0FBQztZQUNSTSxXQUFXO1FBQ2I7Z0NBQUcsRUFBRTtJQUVMLElBQUksQ0FBQ0QsU0FBUztRQUNaLE9BQU87SUFDVDtJQUVBLHFCQUNFLDhEQUFDRTtRQUNDQyxTQUFTLElBQU1KLFNBQVNELFVBQVUsU0FBUyxVQUFVO1FBQ3JETSxXQUFVOztZQUVUTixVQUFVLHVCQUNULDhEQUFDTCxvRkFBR0E7Z0JBQUNXLFdBQVU7Ozs7O3FDQUVmLDhEQUFDWixvRkFBSUE7Z0JBQUNZLFdBQVU7Ozs7OzswQkFFbEIsOERBQUNDO2dCQUFLRCxXQUFVOzBCQUFVOzs7Ozs7Ozs7Ozs7QUFHaEM7R0ExQmdCUDs7UUFDY0gsaURBQVFBOzs7S0FEdEJHIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdoYW5mZW5nL0Rlc2t0b3AvbXhtL2NvZGVzL2FpY29tbXVuaXR5L3NyYy9jb21wb25lbnRzL1RvZ2dsZVRoZW1lLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcblxuaW1wb3J0IHsgTW9vbiwgU3VuIH0gZnJvbSBcImx1Y2lkZS1yZWFjdFwiXG5pbXBvcnQgeyB1c2VUaGVtZSB9IGZyb20gXCJuZXh0LXRoZW1lc1wiXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lVG9nZ2xlKCkge1xuICBjb25zdCB7IHRoZW1lLCBzZXRUaGVtZSB9ID0gdXNlVGhlbWUoKVxuICBjb25zdCBbbW91bnRlZCwgc2V0TW91bnRlZF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICAvLyDnrYnlvoXnu4Tku7bmjILovb3vvIzpgb/lhY3mnI3liqHnq6/muLLmn5Pml7bnmoQgaHlkcmF0aW9uIOS4jeWMuemFjVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE1vdW50ZWQodHJ1ZSlcbiAgfSwgW10pXG5cbiAgaWYgKCFtb3VudGVkKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgb25DbGljaz17KCkgPT4gc2V0VGhlbWUodGhlbWUgPT09ICdkYXJrJyA/ICdsaWdodCcgOiAnZGFyaycpfVxuICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBwLTIgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpob3ZlcjpiZy1ncmF5LTgwMFwiXG4gICAgPlxuICAgICAge3RoZW1lID09PSAnZGFyaycgPyAoXG4gICAgICAgIDxTdW4gY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXllbGxvdy01MDBcIiAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPE1vb24gY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWdyYXktNjAwXCIgLz5cbiAgICAgICl9XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIHRoZW1lPC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApXG59Il0sIm5hbWVzIjpbIk1vb24iLCJTdW4iLCJ1c2VUaGVtZSIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiVGhlbWVUb2dnbGUiLCJ0aGVtZSIsInNldFRoZW1lIiwibW91bnRlZCIsInNldE1vdW50ZWQiLCJidXR0b24iLCJvbkNsaWNrIiwiY2xhc3NOYW1lIiwic3BhbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/ToggleTheme.tsx\n"));

/***/ })

});