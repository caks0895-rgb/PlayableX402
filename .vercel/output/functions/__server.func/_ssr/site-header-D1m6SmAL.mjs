import { b as cn } from "./pay.server-DcxlzbMU.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-header-D1m6SmAL.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/site-header.tsx";
function SiteHeader({ active }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		className: "border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/",
				className: "flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "font-display text-lg font-semibold tracking-tight",
					children: "PlayableX402"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 9,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden text-xs text-muted sm:inline",
					children: "Quant Arena & Reputation"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 10,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 8,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "flex items-center gap-1 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/floor",
						className: cn("rounded-[8px] px-3 py-2 transition-colors duration-150", active === "floor" ? "bg-raised text-fg" : "text-muted hover:text-fg"),
						children: "Floor"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 13,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/reputation",
						className: cn("rounded-[8px] px-3 py-2 transition-colors duration-150", active === "reputation" ? "bg-raised text-fg" : "text-muted hover:text-fg"),
						children: "Reputation"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 22,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/docs",
						className: cn("rounded-[8px] px-3 py-2 transition-colors duration-150", active === "docs" || active === "skill" ? "bg-raised text-fg" : "text-muted hover:text-fg"),
						children: "Agent Hub"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 12,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 7,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 5
	}, this);
}
//#endregion
export { SiteHeader as t };
