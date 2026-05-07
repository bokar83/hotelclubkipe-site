(function(window){
'use strict';
var HCK = window.HCK || {};
window.HCK = HCK;
var cachedClient = null;
function getClient(){
  if(cachedClient){ return cachedClient; }
  if(window.supabase && HCK.SUPABASE_URL && HCK.SUPABASE_ANON_KEY){
    cachedClient = window.supabase.createClient(HCK.SUPABASE_URL, HCK.SUPABASE_ANON_KEY);
    return cachedClient;
  }
  if(HCK.supabase){ return HCK.supabase; }
  throw new Error('Supabase client is not configured');
}
function unwrap(res){ if(res && res.error){ throw res.error; } return res ? res.data : null; }
function one(res){ var d = unwrap(res); return d && d.length ? d[0] : d; }
function userId(){
  try{
    var raw = window.localStorage.getItem('hck_user');
    var u = raw ? JSON.parse(raw) : HCK.currentUser;
    return u && (u.id || u.user_id) || null;
  }catch(e){ return null; }
}
function monthBounds(year, month){
  var s = new Date(year, month - 1, 1);
  var e = new Date(year, month, 0);
  return { start: s.toISOString().slice(0,10), end: e.toISOString().slice(0,10) };
}
function logActivity(action, entityType, entityId, details){
  return getClient().from('activity_log').insert({
    action: action,
    entity_type: entityType || null,
    entity_id: entityId || null,
    details: details || {},
    user_id: userId(),
    created_at: new Date().toISOString()
  }).then(one).catch(function(err){ if(window.console){ console.warn('logActivity failed', err); } return null; });
}
function getReservationsForMonth(year, month){
  var b = monthBounds(year, month);
  return getClient().from('reservations').select('*, clients(*), business_accounts(*)').lte('check_in', b.end).gte('check_out', b.start).neq('status','archived').order('check_in', { ascending:true }).then(unwrap);
}
function createReservation(payload){
  var data = payload || {};
  data.created_at = data.created_at || new Date().toISOString();
  data.updated_at = new Date().toISOString();
  return getClient().from('reservations').insert(data).select('*, clients(*), business_accounts(*)').then(one).then(function(row){
    return logActivity('create_reservation','reservation',row && row.id,row).then(function(){ return row; });
  });
}
function updateReservationStatus(id, status, extra){
  var data = extra || {};
  data.status = status;
  data.updated_at = new Date().toISOString();
  if(status === 'checked_in'){ data.actual_check_in = new Date().toISOString(); }
  if(status === 'checked_out'){ data.actual_check_out = new Date().toISOString(); }
  return getClient().from('reservations').update(data).eq('id', id).select('*, clients(*), business_accounts(*)').then(one).then(function(row){
    return logActivity('update_reservation_status','reservation',id,{status:status}).then(function(){ return row; });
  });
}
function archiveReservation(id){ return updateReservationStatus(id, 'archived', { archived_at:new Date().toISOString() }); }
function deleteReservation(id){
  return getClient().from('reservations').delete().eq('id', id).then(unwrap).then(function(data){
    return logActivity('delete_reservation','reservation',id,{}).then(function(){ return data; });
  });
}
function getClients(search){
  var q = getClient().from('clients').select('*').order('full_name', { ascending:true });
  if(search){ q = q.or('full_name.ilike.%' + search + '%,phone.ilike.%' + search + '%,email.ilike.%' + search + '%'); }
  return q.then(unwrap);
}
function createClient(payload){
  var data = payload || {};
  data.created_at = data.created_at || new Date().toISOString();
  data.updated_at = new Date().toISOString();
  return getClient().from('clients').insert(data).select('*').then(one).then(function(row){
    return logActivity('create_client','client',row && row.id,row).then(function(){ return row; });
  });
}
function updateClient(id, payload){
  var data = payload || {};
  data.updated_at = new Date().toISOString();
  return getClient().from('clients').update(data).eq('id', id).select('*').then(one).then(function(row){
    return logActivity('update_client','client',id,data).then(function(){ return row; });
  });
}
function getBusinessAccounts(search){
  var q = getClient().from('business_accounts').select('*').order('company_name', { ascending:true });
  if(search){ q = q.or('company_name.ilike.%' + search + '%,contact_name.ilike.%' + search + '%,contact_email.ilike.%' + search + '%'); }
  return q.then(unwrap);
}
function createBusinessAccount(payload){
  var data = payload || {};
  data.created_at = data.created_at || new Date().toISOString();
  data.updated_at = new Date().toISOString();
  return getClient().from('business_accounts').insert(data).select('*').then(one).then(function(row){
    return logActivity('create_business_account','business_account',row && row.id,row).then(function(){ return row; });
  });
}
function getInvoices(filters){
  var f = filters || {};
  var q = getClient().from('invoices').select('*, reservations(*, clients(*), business_accounts(*))').order('created_at', { ascending:false });
  if(f.status){ q = q.eq('status', f.status); }
  if(f.from){ q = q.gte('issue_date', f.from); }
  if(f.to){ q = q.lte('issue_date', f.to); }
  return q.then(unwrap);
}
function createInvoice(payload){
  var data = payload || {};
  data.created_at = data.created_at || new Date().toISOString();
  data.updated_at = new Date().toISOString();
  if(!data.invoice_number){
    return generateInvoiceNumber().then(function(num){ data.invoice_number = num; return createInvoice(data); });
  }
  return getClient().from('invoices').insert(data).select('*, reservations(*, clients(*), business_accounts(*))').then(one).then(function(row){
    return logActivity('create_invoice','invoice',row && row.id,row).then(function(){ return row; });
  });
}
function generateInvoiceNumber(){
  var y = new Date().getFullYear();
  var prefix = 'HCK-' + y + '-';
  return getClient().from('invoices').select('invoice_number').like('invoice_number', prefix + '%').order('invoice_number', { ascending:false }).limit(1).then(unwrap).then(function(rows){
    var next = 1;
    if(rows && rows.length && rows[0].invoice_number){ next = parseInt(rows[0].invoice_number.split('-')[2], 10) + 1; }
    return prefix + ('0000' + next).slice(-4);
  });
}
function getPricing(){ return getClient().from('room_rates').select('*').order('room_number', { ascending:true }).then(unwrap); }
function updateRoomRate(id, payload){
  var data = payload || {};
  data.updated_at = new Date().toISOString();
  return getClient().from('room_rates').update(data).eq('id', id).select('*').then(one).then(function(row){
    return logActivity('update_room_rate','room_rate',id,data).then(function(){ return row; });
  });
}
function getSystemSettings(){
  return getClient().from('system_settings').select('*').order('key', { ascending:true }).then(unwrap).then(function(rows){
    var out = {};
    for(var i=0;i<(rows || []).length;i++){ out[rows[i].key] = rows[i].value; }
    return out;
  });
}
function updateSystemSettings(settings){
  var data = [];
  for(var k in settings){ if(settings.hasOwnProperty(k)){ data.push({ key:k, value:settings[k], updated_at:new Date().toISOString() }); } }
  if(!data.length){ return Promise.resolve([]); }
  return getClient().from('system_settings').upsert(data, { onConflict:'key' }).select('*').then(unwrap).then(function(rows){
    return logActivity('update_system_settings','settings',null,settings).then(function(){ return rows; });
  });
}
function getProfiles(){ return getClient().from('profiles').select('*').order('full_name', { ascending:true }).then(unwrap); }
function updateProfile(id, payload){
  var data = payload || {};
  data.updated_at = new Date().toISOString();
  return getClient().from('profiles').update(data).eq('id', id).select('*').then(one).then(function(row){
    return logActivity('update_profile','profile',id,data).then(function(){ return row; });
  });
}
function getActivityLog(limit){
  return getClient().from('activity_log').select('*, profiles(full_name, username)').order('created_at', { ascending:false }).limit(limit || 100).then(unwrap);
}
function getTodayStats(){
  var today = new Date().toISOString().slice(0,10);
  return getClient().from('reservations').select('id,status,check_in,check_out').neq('status','archived').then(unwrap).then(function(rows){
    var s = { occupied:0, arrivals:0, departures:0, pending:0 };
    rows = rows || [];
    for(var i=0;i<rows.length;i++){
      var r = rows[i];
      if(r.check_in <= today && r.check_out > today && r.status !== 'cancelled'){ s.occupied++; }
      if(r.check_in === today){ s.arrivals++; }
      if(r.check_out === today){ s.departures++; }
      if(r.status === 'pending'){ s.pending++; }
    }
    return s;
  });
}
HCK.api = { logActivity:logActivity, getReservationsForMonth:getReservationsForMonth, createReservation:createReservation, updateReservationStatus:updateReservationStatus, archiveReservation:archiveReservation, deleteReservation:deleteReservation, getClients:getClients, createClient:createClient, updateClient:updateClient, getBusinessAccounts:getBusinessAccounts, createBusinessAccount:createBusinessAccount, getInvoices:getInvoices, createInvoice:createInvoice, generateInvoiceNumber:generateInvoiceNumber, getPricing:getPricing, updateRoomRate:updateRoomRate, getSystemSettings:getSystemSettings, updateSystemSettings:updateSystemSettings, getProfiles:getProfiles, updateProfile:updateProfile, getActivityLog:getActivityLog, getTodayStats:getTodayStats };
for(var k in HCK.api){ if(HCK.api.hasOwnProperty(k)){ window[k] = HCK.api[k]; } }
})(window);
// api spacer 180
// api spacer 181
// api spacer 182
// api spacer 183
// api spacer 184
// api spacer 185
// api spacer 186
// api spacer 187
// api spacer 188
// api spacer 189
// api spacer 190
// api spacer 191
// api spacer 192
// api spacer 193
// api spacer 194
// api spacer 195
// api spacer 196
// api spacer 197
// api spacer 198
// api spacer 199
