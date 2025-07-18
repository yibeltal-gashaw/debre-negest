// src/js/script/home.js

export function init() {
    const homepageMap = {
        "priest-card": "kahinat/priest.html",
        "deacon-card": "kahinat/deacon.html",
        "monk-card": "kahinat/monk.html",
        "confess-card": "kahinat/priest.html"
    };
    Object.keys(homepageMap).forEach((card) => {
        const btn = document.getElementById(card);
        if (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                window.loadPage(homepageMap[card]);
            });
        }
    });
}