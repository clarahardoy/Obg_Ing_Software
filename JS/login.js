const emailInput = document.getElementById('email');
const contrasenaInput = document.getElementById('password');
const btnLogin = document.getElementById('login-btn');
const formLogin = document.getElementById('login-form');
const emailError = document.getElementById('error-mail');

const emailValidacion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailAdmin = 'admin@admin.com';
const contrasenaAdmin = 'admin123';

const habilitarBotonLogin = () => {
  const emailCompletado = emailInput.value.trim() !== '';
  const contrasenaCompletada = contrasenaInput.value.trim() !== '';
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
  const email = emailInput.value.trim();
  const contrasena = contrasenaInput.value.trim();

  if (email === emailAdmin && contrasena === contrasenaAdmin) {
    window.location.href = 'index.html';
  }
};

emailInput.addEventListener('input', () => {
  habilitarBotonLogin();
  actualizarMensajeDeErrorDeMail();
});
contrasenaInput.addEventListener('input', habilitarBotonLogin);

formLogin.addEventListener('submit', function(event) {
  event.preventDefault();
  validarCredenciales();
});
