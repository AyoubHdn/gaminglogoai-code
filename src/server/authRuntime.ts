import type { DbServiceBinding } from "./dbService";

export type AuthRuntime = {
  DB_AUTH_BACKEND?: string;
  DB_SERVICE?: DbServiceBinding;
};

export type TrustedAuthBackend = "prisma" | "service";

export function selectAuthBackend(runtime: AuthRuntime): TrustedAuthBackend {
  const backend = runtime.DB_AUTH_BACKEND ?? "prisma";
  if (backend !== "prisma" && backend !== "service") {
    throw new Error("Unsupported DB_AUTH_BACKEND");
  }
  return backend;
}

export function requireAuthDbBinding(runtime: AuthRuntime): DbServiceBinding {
  if (!runtime.DB_SERVICE) {
    throw new Error("DB_SERVICE binding is required for service auth");
  }
  return runtime.DB_SERVICE;
}
