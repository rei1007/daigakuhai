document.addEventListener('DOMContentLoaded', () => {
    /**
     * 指定された要素内のテキストノードを再帰的に処理し、
     * 漢字とそれ以外の文字に異なるフォントを適用します。
     * @param {HTMLElement} element - 処理対象のHTML要素
     */
    const applyCustomFonts = (element) => {
        // scriptやstyleタグは処理対象外
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return;
        }

        // elementの子ノードを配列に変換してループ（元のNodeListが変更されるため）
        const childNodes = Array.from(element.childNodes);

        childNodes.forEach(node => {
            // 1. 要素ノードの場合、再帰的に処理を呼び出す
            if (node.nodeType === Node.ELEMENT_NODE) {
                applyCustomFonts(node);
            }
            // 2. テキストノードで、空白文字のみでない場合
            else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                const fragment = document.createDocumentFragment();
                const text = node.textContent;

                // 正規表現で漢字の連続とそれ以外の文字の連続に分割
                // 漢字のUnicode範囲: U+4E00-U+9FFF, U+3400-U+4DBF
                const parts = text.split(/([\u4e00-\u9faf\u3400-\u4dbf]+)/);

                parts.forEach(part => {
                    if (part.length === 0) return;

                    const span = document.createElement('span');
                    span.textContent = part;

                    // 漢字の正規表現にマッチするかどうかでクラスを振り分ける
                    if (/^[\u4e00-\u9faf\u3400-\u4dbf]+$/.test(part)) {
                        span.className = 'font-kanji';
                    } else {
                        span.className = 'font-other';
                    }
                    fragment.appendChild(span);
                });

                // 元のテキストノードを、新しく生成したspan要素群で置き換える
                node.parentNode.replaceChild(fragment, node);
            }
        });
    };

    // body全体を対象として処理を開始
    applyCustomFonts(document.body);
});

// ヒーローセクションの画像スライダー
const sliderImages = document.querySelectorAll('.slider-image');
if (sliderImages.length > 0) {
    let currentImageIndex = 0;
    setInterval(() => {
        sliderImages[currentImageIndex].style.opacity = 0;
        currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
        sliderImages[currentImageIndex].style.opacity = 1;
    }, 5000);
}

// スクロール連動アニメーション
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    observer.observe(element);
});