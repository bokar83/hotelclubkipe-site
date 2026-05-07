var supabaseClient = null;
var currentProfile = null;
function initSupabaseClient(){
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return supabaseClient;
}
function normalizeHotelEmail(username){
  var value = String(username || '').replace(/^\s+|\s+$/g, '').toLowerCase();
  if (value.indexOf('@') === -1) { value = value + HOTEL_DOMAIN; }
  return value;
}
function getCurrentProfile(){
  initSupabaseClient();
  if (!supabaseClient) { return Promise.reject(new Error('Supabase indisponible')); }
  return supabaseClient.auth.getUser().then(function(result){
    var user = result && result.data ? result.data.user : null;
    if (!user) { return null; }
    return supabaseClient.from('profiles').select('*').eq('id', user.id).maybeSingle().then(function(profileResult){
      if (profileResult.error && profileResult.error.code !== 'PGRST116') { throw profileResult.error; }
      var fallbackName = user.email ? user.email.split('@')[0] : 'staff';
      currentProfile = profileResult.data || { id:user.id, email:user.email, full_name:fallbackName, role:fallbackName === 'admin' ? 'admin' : 'staff', is_admin:fallbackName === 'admin' };
      return currentProfile;
    });
  }).catch(function(error){ console.error('getCurrentProfile', error); throw error; });
}
function isAdmin(profile){
  var p = profile || currentProfile;
  return !!(p && (p.is_admin === true || p.role === 'admin'));
}
function requireAuth(onSuccess){
  initSupabaseClient();
  if (!supabaseClient) { window.location.href = 'index.html'; return; }
  supabaseClient.auth.getSession().then(function(result){
    var session = result && result.data ? result.data.session : null;
    if (!session) { window.location.href = 'index.html'; return null; }
    return getCurrentProfile().then(function(profile){
      if (!profile) { window.location.href = 'index.html'; return; }
      currentProfile = profile;
      initSidebar(profile);
      if (typeof onSuccess === 'function') { onSuccess(profile); }
      return profile;
    });
  }).catch(function(error){ console.error('requireAuth', error); window.location.href = 'index.html'; });
}
function requireAdmin(){
  initSupabaseClient();
  if (!supabaseClient) { window.location.href = 'index.html'; return; }
  supabaseClient.auth.getSession().then(function(result){
    var session = result && result.data ? result.data.session : null;
    if (!session) { window.location.href = 'index.html'; return null; }
    return getCurrentProfile().then(function(profile){
      if (!isAdmin(profile)) { window.location.href = 'dashboard.html'; return; }
      initSidebar(profile);
    });
  }).catch(function(error){ console.error('requireAdmin', error); window.location.href = 'index.html'; });
}
function logout(){
  initSupabaseClient();
  if (!supabaseClient) { window.location.href = 'index.html'; return; }
  supabaseClient.auth.signOut().then(function(){ window.location.href = 'index.html'; }).catch(function(error){ console.error('logout', error); window.location.href = 'index.html'; });
}
function login(username, password){
  initSupabaseClient();
  if (!supabaseClient) { return Promise.reject(new Error('Supabase indisponible')); }
  return supabaseClient.auth.signInWithPassword({ email:normalizeHotelEmail(username), password:password }).then(function(result){
    if (result.error) { throw result.error; }
    return getCurrentProfile();
  }).catch(function(error){ console.error('login', error); throw error; });
}
function initSidebar(profile){
  var p = profile || currentProfile || {};
  var name = p.full_name || p.email || 'Utilisateur';
  var usernameEls = document.querySelectorAll('#sidebar-username, .sidebar-username');
  var i;
  for (i = 0; i < usernameEls.length; i += 1) { usernameEls[i].textContent = name; }
  var adminEls = document.querySelectorAll('.admin-only');
  for (i = 0; i < adminEls.length; i += 1) {
    if (isAdmin(p)) { adminEls[i].classList.remove('hidden'); }
    else { adminEls[i].classList.add('hidden'); }
  }
  var path = window.location.pathname.split('/').pop() || 'dashboard.html';
  var links = document.querySelectorAll('.nav-link');
  for (i = 0; i < links.length; i += 1) {
    if (links[i].getAttribute('href') === path) { links[i].classList.add('active'); }
    else { links[i].classList.remove('active'); }
  }
}
document.addEventListener('DOMContentLoaded', function(){
  initSupabaseClient();
  var logoutButton = document.getElementById('logout-button');
  if (logoutButton) { logoutButton.onclick = logout; }
});
