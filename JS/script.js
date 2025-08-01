/* Nav mobile */
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

/* CONTADORES GLOBALES */
let contadorReservas = 1;
let contadorBarberos = 1;
let contadorServicios = 1;

/* CLASES DE DOMINIO */
class Reserva {
  constructor(nombre, apellido, email, celular, idBarbero, idServicio, hora, fecha) {
    this.id = contadorReservas;
    this.nombre = nombre.toUpperCase();
    this.apellido = apellido.toUpperCase();
    this.email = email.toUpperCase();
    this.celular = celular;
    this.idBarbero = idBarbero;
    this.idServicio = idServicio;
    this.hora = hora;
    this.fecha = fecha;
    contadorReservas++;
  }
}

class Barbero {
  constructor(imagen, nombreCompleto, descripcion) {
    this.id = contadorBarberos;
    this.imagen = imagen;
    this.nombre = nombreCompleto.toUpperCase();
    this.descripcion = descripcion;
    contadorBarberos++;
  }
}

class Servicio {
  constructor(imagen, nombre, descripcion, precio) {
    this.id = contadorServicios;
    this.imagen = imagen;
    this.nombre = nombre.toUpperCase();
    this.descripcion = descripcion;
    this.precio = precio;
    contadorServicios++;
  }
}

/* ========== CLASE SISTEMA ========== */
class Sistema {
  constructor() {

    this.listaReservas = []; // inicialmente VACÍO

    /* PRECARGA */
    this.listaBarberos = [
      new Barbero("assets/images/barbero1.jpg", "Martín Ramírez",
        "15 años de experiencia · Maestro en cortes clásicos y afeitados a navaja."),
      new Barbero("assets/images/barbero2.jpg", "Diego Morales",
        "12 años de experiencia · Especialista en fades y degradados modernos."),
      new Barbero("assets/images/barbero3.jpg", "Sebastián Castro",
        "10 años de experiencia · Colorista experto en mechas y decoloración."),
      new Barbero("assets/images/barbero4.jpg", "Alejandro Torres",
        "8 años de experiencia · Gurú del cuidado y diseño de barbas."),
      new Barbero("assets/images/barbero5.jpg", "Javier Herrera",
        "7 años de experiencia · Stylist en texturizados y undercuts creativos."),
      new Barbero("assets/images/barbero6.jpg", "Nicolás Gómez",
        "5 años de experiencia · Artista en diseños y patrones con máquina.")
    ];

    /* -------- SERVICIOS PRECARGADOS -------- */
    this.listaServicios = [
      new Servicio("img/servicio_corte.svg", "Corte de Pelo",
        "Cortes clásicos y modernos con técnicas profesionales. Incluye lavado, corte y peinado.",
        450),
      new Servicio("img/servicio_barba.svg", "Rasurada de Barba",
        "Arreglo y modelado de barba con aceites y productos premium. Incluye hidratación.",
        350),
      new Servicio("img/servicio_colorimetria.svg", "Colorimetría",
        "Tintes profesionales y mechas con productos de alta calidad. Consulta previa incluida.",
        500),
      new Servicio("img/servicio_lavado.svg", "Lavado y Acondicionamiento de Cabello",
        "Lavado y acondicionamiento de cabello con productos premium. Incluye hidratación.",
        400),
      new Servicio("img/servicio_premium.svg", "Premium",
        "Nutrición con minerales que nutren el cabello. Incluye hidratación.",
        800)
    ];

    /* usuario logueado (si implementas login) */
    this.usuarioLogueado = null;
  }

  /* ---------- UTILIDADES ----------- */

  /**
   * Devuelve el primer elemento de un array cuya propiedad === valor, o null.
   * @param {Array} array
   * @param {String} propiedad
   * @param {*} valor
   */
  buscarElemento(array, propiedad, valor) {
    let objeto = null;
    for (let i = 0; i < array.length; i++) {
      if (array[i][propiedad] === valor) {
        objeto = array[i];
        break;
      }
    }
    return objeto;
  }

  /**
   * Crea una nueva reserva y la agrega a listaReservas.
   * Valida que existan barbero y servicio.
   */
  agregarReserva(nombre, apellido, email, celular, idBarbero, idServicio, hora, fecha) {
    const barbero = this.buscarElemento(this.listaBarberos, "id", idBarbero);
    const servicio = this.buscarElemento(this.listaServicios, "id", idServicio);

    if (!barbero || !servicio) {
      throw new Error("Barbero o servicio inexistente");
    }

    const nuevaReserva = new Reserva(
      nombre, apellido, email, celular,
      idBarbero, idServicio, hora, fecha
    );
    this.listaReservas.push(nuevaReserva);
  }

  /**
   * Devuelve todas las reservas de un día concreto (string en mayúsculas).
   */
  reservasPorDia(dia) {
    return this.listaReservas.filter(r => r.dia === dia.toUpperCase());
  }
}

/* ========== INSTANCIA ÚNICA ========= */
let sistema = new Sistema();


document.querySelector("#btnReservar").addEventListener("click", realizarReserva);

function realizarReserva() {
  let nombre = document.querySelector("#txtNombre").value;
  let apellido = document.querySelector("#txtApellido").value;
  let email = document.querySelector("#txtEmail").value;
  let celular = document.querySelector("#txtTelefono").value);
  let idBarbero = parseInt(document.querySelector("#slcBarbero").value);
  let idServicio = parseInt(document.querySelector("#slcServicio").value);
  let hora = document.querySelector("#slcHora").value;
  let fecha = document.querySelector("#txtFecha").value;

  // Validación de campos
  if (!nombre || !apellido || !email || !celular || isNaN(idBarbero) || isNaN(idServicio) || !dia || !fecha) {
    alert("Todos los campos son obligatorios.");
    return;
  } else if(dia)
}

/* ======== EJEMPLO DE USO (puedes borrar) ======== */
// sistema.agregarReserva("Ana", "López", "ana@mail.com", "099123456",
//                        1, 3, "VIERNES", "2025-08-08");
// console.log(sistema.listaReservas);

