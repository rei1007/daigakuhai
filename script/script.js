/**
 * =================================================================
 * 初期化処理
 * DOM（HTML）の読み込みが完了した時点で実行されるメインの処理。
 * =================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. ページ全体にカスタムフォントを適用
    applyCustomFonts(document.body);

    // 2. ヒーローセクションの画像スライダーを初期化
    initializeHeroSlider();

    // 3. スクロールに応じた表示アニメーションを初期化
    initializeScrollReveal();
});

/**
 * =================================================================
 * カスタムフォント適用スクリプト
 * ページ内のテキストを解析し、漢字とそれ以外の文字で
 * 自動的に異なるフォントクラスを割り当てます。
 * =================================================================
 */
const applyCustomFonts = (element) => {
    // scriptやstyleタグは処理から除外する
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
        return;
    }

    // elementの子ノードのリストを配列に変換してからループ処理する。
    // (元のNodeListは、DOMの変更に伴い動的に変化するため、静的な配列にコピーする)
    const childNodes = Array.from(element.childNodes);

    childNodes.forEach(node => {
        // [ケース1] ノードがHTML要素の場合 (例: <p>, <div>)
        // 再帰的にこの関数を呼び出し、さらにその子要素を探索する。
        if (node.nodeType === Node.ELEMENT_NODE) {
            applyCustomFonts(node);
        }
        // [ケース2] ノードがテキストノードで、かつ空白文字のみでない場合
        else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            // テキストを分割して格納するための仮の要素（DocumentFragment）を作成
            const fragment = document.createDocumentFragment();
            const text = node.textContent;

            // 正規表現を使い、テキストを「漢字の連続」と「それ以外の文字の連続」に分割する。
            // 例: "大学杯2025" -> ["", "大学杯", "2025"]
            // 漢字のUnicode範囲: U+4E00-U+9FFF, U+3400-U+4DBF
            const parts = text.split(/([\u4e00-\u9faf\u3400-\u4dbf]+)/);

            parts.forEach(part => {
                if (part.length === 0) return; // 空の文字列は無視

                const span = document.createElement('span');
                span.textContent = part;

                // テキストが漢字のみで構成されているか判定し、クラスを割り当てる
                if (/^[\u4e00-\u9faf\u3400-\u4dbf]+$/.test(part)) {
                    span.className = 'font-kanji'; // 漢字用クラス
                } else {
                    span.className = 'font-other'; // 漢字以外用クラス
                }
                fragment.appendChild(span);
            });

            // 元のテキストノードを、新しく生成した<span>要素群で置き換える
            node.parentNode.replaceChild(fragment, node);
        }
    });
};


/**
 * =================================================================
 * ヒーローセクション画像スライダー
 * 背景画像を一定時間ごとに切り替えます。
 * =================================================================
 */
const initializeHeroSlider = () => {
    const sliderImages = document.querySelectorAll('.slider-image');
    if (sliderImages.length === 0) return; // 対象画像がなければ何もしない

    let currentImageIndex = 0;
    const slideInterval = 5000; // 5秒ごとに切り替え

    setInterval(() => {
        // 現在の画像を非表示にする
        sliderImages[currentImageIndex].style.opacity = 0;

        // 次の画像のインデックスを計算 (配列の最後に到達したら最初に戻る)
        currentImageIndex = (currentImageIndex + 1) % sliderImages.length;

        // 次の画像を表示する
        sliderImages[currentImageIndex].style.opacity = 1;
    }, slideInterval);
};


/**
 * =================================================================
 * スクロール連動アニメーション (Reveal)
 * 指定された要素が画面内に入ったときに、フェードイン表示させます。
 * =================================================================
 */
const initializeScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return; // 対象要素がなければ何もしない

    // IntersectionObserver: 要素がビューポートと交差したかを監視するAPI
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // isIntersectingがtrueなら、要素が画面内に入ったことを意味する
            if (entry.isIntersecting) {
                // 'visible'クラスを追加して、CSSで定義された表示アニメーションを開始
                entry.target.classList.add('visible');

                // 一度表示された要素は、もう監視する必要がないため監視を停止（パフォーマンス向上）
                observer.unobserve(entry.target);
            }
        });
    }, {
        // threshold: 0.1 は、要素が10%以上画面内に入った時にコールバックを実行するという意味
        threshold: 0.1
    });

    // すべての.reveal要素を監視対象として登録
    revealElements.forEach(element => {
        observer.observe(element);
    });
};

// 他のファイルから使えるように、関数をエクスポート
export { initializeScrollReveal, applyCustomFonts };