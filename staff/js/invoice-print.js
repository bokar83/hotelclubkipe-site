(function(window){
'use strict';
function esc(v){ return v === null || v === undefined ? '' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function money(v,c){ return Number(v || 0).toLocaleString('fr-FR') + ' ' + esc(c || 'GNF'); }
function printInvoice(invoiceData){
  var d = invoiceData || {};
  var r = d.reservations || d.reservation || {};
  var c = r.clients || d.client || {};
  var b = r.business_accounts || d.business_account || {};
  var currency = d.currency || r.currency || 'GNF';
  var subtotal = d.subtotal || d.amount_ht || d.total_amount || r.total_amount || 0;
  var tax = d.tax_amount || 0;
  var discount = d.discount_amount || 0;
  var total = d.total_amount || (Number(subtotal) + Number(tax) - Number(discount));
  var paid = d.amount_paid || r.amount_paid || 0;
  var balance = Number(total) - Number(paid);
  var html = '';
  html += '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(d.invoice_number || 'Facture') + '</title>';
  html += '<style>';
  html += 'body{font-family:Arial,sans-serif;color:#15201d;margin:0;background:#fff}.page{max-width:860px;margin:0 auto;padding:34px}';
  html += '.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #b9924b;padding-bottom:20px}.logo{height:82px}.hotel{text-align:right}.hotel h1{margin:0;color:#10231f;font-size:24px}.hotel p{margin:4px 0;color:#4b5563}';
  html += '.meta{display:flex;justify-content:space-between;margin:28px 0;gap:24px}.box{width:50%;border:1px solid #d7d2c3;padding:16px}.box h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#b9924b;margin:0 0 10px}';
  html += 'table{width:100%;border-collapse:collapse;margin-top:24px}th{background:#10231f;color:#fff;text-align:left;padding:11px}td{border-bottom:1px solid #e6e0d2;padding:11px}';
  html += '.totals{margin-left:auto;margin-top:20px;width:320px}.totals div{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e6e0d2}.totals .grand{font-weight:bold;font-size:18px;color:#10231f}';
  html += '.footer{position:fixed;left:34px;right:34px;bottom:24px;border-top:1px solid #d7d2c3;padding-top:10px;font-size:11px;color:#5c6670;text-align:center}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
  html += '</style></head><body><div class="page">';
  html += '<div class="head"><img class="logo" src="../images/logo-transparent.png" alt="Hotel Club de Kipe"><div class="hotel"><h1>HOTEL CLUB DE KIPE</h1><p>Facture ' + esc(d.invoice_number || '') + '</p><p>Date: ' + esc(d.issue_date || new Date().toISOString().slice(0,10)) + '</p></div></div>';
  html += '<div class="meta"><div class="box"><h2>Emetteur</h2><strong>Hotel Club de Kipe</strong><br>Conakry, Republique de Guinee<br>Tel: +224<br>Email: contact@hotelclubdekipe.com</div>';
  html += '<div class="box"><h2>Adresse a</h2><strong>' + esc((b && b.company_name) || (c && c.full_name) || d.bill_to || 'Client') + '</strong><br>' + esc((b && b.contact_name) || '') + '<br>' + esc((c && c.email) || (b && b.contact_email) || '') + '<br>' + esc((c && c.phone) || '') + '</div></div>';
  html += '<table><thead><tr><th>Description</th><th>Chambre</th><th>Sejour</th><th>Montant</th></tr></thead><tbody>';
  html += '<tr><td>Reservation hoteliere</td><td>' + esc(r.room_number || d.room_number || '') + '</td><td>' + esc(r.check_in || '') + ' au ' + esc(r.check_out || '') + '</td><td>' + money(subtotal, currency) + '</td></tr>';
  html += '</tbody></table><div class="totals">';
  html += '<div><span>Sous-total</span><span>' + money(subtotal, currency) + '</span></div><div><span>Taxes</span><span>' + money(tax, currency) + '</span></div><div><span>Remise</span><span>' + money(discount, currency) + '</span></div>';
  html += '<div class="grand"><span>Total</span><span>' + money(total, currency) + '</span></div><div><span>Paye</span><span>' + money(paid, currency) + '</span></div><div><span>Solde</span><span>' + money(balance, currency) + '</span></div></div>';
  html += '<p style="margin-top:36px;color:#4b5563">Merci pour votre confiance.</p><div class="footer">RCCM/GN.TCC.2019.0 5769 - CLUB DE KIPE</div></div></body></html>';
  var win = window.open('', '_blank', 'width=900,height=700');
  if(!win){ alert('Autorisez les fenetres pop-up pour imprimer la facture.'); return; }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(function(){ win.print(); }, 350);
}
window.printInvoice = printInvoice;
})(window);
// invoice spacer 46
// invoice spacer 47
// invoice spacer 48
// invoice spacer 49
// invoice spacer 50
// invoice spacer 51
// invoice spacer 52
// invoice spacer 53
// invoice spacer 54
// invoice spacer 55
// invoice spacer 56
// invoice spacer 57
// invoice spacer 58
// invoice spacer 59
// invoice spacer 60
// invoice spacer 61
// invoice spacer 62
// invoice spacer 63
// invoice spacer 64
// invoice spacer 65
// invoice spacer 66
// invoice spacer 67
// invoice spacer 68
// invoice spacer 69
// invoice spacer 70
// invoice spacer 71
// invoice spacer 72
// invoice spacer 73
// invoice spacer 74
// invoice spacer 75
// invoice spacer 76
// invoice spacer 77
// invoice spacer 78
// invoice spacer 79
