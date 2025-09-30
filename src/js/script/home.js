// src/js/script/home.js

export function init() {
  const priests = document.querySelector(".priest-card .user-total");
  const deacons = document.getElementById(".deacon-card .user-total");
  const servants = document.getElementById(".priest-card .user-total");
  const komosat = document.getElementById(".monk-card .user-total");

  const homepageMap = {
    "priest-card": "kahinat/priest.html",
    "deacon-card": "kahinat/deacon.html",
    "monk-card": "kahinat/monk.html",
    "confess-card": "kahinat/servant.html",
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

  // loadTotalData();
}

function loadTotalData() {
  const tables = ["nwayekdusan", "servant"];
    window.api.totalItems('nwayekdusan').then((result) => {
      // alert(result)
      if (result.success) {
        
      } else {
        alert("ስህተት ተከስቷል: " + result.error);
      }
    });
  }
