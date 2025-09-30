let base64Photo = null;
let editMode = false;
let editId = null;

export function init(loadPage) {
  // Modal Elements
  const modal = document.getElementById("add-servant-modal");
  const openBtn = document.getElementById("fab-add-servant");
  const closeBtn = document.getElementById("close-servant-modal");
  const searchfield = document.querySelector(".nav-search-bar-input");

  searchfield.addEventListener("input", async function () {
    const data = {
      table: "servant",
      columns: ["name","phone","job","wife_name","wife_job","address","ketena"],
      query: searchfield.value,
    };
    const priest = await priests();
    await window.api.searchInCouples(data).then((result) => {
      if (result.success) {
        if (result != undefined) {
          const ServantsWithFathers = mapper(result.data, priest);
          displayServants(ServantsWithFathers);
        }
      }
    });
  });

  // Show/Hide Modal
  openBtn.onclick = () => (modal.style.display = "block");
  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  window.api.getFathers().then((result) => {
    if (result.success) {
      const select = document.getElementById("servantCfather");
      select.innerHTML = ""; // refresh
      result.data.forEach((father) => {
        const option = document.createElement("option");
        option.value = father.id; // ID for backend use
        option.textContent = father.name; // Display name
        select.appendChild(option);
      });
    } else {
      console.log("dfjioerf");
    }
  });
  document
    .getElementById("servantPhoto")
    .addEventListener("change", function (event) {
      event.preventDefault(); // ✅ Prevent form submission
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        base64Photo = e.target.result;
      };
      reader.readAsDataURL(file);
    });

  // Form Submission (for now: just log)
  document.getElementById("addServantForm").onsubmit = function (e) {
    e.preventDefault();
    const data = {
      name: document.getElementById("servantName").value,
      christianName: document.getElementById("servantCname").value,
      fatherName: document.getElementById("servantCfather").value,
      phone: document.getElementById("servantPhone").value,
      work: document.getElementById("servantWork").value,
      job: document.getElementById("servantJob").value,
      wifeName: document.getElementById("ownerName").value,
      wifeCname: document.getElementById("ownerCname").value,
      wifePhone: document.getElementById("ownerPhone").value,
      wifeWork: document.getElementById("ownerWork").value,
      wifeJob: document.getElementById("ownerJob").value,
      address: document.getElementById("servantAddress").value,
      ketena: document.getElementById("servantRegion").value,
      fee: document.getElementById("servantFee").value,
      photo: base64Photo || "",
    };

    if (editMode) {
      data.id = editId;
      window.api.updateServantInfo(data);
      loadItems();
      closeModal();
    } else {
      window.api
        .saveServants(data)
        .then((result) => {
          if (result.success) {
            closeModal();
            loadItems();
          } else {
            console.error("Error saving item:", result.error);
            alert("ስህተት ተከስቷል: " + result.error);
          }
        })
        .catch((error) => {
          console.error("Error saving item:", error);
          alert("ስህተት ተከስቷል");
        });
    }

    // 🔄 Optional: Append to table or send to backend here

    // this.reset();
    // modal.style.display = 'none';
  };

  function closeModal() {
    modal.style.display = "none";
    document.getElementById("addServantForm").reset();
    // photoPreview.style.display = 'none';
    base64Photo = null;
  }

  // Function to load and display items
  function loadItems() {
    window.api
      .getAllServants()
      .then((result) => {
        if (result.success) {
          displayItems(result.data);
        } else {
          console.error("Error loading items:", result.error);
        }
      })
      .catch((error) => {
        console.error("Error loading items:", error);
      });
  }
  // Function to display items in the table
  function displayItems(items) {
    const tbody = document.querySelector("#servants-table tbody");
    tbody.innerHTML = "";

    items.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${
                  item.photo
                    ? `<img src="${item.item_photo}" style="max-width:40px;max-height:40px;border-radius:4px;" />`
                    : ""
                }</td>
                <td>${item.name}</td>
                <td>${item.christianName}</td>
                <td>${item.fatherName}</td>
                <td>${item.phone}</td>
                <td>${item.work}</td>
                <td>${item.job}</td>
                <td>${item.wifeName}</td>
                <td>${item.wifeCname}</td>
                <td>${item.wifePhone}</td>
                <td>${item.wifeWork}</td>
                <td>${item.wifeJob}</td>
                <td>${item.address}</td>
                <td>${item.ketena}</td>
                <td>${item.fee}</td>
                <td>${item.action}</td>
                <td>
                    <button class="btn-action btn-edit" data-id="${
                      item.id
                    }">Edit</button>
                    <button class="btn-action btn-delete" data-id="${
                      item.id
                    }">Delete</button>
                </td>
            `;
      tbody.appendChild(row);
    });
    // Attach event listeners for edit and delete
    tbody.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        editItem(
          id,
          items.find((i) => i.id == id)
        );
      });
    });
    tbody.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        if (confirm("እርግጠኛ ነዎት ለማጥፋት?")) {
          deleteItem(id);
        }
      });
    });
  }

  let currentStep = 1;
  const totalSteps = 3;
  function showStep(step) {
    for (let i = 1; i <= totalSteps; i++) {
      document.getElementById(`servant-step-${i}`).style.display =
        i === step ? "block" : "none";
      document
        .querySelectorAll(".progress-bar .step")
        [i - 1].classList.toggle("active", i === step);
    }
  }

  document.getElementById("next-servant-1").onclick = () => {
    currentStep = 2;
    showStep(currentStep);
  };
  document.getElementById("back-servant-2").onclick = () => {
    currentStep = 1;
    showStep(currentStep);
  };
  document.getElementById("next-servant-2").onclick = () => {
    currentStep = 3;
    showStep(currentStep);
  };
  document.getElementById("back-servant-3").onclick = () => {
    currentStep = 2;
    showStep(currentStep);
  };

  // On modal open:
  showStep(currentStep);
  loadServantsWithFathers();
}
async function priests() {
  // Fetch priests
  const priestResult = await window.api.getAllPriest();
  if (!priestResult.success) throw new Error(priestResult.error);

  const priestData = priestResult.data;
  return priestData;
}
function mapper(servants, res) {
  const ServantsWithFathers = servants.map((servant) => {
    const father = res.find((priest) => priest.id == servant.christian_father);
    return {
      ...servant,
      christian_father: father ? father.name : null,
    };
  });
  return ServantsWithFathers;
}
async function loadServantsWithFathers() {
  try {
    const res = await priests();
    // Fetch servants
    const servantResult = await window.api.getAllServants();
    if (!servantResult.success) throw new Error(servantResult.error);

    const servants = servantResult.data;

    // Map servants to their priest
    const ServantsWithFathers = mapper(servants, res);

    // Render the combined data
    //   renderPriests(priestsWithServants);
    displayServants(ServantsWithFathers);
  } catch (error) {
    console.error("Error loading priests with servants:", error);
  }
}

loadServantsWithFathers();

function displayServants(servants) {
  const table = document.getElementById("servant-father-data");
  table.innerHTML = ""; // clear table before adding new rows

  servants.forEach((servant, idx) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${idx + 1}</td>
        <td><img src="${
          servant.photo || "../../assets/images/avatar.png"
        }" width="40" height="40"></td>
        <td>${servant.name}</td>
        <td>${servant.christian_name}</td>
        <td>${servant.christian_father_name || servant.christian_father}</td>
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
        <td>
          <span class="btn edit">Edit</span>
          <span class="btn delete">Delete</span>
        </td>
      `;

    // Attach edit handler
    row.querySelector(".edit").addEventListener("click", () => {
      editServant(servant); // define this function to open a form/modal pre-filled with servant info
    });

    // Attach delete handler
    row.querySelector(".delete").addEventListener("click", async () => {
      if (confirm(`Are you sure you want to delete ${servant.name}?`)) {
        try {
          const result = await window.api.deleteServant(servant.id); // backend function to remove servant
          if (result.success) {
            alert("Servant deleted successfully");
            row.remove(); // remove the row from table
          } else {
            alert("Error deleting servant: " + result.error);
          }
        } catch (err) {
          console.error("Unexpected error deleting servant:", err);
        }
      }
    });

    table.appendChild(row);
  });
}

function editServant(servant) {
  const modal = document.getElementById("add-servant-modal");
  modal.style.display = "block";

  document.getElementById("servantName").value = servant.name;
  // document.getElementById('servantCfather').value = servant.christian_father;
  document.getElementById("servantPhone").value = servant.phone;
  document.getElementById("servantWork").value = servant.work;
  document.getElementById("servantJob").value = servant.job;
  document.getElementById("ownerName").value = servant.wife_name;
  document.getElementById("ownerPhone").value = servant.wife_phone;
  document.getElementById("ownerCname").value = servant.wife_christian_name;
  document.getElementById("ownerJob").value = servant.wife_job;
  document.getElementById("servantAddress").value = servant.address;
  document.getElementById("servantRegion").value = servant.ketena;
  document.getElementById("servantFee").value = servant.fee;
  document.getElementById("servantPhoto").files[0]?.name || servant.photo;
  document.getElementById("ownerWork").value = servant.wife_work;
  document.getElementById("servantCname").value = servant.christian_name;

  editMode = true;
  editId = servant.id;
}
