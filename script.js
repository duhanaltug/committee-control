// Örnek üye verileri (localStorage'dan alınacak veya varsayılan olarak kullanılacak)
let members = JSON.parse(localStorage.getItem("members")) || [];

// Ay isimlerini tanımlama
const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

// Üye listesini görüntüleme fonksiyonu
function displayMembers() {
  const memberList = document.getElementById("memberList");
  memberList.innerHTML = "";
  members.forEach((member, index) => {
    const memberDiv = document.createElement("div");
    memberDiv.classList.add("member");

    const nameDiv = document.createElement("div");
    nameDiv.textContent = member.name;
    nameDiv.classList.add("name"); // Üye ismi için class eklendi
    memberDiv.appendChild(nameDiv);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", () => deleteMember(index));
    memberDiv.appendChild(deleteButton);

    memberDiv.addEventListener("click", () => showPaymentDetails(index)); // Üye üzerine tıklama olayı eklendi

    memberList.appendChild(memberDiv);
  });
}

// Ödeme detaylarını görüntüleme fonksiyonu
function showPaymentDetails(index) {
  const paymentDetails = document.getElementById("paymentDetails");
  paymentDetails.innerHTML = "";
  const member = members[index];
  const paymentList = document.createElement("ul");
  member.payments.forEach((payment, month) => {
    const listItem = document.createElement("li");
    listItem.id = `payment-${index}-${month}`; // Benzersiz ID tanımlaması

    const monthBox = document.createElement("div");
    monthBox.classList.add("monthBox");
    monthBox.textContent = monthNames[month];

    const statusBox = document.createElement("div");
    statusBox.classList.add("statusBox");
    statusBox.textContent = payment ? "Ödendi" : "Ödenmedi";
    statusBox.style.backgroundColor = payment ? "green" : "red";

    listItem.appendChild(monthBox);
    listItem.appendChild(statusBox);

    // Ödeme yapılacak aylara tıklanabilirlik özelliği ekleme
    listItem.addEventListener("click", () => {
      if (!payment) {
        markPayment(index, month);
      }
    });

    // Ödeme iptal etme butonu
    if (payment) {
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "İptal Et";
      cancelButton.classList.add("cancelButton");
      cancelButton.addEventListener("click", () => cancelPayment(index, month));
      listItem.appendChild(cancelButton);
    }

    paymentList.appendChild(listItem);
  });
  paymentDetails.appendChild(paymentList);
}

// Yeni üye ekleme fonksiyonu
function addMember(name) {
  members.push({ name: name, payments: Array(12).fill(false) });
  localStorage.setItem("members", JSON.stringify(members));
  displayMembers();
}

// Üye silme fonksiyonu
function deleteMember(index) {
  members.splice(index, 1);
  localStorage.setItem("members", JSON.stringify(members));
  displayMembers(); // Üye listesini güncelle
}

// Ödemeyi işaretleme fonksiyonu
function markPayment(memberIndex, month) {
  members[memberIndex].payments[month] = true;
  localStorage.setItem("members", JSON.stringify(members));

  // İşaretlenen ödemenin rengini ve içeriğini güncelleme
  const paymentItem = document.getElementById(
    `payment-${memberIndex}-${month}`
  );
  if (paymentItem) {
    const statusBox = paymentItem.querySelector(".statusBox");
    statusBox.textContent = "Ödendi";
    statusBox.style.backgroundColor = "green";
  }

  showPaymentDetails(memberIndex);
}

// Ödemeyi iptal etme fonksiyonu
function cancelPayment(memberIndex, month) {
  members[memberIndex].payments[month] = false;
  localStorage.setItem("members", JSON.stringify(members));

  // İptal edilen ödemenin rengini ve içeriğini güncelleme
  const paymentItem = document.getElementById(
    `payment-${memberIndex}-${month}`
  );
  if (paymentItem) {
    const statusBox = paymentItem.querySelector(".statusBox");
    statusBox.textContent = "Ödenmedi";
    statusBox.style.backgroundColor = "red";
  }

  showPaymentDetails(memberIndex);
}

// Sayfa yüklendiğinde üye listesini görüntüle
window.onload = function () {
  displayMembers();
};

// Üye ekleme formunu dinleme
const addMemberForm = document.getElementById("addMemberForm");
addMemberForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Sayfanın yeniden yüklenmesini önler
  const memberNameInput = document.getElementById("memberName");
  const memberName = memberNameInput.value.trim();
  if (memberName !== "") {
    addMember(memberName);
    memberNameInput.value = ""; // Formu temizle
  } else {
    alert("Üye adı boş olamaz!");
  }
});

// Üye filtreleme fonksiyonu
function filterMembers() {
  const filterValue = document
    .getElementById("filterInput")
    .value.toUpperCase();
  const members = document.querySelectorAll("#memberList .member");

  members.forEach((member) => {
    const name = member.querySelector(".name").textContent.toUpperCase();
    if (name.includes(filterValue)) {
      member.style.display = "";
    } else {
      member.style.display = "none";
    }
  });
}

// Arama kutusunu dinleme
const filterInput = document.getElementById("filterInput");
filterInput.addEventListener("input", filterMembers);
