/* ================= LOCAL "DATABASE" (DEMO VERSION) =================
   No live backend — all enquiries live in the visitor's own browser
   via localStorage, so testing this demo never touches the real
   production database or sends a real WhatsApp message. */

const LS_KEY = "demo_enquiries";

function lsGetAll() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
function lsSetAll(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}
function lsAdd(data) {
  const all = lsGetAll();
  const id  = "demo_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  all[id] = data;
  lsSetAll(all);
  return id;
}
function lsDelete(id) {
  const all = lsGetAll();
  delete all[id];
  lsSetAll(all);
}



/* ================= MAIN FORM ================= */

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
  student: document.getElementById("student").value,
  phone: document.getElementById("phone").value,
  father: document.getElementById("father").value,
  mother: document.getElementById("mother").value,
  className: document.getElementById("className").value,
  query: document.getElementById("query").value || "N/A",
  date: new Date().toLocaleString()
};

  // Demo version — save locally instead of a live backend
  lsAdd(data);

  alert("ℹ️ Demo Mode\n\nThis is a live demo — no real WhatsApp number is linked.\n\nTo receive enquiries via WhatsApp, connect your own number. You can view this submitted enquiry in the Admin Panel (Email: testing@gmail.com / Password: testing1234).");

  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 2000);

  this.reset();
});


/* ================= LOGIN PAGE ================= */

window.openLogin = function openLogin() {

  // Portfolio demo — no Firebase here at all, login is a fixed demo
  // account checked instantly, no network round-trip involved.
  //
  // Built with DOM APIs instead of document.write(), which is an old,
  // inconsistently-supported API that can throw unpredictable errors
  // across different browsers/extensions. createElement + appendChild
  // is the reliable, modern way to build a popup window's content.
  let win = window.open("", "_blank");
  if (!win) {
    alert("Your browser blocked this popup. Please allow popups for this site and try again.");
    return;
  }

  win.document.title = "Admin Login";

  const meta = win.document.createElement("meta");
  meta.setAttribute("charset", "UTF-8");
  win.document.head.appendChild(meta);

  const style = win.document.createElement("style");
  style.textContent = `
body{margin:0;font-family:Arial;background:url("img2.jpg") center/cover fixed;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px;}
.login{background:rgba(255,255,255,0.15);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.25);padding:30px;border-radius:18px;width:100%;max-width:340px;color:white;box-shadow:0 15px 35px rgba(0,0,0,0.4);}
input{width:90%;display:block;margin:8px auto;padding:12px;border-radius:6px;border:none;}
.pass-box{display:flex;gap:5px;margin:8px auto;width:90%;}
.pass-box input{flex:1;margin:0;width:auto;}
.pass-box button{padding:12px;background:#333;border:none;color:white;border-radius:6px;cursor:pointer;}
.login button.login-btn{width:90%;margin:12px auto 0;display:block;padding:12px;background:#000;color:white;border:none;border-radius:6px;cursor:pointer;}
.login button.login-btn:disabled{opacity:0.5;cursor:not-allowed;}
.err{color:#ff6b6b;font-size:13px;text-align:center;margin:4px 0 0;min-height:16px;}
.status{color:#ffd166;font-size:12px;text-align:center;margin:4px 0 0;}
.forgot{display:block;text-align:center;margin-top:10px;font-size:13px;color:#cde;cursor:pointer;text-decoration:underline;}
`;
  win.document.head.appendChild(style);

  win.document.body.insertAdjacentHTML("beforeend", `
<div class="login">
<h3>Admin Login</h3>
<p style="font-size:12px;text-align:center;opacity:0.85;margin-top:-6px;">Demo login - Email: <strong>testing@gmail.com</strong><br>Password: <strong>testing1234</strong></p>

<input type="email" id="email" placeholder="Email">

<div class="pass-box">
<input type="password" id="pass" placeholder="Password">
<button type="button" id="toggleBtn">👁</button>
</div>

<button class="login-btn" id="loginBtn">Login</button>
<p class="err" id="err"></p>
<span class="forgot" id="forgotLink">Forgot Password?</span>
</div>
`);

  // Note: attaching behavior via addEventListener (not inline onclick=""),
  // since this script is appended as a real DOM node — appendChild always
  // executes scripts, unlike innerHTML/document.write which can be blocked.
  const script = win.document.createElement("script");
  script.textContent = `
const DEMO_ADMIN_EMAIL    = "testing@gmail.com";
const DEMO_ADMIN_PASSWORD = "testing1234";

function togglePass(){
  let p = document.getElementById("pass");
  p.type = p.type === "password" ? "text" : "password";
}

function login(){
  const email = document.getElementById("email").value.trim();
  const pass  = document.getElementById("pass").value;
  const errEl = document.getElementById("err");
  errEl.textContent = "";

  if(!email || !pass){
    errEl.textContent = "Please enter email and password.";
    return;
  }

  if(email === DEMO_ADMIN_EMAIL && pass === DEMO_ADMIN_PASSWORD){
    window.opener.openDashboard();
    window.close();
  } else {
    errEl.textContent = "Wrong email or password.";
  }
}

function forgotPassword(){
  const email = document.getElementById("email").value.trim();
  const errEl = document.getElementById("err");
  errEl.textContent = "";

  if(!email){
    errEl.textContent = "Enter your email above first, then click Forgot Password.";
    return;
  }

  alert("[Demo] This is a demo version with no connected backend.\\n\\nTo enable the password-reset-email feature, connect this project to your own Firebase project (Authentication).");
}

document.getElementById("toggleBtn").addEventListener("click", togglePass);
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("forgotLink").addEventListener("click", forgotPassword);
`;
  win.document.body.appendChild(script);
}


