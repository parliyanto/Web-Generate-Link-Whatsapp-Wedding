/* ======================================================
   BEKASI PAGE — FULL UI + LOGIC (WITH CSS CLASSES)
====================================================== */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3?bundle&target=es2020";
console.log("Bekasi page loaded");


const supabase = createClient(
  "https://njdnhhbjdhtqaylhrxzv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZG5oaGJqZGh0cWF5bGhyeHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjM5NzMsImV4cCI6MjA3NjMzOTk3M30.PnlGDPgr7fCEmEDJrYac9mLM5_9GkRJp_6nxQ4C61tU"
);

const BEKASI_TABLE = "whatsapp_invites";
const BEKASI_LINK = "https://wedding-asrief.vercel.app/";

/* ======================================================
   RENDER UI INTO BEKASI TAB
====================================================== */

document.getElementById("bekasiContainer").innerHTML = `

  <label>Impor Data Excel (Kolom: Nama, Nomor)</label>
  <input type="file" id="excelBekasi" accept=".xlsx,.xls">
  <div id="loadingBekasi" style="display:none;font-weight:bold;color:#444;">⏳ Sedang memproses excel...</div>

  <p>Create Manual</p>

  <label>Nama Tamu:</label>
  <input type="text" id="nameBekasi">

  <label>Nomor WhatsApp:</label>
  <input type="text" id="phoneBekasi">

  <label>Datang dengan pasangan?</label>
  <select id="partnerBekasi">
      <option value="false">Tidak</option>
      <option value="true">Ya</option>
  </select>

  <button id="previewBekasiBtn" class="preview-btn">Preview Pesan</button>
  <button id="confirmBekasiBtn" class="preview-btn" style="display:none;">Konfirmasi & Generate</button>
  <button id="clearBekasiBtn" class="close-preview" style="display:none;">Clear Preview</button>

  <div id="previewBoxBekasi" class="preview" style="display:none;"></div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;">
     <h3 style="margin:0;">Log Undangan WhatsApp</h3>
     <div style="display:flex;gap:15px;align-items:center;">
       <span id="totalBekasi" style="font-weight:bold;color:#333;">Total: 0</span>
       <button id="deleteAllBekasi" class="delete-button">🗑 Hapus Semua</button>
     </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nama</th>
        <th>Nomor</th>
        <th>Pasangan</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody id="bekasiTableBody"></tbody>
  </table>
`;

/* ======================================================
   HELPERS
====================================================== */

function fixPhone(num) {
  if (typeof num === "number") return num.toFixed(0);
  return String(num || "").replace(/\D/g, "");
}

function generateMessageBekasi(name, partner) {
  const partnerText = partner 
    ? "Bapak/Ibu/Saudara/i berdua" 
    : "Bapak/Ibu/Saudara/i";

return `Assalamu'alaikum Wr. Wb

*Yth. ${name}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang ${partnerText}, teman sekaligus sahabat, untuk menghadiri acara pernikahan putra/i kami :

*Asri Cikita Putri, S.Ds & Arief Rachman Nugraha, S.T*

Yang akan dilaksanakan pada:
*Hari : Minggu, 7 Desember 2025*
*Waktu Akad Nikah : 07.30 – 09.00 WIB*
*Waktu Resepsi : 11.00 – 13.00 WIB*

*Lokasi : ARRODA Function Hall Darussalam*  
Jl. Cikunir Raya No 2A, Jakamulya Kota Bekasi

Link undangan:
${BEKASI_LINK}?guest_name=${encodeURIComponent(name)}

Merupakan suatu kebahagiaan bagi kami apabila ${partnerText} berkenan untuk hadir dan memberikan doa restu.
Atas perhatiannya, kami ucapkan terima kasih.

Asri & Arief.
Kel.Drs Agus Milad Jamal & Drg.Rita Febriyanti.
Kel. Madih S.Sos & Suminar S.Pd.
`;
}


/* ======================================================
   PREVIEW MANUAL
====================================================== */

