/**
 * @jest-environment jsdom
 */

// MOCKEAR elementos del DOM antes de importar el módulo
document.body.innerHTML = `
  <form id="login-form">
    <input type="email" id="email" name="email" required>
    <input type="password" id="password" name="password" required>
    <button type="submit" id="login-btn" disabled>Iniciar sesión</button>
    <div id="error-mail" class="mensaje-error" style="display:none;">Email inválido</div>
  </form>
`;

// MOCKEAR window.location
const mockLocation = {
  href: ''
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// IMPORTAR FUNCIONES A TESTEAR
const {
  emailValidacion,
  emailAdmin,
  contrasenaAdmin,
  habilitarBotonLogin,
  actualizarMensajeDeErrorDeMail,
  validarCredenciales
} = require('../JS/login.js');

describe('LOG IN TESTS UNITARIOS', () => {
  let emailInput, contrasenaInput, btnLogin, formLogin, emailError;

  beforeEach(() => {
    emailInput = document.getElementById('email');
    contrasenaInput = document.getElementById('password');
    btnLogin = document.getElementById('login-btn');
    formLogin = document.getElementById('login-form');
    emailError = document.getElementById('error-mail');
    
    emailInput.value = '';
    contrasenaInput.value = '';
    btnLogin.disabled = true;
    emailError.style.display = 'none';
    mockLocation.href = '';
  });

  describe('VALIDACION DE EMAIL', () => {
    test('validar formato de email', () => {
      const emailsValidos = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin@admin.com',
        'test123@test.org'
      ];

      emailsValidos.forEach(email => {
        expect(emailValidacion.test(email)).toBe(true);
      });
    });

    test('rechazar formato de email inválido', () => {
      const emailsInvalidos = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user domain.com',
        '',
        '   '
      ];

      emailsInvalidos.forEach(email => {
        expect(emailValidacion.test(email)).toBe(false);
      });
    });
  });

  describe('ESTADO DEL BOTON', () => {
    test('habilitar botón cuando los dos campos están llenos y el email es válido', () => {
      emailInput.value = 'test@example.com';
      contrasenaInput.value = 'password123';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(false);
    });

    test('deshabilitar botón cuando el email está vacío', () => {
      emailInput.value = '';
      contrasenaInput.value = 'contrasena123';
      
      habilitarBotonLogin();
      expect(btnLogin.disabled).toBe(true);
    });

    test('deshabilitar botón cuando la contraseña está vacía', () => {
      emailInput.value = 'test@ejemplo.com';
      contrasenaInput.value = '';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(true);
    });

    test('deshabilitar botón cuando el email es inválido', () => {
      emailInput.value = 'email-no-valido';
      contrasenaInput.value = 'contrasena123';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(true);
    });

    test('deshabilitar botón cuando los dos campos están vacíos', () => {
      emailInput.value = '';
      contrasenaInput.value = '';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(true);
    });

    test('habilitar botón cuando los dos campos están llenos y el email es válido', () => {
      emailInput.value = 'test@ejemplo.com';
      contrasenaInput.value = 'contrasena123';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(false);
    });
  });

  describe('MENSAJE DE ERROR', () => {
    test('mostrar mensaje de error cuando el email es inválido', () => {
      emailInput.value = 'email-no-valido';
      
      actualizarMensajeDeErrorDeMail();
      
      expect(emailError.style.display).toBe('block');
    });
  });

  describe('VALIDACION DE CREDENCIALES', () => {
    test('redirigir a listadoReservas.html con credenciales de admin correctas', () => {
      emailInput.value = emailAdmin;
      contrasenaInput.value = contrasenaAdmin;
      
      validarCredenciales();
      expect(mockLocation.href).toBe('listadoReservas.html');
    });

    test('no redirigir con email incorrecto', () => {
      emailInput.value = 'email-incorrecto';
      contrasenaInput.value = contrasenaAdmin;
      
      validarCredenciales();
      
      expect(mockLocation.href).toBe('');
    });

    test('no redirigir con contraseña incorrecta', () => {
      emailInput.value = emailAdmin;
      contrasenaInput.value = 'incorrecta-contrasena';
      
      validarCredenciales();
      
      expect(mockLocation.href).toBe('');
    });

    test('no redirigir con email y contrasena incorrectos', () => {
      emailInput.value = 'email-incorrecto';
      contrasenaInput.value = 'incorrecta-contrasena';
      
      validarCredenciales();
      
      expect(mockLocation.href).toBe('');
    });

    test('no redirigir con email y contrasena en mayusuclas', () => {
      emailInput.value = 'ADMIN@ADMIN.COM';
      contrasenaInput.value = 'ADMIN123';
      
      validarCredenciales();
      
      expect(mockLocation.href).toBe('');
    });

    test('no redirigir con email y contrasena correctos pero con espacios en blanco', () => {
      emailInput.value = '  admin@admin.com  ';
      contrasenaInput.value = '  admin123  ';
      
      validarCredenciales();
      expect(mockLocation.href).toBe('');
    });
  });

  describe('CONSTANTES DE CREDENCIALES DE ADMIN', () => {
    test('email de admin correcto', () => {
      expect(emailAdmin).toBe('admin@admin.com');
    });

    test('contrasena de admin correcta', () => {
      expect(contrasenaAdmin).toBe('admin123');
    });
  });

  describe('CASOS BORDE', () => {
    test('no habilitar botón con email muy largo', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      emailInput.value = longEmail;
      contrasenaInput.value = 'password123';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(false);
    });

    test('no habilitar botón con email con caracteres especiales', () => {
      const specialEmail = 'test+tag@example.com';
      emailInput.value = specialEmail;
      contrasenaInput.value = 'password123';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(false);
    });

    test('no habilitar botón con email y contrasena vacios', () => {
      emailInput.value = '';
      contrasenaInput.value = '';
      
      habilitarBotonLogin();
      
      expect(btnLogin.disabled).toBe(true);
    });

    test('no habilitar botón con email y contrasena nulos', () => {
      emailInput.value = null;
      contrasenaInput.value = null;
      
      habilitarBotonLogin();
      expect(btnLogin.disabled).toBe(true);
    });
  });
});
