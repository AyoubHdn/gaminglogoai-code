// lib/getDevice.ts
export function getDeviceInfo() {
  const ua = navigator.userAgent.toLowerCase();

  const isAndroid = ua.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isMobile = isAndroid || isIOS;

  return {
    device: isMobile ? "mobile" : "desktop",
    os: isAndroid
      ? "android"
      : isIOS
      ? "ios"
      : ua.includes("mac")
      ? "mac"
      : "windows",
  };
}
