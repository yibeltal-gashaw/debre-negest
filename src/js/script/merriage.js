let husbandPhotoBase64 = "";
let wifePhotoBase64 = "";

function handleFileInput(fileInput, callback) {
  const file = fileInput.files[0];
  if (!file) return callback(null);

  const reader = new FileReader();
  reader.onload = function (e) {
    // result is base64 string
    const base64 = e.target.result; // remove "data:image/...;base64,"
    callback(base64);
  };
  reader.readAsDataURL(file);
}

export function init() {
  const add = document.getElementById("fab-add-couple");
  const modal = document.getElementById("add-couple-modal");
  const importData = document.getElementById("import-data");
  const btnimport = document.getElementById("fab-import-couple");
  const close = document.getElementById("close-modal");
  const form = document.getElementById("addCoupleForm");
  const searchInput = document.querySelector(".nav-search-bar-input");
  searchInput.addEventListener("input", async function () {
    const result = await search("marriages", "husband_name_am", searchInput.value);
    if (result != undefined) {
      displayCertificates(result);
    }
  });

  add.addEventListener("click", function (e) {
    e.preventDefault();
    // window.loadPage("merriage/new-couple.html");
    modal.style.display = "block";
  });
  close.onclick = () => {
    modal.style.display = "none";
  };
  btnimport.onclick = () => {
    importData.click();
  };

  // Handle file selection only once
  importData.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const result = await window.api.importExcel(arrayBuffer);
      if (result.success) {
        alert(result.data);
        loadMarriages();
      } else {
        console.error("Import error:", result.error);
        alert(result.error);
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset the input so selecting the same file again triggers onchange
    importData.value = "";
  };

  window.previewImage = function (event, targetId, infoLabel) {
    document.getElementById(infoLabel).style.display = "none";
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById(
        targetId
      ).style.backgroundImage = `url('${e.target.result}')`;
      const base64 = e.target.result;
      if (targetId === "husbandPhoto") {
        husbandPhotoBase64 = base64;
      } else if (targetId === "wifePhoto") {
        wifePhotoBase64 = base64;
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  window.triggerUpload = function (inputId) {
    const input = document.getElementById(inputId);
    input.click();
    // Handle the file after user selects it
    // input.onchange = (e) => {

    // };
  };

  window.handleDrop = function (event, inputId, photoId) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById(
          photoId
        ).style.backgroundImage = `url('${reader.result}')`;
      };
      reader.readAsDataURL(file);
      // Also set file to the hidden input for potential form storage
      document.getElementById(inputId).files = event.dataTransfer.files;
    }
  };

  form.onsubmit = function (e) {
    e.preventDefault();
    const data = {
      husbandNameAm: document.getElementById("husbandNameAm").value,
      husbandNameEn: document.getElementById("husbandNameEn").value,
      husbandChristianNameAm: document.getElementById("husbandChristianNameAm")
        .value,
      husbandChristianNameEn: document.getElementById("husbandChristianNameEn")
        .value,
      husbandDob: document.getElementById("husbandDob").value,
      husbandBirthPlaceAm: document.getElementById("husbandBirthPlaceAm").value,
      husbandBirthPlaceEn: document.getElementById("husbandBirthPlaceEn").value,
      husbandResidenceAm: document.getElementById("husbandResidenceAm").value,
      husbandResidenceEn: document.getElementById("husbandResidenceEn").value,
      husbandNationalityAm: document.getElementById("husbandNationalityAm")
        .value,
      husbandNationalityEn: document.getElementById("husbandNationalityEn")
        .value,
      husbandFatherNameAm: document.getElementById("husbandFatherNameAm").value,
      husbandFatherNameEn: document.getElementById("husbandFatherNameEn").value,
      husbandMotherNameAm: document.getElementById("husbandMotherNameAm").value,
      husbandMotherNameEn: document.getElementById("husbandMotherNameEn").value,

      wifeNameAm: document.getElementById("wifeNameAm").value,
      wifeNameEn: document.getElementById("wifeNameEn").value,
      wifeChristianNameAm: document.getElementById("wifeChristianNameAm").value,
      wifeChristianNameEn: document.getElementById("wifeChristianNameEn").value,
      wifeDob: document.getElementById("wifeDob").value,
      wifeBirthPlaceAm: document.getElementById("wifeBirthPlaceAm").value,
      wifeBirthPlaceEn: document.getElementById("wifeBirthPlaceEn").value,
      wifeResidenceAm: document.getElementById("wifeResidenceAm").value,
      wifeResidenceEn: document.getElementById("wifeResidenceEn").value,
      wifeNationalityAm: document.getElementById("wifeNationalityAm").value,
      wifeNationalityEn: document.getElementById("wifeNationalityEn").value,
      wifeFatherNameAm: document.getElementById("wifeFatherNameAm").value,
      wifeFatherNameEn: document.getElementById("wifeFatherNameEn").value,
      wifeMotherNameAm: document.getElementById("wifeMotherNameAm").value,
      wifeMotherNameEn: document.getElementById("wifeMotherNameEn").value,

      churchName: document.getElementById("churchName").value,
      officiatingPriest: document.getElementById("officiatingPriest").value,
      marriageDate: document.getElementById("marriageDate").value,
      marriageDay: document.getElementById("marriageDay").value,
      spiritualFather: document.getElementById("spiritualFather").value,
      emagn1: document.getElementById("emagn1").value,
      emagn2: document.getElementById("emagn2").value,
      emagn3: document.getElementById("emagn3").value,
      husbandPhoto: husbandPhotoBase64,
      wifePhoto: wifePhotoBase64,
    };
    console.log("Form Data:", data);

    window.api.saveMarriage(data).then((result) => {
      if (result.success) {
        alert(result.message);
        displayCertificates();
      } else {
        alert("ስህተት ተከስቷል: " + result.error);
      }
    });
  };

  loadMarriages();
}

