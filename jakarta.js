/* ======================================================
   JAKARTA PAGE — FINAL VERSION WITH PROGRESS BAR
====================================================== */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3?bundle&target=es2020";
console.log("Jakarta page loaded");

const supabase = createClient(
  "https://njdnhhbjdhtqaylhrxzv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZG5oaGJqZGh0cWF5bGhyeHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjM5NzMsImV4cCI6MjA3NjMzOTk3M30.PnlGDPgr7fCEmEDJrYac9mLM5_9GkRJp_6nxQ4C61tU"
);

const TABLE = "whatsapp_invites_jakarta";
const BASE_LINK = "https://postwedding-asrief.vercel.app/";

/* ======================================================
   WAIT DOM READY
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initJakartaUI();
  initJakartaLogic();
});


/* ======================================================
   RENDER UI
====================================================== */
function initJakartaUI() {
  document.getElementById("jakartaContainer").innerHTML = `
    <label>Impor Data Excel (Kolom: Nama, Nomor)</label>
    <input type="file" id="excelJakarta" accept=".xlsx,.xls">
    <div id="loadingJakarta" style="display:none;font-weight:bold;color:#444;">⏳ Sedang memproses excel...</div>

    <!-- PROGRESS BAR -->
    <div id="progressJakartaWrapper" style="display:none; margin:10px 0;">
      <div style="background:#eee; width:100%; height:20px; border-radius:6px; overflow:hidden;">
        <div id="progressJakartaBar" style="height:100%; width:0%; background:#4f46e5; transition:0.2s;"></div>
      </div>
      <p id="progressJakartaText" style="margin-top:5px; font-size:14px; font-weight:bold;"></p>
    </div>

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
      <h3>Log Undangan WhatsApp</h3>
      <div style="display:flex;gap:15px;align-items:center;">
        <span id="totalJakarta">Total: 0</span>
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
}


/* ======================================================
   MAIN LOGIC
====================================================== */
function initJakartaLogic() {

  const excel = document.getElementById("excelJakarta");
  const name = document.getElementById("nameJakarta");
  const phone = document.getElementById("phoneJakarta");
  const partner = document.getElementById("partnerJakarta");
  const previewBtn = document.getElementById("previewJakartaBtn");
  const confirmBtn = document.getElementById("confirmJakartaBtn");
  const clearBtn = document.getElementById("clearJakartaBtn");

  const previewBox = document.getElementById("previewBoxJakarta");
  const totalEl = document.getElementById("totalJakarta");
  const tableBody = document.getElementById("jakartaTableBody");
  const loading = document.getElementById("loadingJakarta");

  const progressWrap = document.getElementById("progressJakartaWrapper");
  const progressBar = document.getElementById("progressJakartaBar");
  const progressText = document.getElementById("progressJakartaText");

  let current = null;


  /* ========== Generate Message ========== */
  function generateMessage(name, partner) {
    const partnerText = partner 
    ? "Bapak/Ibu/Saudara/i berdua" 
    : "Bapak/Ibu/Saudara/i";

    // 🟦 Fix agar greeting juga ikut pasangan
  const nameDisplay = partner
    ? `${name} & Pasangan`
    : name;

return `Assalamu'alaikum Wr. Wb

*Yth. ${nameDisplay}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang ${partnerText}, teman sekaligus sahabat, untuk menghadiri acara resepsi pernikahan putra/i kami :

*Arief Rachman Nugraha, S.T & Asri Cikita Putri, S.Ds*

yang akan dilaksanakan pada:
*Hari: Minggu, 14 Desember 2025*
*Waktu Acara: 11.00 – 16.00 WIB*
*Lokasi: PT Mustika Ratu Tbk — Head Office*
Jl. Mustika Ratu No.2 7, RT.7/RW.8, Ciracas Jakarta Timur.

_Berikut ini kami kirimkan link undangan digital mengenai detail acara:_
_${BASE_LINK}?guest_name=${encodeURIComponent(name)}_

Merupakan suatu kebahagiaan bagi kami apabila ${partnerText} berkenan untuk hadir dan memberikan doa restu.

Atas perhatiannya, kami ucapkan terima kasih.

Arief & Asri
Kel. Madih S.Sos & Suminar S.Pd.
Kel. Drs. Agus Milad Jamal & Drg.Rita Febriyanti.
`;
  }


  /* ========== PREVIEW ========== */
  previewBtn.onclick = () => {
    if (!name.value || !phone.value) return alert("Isi nama & nomor dulu.");

    const msg = generateMessage(name.value.trim(), partner.value === "true");
    const link = `https://wa.me/${phone.value.trim()}?text=${encodeURIComponent(msg)}`;

    current = {
      guest_name: name.value.trim(),
      phone_number: phone.value.trim(),
      partner: partner.value === "true",
      message_link: link
    };

    previewBox.innerHTML = msg
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/\n/g, "<br>");
    previewBox.style.display = "block";
    confirmBtn.style.display = "inline-block";
    clearBtn.style.display = "inline-block";
  };

  clearBtn.onclick = () => {
    previewBox.style.display = "none";
    confirmBtn.style.display = "none";
    clearBtn.style.display = "none";
  };


  /* ========== SAVE MANUAL ========== */
  confirmBtn.onclick = async () => {
    const { error } = await supabase.from(TABLE).insert([current]);

    if (error) return alert("❌ Error: " + error.message);

    alert("Berhasil disimpan!");
    loadJakarta();
  };


  /* ======================================================
     IMPORT EXCEL — WITH PROGRESS BAR
  ======================================================= */
  excel.addEventListener("change", async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    loading.style.display = "block";

    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // SHOW PROGRESS BAR
    progressWrap.style.display = "block";
    progressBar.style.width = "0%";

    let total = rows.length;
    let processed = 0;

    for (const r of rows) {
      const nama = (r.Nama || "").trim();
      const nomor = String(r.Nomor || "").replace(/\D/g, "");

      if (!nama || !nomor) {
        processed++;
        continue;
      }

      const msg = generateMessage(nama, false);
      const link = `https://wa.me/${nomor}?text=${encodeURIComponent(msg)}`;

      await supabase.from(TABLE).insert([
        { guest_name: nama, phone_number: nomor, partner: false, message_link: link }
      ]);

      // UPDATE PROGRESS
      processed++;
      const percent = Math.round((processed / total) * 100);

      progressBar.style.width = percent + "%";
      progressText.innerText = `Memproses ${processed} / ${total} (${percent}%)`;
    }

    // COMPLETE
    loading.style.display = "none";
    progressText.innerText = "✔ Import selesai!";

    setTimeout(() => {
      progressWrap.style.display = "none";
      progressBar.style.width = "0%";
    }, 1500);

    loadJakarta();
  });


  /* ========== LOAD TABLE ========== */
  async function loadJakarta() {
    const { data } = await supabase
      .from(TABLE)
      .select("*")
      .order("id", { ascending: true });

    tableBody.innerHTML = "";
    totalEl.innerText = "Total: " + data.length;

    data.forEach((row, idx) => {
      const encoded = btoa(row.message_link);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.guest_name}</td>
        <td>${row.phone_number}</td>
        <td>${row.partner ? "Ya" : "Tidak"}</td>
        <td><button onclick="previewJakartaRow('${encoded}', ${idx})">👁 Preview</button></td>
      `;

      tableBody.appendChild(tr);
    });
  }


  /* ========== INLINE PREVIEW ========== */
  window.previewJakartaRow = (encoded, idx) => {
    const link = atob(encoded);
    const rawMsg = decodeURIComponent(link.split("?text=")[1]);
    const htmlMsg = rawMsg
    .replace(/\*(.*?)\*/g, "<b>$1</b>")        // Bold
    .replace(/_(.*?)_/g, "<i>$1</i>")          // Italic WA → HTML
    .replace(/\n/g, "<br>");


    document.querySelectorAll(".preview-row").forEach(x => x.remove());

    const baseRow = tableBody.children[idx];
    const pr = document.createElement("tr");
    pr.className = "preview-row";

    pr.innerHTML = `
      <td colspan="4">
        ${htmlMsg}
        <div style="margin-top:10px; display:flex; gap:10px; border-top:1px solid #ccc; padding-top:10px;">
          <button><a href="${link}" target="_blank">📤 Kirim WA</a></button>
          <button onclick="this.closest('tr').remove()">✖ Tutup</button>
        </div>
      </td>
    `;

    baseRow.after(pr);
  };


  /* ========== DELETE ALL ========== */
  document.getElementById("deleteAllJakarta").onclick = async () => {
    if (!confirm("Hapus semua data Jakarta?")) return;

    await supabase.from(TABLE).delete().neq("id", 0);
    loadJakarta();
  };

  loadJakarta();
}
