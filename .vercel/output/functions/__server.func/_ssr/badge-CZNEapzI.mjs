import { b as cn } from "./pay.server-DcxlzbMU.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CZNEapzI.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/ui/badge.tsx";
function Badge({ children, tone = "muted", className }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide", {
			muted: "text-muted border-border",
			live: "text-live border-live/30",
			warn: "text-warn border-warn/30",
			danger: "text-danger border-danger/30",
			pool: "text-pool border-pool/30",
			fg: "text-fg border-border-strong"
		}[tone], className),
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 22,
		columnNumber: 5
	}, this);
}
//#endregion
export { Badge as t };
