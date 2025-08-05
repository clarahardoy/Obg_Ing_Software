/* --------------- Hamburguesa – Nav mobile --------------- */
const btnMenu = document.getElementById('btnMenu');
const navLinks = document.getElementById('navLinks');

btnMenu?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  btnMenu.classList.toggle('active');
});
navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      btnMenu.classList.remove('active');
    }
  })
);

/* ------------------ Contadores globales ------------------ */
let idServicio = 0,
  idBarbero = 0,
  idReserva = 0;

/* ------------------------- Modelos ----------------------- */
class Servicio {
  constructor({ nombre, descripcion, precio, duracion = 30, img = "" }) {
    this.id = idServicio++;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.duracion = duracion;
    this.img = img;
  }
}
class Barbero {
  constructor({ nombre, descripcion = "", img = "" }) {
    this.id = idBarbero++;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.img = img;
  }
}
class Reserva {
  constructor({ nombre, apellido, celular, email,
    barberoId, servicioId, fechaHora }) {
    this.id = idReserva++;
    this.nombre = nombre;
    this.apellido = apellido;
    this.celular = celular;
    this.email = email;
    this.barberoId = barberoId;
    this.servicioId = servicioId;
    this.fechaHora = (fechaHora instanceof Date)
      ? fechaHora.toISOString()
      : fechaHora;   // string ISO
  }
}

/* ------------------------ Sistema ------------------------ */
export class Sistema {
  constructor() {
    /* Reservas previas */
    this.reservas = this.#leerLS();
    if (this.reservas.length) {
      idReserva = Math.max(...this.reservas.map(r => r.id)) + 1;
    }

    /* Catálogos precargados */
    this.listaServicios = [
      new Servicio({ nombre: "Corte de Pelo", descripcion: "Corte + lavado + peinado", precio: 450, img: "assets/images/servicio_corte.jpg" }),
      new Servicio({ nombre: "Rasurada de Barba", descripcion: "Arreglo y modelado de barba", precio: 350, img: "assets/images/servicio_barba.jpg" }),
      new Servicio({ nombre: "Colorimetría", descripcion: "Tintes y mechas", precio: 500, img: "assets/images/servicio_colorimetria.jpg" }),
      new Servicio({ nombre: "Lavado y Acondicionamiento", descripcion: "Lavado premium + hidratación", precio: 400, img: "assets/images/servicio_lavado.jpg" }),
      new Servicio({ nombre: "Tratamiento Premium", descripcion: "Nutrición profunda", precio: 800, img: "assets/images/servicio_premium.jpg" })
    ];
    this.listaBarberos = [
      new Barbero({ nombre: "Martín Ramírez", descripcion: "15 años de experiencia", img: "assets/images/barbero1.jpg" }),
      new Barbero({ nombre: "Diego Morales", descripcion: "Especialista en fades", img: "assets/images/barbero2.jpg" }),
      new Barbero({ nombre: "Sebastián Castro", descripcion: "Colorista", img: "assets/images/barbero3.jpg" }),
      new Barbero({ nombre: "Alejandro Torres", descripcion: "Diseño de barbas", img: "assets/images/barbero4.jpg" }),
      new Barbero({ nombre: "Javier Herrera", descripcion: "Texturizados", img: "assets/images/barbero5.jpg" }),
      new Barbero({ nombre: "Nicolás Gómez", descripcion: "Diseños con máquina", img: "assets/images/barbero6.jpg" })
    ];

    /* Horarios 09:00-21:00 cada 30' */
    this.listaHoras = [];
    for (let h = 9; h <= 21; h++) {
      const hh = h.toString().padStart(2, '0');
      this.listaHoras.push(`${hh}:00`);
      if (h < 21) this.listaHoras.push(`${hh}:30`);
    }
  }

  /* ---- Turnos libres para barbero + fecha ---- */
  horasDisponibles(barberoId, fechaISO) {
    if (isNaN(barberoId) || !fechaISO) return [];   // no hay selección aún

    const ocupadas = new Set();
    for (const r of this.reservas) {
      if (r.barberoId === barberoId) {
        const f = new Date(r.fechaHora);
        if (f.toISOString().split('T')[0] === fechaISO) {
          ocupadas.add(f.toTimeString().slice(0, 5));
        }
      }
    }
    return this.listaHoras.filter(h => !ocupadas.has(h));
  }

  agregarReserva(reserva) {
    this.reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(this.reservas));
  }

  #leerLS() {
    try {
      const raw = localStorage.getItem('reservas');
      return raw ? JSON.parse(raw).map(o => new Reserva(o)) : [];
    } catch { return []; }
  }
}

