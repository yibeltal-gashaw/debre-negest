

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

}

export function executives() {
    var btn = document.getElementById("fab-add-executives");
    var modal = document.getElementById("new-executive-model");
    var closebtn = document.getElementById("close-modal");
    console.log(btn, modal);

    if (btn) {
        btn.onclick = () => {
            modal.style.display = "block"
        }
    }
    closebtn.onclick = () => {
        modal.style.display = "none"
    }
    // Close modal on clicking outside modal-content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    document.getElementById('next-1').addEventListener('click', function(){
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
    })
    document.getElementById('back-1').addEventListener('click', function(){
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-1').style.display = 'block';
    })

    // Drag and Drop functionality for photo upload
const photoDropArea = document.getElementById('photo-drop-area');
const photoInput = document.getElementById('executivePhoto');

if (photoDropArea && photoInput) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        photoDropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        photoDropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        photoDropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    photoDropArea.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        photoDropArea.classList.add('drag-over');
    }

    function unhighlight() {
        photoDropArea.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        photoInput.files = files;
    }
}
}