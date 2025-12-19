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

  // reset hasil & badge
  document.getElementById("result").innerHTML = "";
  document.getElementById("badgeArea").innerHTML = "";
}

// =====================
// CEK JAWABAN
// =====================
function cekJawaban(index) {
  const id = getID();
  const item = soalData[id];
  const indexBenar = item.benar;
  const jawabanBenarText = item.opsi[indexBenar];

  const result = document.getElementById("result");
  const badgeArea = document.getElementById("badgeArea");
  const allBtn = document.querySelectorAll(".pilihan");

  // disable semua tombol
  allBtn.forEach(btn => btn.disabled = true);

  const isCorrect = index === indexBenar;

  // =====================
  // TAMPILKAN HASIL
  // =====================
  if (isCorrect) {
    result.innerHTML = `
      <span class="benar">
        Jawaban Benar! 🎉
      </span>
    `;
  } else {
    result.innerHTML = `
      <span class="salah">
        Jawaban Salah ❌<br>
        <strong>Jawaban yang benar adalah: ${jawabanBenarText}</strong>
      </span>
    `;
  }

  // =====================
  // WARNA TOMBOL
  // =====================
  allBtn[indexBenar].style.background = "#32CD32"; // hijau

  if (!isCorrect) {
    allBtn[index].style.background = "#FF6347"; // merah
  }

  // =====================
  // BADGE
  // =====================
  badgeArea.innerHTML = `
    <div class="badge ${isCorrect ? "badge-bener" : "badge-salah"}">
      ${isCorrect ? "🎉 Kamu Hebat!" : "💪 Semangat Lagi!"}
    </div>
  `;

  // =====================
  // CONFETTI (JIKA BENAR)
  // =====================
  if (isCorrect && typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}
