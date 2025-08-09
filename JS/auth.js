/* --------------- Protección de acceso --------------- */
function verificarAcceso() {
  if (localStorage.getItem('ADMIN_LOGGEADO') !== 'true') {
    cerrarSesion();
    return false;
  }
  return true;
}

function cerrarSesion() {
  localStorage.removeItem('ADMIN_LOGGEADO');
  window.location.href = 'login.html';
}