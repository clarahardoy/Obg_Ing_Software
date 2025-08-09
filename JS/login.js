const emailInput = document.getElementById('email');
const contrasenaInput = document.getElementById('password');
const btnLogin = document.getElementById('login-btn');
const formLogin = document.getElementById('login-form');
const emailError = document.getElementById('error-mail');
const passwordError = document.getElementById('error-password');
const emailValidacion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailAdmin = 'admin@admin.com';
const contrasenaAdmin = 'admin123';

const habilitarBotonLogin = () => {
  const emailCompletado = emailInput.value.trim() !== '';
  const contrasenaCompletada = contrasenaInput.value.trim() !== '';
  let emailValido = false;
  
  if (emailValidacion.test(emailInput.value)) {
    emailValido = true;
  } else {
    emailValido = false;
  }
  
  btnLogin.disabled = !(emailCompletado && contrasenaCompletada && emailValido);
};

const actualizarMensajeDeErrorDeMail = () => {
  const valor = emailInput.value.trim();
  if (valor && !emailInput.checkValidity()) {
    emailError.style.display = 'block';
  } else {
    emailError.style.display = 'none';
  }
};

const validarCredenciales = () => {
  const email = emailInput.value;
  const contrasena = contrasenaInput.value;

  if (email === emailAdmin && contrasena === contrasenaAdmin) {
    localStorage.setItem('ADMIN_LOGGEADO', 'true');
    window.location.href = 'listadoReservas.html';
  } else {
    passwordError.style.display = 'block';
  }
};

if (emailInput) {
  emailInput.addEventListener('input', () => {
    habilitarBotonLogin();
    actualizarMensajeDeErrorDeMail();
  });
}

if (contrasenaInput) {
  contrasenaInput.addEventListener('input', habilitarBotonLogin);
}

if (formLogin) {
  formLogin.addEventListener('submit', function(event) {
    event.preventDefault();
    validarCredenciales();
  });
}

// EXPORTAR PARA EL TESTING
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    emailValidacion,
    emailAdmin,
    contrasenaAdmin,
    habilitarBotonLogin,
    actualizarMensajeDeErrorDeMail,
    validarCredenciales
  };
}