function handleExcel(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  };
  reader.readAsArrayBuffer(file);
}

async function loadMarriages() {
  const result = await window.api.loadMarriage();
  if (!result.success) return console.error("Failed to load certificates");
  displayCertificates(result);
}

function displayCertificates(result) {
  const tbody = document.getElementById("couples-data");
  tbody.innerHTML = "";

  result.data.forEach((cert, idx) => {
    const row = document.createElement("tr");
    const photo =
      cert.husband_photo == null
        ? "../../assets/images/avatar.png"
        : cert.husband_photo;
    row.innerHTML = `
                <td>${idx + 1}</td>
              <td><img src=${photo} width="40px" height="40px" ></td>
              <td>${cert.husband_name_am}</td>
                <td>${cert.husband_christian_name_am}</td>
        `;
    row.addEventListener("click", function () {
      localStorage.setItem("couples", JSON.stringify(cert));
      window.loadPage("merriage/detail.html");
    });
    tbody.appendChild(row);
  });

  let currentStep = 1;
  const totalSteps = 5;
  function showStep(step) {
    for (let i = 1; i <= totalSteps; i++) {
      document.getElementById(`step-${i}`).style.display =
        i === step ? "block" : "none";
      document
        .querySelectorAll(".progress-bar .step")
        [i - 1].classList.toggle("active", i === step);
    }
  }

  document.getElementById("next-1").onclick = () => {
    currentStep = 2;
    showStep(currentStep);
  };
  document.getElementById("back-2").onclick = () => {
    currentStep = 1;
    showStep(currentStep);
  };
  document.getElementById("next-2").onclick = () => {
    currentStep = 3;
    showStep(currentStep);
  };
  document.getElementById("back-3").onclick = () => {
    currentStep = 2;
    showStep(currentStep);
  };
  document.getElementById("back-4").onclick = () => {
    currentStep = 3;
    showStep(currentStep);
  };
  document.getElementById("next-3").onclick = () => {
    currentStep = 4;
    showStep(currentStep);
  };
  document.getElementById("next-4").onclick = () => {
    currentStep = 5;
    showStep(currentStep);
  };
  document.getElementById("back-5").onclick = () => {
    currentStep = 4;
    showStep(currentStep);
  };
}

function search(t, c, q) {
  const data = {
    table: t,
    column: c,
    query: q,
  };
  let res = window.api.searchInCouples(data).then((result) => {
    if (result.success) {
      return result;
    }
  });
   return res;
}

// Call this after saving a new certificate or on page load
// displayCertificates();
