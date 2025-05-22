// src/component/FormGroup.tsx
import clsx from "clsx";
import React from "react"; // Added React import

export function FormGroup(props: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      // Original had "gab-1", assuming typo for "gap-1"
      className={clsx("flex flex-col gap-1", props.className)} 
    >
      {props.children}
    </div>
  );
}