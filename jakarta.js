/* ======================================================
   JAKARTA PAGE — FULL UI + LOGIC (WITH CSS CLASSES)
====================================================== */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://njdnhhbjdhtqaylhrxzv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZG5oaGJqZGh0cWF5bGhyeHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjM5NzMsImV4cCI6MjA3NjMzOTk3M30.PnlGDPgr7fCEmEDJrYac9mLM5_9GkRJp_6nxQ4C61tU"
);

const JKT_TABLE = "whatsapp_invites_jakarta";
const JKT_LINK = "https://weddingbride-asrief.vercel.app/";

/* ======================================================
   RENDER UI INTO JAKARTA TAB
====================================================== */

document.getElementById("jakartaContainer").innerHTML = `

  <label>Impor Data Excel (Kolom: Nama, Nomor)</label>
  <input type="file" id="excelJakarta" accept=".xlsx,.xls">
  <div id="loadingJakarta" style="display:none;font-weight:bold;color:#444;">⏳ Sedang memproses excel...</div>

  <p>Create Manual</p>

  <label>Nama Tamu:</label>
  <input type="text" id="nameJakarta">

  <label>Nomor WhatsApp:</label>
  <input type="text" id="phoneJakarta">

  <label>Datang dengan pasangan?</label>
  <select id="partnerJakarta">
      <option value="false">Tidak</option>
      <option value="true">Ya</option>
  </select>

  <button id="previewJakartaBtn" class="preview-btn">Preview Pesan</button>
  <button id="confirmJakartaBtn" class="preview-btn" style="display:none;">Konfirmasi & Generate</button>
  <button id="clearJakartaBtn" class="close-preview" style="display:none;">Clear Preview</button>

  <div id="previewBoxJakarta" class="preview" style="display:none;"></div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;">
     <h3 style="margin:0;">Log Undangan WhatsApp</h3>
     <div style="display:flex;gap:15px;align-items:center;">
       <span id="totalJakarta" style="font-weight:bold;color:#333;">Total: 0</span>
       <button id="deleteAllJakarta" class="delete-button">🗑 Hapus Semua</button>
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
    <tbody id="jakartaTableBody"></tbody>
  </table>
`;

/* ======================================================
   HELPERS
====================================================== */
function fixPhone(num) {
  if (typeof num === "number") return num.toFixed(0);
  return String(num || "").replace(/\D/g, "");
}

/* ======================================================
   GENERATE MESSAGE (JAKARTA VERSION)
====================================================== */

function generateMessageJakarta(name, partner) {
  const partnerText = partner ? 
    "Bapak/Ibu/Saudara/i berdua" :
    "Bapak/Ibu/Saudara/i";

return `Assalamu'alaikum Wr. Wb

*Yth. ${name}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang ${partnerText}, teman sekaligus sahabat, untuk menghadiri acara pernikahan putra/i kami :

*Arief Rachman Nugraha, S.T & Asri Cikita Putri, S.Ds*

Yang akan dilaksanakan pada:
*Hari : Minggu, 14 Desember 2025*
*Waktu Acara : 11.00 – 16.00 WIB*

*Lokasi : PT Mustika Ratu, TBK – Head Office*
Jl. Mustika Ratu No.2 7, RT.7/RW.8, Ciracas Jakarta Timur.

Berikut link undangan kami untuk info lengkap dari acara bisa kunjungi :
${JKT_LINK}?guest_name=${encodeURIComponent(name)}

Merupakan suatu kebahagiaan bagi kami apabila ${partnerText} berkenan untuk hadir dan memberikan doa restu.
Atas perhatiannya, kami ucapkan terimakasih.

Arief & Asri.
Kel. Madih S.Sos & Suminar S.Pd.
Kel.Drs Agus Milad Jamal & Drg.Rita Febriyanti.
`;
}

/* ======================================================
   PREVIEW MANUAL
====================================================== */

let currentJakarta = {};

previewJakartaBtn.onclick = () => {

  const name = nameJakarta.value.trim();
  const phone = phoneJakarta.value.trim();
  const partner = partnerJakarta.value === "true";

  if (!name || !phone) return alert("❌ Nama & nomor wajib diisi.");

  const msg = generateMessageJakarta(name, partner);
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  currentJakarta = {
      guest_name: name,
      phone_number: phone,
      partner: partner,
      message_link: link
  };

  // Convert WA *bold* → HTML <b>
  const htmlMessage = msg
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");

  previewBoxJakarta.innerHTML = htmlMessage;
  previewBoxJakarta.style.display = "block";
  confirmJakartaBtn.style.display = "inline-block";
  clearJakartaBtn.style.display = "inline-block";
};

clearJakartaBtn.onclick = () => {
  previewBoxJakarta.style.display = "none";
  confirmJakartaBtn.style.display = "none";
  clearJakartaBtn.style.display = "none";
};

/* ======================================================
   SAVE MANUAL → SUPABASE
====================================================== */

confirmJakartaBtn.onclick = async () => {
  await supabase.from(JKT_TABLE).insert([currentJakarta]);
  alert("✅ Undangan berhasil disimpan!");
  loadJakarta();
};

/* ======================================================
   IMPORT EXCEL
====================================================== */

excelJakarta.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  loadingJakarta.style.display = "block";

  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  for (const r of rows) {
    const name = (r.Nama || "").trim();
    const phone = fixPhone(r.Nomor);
    if (!name || !phone) continue;

    const msg = generateMessageJakarta(name, false);
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    await supabase.from(JKT_TABLE).insert([
      { guest_name: name, phone_number: phone, partner: false, message_link: link }
    ]);
  }

  loadingJakarta.style.display = "none";
  loadJakarta();
});

/* ======================================================
   LOAD TABLE
====================================================== */

async function loadJakarta() {

  const { data } = await supabase
    .from(JKT_TABLE)
    .select("*")
    .order("id", { ascending: true });

  jakartaTableBody.innerHTML = "";
  totalJakarta.innerText = `Total: ${data.length}`;

  data.forEach((row, index) => {
    const encoded = btoa(row.message_link);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.guest_name}</td>
      <td>${row.phone_number}</td>
      <td>${row.partner ? "Ya" : "Tidak"}</td>
      <td>
        <button class="preview-btn" onclick="previewJakartaRow('${encoded}', ${index})">👁 Preview</button>
      </td>
    `;

    jakartaTableBody.appendChild(tr);
  });
}

/* ======================================================
   INLINE PREVIEW
====================================================== */

window.previewJakartaRow = (encoded, index) => {
  const link = atob(encoded);
  const rawMsg = decodeURIComponent(link.split("?text=")[1]);

  const htmlMsg = rawMsg
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");

  document.querySelectorAll(".preview-row").forEach(x => x.remove());

  const table = jakartaTableBody;
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

deleteAllJakarta.onclick = async () => {
  if (!confirm("Hapus SEMUA data Jakarta?")) return;
  await supabase.from(JKT_TABLE).delete().neq("id", 0);
  loadJakarta();
};

loadJakarta();
