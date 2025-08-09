/**
 * @jest-environment jsdom
 */
const { Sistema, Reserva, Servicio, Barbero } = require("../JS/script.js");

describe("SERVICIOS Y BARBEROS – TESTS UNITARIOS", () => {

    /* ------------------------------------------------------------------
       1.  CLASE SERVICIO
       ------------------------------------------------------------------ */
    describe("CLASE SERVICIO", () => {

        test("crear servicio con todos los parámetros", () => {
            const servicio = new Servicio({
                nombre: "Corte Moderno",
                descripcion: "Corte de última tendencia",
                precio: 500,
                duracion: 45,
                img: "test.jpg"
            });

            expect(servicio.nombre).toBe("Corte Moderno");
            expect(servicio.descripcion).toBe("Corte de última tendencia");
            expect(servicio.precio).toBe(500);
            expect(servicio.duracion).toBe(45);
            expect(servicio.img).toBe("test.jpg");
            expect(typeof servicio.id).toBe("number");
        });

        test("crear servicio con duración por defecto", () => {
            const servicio = new Servicio({
                nombre: "Lavado",
                descripcion: "Lavado básico",
                precio: 200
            });

            expect(servicio.duracion).toBe(30); // valor por defecto
            expect(servicio.img).toBe(""); // valor por defecto
        });

        test("IDs se incrementan automáticamente", () => {
            const servicio1 = new Servicio({
                nombre: "Servicio 1",
                descripcion: "Descripción 1",
                precio: 100
            });

            const servicio2 = new Servicio({
                nombre: "Servicio 2", 
                descripcion: "Descripción 2",
                precio: 200
            });

            expect(servicio2.id).toBeGreaterThan(servicio1.id);
        });
    });

    /* ------------------------------------------------------------------
       2.  CLASE BARBERO
       ------------------------------------------------------------------ */
    describe("CLASE BARBERO", () => {

        test("crear barbero con todos los parámetros", () => {
            const barbero = new Barbero({
                nombre: "Carlos Mendoza",
                descripcion: "Especialista en barbas",
                img: "carlos.jpg"
            });

            expect(barbero.nombre).toBe("Carlos Mendoza");
            expect(barbero.descripcion).toBe("Especialista en barbas");
            expect(barbero.img).toBe("carlos.jpg");
            expect(typeof barbero.id).toBe("number");
        });

        test("crear barbero solo con nombre", () => {
            const barbero = new Barbero({
                nombre: "Ana López"
            });

            expect(barbero.nombre).toBe("Ana López");
            expect(barbero.descripcion).toBe(""); // valor por defecto
            expect(barbero.img).toBe(""); // valor por defecto
        });

        test("IDs se incrementan automáticamente", () => {
            const barbero1 = new Barbero({ nombre: "Barbero 1" });
            const barbero2 = new Barbero({ nombre: "Barbero 2" });

            expect(barbero2.id).toBeGreaterThan(barbero1.id);
        });
    });

    /* ------------------------------------------------------------------
       3.  CATÁLOGOS PRECARGADOS EN SISTEMA
       ------------------------------------------------------------------ */
    describe("CATÁLOGOS PRECARGADOS", () => {

        let sistema;

        beforeEach(() => {
            sistema = new Sistema();
        });

        test("sistema tiene 5 servicios precargados", () => {
            expect(sistema.listaServicios).toHaveLength(5);
            expect(sistema.listaServicios[0].nombre).toBe("Corte de Pelo");
            expect(sistema.listaServicios[4].nombre).toBe("Tratamiento Premium");
        });

        test("sistema tiene 6 barberos precargados", () => {
            expect(sistema.listaBarberos).toHaveLength(6);
            expect(sistema.listaBarberos[0].nombre).toBe("Martín Ramírez");
            expect(sistema.listaBarberos[5].nombre).toBe("Nicolás Gómez");
        });

        test("todos los servicios tienen precio y duración válidos", () => {
            sistema.listaServicios.forEach(servicio => {
                expect(servicio.precio).toBeGreaterThan(0);
                expect(servicio.duracion).toBeGreaterThan(0);
                expect(typeof servicio.nombre).toBe("string");
                expect(servicio.nombre.length).toBeGreaterThan(0);
            });
        });

        test("todos los barberos tienen nombre válido", () => {
            sistema.listaBarberos.forEach(barbero => {
                expect(typeof barbero.nombre).toBe("string");
                expect(barbero.nombre.length).toBeGreaterThan(0);
                expect(typeof barbero.descripcion).toBe("string");
            });
        });
    });
});
