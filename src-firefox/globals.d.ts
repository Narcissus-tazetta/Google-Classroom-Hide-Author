/// <reference types="webextension-polyfill" />

import type { Browser } from "webextension-polyfill";

declare global {
    const browser: Browser;
    interface Window {
        browser: Browser;
    }
}

export {};