/* ================= DASHBOARD ================= */

window.openDashboard = function openDashboard() {

  let win = window.open("", "_blank");
  if (!win) {
    alert("Your browser blocked this popup. Please allow popups for this site and try again.");
    return;
  }

  win.document.title = "Admin Dashboard";

  const meta = win.document.createElement("meta");
  meta.setAttribute("charset", "UTF-8");
  win.document.head.appendChild(meta);

  const style = win.document.createElement("style");
  style.textContent = `
body{margin:0;font-family:Arial;background:url("img2.jpg") center/cover fixed;padding:10px;}
.dashboard{background:rgba(255,255,255,0.15);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.25);padding:20px;border-radius:18px;max-width:1100px;margin:auto;color:white;}
table{width:100%;border-collapse:collapse;background:white;color:black;}
th,td{border:1px solid #ccc;padding:6px;text-align:center;}
button{padding:6px 10px;background:#333;color:white;border:none;margin:3px;border-radius:5px;}
button:disabled{opacity:0.5;cursor:not-allowed;}
.status{color:#ffd166;font-size:13px;}
`;
  win.document.head.appendChild(style);

  win.document.body.insertAdjacentHTML("beforeend", `
<div class="dashboard">

<h2>Admin Dashboard</h2>
<input type="text" id="search" placeholder="Search...">
<button id="exportBtn">Export Excel</button>
<button id="logoutBtn">Logout</button>

<h3 id="count">Total Enquiries: 0</h3>

<table id="table">
<thead>
<tr>
<th>Student</th>
<th>Father</th>
<th>Mother</th>
<th>Phone</th>
<th>Class</th>
<th>Message</th>
<th>Date</th>
<th>Delete</th>
</tr>
</thead>
<tbody></tbody>
</table>

</div>
`);

  // Load the XLSX library as a real script node (appendChild always runs
  // it -- unlike document.write, which is what was causing this popup to
  // fail unpredictably). Wire up the rest of the dashboard once it's ready.
  const xlsxScript = win.document.createElement("script");
  xlsxScript.src = "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js";
  xlsxScript.onload = () => {

    const script = win.document.createElement("script");
    script.textContent = `
const LS_KEY = "demo_enquiries";
function lsGetAll() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
function lsSetAll(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

let data = [];

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function loadData(){
  const all = lsGetAll();
  data = Object.entries(all).map(([id, val]) => ({ id, ...val }));
  render();
}

function delItem(id){
  if(confirm("Delete this enquiry?")){
    const all = lsGetAll();
    delete all[id];
    lsSetAll(all);
    loadData();
  }
}

function render(){
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";
  data.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + escapeHtml(d.student)   + "</td>" +
      "<td>" + escapeHtml(d.father)    + "</td>" +
      "<td>" + escapeHtml(d.mother)    + "</td>" +
      "<td>" + escapeHtml(d.phone)     + "</td>" +
      "<td>" + escapeHtml(d.className) + "</td>" +
      "<td>" + escapeHtml(d.query)     + "</td>" +
      "<td>" + escapeHtml(d.date)      + "</td>" +
      "<td></td>";
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => delItem(d.id));
    tr.lastElementChild.appendChild(delBtn);
    tbody.appendChild(tr);
  });
  document.getElementById("count").innerText = "Total Enquiries: " + data.length;
}

function filterTable(){
  let val = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll("#table tbody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(val) ? "" : "none";
  });
}

function exportExcel(){
  let ws = XLSX.utils.json_to_sheet(data);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
  XLSX.writeFile(wb, "enquiries.xlsx");
}

document.getElementById("search").addEventListener("keyup", filterTable);
document.getElementById("exportBtn").addEventListener("click", exportExcel);
document.getElementById("logoutBtn").addEventListener("click", () => window.close());

loadData();
`;
    win.document.body.appendChild(script);
  };
  win.document.head.appendChild(xlsxScript);
}
