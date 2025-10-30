import * as browserPolyfill from "webextension-polyfill";
import { ClassroomTextProcessor } from "./ClassroomTextProcessor";
import { DropdownSearchEnhancer } from "./DropdownSearchEnhancer";
import { DropdownUsageTracker } from "./DropdownUsageTracker";

if (typeof browser === "undefined") {
    (window as any).browser = browserPolyfill;
}

new ClassroomTextProcessor();
new DropdownSearchEnhancer();
new DropdownUsageTracker();
