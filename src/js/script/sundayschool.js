export function init() {
    const homepageMap = {
        "tsfetbet": "sundayschool/tsfetbet.html",
        "mereja-kifl": "sundayschool/mereja-kifl.html",
        "yesewu-hail": "sundayschool/yesewu-hail.html",
        "htsanat-kifl": "sundayschool/kids.html"
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

    var btn = document.getElementById("fab-add-priest-left");
    var addKiflat = document.getElementById("fab-add-priest");
    var modal = document.getElementById("sira-asfetsami-modal");
    var closebtn = document.getElementById("close-modal");
    var kiflatModal = document.getElementById("kiflat-modal");
    var newKiflat = document.getElementById("add-modal");
    const tableBody = document.getElementById("kiflat-data");
    const row = document.createElement("tr");

    if(!tableBody) return;

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        modal.style.display = "block";
    });

    closebtn.addEventListener("click", function (e) {
        e.preventDefault();
        modal.style.display = "none";
        kiflatModal.style.display = "none";
    });
    addKiflat.addEventListener("click", function(e){
        e.preventDefault()
        kiflatModal.style.display = "block";
    });
    newKiflat.addEventListener("click", function(e){
        e.preventDefault()
        row.innerHTML = `
            <td><input type="text" id="kiflatName" required /></td>
            <td><input type="text" id="kiflatRepresetative" required /></td>
            <td><input type="text" id="kiflatPhone" required /></td>
            <td><input type="tel" id="kiflatAge" required /></td>
            <td><input type="text" id="kiflatName" required /></td>
            <td><input type="text" id="kiflatRepresetative" required /></td>
            <td><input type="text" id="kiflatPhone" required /></td>
            <td><input type="tel" id="kiflatAge" required /></td>
            <td><input type="tel" id="kiflatAge" required /></td>
            
        `;
        tableBody.appendChild(row);
    })
    
}

