// script.jsから必要な関数をインポート
// 同じ階層にあるため、パスは './script.js' となる
import { initializeScrollReveal, applyCustomFonts } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    // コンテンツを挿入する親要素を取得
    const container = document.getElementById('terms-container');
    if (!container) return;

    // JSONファイルを非同期で読み込む
    fetch('../json/terms.json') // このパスはHTMLファイルからの相対パスに依存します
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // ページタイトルを設定
            document.title = data.pageTitle;

            // JSONデータからHTMLを構築
            data.sections.forEach(sectionData => {
                const sectionEl = document.createElement('section');
                sectionEl.id = 'about';
                // 外側のコンテナからは 'reveal' を削除
                sectionEl.className = 'section container';

                let sectionHTML = `
                    <div class="about-section-box reveal">
                        <h3 class="section-title">${sectionData.title}</h3>
                        <div class="section-divider"></div>
                        <p class="about-section-text">${sectionData.introduction}</p>
                    </div>
                `;

                sectionData.details.forEach(detailData => {
                    let rulesHTML = '';
                    detailData.rules.forEach(rule => {
                        rulesHTML += `
                            <div class="rule-section">
                            ${rule.subtitle ? `<h5 class="rule-subtitle">${rule.subtitle}</h5>` : ''}
                            <p class="rule-description">${rule.description}</p>
                            </div>
                        `;
                    });

                    sectionHTML += `
                        <div class="details-box reveal">
                            <h4 class="details-box-title">${detailData.title}</h4>
                            ${detailData.initialDescription ? `<p class="rule-description">${detailData.initialDescription}</p>` : ''}
                            ${rulesHTML}
                        </div>
                    `;
                });

                sectionEl.innerHTML = sectionHTML;
                container.appendChild(sectionEl);
            });

            // コンテンツが追加された後に、インポートした関数を実行
            initializeScrollReveal();
            applyCustomFonts(container);

        })
        .catch(error => {
            console.error('Error fetching or parsing terms data:', error);
            container.innerHTML = '<p>規約の読み込みに失敗しました。</p>';
        });
});