/* --------------------------- DOM READY --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const sistema = new Sistema();

  renderServicios(sistema);
  renderBarberos(sistema);
  cargarSelects(sistema);
  ponerMinFecha();
  actualizarHoras(sistema);

  document.getElementById('slcBarbero')?.addEventListener('change', () => actualizarHoras(sistema));
  document.getElementById('fecha')?.addEventListener('change', () => actualizarHoras(sistema));

  document.getElementById('btnReservar')?.addEventListener('click', e => {
    e.preventDefault();
    realizarReserva(sistema);
    actualizarHoras(sistema);
  });
});

/* ------------------- UI helper functions ------------------- */
const showMensaje = (txt, tipo) => {
  const p = document.getElementById('mensaje');
  if (!p) return;
  p.textContent = txt;
  p.classList.remove('error', 'success');
  if (tipo) p.classList.add(tipo);  // 'error' | 'success'
};

function renderServicios(s) {
  const grid = document.getElementById('serviciosGrid');
  if (!grid) return;
  let html = "";
  for (const srv of s.listaServicios) {
    html += `
      <div class="servicio-card">
        <div class="servicio-icon"><img src="${srv.img}" alt="${srv.nombre}"></div>
        <h3>${srv.nombre}</h3>
        <p>${srv.descripcion}</p>
        <span class="precio">$${srv.precio}</span>
      </div>`;
  }
  grid.innerHTML = html;
}

function renderBarberos(s) {
  const grid = document.getElementById('barberosGrid');
  if (!grid) return;
  let html = "";
  for (const b of s.listaBarberos) {
    html += `
      <div class="barbero-card">
        <div class="barbero-icon"><img src="${b.img}" alt="${b.nombre}"></div>
        <h3>${b.nombre}</h3>
        <p>${b.descripcion}</p>
      </div>`;
  }
  grid.innerHTML = html;
}

function cargarSelects(s) {
  const sb = document.getElementById('slcBarbero');
  const ss = document.getElementById('slcServicio');
  const sh = document.getElementById('slcHora');

  if (sb) {
    let html = '<option value="" disabled selected>Seleccionar</option>';
    for (const b of s.listaBarberos) html += `<option value="${b.id}">${b.nombre}</option>`;
    sb.innerHTML = html;
  }
  if (ss) {
    let html = '<option value="" disabled selected>Seleccionar</option>';
    for (const srv of s.listaServicios) html += `<option value="${srv.id}">${srv.nombre}</option>`;
    ss.innerHTML = html;
  }
  if (sh) {
    sh.innerHTML = '<option value="" disabled selected>Seleccione barbero y fecha</option>';
  }
}

function actualizarHoras(s) {
  const selHora = document.getElementById('slcHora');
  if (!selHora) return;

  const bid = parseInt(document.getElementById('slcBarbero')?.value);
  const fecha = document.getElementById('fecha')?.value;

  if (isNaN(bid) || !fecha) {
    selHora.innerHTML =
      '<option value="" disabled selected>Seleccione barbero y fecha</option>';
    return;
  }

  const libres = s.horasDisponibles(bid, fecha);

  if (libres.length) {
    selHora.innerHTML =
      '<option value="" disabled selected>Seleccionar</option>' +
      libres.map(h => `<option value="${h}">${h}</option>`).join('');
  } else {
    selHora.innerHTML =
      '<option value="" disabled selected>No hay turnos</option>';
  }
}


function ponerMinFecha() {
  const f = document.getElementById('fecha');
  if (f) f.min = new Date().toISOString().split('T')[0];
}

/* ----------------------- Alta de reserva ----------------------- */
function realizarReserva(s) {
  const nombre = document.getElementById('txtNombre')?.value;
  const apellido = document.getElementById('txtApellido')?.value;
  const celular = document.getElementById('txtTelefono')?.value;
  const email = document.getElementById('txtEmail')?.value.trim();
  const barberoId = parseInt(document.getElementById('slcBarbero')?.value);
  const servicioId = parseInt(document.getElementById('slcServicio')?.value);
  const fechaVal = document.getElementById('fecha')?.value;
  const horaVal = document.getElementById('slcHora')?.value;

  /* Validaciones */
  if (!nombre || !apellido || !celular || !email || !fechaVal || !horaVal)
    return showMensaje('Todos los campos son obligatorios', 'error');

  if (!/^\d{9}$/.test(celular))
    return showMensaje('Teléfono no válido', 'error');

  if (!/^\S+@\S+\.com$/i.test(email))
    return showMensaje('Email inválido', 'error');

  const fechaHora = new Date(`${fechaVal}T${horaVal}`);
  if (fechaHora < new Date())
    return showMensaje('Fecha no válida', 'error');

  /* Verificar disponibilidad justo antes de persistir */
  if (!s.horasDisponibles(barberoId, fechaVal).includes(horaVal))
    return showMensaje('Ese turno ya no está disponible', 'error');

  const nueva = new Reserva({
    nombre, apellido, celular, email,
    barberoId, servicioId, fechaHora
  });
  s.agregarReserva(nueva);

  showMensaje('Su turno se reservó correctamente.', 'success');
  document.getElementById('formReserva')?.reset();
}


/* --- EXPORTAR PARA TESTING --- */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Sistema,
    Reserva,
    realizarReserva,
  };
}