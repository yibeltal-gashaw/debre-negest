let editMode = false;
let editId = null;
let itemPhotoBase64 = null;

export function init() {
  const btn = document.getElementById("fab-add-new-item");
  const modal = document.getElementById("add-new-item");
  const close = document.getElementById("close-modal");
  const form = document.getElementById("add-item-form");
  const photoInput = document.getElementById("itemPhoto");
  const photoPreview = document.getElementById("itemPhotoPreview");
  const dropArea = document.getElementById("drop-area");
  const searchItems = document.querySelector(".nav-search-bar-input");
  searchItems.addEventListener("input", async function () {
    const data = {
      table: "nwayekdusan",
      columns: [
        "item_name",
        "gifter_name",
        "price",
        "service",
        "yalebet_huneta",
      ],
      query: searchItems.value,
    };
    await window.api.searchInCouples(data).then((result) => {
      if (result.success) {
        if (result != undefined) {
          displayItems(result.data);
        }
      }
    });
  });
  photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        itemPhotoBase64 = e.target.result;
        photoPreview.src = itemPhotoBase64;
        photoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      itemPhotoBase64 = null;
      photoPreview.style.display = "none";
    }
  });

  // Drag events
  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove("dragover");
    });
  });

  dropArea.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  // Load items when page loads
  loadItems();

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "block";
    form.reset();
    editMode = false;
    editId = null;
  });

  close.addEventListener("click", function (e) {
    e.preventDefault();
    closeModal();
  });

  // close modal when clicking outside content
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };

  function closeModal() {
    modal.style.display = "none";
    form.reset();
    photoPreview.style.display = "none";
    itemPhotoBase64 = null;
    editMode = false;
    editId = null;
  }

  form.onsubmit = function (e) {
    e.preventDefault();
    const data = {
      itemName: document.getElementById("itemName").value,
      itemEntrytDate: document.getElementById("itemEntrytDate").value,
      itemGifterName: document.getElementById("itemGifterName").value,
      itemsPrice: document.getElementById("itemsPrice").value,
      itemsService: document.getElementById("itemsService").value,
      action: document.getElementById("action").value,
      itemPhoto: itemPhotoBase64,
    };
    // console.log("photo",data.itemPhoto)

    if (editMode) {
      data.id = editId;
      window.api.updateNwayekdusanItem(data).then((result) => {
        if (result.success) {
          closeModal();
          loadItems();
        } else {
          alert("ስህተት ተከስቷል: " + result.error);
        }
      });
    } else {
      // Save to database
      window.api
        .saveNwayekdusanItem(data)
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
  };

  // Function to load and display items
  function loadItems() {
    window.api
      .getAllNwayekdusanItems()
      .then((result) => {
        if (result.success) {
          displayItems(result.items);
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
    const tbody = document.querySelector("#priests-table tbody");
    tbody.innerHTML = "";

    items.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${
                  item.item_photo
                    ? `<img src="${item.item_photo}" style="max-width:40px;max-height:40px;border-radius:4px;" />`
                    : ""
                }</td>
                <td>${item.item_name}</td>
                <td>${item.entry_date}</td>
                <td>${item.gifter_name}</td>
                <td>${item.price}</td>
                <td>${item.service}</td>
                <td>${item.yalebet_huneta}</td>
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

  function editItem(id, item) {
    document.getElementById("itemName").value = item.item_name;
    document.getElementById("itemEntrytDate").value = item.entry_date;
    document.getElementById("itemGifterName").value = item.gifter_name;
    document.getElementById("itemsPrice").value = item.price;
    document.getElementById("itemsService").value = item.service;
    document.getElementById("action").value = item.action;

    if (item.item_photo) {
      itemPhotoBase64 = item.item_photo;
      photoPreview.src = item.item_photo;
      photoPreview.style.display = "block";
    } else {
      itemPhotoBase64 = null;
      photoPreview.style.display = "none";
    }

    modal.style.display = "block";
    editMode = true;
    editId = id;
  }

  function deleteItem(id) {
    window.api.deleteNwayekdusanItem(id).then((result) => {
      if (result.success) {
        alert("በተሳካች ሰለበት ተሰርዟል!");
        loadItems();
      } else {
        alert("ስህተት ተከስቷል: " + result.error);
      }
    });
  }

  window.uploadImage = function (id) {
    document.getElementById(id).click();
  };
}
