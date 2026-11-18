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
// src/component/Input.tsx
import React from "react";
import clsx from "clsx";
export function Input(props) {
    const { className } = props, rest = __rest(props, ["className"]);
    return (<input type={props.type || "text"} // Default to text if type not specified
     className={clsx("w-full p-3 rounded-md shadow-sm", "text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500", "bg-white dark:bg-slate-800", "border border-slate-300 dark:border-slate-700", "focus:outline-none focus:ring-2 focus:border-transparent", "focus:ring-purple-500 dark:focus:ring-cyan-500", "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none", "disabled:dark:bg-slate-800 disabled:dark:text-slate-500 disabled:dark:border-slate-700", className // Allow overriding or adding classes
        )} {...rest}/>);
}
