// src/js/script/home.js

export function init() {
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

  loadTotalData();
}

function loadTotalData() {
  const priests = document.querySelector(".priest-card .user-total");
  const deacons = document.querySelector(".deacon-card .user-total");
  const servants = document.querySelector(".servant-card .user-total");
  const komosat = document.querySelector(".monk-card .user-total");

  // Load all counts concurrently using Promise.all
  Promise.all([
    window.api.totalItems("dnpriest", "ካህን"), // counts only ካህን (Kahin/priest)
    window.api.totalItems("dnpriest", "ዲያቆን"), // counts only ዲያቆን (Deacon)
    window.api.totalItems("dnpriest", "ቆሞስ"), // counts only ቆሞስ (Monk)
    window.api.totalItems("servant"), // counts all servants
  ])
    .then((results) => {
      // Update DOM elements with the results
      if (results[0].success) priests.textContent = results[0].count;
      if (results[1].success) deacons.textContent = results[1].count;
      if (results[2].success) komosat.textContent = results[2].count;
      if (results[3].success) servants.textContent = results[3].count;
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      alert("ስህተት ተከስቷል: " + error.message);
    });
}
