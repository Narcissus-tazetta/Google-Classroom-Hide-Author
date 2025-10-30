export declare class DropdownSearchEnhancer {
    private observer;
    private enhancedDropdowns;
    private debounceTimers;
    private itemCache;
    constructor();
    private init;
    private start;
    private startObserver;
    private enhanceExistingDropdowns;
    private enhanceDropdownsInNode;
    private isValidDropdown;
    private isPersistentContainer;
    private isOverlayDropdown;
    private getDropdownItems;
    private enhanceDropdown;
    private createSearchElement;
    private setupSearchProtection;
    private setupSearchHandlers;
    private setupDropdownObserver;
    private filterDropdown;
    private generateSearchPatterns;
    private tokenizeRomaji;
    private normalizeQuery;
    private getNormalizedItems;
    private extractAllHiraganaFromText;
    private generateRomajiVariants;
    private resetFilter;
    private getItemText;
    private highlightText;
    private removeHighlight;
    private handleKeyboard;
    private injectStyles;
    destroy(): void;
}
//# sourceMappingURL=DropdownSearchEnhancer.d.ts.map