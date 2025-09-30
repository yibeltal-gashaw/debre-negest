// priest.js
let base64Photo = null;

export function init(loadPage) {
  document
    .querySelector("form")
    .addEventListener("submit", (e) => e.preventDefault());
  const fab = document.getElementById("fab-add-priest");
  const modal = document.getElementById("add-priest-modal");
  const closeBtn = document.getElementById("close-modal");
  const form = document.getElementById("addPriestForm");
  const tbody = document.querySelector("table.scrollable-table tbody");
  const photoIn = document.getElementById("priestPhoto");
  const serviceSelect = document.getElementById("priestService");
  const diconaField = document.getElementById("dicona-field");
  const qsnaField = document.getElementById("qsna-field");
  const ppsnaField = document.getElementById("ppsna-field");
  const qumsnaField = document.getElementById("qumsna-field");
  const searchPriest = document.querySelector(".nav-search-bar-input");
  searchPriest.addEventListener("input", async function () {
    const data = {
      table: "dnpriest",
      columns: ["name", "phone", "role"],
      query: searchPriest.value,
    };
    const res = await window.api.searchInCouples(data).then(result => {
      if (result.success) {
        if (result != undefined) {
          renderPriests(result.data);
        }
      }
    });
  });

  function updateFieldVisibility() {
    const value = serviceSelect.value;

    // Hide all by default
    diconaField.style.display = "none";
    qsnaField.style.display = "none";
    ppsnaField.style.display = "none";
    qumsnaField.style.display = "none";

    // Show based on selected value
    if (value === "ዲያቆን") {
      diconaField.style.display = "block";
    } else if (value === "ካህን") {
      diconaField.style.display = "block";
      qsnaField.style.display = "block";
    } else if (value === "ቆሞስ") {
      diconaField.style.display = "block";
      qsnaField.style.display = "block";
      qumsnaField.style.display = "block";
    } else if (value === "ጳጳስ") {
      diconaField.style.display = "block";
      qsnaField.style.display = "block";
      ppsnaField.style.display = "block";
      qumsnaField.style.display = "block";
    }
  }

  // Initial call
  updateFieldVisibility();

  // Update on change
  serviceSelect.addEventListener("change", updateFieldVisibility);

  photoIn.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        base64Photo = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      base64Photo = null;
    }
  });

  // Open modal on FAB click
  if (fab && modal) {
    fab.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  // Close modal on X click
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal on clicking outside modal-content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d_file = await window.api.processPdfInput('priestdiconacertificate');
    const q_file = await window.api.processPdfInput('priestqsnacertificate');
    const p_file = await window.api.processPdfInput('priestppsnacertificate');

    const d_path = d_file ? d_file.path : null;
    const q_path = q_file ? q_file.path : null;
    const p_path = p_file ? p_file.path : null;
    

    const priestData = {
      name: document.getElementById("priestName").value.trim(),
      phone: document.getElementById("priestPhone").value.trim(),
      photo: base64Photo,
      role: document.getElementById("priestService").value.trim(),
      age: document.getElementById("priestAge").value.trim(),
      cname: document.getElementById("priestCname").value.trim(),
      servicestartyear: document
        .getElementById("priestservicestartyear")
        .value.trim(),
      dicona: document.getElementById("priestdicona").value.trim(),
      dicona_cerificate: d_path,
      qsna: document.getElementById("priestqsna").value.trim(),
      qsna_cerificate: q_path,
      qumsna: document.getElementById("priestqumsna").value.trim(),
      ppsna: document.getElementById("priestppsna").value.trim(),
      ppsna_cerificate: p_path,
      gabcha: document.getElementById("married").checked ? "ባለ ትዳር" : "ያላገባ",
      yeglsira: document.getElementById("priestyeglsira").value.trim(),
      maereg: document.getElementById("priestMaereg").value.trim(),
      sallary: document.getElementById("priestSallary").value.trim(),
      yetmrtdereja: document.getElementById("yetmrtdereja").value.trim(),
    };
    console.log(priestData);

    window.api
      .savePriest(priestData)
      .then((result) => {
        if (result.success) {
          loadPriests();
        } else {
          console.error("Error saing priest: ", result.error);
          alert("Error saving priests.");
        }
      })
      .then((error) => {
        console.error("Error saving item:", error);
        // alert('ስህተት ተከስቷል');
      });
    // Reset form and close modal
    form.reset();
    modal.style.display = "none";
  });

  // Optional: simple edit/delete handlers
  window.editRow = function (btn) {
    alert("Implement edit logic!");
  };

  window.deleteRow = function (btn) {
    if (confirm("Delete this priest?")) {
      const row = btn.closest("tr");
      row.remove();

      // Re-index ተ.ቁ after delete
      const rows = tbody.querySelectorAll("tr");
      rows.forEach((row, idx) => {
        row.cells[0].textContent = idx + 1;
      });
    }
  };

  // Render sample priests on page load

  let currentStep = 1;
  const totalSteps = 3;

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

  // On modal open:
  showStep(currentStep);

  loadPriestsWithServants();
}

