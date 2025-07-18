

document.addEventListener("DOMContentLoaded", function () {
    // side bar menu rendering
    // Map menu IDs to HTML files
    const pageMap = {
        "menu-home": "home.html",
        "menu-preist": "kahinat/priest.html",
        "menu-monk": "kahinat/monk.html",
        "menu-deacon": "kahinat/deacon.html",
        "menu-sebeka-gubae": "sebeka-gubae.html",
        "menu-senbet-timhirt-bet": "senbet-timhirt-bet.html",
        "menu-mahiber-qdusan": "mahiber-qdusan.html",
        "menu-yetswa-mahber-bet": "yetswa-mahber-bet.html",
        "menu-gubae-bet": "gubae-bet.html",
        "menu-ametaw-bealat": "ametaw-bealat.html",
        "menu-message": "message.html",
        "menu-announcement": "announcement.html",
        "menu-others": "others.html",
        "menu-profile": "profile.html",
        "menu-setting": "setting.html"
    };

    // Load home.html by default
    loadPage("home.html");

    Object.keys(pageMap).forEach((menuId) => {
        const btn = document.getElementById(menuId);
        if (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                loadPage(pageMap[menuId]);
            });
        }
    });



    function loadPage(page) {
        fetch(page)
            .then((response) => response.text())
            .then((html) => {
                const container = document.getElementById("main-container");
                container.innerHTML = html;

                // Dynamically load page-specific JS
                if (page.includes("home.html")) {
                    import("../js/script/home.js").then((module) => {
                        module.init(loadPage); // Pass loadPage as an argument
                    });
                }
                if (page.includes("priest.html")) {
                    console.log(page)
                    import("../js/script/priest.js").then((module) => {
                        module.init(loadPage);
                    });
                    // const fab = document.getElementById("fab-add-priest");
                    // const modal = document.getElementById("add-priest-modal");
                    // console.log("modal",modal)

                    // if (fab && modal) {
                    //     fab.addEventListener("click", () => {
                    //         modal.style.display = "flex";
                    //     });
                    // }
                }
            })
            .catch((err) => {
                document.getElementById("main-container").innerHTML =
                    "<p>Failed to load page.</p>";
            });
    }
    window.loadPage = loadPage;
});
