import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, inject } from "@angular/core";

const defaultPlatform = "win" as string;

export function isMac() {
    try {
        return navigator.platform.includes("Mac");
    } catch {
        return defaultPlatform === "mac";
    }
}

export function isWindows() {
    try {
        return navigator.platform.includes("Win");
    } catch {
        return defaultPlatform === "win";
    }
}

export function isBrowser() {
    return isPlatformBrowser(inject(PLATFORM_ID));
}
