/* Hamburguesa - Nav mobile */
const btnMenu = document.getElementById('btnMenu');
const navLinks = document.getElementById('navLinks');

btnMenu.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  btnMenu.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      btnMenu.classList.remove('active');
    }
  })
);

//-------------------------------------------------------------------------------------
// -----------------------------
// Contadores globales de IDs:
let idServicio = 0;
let idBarbero = 0;
let idReserva = 0;

// -----------------------------
// Clases del sistema:
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
  constructor({ nombre, apellido, celular, email, barberoId, servicioId, fechaHora }) {
    this.id = idReserva++;
    this.nombre = nombre;
    this.apellido = apellido;
    this.celular = celular;
    this.email = email;
    this.barberoId = barberoId;
    this.servicioId = servicioId;
    this.fechaHora = fechaHora;
  }
}

// ----------------------------- SISTEMA -----------------------------
export class Sistema {
  constructor() {
    this.reservas = this.leerReservasLS();

    // PRECARGA:
    this.listaServicios = [
      new Servicio({
        nombre: "Corte de Pelo",
        descripcion: "Cortes clásicos y modernos con técnicas profesionales. Incluye lavado, corte y peinado.",
        precio: 450,
        img: "assets/images/servicio_corte.jpg",
      }),
      new Servicio({
        nombre: "Rasurada de Barba",
        descripcion: "Arreglo y modelado de barba con aceites y productos premium. Incluye hidratación.",
        precio: 350,
        img: "assets/images/servicio_barba.jpg",
      }),
      new Servicio({
        nombre: "Colorimetría",
        descripcion: "Tintes profesionales y mechas con productos de alta calidad. Consulta previa incluida.",
        precio: 500,
        img: "assets/images/servicio_colorimetria.jpg",
      }),
      new Servicio({
        nombre: "Lavado y Acondicionamiento",
        descripcion: "Lavado y acondicionamiento de cabello con productos premium. Incluye hidratación.",
        precio: 400,
        img: "assets/images/servicio_lavado.jpg",
      }),
      new Servicio({
        nombre: "Tratamiento Premium",
        descripcion: "Nutrición profunda con minerales que revitalizan el cabello.",
        precio: 800,
        img: "assets/images/servicio_premium.jpg",
      }),
    ];

    this.listaBarberos = [
      new Barbero({
        nombre: "Martín Ramírez",
        descripcion: "15 años de experiencia · Maestro en cortes clásicos y afeitados a navaja.",
        img: "assets/images/barbero1.jpg",
      }),
      new Barbero({
        nombre: "Diego Morales",
        descripcion: "12 años de experiencia · Especialista en fades y degradados modernos.",
        img: "assets/images/barbero2.jpg",
      }),
      new Barbero({
        nombre: "Sebastián Castro",
        descripcion: "10 años de experiencia · Colorista experto en mechas y decoloración.",
        img: "assets/images/barbero3.jpg",
      }),
      new Barbero({
        nombre: "Alejandro Torres",
        descripcion: "8 años de experiencia · Gurú del cuidado y diseño de barbas.",
        img: "assets/images/barbero4.jpg",
      }),
      new Barbero({
        nombre: "Javier Herrera",
        descripcion: "7 años de experiencia · Stylist en texturizados y undercuts creativos.",
        img: "assets/images/barbero5.jpg",
      }),
      new Barbero({
        nombre: "Nicolás Gómez",
        descripcion: "5 años de experiencia · Artista en diseños y patrones con máquina.",
        img: "assets/images/barbero6.jpg",
      }),
    ];
  }

  // ---------- Métodos privados ----------

  leerReservasLS() {
    const raw = window.localStorage.getItem("reservas");
    try {
      return raw ? JSON.parse(raw).map(r => new Reserva(r)) : [];
    } catch {
      console.warn("Reservas corruptas en LocalStorage. Reiniciando.");
      return [];
    }
  }
}

// ----------------------------- RF-01: Reservar turno -----------------------------
document.querySelector("#btnReservar").addEventListener("click", realizarReserva);

function realizarReserva() {
  const mensajeEl = document.getElementById("mensajeError");

  let nombre = document.getElementById("txtNombre").value;
  let apellido = document.getElementById("txtApellido").value;
  let email = document.getElementById("txtEmail")?.value;
  let celular = document.getElementById("txtTelefono")?.value;
  let barberoId = parseInt(document.getElementById("slcBarbero").value);
  let servicioId = parseInt(document.getElementById("slcServicio").value);
  let fechaInput = document.getElementById("fecha")?.value;
  let horaInput = document.getElementById("slcHora")?.value;

  // ------------------ Validaciones ------------------
  if (!nombre || !apellido || !celular || !email || !fechaInput || !horaInput) {
    return mostrarError("Todos los campos son obligatorios", mensajeEl);
  }

  if (!/^\d+$/.test(celular)) {
    return mostrarError("Teléfono no válido", mensajeEl);
  }

  if (!/^\S+@\S+\.com$/i.test(email)) {
    return mostrarError("Email inválido.", mensajeEl);
  }

  const fechaHora = new Date(`${fechaInput}T${horaInput}`);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaHora < hoy) {
    return mostrarError("Fecha no válida", mensajeEl);
  }

  // Pasa las validaciones
  // ------------------ Alta de reserva ------------------
  const nuevaReserva = new Reserva({
    nombre,
    apellido,
    celular,
    email,
    barberoId,
    servicioId,
    fechaHora,
  });

  sistema.reservas.push(nuevaReserva);
  window.localStorage.setItem("reservas", JSON.stringify(sistema.reservas));

  if (mensajeEl) mensajeEl.textContent = "Su turno se reservó correctamente.";
}

function mostrarError(msg, el) {
  if (el) {
    el.textContent = msg;
  } else {
    alert(msg);
  }
}