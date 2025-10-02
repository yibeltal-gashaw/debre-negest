
export function init() {
  const section = document.getElementById("info-section");
  const couple = JSON.parse(localStorage.getItem("couples"));
  const long_info = document.getElementById("long-info");

  const printBtn = document.getElementById("print-certificate-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.api.printCertificate();
    });
  }

  const photo =
    couple.husband_photo == null
      ? "../../assets/images/avatar.png"
      : couple.husband_photo;
    const wphoto =
    couple.wife_photo == null
      ? "../../assets/images/avatar.png"
      : couple.wife_photo;
  document.getElementById(
    "husbandPhoto"
  ).style.backgroundImage = `url('${photo}')`;
  document.getElementById(
    "wifePhoto"
  ).style.backgroundImage = `url('${wphoto}')`;

  section.innerHTML = `
        <div class="info d">
          <div>
            <label>የባል ስም </label>
            <input type="text" id="husbandNameAm" placeholder="${couple.husband_name_am}" disabled/>
          </div>
          <div>
            <label>Name of Husband </label>
            <input type="text" id="husbandNameEn" placeholder="${couple.husband_name_en}" disabled/>
          </div>
          <div>
            <label>የመፅሐፍ ስም </label>
            <input type="text" id="husbandChristianNameAm" placeholder="${couple.husband_christian_name_am}" disabled/>
          </div>
          <div>
            <label>Christian Name</label>
            <input type="text" id="husbandChristianNameEn" placeholder="${couple.husband_christian_name_en}" disabled />
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="text" id="husbandDob" placeholder="${couple.husband_dob}" disabled/>
          </div>
          <div>
            <label>የትውልድ ቦታ</label>
            <input type="text" id="husbandBirthPlaceAm" placeholder="${couple.husband_birth_place_am}" disabled />
          </div>
          <div>
            <label>Place of Birth</label>
            <input type="text" id="husbandBirthPlaceEn" placeholder="${couple.husband_birth_place_en}"disabled />
          </div>
          <div>
            <label>የመኖሪያ አድራሻ </label>
            <input type="text" id="husbandResidenceAm" placeholder="${couple.husband_residence_am} " disabled/>
          </div>
          <div>
            <label>Residence</label>
            <input type="text" id="husbandResidenceEn" placeholder="${couple.husband_residence_en}" disabled/>
          </div>
          <div>
            <label>ዜግነት</label>
            <input type="text" id="husbandNationalityAm" placeholder=${couple.husband_nationality_am} disabled/>
          </div>
          <div>
            <label>Nationality</label>
            <input type="text" id="husbandNationalityEn" placeholder=${couple.husband_nationality_en} disabled/>
          </div>
          <div>
            <label>የአባት ስም</label>
            <input type="text" id="husbandFatherNameAm" placeholder="${couple.husband_father_name_am}" disabled/>
          </div>
          <div>
            <label>Father's Name</label>
            <input type="text" id="husbandFatherNameEn" placeholder="${couple.husband_father_name_en}" disabled/>
          </div>
          <div>
            <label>የእናት ስም</label>
            <input type="text" id="husbandMotherNameAm" placeholder="${couple.husband_mother_name_am}" disabled/>
          </div>
          <div>
            <label>Mother's Name</label>
            <input type="text" id="husbandMotherNameEn" placeholder="${couple.husband_mother_name_en}" disabled/>
          </div>
        </div>

        <div class="info d">
          <div>
            <label>የሚስት ስም</label>
            <input type="text" id="wifeNameAm" placeholder="${couple.wife_name_am}" disabled/>
          </div>
          <div>
            <label>Name Of Wife</label>
            <input type="text" id="wifeNameEn" placeholder="${couple.wife_name_en}" disabled/>
          </div>
          <div>
            <label>የመፅሐፍ ስም </label>
            <input type="text" id="wifeChristianNameAm" placeholder="${couple.wife_christian_name_am}" disabled/>
          </div>
          <div>
            <label>Christian Name</label>
            <input type="text" id="wifeChristianNameEn" placeholder="${couple.wife_christian_name_en}" disabled/>
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="text" id="wifeDob" placeholder="${couple.wife_dob}" disabled/>
          </div>
          <div>
            <label>የትውልድ ቦታ</label>
            <input type="text" id="wifeBirthPlaceAm" placeholder="${couple.wife_birth_place_am}" disabled/>
          </div>
          <div>
            <label>Place of Birth</label>
            <input type="text" id="wifeBirthPlaceEn" placeholder="${couple.wife_birth_place_en}" disabled/>
          </div>
          <div>
            <label>የመኖሪያ አድራሻ </label>
            <input type="text" id="wifeResidenceAm" placeholder="${couple.wife_residence_am}" disabled/>
          </div>
          <div>
            <label>Residence</label>
            <input type="text" id="wifeResidenceEn" placeholder="${couple.wife_residence_en}" disabled />
          </div>
          <div>
            <label>ዜግነት</label>
            <input type="text" id="wifeNationalityAm" placeholder=${couple.wife_nationality_am} disabled />
          </div>
          <div>
            <label>Nationality</label>
            <input type="text" id="wifeNationalityEn" placeholder=${couple.wife_nationality_en} disabled />
          </div>
          <div>
            <label>የአባት ስም</label>
            <input type="text" id="wifeFatherNameAm" placeholder="${couple.wife_father_name_am}" disabled />
          </div>
          <div>
            <label>Father's Name</label>
            <input type="text" id="wifeFatherNameEn" placeholder=${couple.wife_father_name_en} disabled />
          </div>
          <div>
            <label>የእናት ስም</label>
            <input type="text" id="wifeMotherNameAm" placeholder=${couple.wife_mother_name_am} disabled />
          </div>
          <div>
            <label>Mother's Name</label>
            <input type="text" id="wifeMotherNameEn" placeholder=${couple.wife_mother_name_en} disabled />
          </div>
        </div>
    `;
  long_info.innerHTML = `
        <div><label>ጋብቻው የተፈፀመበት ቤተክርስቲያን (ገዳም)</label><input type="text" id="churchName" placeholder=${couple.church_name} disabled /></div>
        <div><label>ቃል ኪዳኑን የፈፀሙት ካህን (ቆሞስ)</label><input type="text" id="officiatingPriest" placeholder=${couple.officiating_priest} disabled /></div>
        <div><label>ጋብቻው የተፈፀመበት ቀን</label><input type="text" id="marriageDate" placeholder=${couple.marriage_date} disabled /></div>
        <div><label>ጋብቻው የተፈፀመበት ዕለት</label><input type="text" id="marriageDay" placeholder=${couple.marriage_day} disabled /></div>
        <div><label>የተጋቢዎች የነብስ አባት (አበነብስ)</label><input type="text" id="spiritualFather" placeholder=${couple.spiritual_father} disabled /></div>
        <div><label>የባል ፊርማ________________ </label></div>
        <div><label>የሚስት ፊርማ______________ </label></div>
        
        <div><label>የእማኞች ስም</label><label>ፊርማ</label></div>
        <div>1ኛ.<label class="underline pl1">${couple.emagn1}</label></label><label>________________</label></div>
        <div>2ኛ.<label class="underline pl1">${couple.emagn2}</label></label><label>________________</label></div>
        <div>3ኛ.<label class="underline pl1">${couple.emagn3}</label></label><label>________________</label></div>
    `;
}
