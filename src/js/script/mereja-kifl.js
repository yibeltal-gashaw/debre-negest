export function init(){
    const add = document.getElementById("fab-add-kiflat");
    const close = document.getElementById("close-modal");
    const modal = document.getElementById("add-kiflat-modal");
    const form = document.getElementById('kiflat-form');

    add.addEventListener("click", function(e){
        e.preventDefault();
        modal.style.display = "block";
    })
    close.addEventListener("click", function(e){
        e.preventDefault();
        modal.style.display = "none";
    });

    form.onsubmit = ()=>{
        const kiflatData = {
            kiflatName: document.getElementById('kiflatName').value,
            kiflatRep: document.getElementById('kiflatRep').value,
            repPhone: document.getElementById('repPhone').value,
            kiflatSize: document.getElementById('kiflatSize').value,
            kiflatYearlyPlan: document.getElementById('kiflatYearlyPlan').value,
        }
    
        console.log(kiflatData);
    }
}