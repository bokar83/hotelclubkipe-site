/* Hotel Club de Kipe - Staff System Config */
var SUPABASE_URL = "https://fcarckibsmpekwqvizyj.supabase.co";
var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYXJja2lic21wZWt3cXZpenlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjg4MjAsImV4cCI6MjA5MzY0NDgyMH0.cKeHK6dBL6bzhwic68lCAc1P6vch61fHYu4Yx2pj_7U";
var HOTEL_DOMAIN = "@hotelclubkipe.com";

var ROOMS = [
  {id:1, number:"102", floor:1, type:"standard",  rate_gnf:600000,  rate_eur:65},
  {id:2, number:"103", floor:1, type:"standard",  rate_gnf:600000,  rate_eur:65},
  {id:3, number:"104", floor:1, type:"standard",  rate_gnf:600000,  rate_eur:65},
  {id:4, number:"201", floor:2, type:"mini_suite",rate_gnf:1000000, rate_eur:110},
  {id:5, number:"202", floor:2, type:"standard",  rate_gnf:800000,  rate_eur:88},
  {id:6, number:"203", floor:2, type:"standard",  rate_gnf:800000,  rate_eur:88},
  {id:7, number:"204", floor:2, type:"suite",     rate_gnf:1200000, rate_eur:133},
  {id:8, number:"301", floor:3, type:"mini_suite",rate_gnf:1000000, rate_eur:110},
  {id:9, number:"302", floor:3, type:"standard",  rate_gnf:800000,  rate_eur:88},
  {id:10,number:"303", floor:3, type:"standard",  rate_gnf:800000,  rate_eur:88},
  {id:11,number:"304", floor:3, type:"suite",     rate_gnf:1200000, rate_eur:133},
  {id:12,number:"305", floor:3, type:"standard",  rate_gnf:800000,  rate_eur:88}
];

var TYPE_FR = {
  standard:  "Standard",
  mini_suite:"Mini Suite",
  suite:     "Suite"
};

var STATUS_FR = {
  confirmed:   "Confirmé",
  checked_in:  "Arrivé",
  checked_out: "Parti",
  cancelled:   "Annulé",
  archived:    "Archivé"
};

var PAY_FR = {
  pending: "En attente",
  partial: "Partiel",
  paid:    "Payé"
};

var STATUS_COLORS = {
  confirmed:   "#B87A2E",
  checked_in:  "#27AE60",
  checked_out: "#6B5C4A",
  cancelled:   "#555555",
  archived:    "#333333",
  available:   "#2A3D25"
};

var CURRENCY_SYMBOLS = {GNF: "GNF", EUR: "€"};

function formatAmount(amount, currency) {
  if (!amount) return "0";
  if (currency === "EUR") {
    return (amount / 1).toFixed(2) + " €";
  }
  return amount.toLocaleString("fr-FR") + " GNF";
}

var _DAYS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
var _MONTHS_FR = ['Jan','Févr','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Dec'];
function formatDate(dateStr) {
  if (!dateStr) return "-";
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  var parts = String(dateStr).split('-');
  var year = parseInt(parts[0],10);
  var month = parseInt(parts[1],10) - 1;
  var day = parseInt(parts[2],10);
  var local = new Date(year, month, day);
  return _DAYS_FR[local.getDay()] + ' ' + (day < 10 ? '0'+day : day) + ' ' + _MONTHS_FR[month] + ' ' + year;
}
function formatDateObj(d) {
  if (!d) return "-";
  var day = d.getDate();
  return _DAYS_FR[d.getDay()] + ' ' + (day < 10 ? '0'+day : day) + ' ' + _MONTHS_FR[d.getMonth()] + ' ' + d.getFullYear();
}

function daysBetween(d1, d2) {
  var a = new Date(d1), b = new Date(d2);
  return Math.max(1, Math.round((b - a) / 86400000));
}
