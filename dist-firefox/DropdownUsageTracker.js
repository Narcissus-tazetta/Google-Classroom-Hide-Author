export class DropdownUsageTracker {
    constructor() {
        this.usage = {};
        this.observer = null;
        this.processedItems = new WeakSet();
        this.reorderedDropdowns = new WeakSet();
        this.useBrowserStorage = typeof browser !== "undefined" && browser.storage?.local;
        this.loadUsage();
        this.init();
    }
    init() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.start());
        }
        else {
            this.start();
        }
    }
    start() {
        this.startObserver();
        this.processExistingDropdowns();
    }
    async loadUsage() {
        try {
            if (this.useBrowserStorage) {
                const result = await browser.storage.local.get("gc_dropdown_usage");
                if (result.gc_dropdown_usage) {
                    this.usage = result.gc_dropdown_usage;
                }
                else {
                    const localData = localStorage.getItem("gc_dropdown_usage");
                    if (localData) {
                        this.usage = JSON.parse(localData);
                        await browser.storage.local.set({ gc_dropdown_usage: this.usage });
                        localStorage.removeItem("gc_dropdown_usage");
                    }
                }
            }
            else {
                const data = localStorage.getItem("gc_dropdown_usage");
                if (data) {
                    this.usage = JSON.parse(data);
                }
            }
        }
        catch { }
    }
    async saveUsage() {
        try {
            if (this.useBrowserStorage) {
                await browser.storage.local.set({ gc_dropdown_usage: this.usage });
            }
            else {
                localStorage.setItem("gc_dropdown_usage", JSON.stringify(this.usage));
            }
        }
        catch { }
    }
    getKey(element) {
        try {
            const text = element.textContent?.normalize("NFKC").trim() || "";
            return text;
        }
        catch {
            return "";
        }
    }
    incrementUsage(element) {
        try {
            const key = this.getKey(element);
            if (!key)
                return;
            this.usage[key] = (this.usage[key] || 0) + 1;
            this.saveUsage();
        }
        catch { }
    }
    reorderDropdown(dropdown) {
        try {
            const items = Array.from(dropdown.querySelectorAll('[role="option"], [role="menuitem"]'));
            if (items.length <= 3)
                return;
            const scored = items.map((el, index) => ({
                el,
                score: this.usage[this.getKey(el)] || 0,
                originalIndex: index,
            }));
            if (!scored.some((s) => s.score > 0))
                return;
            scored.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.originalIndex - b.originalIndex));
            const useCssOrder = this.tryApplyCssOrder(dropdown, scored);
            if (!useCssOrder) {
                this.applyDomReorder(dropdown, scored);
            }
        }
        catch { }
    }
    tryApplyCssOrder(dropdown, scored) {
        try {
            dropdown.style.display = "flex";
            dropdown.style.flexDirection = "column";
            scored.forEach((s, index) => {
                s.el.style.order = String(index);
            });
            requestAnimationFrame(() => {
                const computedDisplay = getComputedStyle(dropdown).display;
                if (computedDisplay !== "flex") {
                    this.applyDomReorder(dropdown, scored);
                }
            });
            return true;
        }
        catch {
            return false;
        }
    }
    applyDomReorder(dropdown, scored) {
        try {
            const fragment = document.createDocumentFragment();
            scored.forEach((s) => {
                if (s.el.parentElement === dropdown) {
                    fragment.appendChild(s.el);
                }
            });
            dropdown.appendChild(fragment);
        }
        catch { }
    }
    startObserver() {
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    for (const node of Array.from(mutation.addedNodes)) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node;
                            this.checkAndSetupDropdown(element);
                            const dropdowns = element.querySelectorAll('[role="listbox"], [role="menu"]');
                            dropdowns.forEach((dd) => this.checkAndSetupDropdown(dd));
                        }
                    }
                }
            }
        });
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    processExistingDropdowns() {
        const dropdowns = document.querySelectorAll('[role="listbox"], [role="menu"]');
        dropdowns.forEach((dd) => this.checkAndSetupDropdown(dd));
    }
    checkAndSetupDropdown(element) {
        if (!element.matches || !element.matches('[role="listbox"], [role="menu"]')) {
            return;
        }
        this.setupDropdown(element);
    }
    setupDropdown(dropdown) {
        const items = dropdown.querySelectorAll('[role="option"], [role="menuitem"]');
        items.forEach((item) => {
            if (this.processedItems.has(item))
                return;
            item.addEventListener("pointerdown", () => {
                try {
                    this.incrementUsage(item);
                }
                catch { }
            }, { capture: true, passive: true });
            this.processedItems.add(item);
        });
        if (!this.reorderedDropdowns.has(dropdown)) {
            this.reorderedDropdowns.add(dropdown);
            setTimeout(() => this.reorderDropdown(dropdown), 100);
        }
    }
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}
//# sourceMappingURL=DropdownUsageTracker.js.map