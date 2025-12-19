let soalData = {};

// =====================
// LOAD DATA SOAL
// =====================
fetch("soal.json")
  .then(res => res.json())
  .then(data => {
    soalData = data;
    loadSoal();
  })
  .catch(err => {
    document.getElementById("container").innerHTML =
      "<h2>Gagal memuat soal!</h2>";
    console.error(err);
  });

// =====================
// AMBIL ID DARI URL
// =====================
function getID() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

// =====================
// LOAD SOAL
// =====================
function loadSoal() {
  const id = getID();

  if (!id || !soalData[id]) {
    document.getElementById("container").innerHTML =
      "<h2>ID Soal tidak ditemukan!</h2>";
    return;
  }

  const item = soalData[id];

  document.getElementById("kategori").innerText = item.kategori;
  document.getElementById("soal").innerText = item.soal;

  const opsiContainer = document.getElementById("opsi");
  opsiContainer.innerHTML = "";

  item.opsi.forEach((text, i) => {
    opsiContainer.innerHTML += `
      <button class="pilihan" onclick="cekJawaban(${i})">
        ${text}
      </button>
    `;
  });

  document.getElementById("result").innerHTML = "";
  document.getElementById("badgeArea").innerHTML = "";
}

// =====================
// CEK JAWABAN
// =====================
function cekJawaban(index) {
  const id = getID();
  const item = soalData[id];
  const benarIndex = item.benar;
  const jawabanBenar = item.opsi[benarIndex];

  const result = document.getElementById("result");
  const badgeArea = document.getElementById("badgeArea");
  const tombol = document.querySelectorAll(".pilihan");

  tombol.forEach(btn => btn.disabled = true);

  const isCorrect = index === benarIndex;

  if (isCorrect) {
    result.innerHTML = `<span class="benar">Jawaban Benar! 🎉</span>`;
  } else {
    result.innerHTML = `
      <span class="salah">
        Jawaban Salah ❌<br>
        <strong>Jawaban benar: ${jawabanBenar}</strong>
      </span>
    `;
  }

  tombol[benarIndex].style.background = "#2ecc71";
  if (!isCorrect) {
    tombol[index].style.background = "#e74c3c";
  }

  badgeArea.innerHTML = `
    <div class="badge ${isCorrect ? "badge-bener" : "badge-salah"}">
      ${isCorrect ? "🎉 Kamu Hebat!" : "💪 Coba Lagi!"}
    </div>
  `;

  if (isCorrect && typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });
  }
}