let currentBekasi = {};

previewBekasiBtn.onclick = () => {

  const name = nameBekasi.value.trim();
  const phone = phoneBekasi.value.trim();
  const partner = partnerBekasi.value === "true";

  if (!name || !phone) return alert("❌ Nama & nomor wajib diisi.");

  const msg = generateMessageBekasi(name, partner);
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  currentBekasi = {
      guest_name: name,
      phone_number: phone,
      partner: partner,
      message_link: link
  };

  // convert *bold* WA → <b>bold</b> HTML
let htmlMessage = msg
  .replace(/\*(.*?)\*/g, "<b>$1</b>")
  .replace(/\n/g, "<br>");

  previewBoxBekasi.innerHTML = htmlMessage;
  previewBoxBekasi.style.display = "block";
  confirmBekasiBtn.style.display = "inline-block";
  clearBekasiBtn.style.display = "inline-block";
};

clearBekasiBtn.onclick = () => {
  previewBoxBekasi.style.display = "none";
  confirmBekasiBtn.style.display = "none";
  clearBekasiBtn.style.display = "none";
};

/* ======================================================
   SAVE MANUAL
====================================================== */

confirmBekasiBtn.onclick = async () => {
  await supabase.from(BEKASI_TABLE).insert([currentBekasi]);
  alert("✅ Undangan berhasil disimpan!");
  loadBekasi();
};

/* ======================================================
   IMPORT EXCEL (EXCEL SELALU TANPA PASANGAN)
====================================================== */

excelBekasi.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  loadingBekasi.style.display = "block";

  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  for (const r of rows) {
    const name = (r.Nama || "").trim();
    const phone = fixPhone(r.Nomor);
    if (!name || !phone) continue;

    const msg = generateMessageBekasi(name, false);
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    await supabase.from(BEKASI_TABLE).insert([
      { guest_name: name, phone_number: phone, partner: false, message_link: link }
    ]);
  }

  loadingBekasi.style.display = "none";
  loadBekasi();
});

/* ======================================================
   LOAD TABLE
====================================================== */

async function loadBekasi() {

  const { data } = await supabase
    .from(BEKASI_TABLE)
    .select("*")
    .order("id", { ascending: true });

  bekasiTableBody.innerHTML = "";
  totalBekasi.innerText = `Total: ${data.length}`;

  data.forEach((row, index) => {
    const encoded = btoa(row.message_link);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.guest_name}</td>
      <td>${row.phone_number}</td>
      <td>${row.partner ? "Ya" : "Tidak"}</td>
      <td>
        <button class="preview-btn" onclick="previewBekasiRow('${encoded}', ${index})">👁 Preview</button>
      </td>
    `;

    bekasiTableBody.appendChild(tr);
  });
}

/* ======================================================
   INLINE PREVIEW
====================================================== */

window.previewBekasiRow = (encoded, index) => {
  const link = atob(encoded);
  const rawMsg = decodeURIComponent(link.split("?text=")[1]);

  // Convert *bold* → <b>bold</b>
  const htmlMsg = rawMsg
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");


  document.querySelectorAll(".preview-row").forEach(x => x.remove());

  const table = bekasiTableBody;
  const original = table.children[index];

  const row = document.createElement("tr");
  row.className = "preview-row";

    row.innerHTML = `
    <td colspan="4">
      <div style="white-space:pre-line;">${htmlMsg}</div>

      <div style="margin-top:10px;display:flex;gap:10px;">
        <a class="preview-link" href="${link}" target="_blank">📤 Kirim WA</a>
        <button class="close-preview" onclick="this.closest('tr').remove()">✖ Tutup</button>
      </div>
    </td>
  `;


  original.after(row);
};

/* ======================================================
   DELETE ALL
====================================================== */

deleteAllBekasi.onclick = async () => {
  if (!confirm("Hapus SEMUA data Bekasi?")) return;
  await supabase.from(BEKASI_TABLE).delete().neq("id", 0);
  loadBekasi();
};

loadBekasi();
