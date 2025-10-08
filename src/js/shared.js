document.addEventListener("DOMContentLoaded", function () {
  // side bar menu rendering
  // Map menu IDs to HTML files
  const pageMap = {
    "menu-home": "home.html",
    "menu-preist": "kahinat/priest.html",
    "menu-monk": "kahinat/monk.html",
    "menu-deacon": "kahinat/deacon.html",
    "menu-sebeka-gubae": "kahinat/servant.html",
    "menu-senbet-timhirt-bet": "senbet-timhirt-bet.html",
    "menu-nwaye-qdusan": "nwayekdusan.html",
    "menu-yetswa-mahber-bet": "yetswa-mahber-bet.html",
    "menu-gubae-bet": "merriage/married.html",
    "menu-ametaw-bealat": "ametaw-bealat.html",
    "menu-message": "message.html",
    "menu-announcement": "announcement.html",
    "menu-others": "others.html",
    "menu-profile": "profile.html",
    "menu-setting": "setting.html",
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

  function loadPage(page, virtualPath = page) {
    fetch(page)
      .then((response) => response.text())
      .then((html) => {
        const container = document.getElementById("main-container");
        container.innerHTML = html;

        // Update breadcrumb based on virtualPath
        //generateBreadcrumb(virtualPath);

        console.log(page);
        if (page.includes("home.html")) {
          import("../js/script/home.js").then((module) => {
            module.init(loadPage); // Pass loadPage as an argument
          });
        }
        if (page.includes("kahinat/servant.html")) {
          import("../js/script/servant.js").then((module) => {
            module.init(loadPage); // Pass loadPage as an argument
          });
        }
        if (page.includes("senbet-timhirt-bet.html")) {
          import("../js/script/sundayschool.js").then((script) => {
            script.init(loadPage);
          });
        }

        if (page.includes("kahinat/priest.html")) {
          import("../js/script/priest.js").then((module) => {
            module.init(loadPage);
          });
        }
        if (page.includes("kahinat/priest-detail.html")) {
          import("../js/script/priest.js").then((module) => {
            module.init(loadPage);
          });
        }

        if (page.includes("kahinat/servant.html")) {
          import("../js/script/servant.js").then((module) => {
            module.init(loadPage);
          });
        }
        if (page.includes("sundayschool/tsfetbet.html")) {
          import("../js/script/sundayschool.js").then((module) => {
            module.executives();
          });
        }
        if (page.includes("merriage/married.html")) {
          import("../js/script/merriage.js").then((module) => {
            module.init(loadPage);
          });
        }
        if (page.includes("merriage/detail.html")) {
          console.log("loading");
          import("../js/script/marriagedetail.js").then((module) => {
            module.init(loadPage);
          });
        }
        if (page.includes("nwayekdusan.html")) {
          import("../js/script/nwayekdusan.js").then((module) => {
            module.init(loadPage);
          });
        }
        if (page.includes("sundayschool/mereja-kifl.html")) {
          import("../js/script/mereja-kifl.js").then((module) => {
            module.init(loadPage);
          });
        }
        if (page.includes("sundayschool/yesewu-hail.html")) {
          import("../js/script/yesewu-hail.js").then((module) => {
            module.init(loadPage);
          });
        }

        if (page.includes("others.html")) {
          import("../js/script/babtism.js").then((module) => {
            module.init(loadPage);
          });;
        }
        if (page.includes("setting.html")) {
          import("../js/script/setting.js").then((module) => {
            module.init(loadPage);
          });;
        }

      })
      .catch((err) => {
        document.getElementById("main-container").innerHTML =
          "<p>Failed to load page.</p>";
      });
  }
  window.loadPage = loadPage;

  function generateBreadcrumb(virtualPath, lang = "am") {
    const labels = {
      am: {
        home: "ዋና",
        priest: "ካህናት",
        deacon: "መሪ መዝሙራን",
        gubae: "ጋብቻ",
        profile: "መለያ",
        setting: "ማስተካክያ",
        others: "ክርስትና",
        // Add more as needed
      },
    };

    const icons = {
      home: "🏠",
      priest: "✝️",
      deacon: "🕊️",
      gubae: "💒",
      profile: "👤",
      setting: "⚙️",
      others: "⛪",
    };

    const container = document.getElementById("breadcrumb-container");
    if (!container) return;

    const pathParts = virtualPath
      .split("/")
      .filter(Boolean)
      .map((p) => p.replace(".html", ""));
    let html = `<nav class="breadcrumb"><a href="#" onclick="loadPage('home.html')">${icons.home} ${labels[lang].home}</a>`;

    let cumulativePath = "";

    pathParts.forEach((part, i) => {
      cumulativePath += (i === 0 ? "" : "/") + part;
      const label = `${icons[part] || ""} ${labels[lang][part] || part}`;

      if (i === pathParts.length - 1) {
        html += `<span class="separator"> › </span><span class="current">${label}</span>`;
      } else {
        html += `<span class="separator"> › </span><a href="#" onclick="loadPage('${cumulativePath}.html', '${cumulativePath}.html')">${label}</a>`;
      }
    });

    html += `</nav>`;
    container.innerHTML = html;
  }
});
