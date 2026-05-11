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
// src/component/PrimaryLink.tsx
import Link from "next/link";
import clsx from "clsx";
export function PrimaryLink(_a) {
    var { children, className, id } = _a, rest = __rest(_a, ["children", "className", "id"]);
    return (<Link id={id} {...rest} // Spreads href, scroll, etc.
     className={clsx("text-slate-600 dark:text-slate-300", // Base text color
        "hover:text-purple-600 dark:hover:text-cyan-400", // Brand hover colors
        "transition-colors duration-200 ease-in-out", "focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-500 rounded-sm focus:ring-offset-2 dark:focus:ring-offset-slate-900", // Focus state
        className // Allows additional classes to be passed
        )}>
      {children}
    </Link>);
}
