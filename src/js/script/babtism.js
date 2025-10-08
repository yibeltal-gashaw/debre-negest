// Register a new baby
export function registerNewBaby(babyData) {
    window.api.registerNewBaby(babyData).then(result => {
        if(result.success){
            alert('Baby registered successfully!');
        }else{
            alert('Registration failed: ' + result.error);
        }
    });
}

// Update baby data
export function updateBaby(id, babyData) {
    window.api.updateBaby(id, babyData).then(result => {
        if(result.success){
            alert('Baby updated successfully!');
        }else{
            alert('Update failed: ' + result.error);
        }
    });
}

// Delete baby data
export function deleteBaby(id) {
    window.api.deleteBaby(id).then(result => {
        if(result.success){
            alert('Baby deleted successfully!');
        }else{
            alert('Delete failed: ' + result.error);
        }
    });
}

export function init() {

    // Get modal elements
    const modal = document.getElementById('registrationModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close-btn');
    const cancelButton = document.querySelector('.cancel-button');
    const baptismForm = document.getElementById('baptismForm');

    // Function to open the modal
    const openModal = () => {
        // modal.style.display = 'block';
        window.api.printCertificate();
    };

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Event listeners to open/close modal
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
        baptismForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Create a FormData object to easily access form values
            const formData = new FormData(baptismForm);

            // Collect all fields into babyData
            const babyData = {};
            for (const [name, value] of formData.entries()) {
                babyData[name] = value;
            }

            // Call registerNewBaby to save to database
            registerNewBaby(babyData);

            // Loop through form data and update the certificate
            for (const [name, value] of formData.entries()) {
                // Find all elements on the certificate that match the input name
                const targetElements = document.querySelectorAll(`[data-id="${name}"]`);
                targetElements.forEach(el => {
                    el.textContent = value;
                });
            }

            // Also update the footer text which has special data-ids
            const christianName = formData.get('christian_name_en') || '';
            const properName = formData.get('proper_name_en') || '';
            const baptismDate = formData.get('baptism_date_en') || '';

            document.querySelector('[data-id="footer_christian_name"]').textContent = christianName;
            document.querySelector('[data-id="footer_proper_name"]').textContent = properName;
            document.querySelector('[data-id="footer_date"]').textContent = baptismDate;

            // Close the modal and reset the form
            closeModal();
            baptismForm.reset();
        });

}
