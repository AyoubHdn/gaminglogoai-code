// global.ts or a similar file like src/types/global.d.ts

export {}; // Ensure the file is treated as a module

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>; // dataLayer can also be optional
    gtag?: (
      command: string,
      action: string,
      params?: { [key: string]: any } // This allows for various params like send_to, value, etc.
    ) => void;
  }
}