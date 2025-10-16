interface ProcessedElement extends HTMLElement {
    dataset: DOMStringMap & {
        processedByHidePoster?: string;
    };
}

class ClassroomTextProcessor {
    private observer: MutationObserver | null = null;

    private readonly classroomPatterns: RegExp[] = [
        /^(.+?)\s*さんが\s*(.+?)\s*を使用して新しい課題を投稿しました:\s*(.+)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を使用して(.+?)を投稿しました:\s*(.+)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を使用して(.+?)を投稿しました\.?\s*(.*)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を投稿しました:\s*(.+)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を投稿しました\.?\s*(.*)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を投稿しました\.?$/,
        /^(.+?)\s*さんが\s*(.+?)\s*をしました\.?$/,
        /^(.+?)\s*さんが\s*(.+?)しました\.?$/,
    ];

    private readonly targetSelectors: string = [
        'span[class*="VGBb"]',
        'div[class*="VGBb"]',
        'div[class*="QRIHxd"]',
        'div[class*="usn0cc"]',
        'div[class*="iOB96"]',
        'span[class*="post"]',
        'div[class*="post"]',
        'span[class*="message"]',
        'div[class*="message"]',
        'span[class*="content"]',
        'div[class*="content"]',
        'span[class*="text"]',
        'div[class*="text"]',
        'span[class*="body"]',
        'div[class*="body"]',
        'span[class*="description"]',
        'div[class*="description"]',
        'span[class*="Pc9Gce"]',
        'div[class*="Pc9Gce"]',
        'span[class*="DShyMc"]',
        'div[class*="DShyMc"]',
        'span[class*="wJD2Bb"]',
        'div[class*="wJD2Bb"]',
        'span[class*="YMvIgc"]',
        'div[class*="YMvIgc"]',
        'span[class*="CYZpAe"]',
        'div[class*="CYZpAe"]',
        'span[class*="YVvGBb"]',
        'div[class*="YVvGBb"]',
        'span[class*="asQXV"]',
        'div[class*="asQXV"]',
        'span[class*="announcement"]',
        'div[class*="announcement"]',
        'span[class*="assignment"]',
        'div[class*="assignment"]',
        'span[class*="stream"]',
        'div[class*="stream"]',
    ].join(", ");

    constructor() {
        this.init();
    }

    private init(): void {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.start());
        } else {
            this.start();
        }
    }

    private start(): void {
        console.log("[Content Script] スクリプトが正常に読み込まれました");
        this.processElementsInNode(document.body);
        this.startObserver();
    }

    private startObserver(): void {
        this.observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    for (const node of Array.from(mutation.addedNodes)) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.processElementsInNode(node as HTMLElement);
                        }
                    }
                } else if (mutation.type === "characterData" || mutation.type === "attributes") {
                    const target = mutation.target;
                    if (target.nodeType === Node.ELEMENT_NODE) {
                        this.processTextInElement(target as ProcessedElement);
                    } else if (target.parentNode && target.parentNode.nodeType === Node.ELEMENT_NODE) {
                        this.processTextInElement(target.parentNode as ProcessedElement);
                    }
                }
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

    private processElementsInNode(node: HTMLElement): void {
        const potentialMessageElements = node.querySelectorAll(this.targetSelectors);
        const allSpansAndDivs = node.querySelectorAll("span, div");
        const allElements = new Set<Element>([...Array.from(potentialMessageElements), ...Array.from(allSpansAndDivs)]);

        for (const element of allElements) {
            if (element.tagName === "SPAN" || element.tagName === "DIV") {
                const text = element.textContent || "";

                if (text.length > 5 && text.includes("さんが")) {
                    const hasChildWithSanga = Array.from(element.children).some(
                        (child) => child.textContent && child.textContent.includes("さんが")
                    );

                    if (
                        element.childNodes.length === 0 ||
                        Array.from(element.childNodes).some(
                            (childNode) =>
                                childNode.nodeType === Node.TEXT_NODE && childNode.textContent?.includes("さんが")
                        ) ||
                        (!hasChildWithSanga && text.includes("さんが"))
                    ) {
                        this.processTextInElement(element as ProcessedElement);
                    }
                }
            }
        }
    }

    private processTextInElement(element: ProcessedElement): void {
        const originalText = element.textContent || "";

        if (!originalText.includes("さんが")) {
            return;
        }

        if (element.dataset.processedByHidePoster === "true" && !originalText.includes("さんが")) {
            return;
        }

        let processed = false;

        for (let i = 0; i < this.classroomPatterns.length; i++) {
            const pattern = this.classroomPatterns[i];
            const match = originalText.match(pattern);

            if (match) {
                let newText = "";

                switch (i) {
                    case 0:
                        newText = match[3] || "";
                        break;
                    case 1:
                    case 2:
                        newText = match[4] || match[3] || "";
                        break;
                    case 3:
                        newText = match[3] || "";
                        break;
                    case 4:
                        newText = (match[3] && match[3].trim()) || match[2] || "";
                        break;
                    default:
                        newText = match[2] || "";
                        break;
                }

                element.textContent = newText;
                element.dataset.processedByHidePoster = "true";
                processed = true;
                break;
            }
        }

        if (!processed) {
            const sangaIndex = originalText.indexOf("さんが");
            if (sangaIndex !== -1) {
                const afterSanga = originalText.substring(sangaIndex + 3).trim();
                if (afterSanga.length > 0) {
                    element.textContent = afterSanga;
                    element.dataset.processedByHidePoster = "true";
                    processed = true;
                }
            }
        }

        if (element.dataset.processedByHidePoster === "true") {
            element.textContent = this.cleanupText(element.textContent || "");
        }
    }

    private cleanupText(text: string): string {
        text = text.replace(/^20\d{2}年[_＿\s]?/g, "");
        text = text.replace(/20\d{2}年[_＿\s]/g, "");
        text = text.replace(/20\d{2}[_＿\s]/g, "");
        text = text.replace(/[_＿\s]20\d{2}年?/g, "");
        text = text.replace(/[_＿]20\d{2}/g, "");
        text = text.replace(/_?ワークシート$/, "");
        text = text.replace(/ワークシート$/, "");
        text = text.replace(/^ワークシート[_＿\s]?/, "");
        text = text.replace(/[_＿\s]ワークシート[_＿\s]?/g, "");
        text = text.replace(/^[_＿\s]+/, "");
        text = text.replace(/[_＿\s]+$/, "");
        text = text.replace(/[_＿]{2,}/g, "_");
        text = text.replace(/[_＿\s]{2,}/g, " ");
        text = text.trim();
        text = text.replace(/^[_＿\-\s]+/, "");
        text = text.replace(/[_＿\-\s]+$/, "");
        return text;
    }

    public destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}

new ClassroomTextProcessor();
