// script.jsからアニメーションとフォント適用のための関数をインポート
import { initializeScrollReveal, applyCustomFonts } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    // 必須要素を取得
    const noEntrySection = document.querySelector('.no-entry');
    const container = document.getElementById('entry-page');
    if (!noEntrySection || !container) return;

    // JSONデータを読み込む
    fetch('../json/entry.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tournaments = data.tournaments;

            // 大会情報が1件以上あるかチェック
            if (tournaments && tournaments.length > 0) {
                // 「受付期間外」のセクションを非表示にする
                noEntrySection.style.display = 'none';

                // 各大会のHTMLを生成してページに追加
                tournaments.forEach(tournament => {
                    const tournamentHTML = `
                        <section class="section container reveal">
                            <div class="about-section-box entry-section">
                                <h3 class="section-title tournament-title">${tournament.title}</h3>
                                <div class="section-divider"></div>
                                <p class="tournament-date">${tournament.datetime}</p>
                                <p class="entry-date">${tournament.deadline}</p>
                                <a class="entry-button" href="${tournament.url}" target="_blank">
                                    エントリーする！
                                </a>
                            </div>
                        </section>
                    `;
                    // 生成したHTMLをコンテナの末尾に追加
                    container.insertAdjacentHTML('beforeend', tournamentHTML);
                });

                // 動的に追加した要素にアニメーションとフォントを適用
                initializeScrollReveal();
                applyCustomFonts(container);
            }
            // 大会情報がなければ何もしない（デフォルトの「受付期間外」セクションが表示されたままになる）
        })
        .catch(error => {
            console.error('Error fetching tournament data:', error);
            // エラーが発生した場合も「受付期間外」セクションが表示されたままになる
        });
});