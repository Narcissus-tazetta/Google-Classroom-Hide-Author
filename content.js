window.addEventListener('load', () => {
    console.log('[Content Script] スクリプトが正常に読み込まれました');
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        processElementsInNode(node);
                    }
                });
            } else if (mutation.type === 'characterData' || mutation.type === 'attributes') {
                if (mutation.target.nodeType === 1) {
                    processTextInElement(mutation.target);
                } else if (mutation.target.parentNode && mutation.target.parentNode.nodeType === 1) {
                    processTextInElement(mutation.target.parentNode);
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    processElementsInNode(document.body);
});

function processElementsInNode(node) {
    const potentialMessageElements = node.querySelectorAll(
        'span[class*="VGBb"], ' +
        'div[class*="VGBb"], ' +  
        'div[class*="QRIHxd"], ' + 
        'div[class*="usn0cc"], ' + 
        'div[class*="iOB96"], ' +
        'span[class*="post"], ' +
        'div[class*="post"], ' +
        'span[class*="message"], ' +
        'div[class*="message"], ' +
        'span[class*="content"], ' +
        'div[class*="content"], ' +
        'span[class*="text"], ' +
        'div[class*="text"], ' +
        'span[class*="body"], ' +
        'div[class*="body"], ' +
        'span[class*="description"], ' +
        'div[class*="description"], ' +
        'span[class*="Pc9Gce"], ' +
        'div[class*="Pc9Gce"], ' +
        'span[class*="DShyMc"], ' +
        'div[class*="DShyMc"], ' +
        'span[class*="wJD2Bb"], ' +
        'div[class*="wJD2Bb"], ' +
        'span[class*="YMvIgc"], ' +
        'div[class*="YMvIgc"], ' +
        'span[class*="CYZpAe"], ' +
        'div[class*="CYZpAe"], ' +
        'span[class*="YVvGBb"], ' +
        'div[class*="YVvGBb"], ' +
        'span[class*="asQXV"], ' +
        'div[class*="asQXV"], ' +
        'span[class*="announcement"], ' +
        'div[class*="announcement"], ' +
        'span[class*="assignment"], ' +
        'div[class*="assignment"], ' +
        'span[class*="stream"], ' +
        'div[class*="stream"]'
    );

    const allSpansAndDivs = node.querySelectorAll('span, div');
    const allElements = new Set([...potentialMessageElements, ...allSpansAndDivs]);
    
    allElements.forEach(element => {
        if (element.tagName === 'SPAN' || element.tagName === 'DIV') {
            const text = element.textContent || '';
            
            if (text.length > 5 && text.includes('さんが')) {
                const hasChildWithSanga = Array.from(element.children).some(child => 
                    child.textContent && child.textContent.includes('さんが')
                );
                
                if (element.childNodes.length === 0 || 
                    Array.from(element.childNodes).some(node => node.nodeType === 3 && node.textContent.includes('さんが')) ||
                    (!hasChildWithSanga && text.includes('さんが'))) {
                    processTextInElement(element);
                }
            }
        }
    });
}

function processTextInElement(element) {
    let originalText = element.textContent;
    if (!originalText.includes('さんが')) {
        return;
    }
    
    if (element.dataset.processedByHidePoster === 'true' && !originalText.includes('さんが')) {
        return;
    }
    
    const classroomPatterns = [
        /^(.+?)\s*さんが\s*(.+?)\s*を使用して新しい課題を投稿しました:\s*(.+)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を使用して(.+?)を投稿しました:\s*(.+)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を使用して(.+?)を投稿しました\.?\s*(.*)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を投稿しました:\s*(.+)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を投稿しました\.?\s*(.*)$/,
        /^(.+?)\s*さんが\s*(.+?)\s*を投稿しました\.?$/,
        /^(.+?)\s*さんが\s*(.+?)\s*をしました\.?$/,
        /^(.+?)\s*さんが\s*(.+?)しました\.?$/,
        /^(.+?)\s*さんが\s*(.+)$/
    ];
    
    let processed = false;
    
    for (let i = 0; i < classroomPatterns.length; i++) {
        const pattern = classroomPatterns[i];
        const match = originalText.match(pattern);
        if (match) {
            let newText = '';
            
            if (i === 0) {
                newText = match[3];
            } else if (i === 1 || i === 2) {
                if (match[4]) {
                    newText = match[4];
                } else {
                    newText = match[3];
                }
            } else if (i === 3) {
                newText = match[3];
            } else if (i === 4) {
                if (match[3] && match[3].trim()) {
                    newText = match[3].trim();
                } else {
                    newText = match[2];
                }
            } else if (i === 5) {
                newText = match[2];
            } else if (i === 6) {
                newText = match[2];
            } else if (i === 7) {
                newText = match[2];
            } else {
                newText = match[2];
            }
            
            element.textContent = newText;
            element.dataset.processedByHidePoster = 'true';
            processed = true;
            break;
        }
    }
    
    if (!processed) {
        const sangaIndex = originalText.indexOf('さんが');
        if (sangaIndex !== -1) {
            const afterSanga = originalText.substring(sangaIndex + 3).trim();
            if (afterSanga.length > 0) {
                element.textContent = afterSanga;
                element.dataset.processedByHidePoster = 'true';
                processed = true;
            }
        }
    }
}
