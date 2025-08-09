/**
 * @jest-environment jsdom
 */
const { Sistema, Reserva } = require("../JS/script.js");

describe("RESERVAS – TESTS UNITARIOS", () => {

    let sistema;

    beforeEach(() => {
        localStorage.clear();
        sistema = new Sistema();
    });

    /* ------------------------------------------------------------------
       1.  HORAS DISPONIBLES
       ------------------------------------------------------------------ */
    describe("HORAS DISPONIBLES", () => {

        test("devuelve la lista completa cuando no hay reservas previas", () => {
            const hoy = "2025-08-05";                 // AAAA-MM-DD   (ISO)
            const horas = sistema.horasDisponibles(1, hoy);

            expect(horas).toEqual(sistema.listaHoras);  // misma longitud y mismos valores
        });

        test("excluye la hora ya reservada para ese barbero y fecha", () => {
            /* Creo una reserva en el slot 10:00 (13:00 cuando se guarda en el sistema)*/
            const reserva = new Reserva({
                nombre: "Ana",
                apellido: "Gómez",
                celular: "091234567",
                email: "ana@example.com",
                barberoId: 2,
                servicioId: 0,
                fechaHora: "2025-08-05T13:00:00.000Z",
            });
            sistema.agregarReserva(reserva);

            const horas = sistema.horasDisponibles(2, "2025-08-05");

            expect(horas).not.toContain("10:00");
            expect(horas.length).toBe(sistema.listaHoras.length - 1);
        });

        test("si no se pasa barbero o fecha válidos, devuelve []", () => {
            expect(sistema.horasDisponibles(NaN, "")).toEqual([]);
        });
    });

    /* ------------------------------------------------------------------
       2.  REGISTRO Y PERSISTENCIA
       ------------------------------------------------------------------ */
    describe("AGREGAR RESERVA", () => {

        test("persiste la reserva en localStorage", () => {
            const r = new Reserva({
                nombre: "Luis",
                apellido: "Pérez",
                celular: "099876543",
                email: "luis@example.com",
                barberoId: 1,
                servicioId: 0,
                fechaHora: "2025-08-06T15:30:00.000Z",
            });
            sistema.agregarReserva(r);

            const guardadas = JSON.parse(localStorage.getItem("reservas"));
            expect(guardadas).toHaveLength(1);
            expect(guardadas[0].id).toBe(r.id);
        });

        test("incrementa el id de forma automática", () => {
            const primera = new Reserva({
                nombre: "María",
                apellido: "Silva",
                celular: "092222222",
                email: "maria@example.com",
                barberoId: 1,
                servicioId: 0,
                fechaHora: "2025-08-07T09:00:00.000Z",
            });
            sistema.agregarReserva(primera);

            const segunda = new Reserva({
                nombre: "Juan",
                apellido: "Ruiz",
                celular: "093333333",
                email: "juan@example.com",
                barberoId: 1,
                servicioId: 0,
                fechaHora: "2025-08-07T09:30:00.000Z",
            });
            sistema.agregarReserva(segunda);

            expect(segunda.id).toBeGreaterThan(primera.id);
        });
    });

    /* ------------------------------------------------------------------
       3.  CONFLICTOS DE HORARIO
       ------------------------------------------------------------------ */
    describe("SOLAPES / CONFLICTOS", () => {

        test("no debería permitir reservar un turno ya tomado", () => {
            /* 1ª reserva legal */
            const r1 = new Reserva({
                nombre: "Carlos",
                apellido: "López",
                celular: "094444444",
                email: "carlos@example.com",
                barberoId: 3,
                servicioId: 0,
                fechaHora: "2025-08-10T18:00:00.000Z",
            });
            sistema.agregarReserva(r1);

            /* Intento reservar el mismo slot */
            const horas = sistema.horasDisponibles(3, "2025-08-10");
            expect(horas).not.toContain("15:00"); // 15:00 es la hora de la reserva 1 guardada en el sistema porque la convierte a UTC
        });
    });

    /* ------------------------------------------------------------------
       4.  BORDE: GENERACIÓN DE LISTA HORAS
       ------------------------------------------------------------------ */
    describe("LISTA HORAS (09:00-21:00 cada 30')", () => {

        test("el primer slot es 09:00 y el último 21:00", () => {
            expect(sistema.listaHoras[0]).toBe("09:00");
            expect(sistema.listaHoras[sistema.listaHoras.length - 1]).toBe("21:00");
        });

        test("la cantidad total de slots es 25 (13 horas completas + 12 medias)", () => {
            expect(sistema.listaHoras).toHaveLength(25);
        });
    });
});
