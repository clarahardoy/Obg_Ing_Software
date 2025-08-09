

/* --------------- Listado de Reservas --------------- */
class ListadoReservas {
  constructor() {
    
    // Crear instancia de Sistema para acceder a barberos y servicios
    this.sistema = new Sistema();
    this.reservas = this.cargarReservas();
    this.reservasPorPagina = 6;
    this.paginaActual = 0;
    this.inicializar();
  }

  cargarReservas() {
    try {
      const reservasJSON = localStorage.getItem('reservas');      
      if (!reservasJSON) {
        return [];
      } 
      const reservas = JSON.parse(reservasJSON);    
      const reservasOrdenadas = reservas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));  
      return reservasOrdenadas;
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      return [];
    }
  }

  configurarEventos() {
    const btnVerMas = document.getElementById('btnVerMas');
    if (btnVerMas) {
      btnVerMas.addEventListener('click', () => {
        this.cargarMasReservas();
      });
    }
  }

  inicializar() {
    this.renderizarReservas();
    this.configurarEventos();
  }

  formatearFecha(fechaISO) {
    try {
      const fecha = new Date(fechaISO);
      const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
      const hora = fecha.toTimeString().slice(0, 5);
      
      return {
        fecha: fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1),
        hora: hora
      };
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return {
        fecha: 'Fecha inválida',
        hora: '--:--'
      };
    }
  }

  obtenerNombreBarbero(barberoId) {
    const barberos = this.sistema.listaBarberos;
    let barbero = barberos.find(b => b.id == barberoId);
    return barbero ? barbero.nombre : 'Barbero no encontrado';
  }

  obtenerNombreServicio(servicioId) {
    const servicios = this.sistema.listaServicios;
    let servicio = servicios.find(s => s.id == servicioId);
    return servicio ? servicio : { nombre: 'Servicio no encontrado', precio: 0 };
  }

  esReservaAFuturo(fechaISO) {
    const ahora = new Date();
    const fechaReserva = new Date(fechaISO);
    // es proxima si es en el futuro o dentro de las ultimas 24 horas
    const diferencia = fechaReserva.getTime() - ahora.getTime();
    const unDiaEnMs = 24 * 60 * 60 * 1000;
    return diferencia > -unDiaEnMs;
  }

  crearItemReserva(reserva) {
    const { fecha, hora } = this.formatearFecha(reserva.fechaHora);
    const nombreBarbero = this.obtenerNombreBarbero(reserva.barberoId);
    const servicio = this.obtenerNombreServicio(reserva.servicioId);
    const esProxima = this.esReservaAFuturo(reserva.fechaHora);
    const estadoClass = esProxima ? 'proxima' : 'pasada';

    return `
      <div class="reserva-item ${estadoClass}">
        <div class="reserva-header" onclick="clickAccordion(${reserva.id})">
          <div class="reserva-summary">
            <h3 class="cliente-nombre">${reserva.nombre} ${reserva.apellido}</h3>
            <div class="reserva-meta">
              <span class="reserva-id">#${reserva.id}</span>
              <span class="reserva-fecha">${fecha} - ${hora}</span>
            </div>
          </div>
          <div class="accordion-icon">
            <span class="chevron">▼</span>
          </div>
        </div>
        
        <div class="reserva-details" id="details-${reserva.id}">
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Barbero:</span>
              <span class="detail-value">${nombreBarbero}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Servicio:</span>
              <span class="detail-value">${servicio.nombre}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Precio:</span>
              <span class="detail-value precio">$${servicio.precio}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Teléfono:</span>
              <span class="detail-value">${reserva.celular}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${reserva.email}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="estado-badge ${estadoClass}">
                ${esProxima ? 'Próxima' : 'Pasada'}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderizarReservas() {
    const container = document.getElementById('listaReservas');
    const btnVerMas = document.getElementById('btnVerMas');
    if (this.reservas.length === 0) {
      container.innerHTML = `
        <div class="sin-reservas">
          <h3>No hay reservas registradas</h3>
        </div>
      `;
      if (btnVerMas) btnVerMas.style.display = 'none';
      return;
    }

    // qué reservas mostrar
    const inicio = 0;
    const fin = (this.paginaActual + 1) * this.reservasPorPagina;
    const reservasAMostrar = this.reservas.slice(inicio, fin);

    // generar HTML
    const html = reservasAMostrar.map(reserva => this.crearItemReserva(reserva)).join('');
    container.innerHTML = html;

    // mostrar  o esconder botón "Ver más"
    if (btnVerMas) {
      if (fin >= this.reservas.length) {
        btnVerMas.style.display = 'none';
      } else {
        btnVerMas.style.display = 'block';
        btnVerMas.textContent = `Ver más (${this.reservas.length - fin} restantes)`;
      }
    }
    this.mostrarEstadisticas();
  }

  cargarMasReservas() {
    this.paginaActual++;
    this.renderizarReservas();
  }

  mostrarEstadisticas() {
    const totalReservas = this.reservas.length;
    const reservasProximas = this.reservas.filter(r => this.esReservaAFuturo(r.fechaHora)).length;
    const reservasPasadas = totalReservas - reservasProximas;

    // Agregar estadísticas al DOM si no existen
    let contenedorTotales = document.querySelector('.reservas-totales');
    if (!contenedorTotales) {
      contenedorTotales = document.createElement('div');
      contenedorTotales.className = 'reservas-totales';
      
      const container = document.querySelector('.reservas-admin .container');
      const grid = document.getElementById('listaReservas');
      container.insertBefore(contenedorTotales, grid);
    }

    contenedorTotales.innerHTML = `
      <div class="totales-grid">
        <div class="stat-item">
          <span class="stat-number">${totalReservas}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${reservasProximas}</span>
          <span class="stat-label">Próximas</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${reservasPasadas}</span>
          <span class="stat-label">Pasadas</span>
        </div>
      </div>
    `;
  }
}

/* --------------- Inicialización --------------- */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const listado = new ListadoReservas();
  } catch (error) {
    console.error('Error al crear ListadoReservas:', error);
  }
});

/* --------------- Función para manejar accordion --------------- */
function clickAccordion(reservaId) {
  const details = document.getElementById(`details-${reservaId}`);
  const chevron = document.querySelector(`[onclick="clickAccordion(${reservaId})"] .chevron`);
  
  if (details.classList.contains('open')) {
    details.classList.remove('open');
    chevron.style.transform = 'rotate(0deg)';
  } else {
    // Cerrar otros accordions abiertos
    document.querySelectorAll('.reserva-details.open').forEach(detail => {
      detail.classList.remove('open');
    });
    document.querySelectorAll('.chevron').forEach(ch => {
      ch.style.transform = 'rotate(0deg)';
    });
    
    // Abrir el seleccionado
    details.classList.add('open');
    chevron.style.transform = 'rotate(180deg)';
  }
}

// Hacer disponible globalmente
window.clickAccordion = clickAccordion;
