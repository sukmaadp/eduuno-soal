let soalData = {};

fetch("soal.json")
  .then(res => res.json())
  .then(data => {
    soalData = data;
    loadSoal();
  });

function getID() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

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
      <button class="pilihan" data-index="${i}" onclick="cekJawaban(${i})">${text}</button>
    `;
  });
}

function cekJawaban(index) {
  const id = getID();
  const benar = soalData[id].benar;
  const result = document.getElementById("result");
  const badgeArea = document.getElementById("badgeArea");

  // disable semua tombol
  const allBtn = document.querySelectorAll(".pilihan");
  allBtn.forEach(btn => btn.disabled = true);

  // jawaban benar atau salah
  const isCorrect = index === benar;

  if (isCorrect) {
    result.innerHTML = "<span class='benar'>Jawaban Benar!</span>";
  } else {
    result.innerHTML = "<span class='salah'>Jawaban Salah!</span>";
  }

  // warna tombol
  allBtn[benar].style.background = "green";
  allBtn[index].style.background = (isCorrect ? "green" : "red");

  // Tampilkan badge
  badgeArea.innerHTML = `
    <div class="badge ${isCorrect ? 'badge-bener' : 'badge-salah'}">
      ${isCorrect ? "🎉 Kamu Hebat!" : "💪 Semangat Lagi!"}
    </div>
  `;

  // Animasi confetti jika benar
  if (isCorrect) {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}
