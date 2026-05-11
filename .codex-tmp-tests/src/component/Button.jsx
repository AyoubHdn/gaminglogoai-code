var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// src/component/Button.tsx (or your path)
import clsx from "clsx";
import { Spinner } from "./Spinner"; // Assuming Spinner component exists and is styled appropriately
export function Button(props) {
    const { variant = "primary", isLoading, children, className, fullWidth } = props, rest = __rest(props, ["variant", "isLoading", "children", "className", "fullWidth"]);
    let variantClasses = "";
    switch (variant) {
        case "primary": // Main Call to Action
            variantClasses = `
        bg-purple-600 hover:bg-purple-700 text-white
        dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
        font-semibold shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 
        dark:focus:ring-offset-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400
      `;
            break;
        case "secondary": // Less prominent actions
            variantClasses = `
        bg-slate-200 hover:bg-slate-300 text-slate-700
        dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200
        font-medium border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-offset-2
        dark:focus:ring-offset-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400
      `;
            break;
        case "accent": // For special emphasis, alternative CTA
            variantClasses = `
        bg-cyan-500 hover:bg-cyan-600 text-slate-900
        dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white
        font-semibold shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2
        dark:focus:ring-offset-slate-900 focus:ring-cyan-400 dark:focus:ring-purple-500
      `;
            break;
        case "danger": // For destructive actions
            variantClasses = `
        bg-red-600 hover:bg-red-700 text-white
        dark:bg-red-700 dark:hover:bg-red-800 dark:text-red-100
        font-medium shadow focus:ring-2 focus:ring-offset-2
        dark:focus:ring-offset-slate-900 focus:ring-red-500
      `;
            break;
        case "ghost": // For minimal, often inline actions
            variantClasses = `
        bg-transparent hover:bg-slate-100 text-slate-700
        dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-cyan-400
        font-medium focus:ring-2 focus:ring-offset-1
        dark:focus:ring-offset-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400
      `;
            break;
        default: // Fallback to primary
            variantClasses = `
        bg-purple-600 hover:bg-purple-700 text-white
        dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
        font-semibold shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 
        dark:focus:ring-offset-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400
      `;
    }
    return (<button {...rest} // Spread rest of the props (like onClick, type, etc.)
     className={clsx("flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm transition-all duration-200 ease-in-out focus:outline-none", // Base styles
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none disabled:hover:scale-100", // Disabled state
        isLoading && "opacity-80 cursor-wait", // Loading state (Spinner already adds visual)
        fullWidth && "w-full", // Full width if prop is true
        variantClasses, // Variant specific styles
        className // Allow overriding or adding classes via props
        )} disabled={isLoading || props.disabled} // Disable if loading or explicitly disabled
    >
      {isLoading && <Spinner className="h-4 w-4"/>} {/* Pass className to Spinner if it accepts */}
      {children}
    </button>);
}
