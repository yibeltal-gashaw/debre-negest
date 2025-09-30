export function init(){
    const modal = document.getElementById("add-hr-modal");
    const add = document.getElementById("fab-add-hr");
    const close = document.getElementById("close-modal");
    const form = document.getElementById("addHrForm");

    let currentStep = 1;
    const totalSteps = 3;
  
    function showStep(step) {
      for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(`step-${i}`).style.display = (i === step) ? 'block' : 'none';
        document.querySelectorAll('.progress-bar .step')[i - 1].classList.toggle('active', i === step);
      }
    }
  
    document.getElementById('next-1').onclick = () => { currentStep = 2; showStep(currentStep); };
    document.getElementById('back-2').onclick = () => { currentStep = 1; showStep(currentStep); };
    document.getElementById('next-2').onclick = () => { currentStep = 3; showStep(currentStep); };
    document.getElementById('back-3').onclick = () => { currentStep = 2; showStep(currentStep); };
  
    // On modal open:
    showStep(currentStep);

    add.addEventListener("click", function(){
        modal.style.display = "block";
    });

    close.addEventListener("click", function(){
        modal.style.display = "none";
    });

    form.onsubmit = function(e){
        e.preventDefault();
        const data = {
            name:document.getElementById('name').value,
            cname:document.getElementById('cname').value,
            phone:document.getElementById('phone').value,
            age:document.getElementById('age').value,
            service:document.getElementById('service').value,
            yenshaAbat:document.getElementById('yenshaAbat').value,
            address:document.getElementById('address').value,
            startingDate:document.getElementById('startingDate').value,
            married:document.getElementById('married').value,
            single:document.getElementById('single').value,
            photo:document.getElementById('photo').value,
        }
        console.log(data);
    }

}