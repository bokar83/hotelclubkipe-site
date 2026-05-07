(function(window){
'use strict';
var HCK = window.HCK || {};
window.HCK = HCK;
var cachedClient = null;
function getClient(){
  if(cachedClient){ return cachedClient; }
  if(typeof supabaseClient !== 'undefined' && supabaseClient){
    cachedClient = supabaseClient;
    return cachedClient;
  }
  var url = window.SUPABASE_URL || HCK.SUPABASE_URL;
  var key = window.SUPABASE_ANON || HCK.SUPABASE_ANON_KEY;
  if(window.supabase && url && key){
    cachedClient = window.supabase.createClient(url, key);
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
  if (status) { data.status = status; }
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
  var doInsert = function(){
    return getClient().from('clients').insert([data]).select('*').then(one).then(function(row){
      return logActivity('create_client','client',row && row.id,{name:data.full_name}).then(function(){ return row; });
    });
  };
  if(data.id_number && data.id_number.trim()){
    return getClient().from('clients').select('*').eq('id_number',data.id_number.trim()).maybeSingle()
      .then(function(existing){
        if(existing.data){ return { data:existing.data, duplicate:true }; }
        return doInsert();
      }).catch(doInsert);
  }
  return doInsert();
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
  var q = getClient().from('invoices').select('*, reservations(*, clients(*), business_accounts(*))').order('invoice_date', { ascending:false });
  if(f.status){ q = q.eq('status', f.status); }
  if(f.from){ q = q.gte('invoice_date', f.from); }
  if(f.to){ q = q.lte('invoice_date', f.to); }
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
function getPricing(){ return getClient().from('rooms').select('id,number,type,rate_gnf,rate_eur').order('number', { ascending:true }).then(unwrap); }
function updateRoomRate(id, payload){
  var data = {};
  if(payload && payload.rate_gnf !== undefined){ data.rate_gnf = Number(payload.rate_gnf); }
  if(payload && payload.rate_eur !== undefined){ data.rate_eur = Number(payload.rate_eur); }
  return getClient().from('rooms').update(data).eq('id', id).select('*').then(one).then(function(row){
    return logActivity('update_room_rate','room',id,data).then(function(){ return row; });
  });
}
function getSystemSettings(){
  return getClient().from('system_settings').select('*').eq('id',1).maybeSingle().then(function(res){
    if(res && res.error){ throw res.error; }
    var row = res && res.data ? res.data : {};
    return {
      hotel_name: row.hotel_name || 'Hôtel Club de Kipé',
      address_line1: row.address_line1 || '',
      address_line2: row.address_line2 || '',
      phone: row.phone || '',
      email: row.email || '',
      rccm: row.rccm || '',
      default_tax_rate: row.tax_rate_default || 0,
      default_currency: row.currency_default || 'GNF'
    };
  });
}
function updateSystemSettings(settings){
  var data = {
    hotel_name: settings.hotel_name,
    address_line1: settings.address_line1,
    address_line2: settings.address_line2,
    phone: settings.phone,
    email: settings.email,
    rccm: settings.rccm,
    tax_rate_default: Number(settings.default_tax_rate || 0),
    currency_default: settings.default_currency || 'GNF',
    updated_at: new Date().toISOString()
  };
  return getClient().from('system_settings').update(data).eq('id',1).select('*').then(unwrap).then(function(rows){
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
function getReservationsForWeek(startDate, endDate){
  try {
    var client = null;
    if(typeof supabaseClient !== 'undefined' && supabaseClient){ client = supabaseClient; }
    if(!client && typeof initSupabaseClient === 'function'){ client = initSupabaseClient(); }
    if(!client){ client = getClient(); }
    return client.from('reservations').select('*, clients(*), business_accounts(*)').lte('check_in', endDate).gte('check_out', startDate).not('status', 'in', '(cancelled,archived)').then(function(r){ return r.data || []; }).catch(function(){ return []; });
  } catch(e) {
    return Promise.resolve([]);
  }
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
    }
    return getClient().from('invoices').select('id,status,balance_due').then(unwrap).then(function(invs){
      invs = invs || [];
      for(var j=0;j<invs.length;j++){
        if(invs[j].status === 'draft' || invs[j].status === 'sent'){ s.pending++; }
      }
      return s;
    });
  });
}
HCK.api = { logActivity:logActivity, getReservationsForMonth:getReservationsForMonth, getReservationsForWeek:getReservationsForWeek, createReservation:createReservation, updateReservationStatus:updateReservationStatus, archiveReservation:archiveReservation, deleteReservation:deleteReservation, getClients:getClients, createClient:createClient, updateClient:updateClient, getBusinessAccounts:getBusinessAccounts, createBusinessAccount:createBusinessAccount, getInvoices:getInvoices, createInvoice:createInvoice, generateInvoiceNumber:generateInvoiceNumber, getPricing:getPricing, updateRoomRate:updateRoomRate, getSystemSettings:getSystemSettings, updateSystemSettings:updateSystemSettings, getProfiles:getProfiles, updateProfile:updateProfile, getActivityLog:getActivityLog, getTodayStats:getTodayStats };
for(var k in HCK.api){ if(HCK.api.hasOwnProperty(k)){ window[k] = HCK.api[k]; } }
})(window);