function loadPage(url) {
  document.getElementById("main-container").innerHTML =
    '<div class="spinner">Loading...</div>';
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("main-container").innerHTML = html;
      if (url.endsWith("priest-detail.html")) {
        renderPriestDetail();
      }
    });
}

function renderPriestDetail() {
  const container = document.getElementById("priest-detail-container");
  const servantsdiv = document.getElementById("servants-data");
  const priest = JSON.parse(localStorage.getItem("selectedPriest"));
  const closeBtn = document.getElementById("close-modal");
  const modal = document.getElementById("update-priest-modal");
  const updateForm = document.getElementById("updatePriestForm");
  let id = priest.id;

  if (!priest) {
    container.innerHTML = "<p>No priest data found.</p>";
    return;
  }
  container.innerHTML = `
  <div class="priests-card">
    <div class="glow-ring">
      <img class="priest-photo" id="profilePhoto" src="${priest.photo == "" ? "../../assets/images/avatar.png" : priest.photo
    }" alt="Priest Photo">
      <img class="overlay" src="../../assets/icons/camera.png" alt="Camera Icon" onclick="document.getElementById('imageInput').click()">
      <input type="file" id="imageInput" accept="image/*">
      <div class="spinner-overlay" id="photo-spinner">
      <div class="spinner"></div>
    </div>
    </div>


    <div class="priests-details">
      <div class="priests-info">
        <div class="priest-name">${priest.name}</div>
        <div class="priest-role">${priest.role}</div>
        <div class="priest-phone">
          <span class="priest-phone-label">Phone:</span>
          <span class="priest-info-phone">${priest.phone}</span>
        </div>
      </div>

      <div class="priests-ordination">
        <div class="overlay" onclick="document.getElementById('update-priest-modal').click()">edit</div>
        <p><span class="label">ዲቁና የተቀበለበት:</span> ${priest.dicona}</p>
        <p><span class="label">ቅስና የተቀበለበት:</span> ${priest.qsna}</p>
        <p><span class="label">ቁምስና የተቀበለበት:</span> ${priest.qumsna}</p>
        <p><span class="label">ጵጵስና የተቀበለበት:</span> ${priest.ppsna}</p>
      </div>

      <div class="priests-personal">
        <div class="overlay" onclick="displayServiceModal()">edit</div>
        <p><span class="label">የትዳር ሁኔታ:</span> ${priest.gabcha}</p>
        <p><span class="label">የግል ስራ:</span> ${priest.yeglsira}</p>
        <p><span class="label">የተሰጠ ማዕረግ:</span> ${priest.maereg}</p>
        <p><span class="label">የት/ት ደረጃ:</span> ${priest.yetmrtdereja}</p>
        <p><span class="label">ደሞዝ:</span> ${priest.sallary}</p>
      </div>
    </div>
  </div>

  `;
  servantsdiv.innerHTML = ""; // clear previous rows
  (priest.servants || []).forEach((servant, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
           <td>${idx + 1}</td>
            <img src="${servant.photo || "../../assets/images/avatar.png"
      }" width="40" height="40">
            <td>${servant.name}</td>
            <td>${servant.christian_name}</td>
            <td>${servant.phone}</td>
            <td>${servant.work}</td>
            <td>${servant.job}</td>
            <td>${servant.wife_name}</td>
            <td>${servant.wife_christian_name}</td>
            <td>${servant.wife_phone}</td>
            <td>${servant.wife_work}</td>
            <td>${servant.wife_job}</td>
            <td>${servant.address}</td>
            <td>${servant.ketena}</td>
            <td>${servant.fee}</td>
    `;
    servantsdiv.appendChild(row);
  });

  // ✅ Attach preview handler after rendering
  imageInput.replaceWith(imageInput.cloneNode(true)); // removes old listeners
  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      event.preventDefault(); // ✅ Prevent form submission
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const base64Photo = e.target.result;

        // Update image preview
        document.getElementById("profilePhoto").src = base64Photo;

        // Show loading indicator
        document.getElementById("photo-spinner").style.display = "block";

        window.api.updatePhoto(priest.id, base64Photo).then((result) => {
          document.getElementById("photo-spinner").style.display = "none";
          if (result.success) {
            console.log("Photo updated successfully");
          } else {
            document.getElementById("photo-spinner").style.display = "none";
            console.error("Error updating photo:", result.error);
          }
        });
      };
      reader.readAsDataURL(file);
    });

  modal.addEventListener("click", function () {
    modal.style.display = "block";
  });
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  updateForm.onsubmit = async function (e) {
    e.preventDefault();
    const data = {
      id,
      dicona: document.getElementById("upriestdicona").value,
      qsna: document.getElementById("upriestqsna").value,
      qumsna: document.getElementById("upriestqumsna").value,
      ppsna: document.getElementById("upriestppsna").value,
    };
    const response = await window.api.updatePriestServiceInfo(data);
    console.log(response);

    modal.style.display = "none";
  };
}

function renderPriests(priests) {
  const table = document.getElementById("priest-data");
  if (!table) return;
  table.innerHTML = ""; // Clear existing rows
  priests.forEach((priest, idx) => {
    const row = document.createElement("tr");
    const photo =
      priest.photo == "" ? "../../assets/images/avatar.png" : priest.photo;
    row.innerHTML = `
            <td>${idx + 1}</td>
            <td><img src=${photo} width="40px" height="40px" ></td>
            <td>${priest.name}</td>
            <td>${priest.phone}</td>
            <td>${priest.role}</td>
            <td>
              <span class="btn edit">Edit</span>
              <span class="btn delete">Delete</span>
            </td>
        `;
    // Add click event to row (excluding the action buttons)
    row.addEventListener("click", (e) => {
      // Prevent click if Edit/Delete button is clicked
      if (e.target.tagName === "BUTTON") return;

      localStorage.setItem("selectedPriest", JSON.stringify(priest));
      window.loadPage("kahinat/priest-detail.html");
    });
    table.appendChild(row);
  });
}

async function loadPriestsWithServants() {
  try {
    // Fetch priests
    const priestResult = await window.api.getAllPriest();
    if (!priestResult.success) throw new Error(priestResult.error);

    const priests = priestResult.data;

    // Fetch servants
    const servantResult = await window.api.getAllServants();
    if (!servantResult.success) throw new Error(servantResult.error);

    const servants = servantResult.data;

    // Map servants to their priest
    const priestsWithServants = priests.map((priest) => {
      return {
        ...priest,
        servants: servants.filter(
          (servant) => servant.christian_father == priest.id
        ), // adjust key if needed
      };
    });

    // Render the combined data
    renderPriests(priestsWithServants);
  } catch (error) {
    console.error("Error loading priests with servants:", error);
  }
}

loadPriestsWithServants();

window.loadPage = loadPage;
window.renderPriests = renderPriests;