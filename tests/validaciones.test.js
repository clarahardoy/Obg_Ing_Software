/**
 * @jest-environment jsdom
 */

describe("VALIDACIONES – TESTS UNITARIOS", () => {

    /* ------------------------------------------------------------------
       1.  VALIDACIÓN DE TELÉFONO
       ------------------------------------------------------------------ */
    describe("VALIDACIÓN DE TELÉFONO", () => {

        const validarTelefono = (celular) => /^\d{9}$/.test(celular);

        test("acepta números de 9 dígitos", () => {
            const telefonosValidos = [
                "091234567",
                "092345678", 
                "093456789",
                "094567890",
                "095678901",
                "096789012",
                "097890123",
                "098901234",
                "099012345"
            ];

            telefonosValidos.forEach(telefono => {
                expect(validarTelefono(telefono)).toBe(true);
            });
        });

        test("rechaza números con menos de 9 dígitos", () => {
            const telefonosInvalidos = [
                "12345678", 
                "1234567",    
                "123456",    
                "12345",       
                "",            
                "1"             
            ];

            telefonosInvalidos.forEach(telefono => {
                expect(validarTelefono(telefono)).toBe(false);
            });
        });

        test("rechaza números con más de 9 dígitos", () => {
            const telefonosInvalidos = [
                "0912345678",   
                "09123456789", 
                "091234567890"  
            ];

            telefonosInvalidos.forEach(telefono => {
                expect(validarTelefono(telefono)).toBe(false);
            });
        });

        test("rechaza números con caracteres no numéricos", () => {
            const telefonosInvalidos = [
                "091-234-567",  
                "091.234.567",  
                "091 234 567",  
                "09123456a",    
                "091234567.",  
                "+091234567",  
                "(091)234567"
            ];

            telefonosInvalidos.forEach(telefono => {
                expect(validarTelefono(telefono)).toBe(false);
            });
        });
    });

    /* ------------------------------------------------------------------
       2.  VALIDACIÓN DE EMAIL (RESERVAS)
       ------------------------------------------------------------------ */
    describe("VALIDACIÓN DE EMAIL PARA RESERVAS", () => {

        const validarEmailReserva = (email) => /^\S+@\S+\.com$/i.test(email);

        test("acepta emails válidos con .com", () => {
            const emailsValidos = [
                "usuario@ejemplo.com",
                "test@test.com",
                "admin@barberia.com",
                "cliente123@gmail.com",
                "info@empresa.com",
                "contacto@sitio.COM" 
            ];

            emailsValidos.forEach(email => {
                expect(validarEmailReserva(email)).toBe(true);
            });
        });

        test("rechaza emails sin .com", () => {
            const emailsInvalidos = [
                "usuario@ejemplo.org",
                "test@test.net",
                "admin@barberia.es",
                "cliente@gmail.co.uk",
                "info@empresa"
            ];

            emailsInvalidos.forEach(email => {
                expect(validarEmailReserva(email)).toBe(false);
            });
        });

        test("rechaza emails malformados", () => {
            const emailsInvalidos = [
                "usuario.com",          
                "@ejemplo.com",         
                "usuario@.com",        
                "usuario@ejemplo.",     
                "",                     
                "usuario@"            
            ];

            emailsInvalidos.forEach(email => {
                expect(validarEmailReserva(email)).toBe(false);
            });
        });
    });

    /* ------------------------------------------------------------------
       3.  VALIDACIÓN DE FECHA FUTURA
       ------------------------------------------------------------------ */
    describe("VALIDACIÓN DE FECHA FUTURA", () => {

        const validarFechaFutura = (fechaVal, horaVal) => {
            const fechaHora = new Date(`${fechaVal}T${horaVal}`);
            return fechaHora > new Date();
        };

        test("acepta fechas futuras", () => {
            const manana = new Date();
            manana.setDate(manana.getDate() + 1);
            const fechaManana = manana.toISOString().split('T')[0];

            expect(validarFechaFutura(fechaManana, "10:00")).toBe(true);
            expect(validarFechaFutura(fechaManana, "15:30")).toBe(true);
        });

        test("rechaza fechas pasadas", () => {
            const ayer = new Date();
            ayer.setDate(ayer.getDate() - 1);
            const fechaAyer = ayer.toISOString().split('T')[0];

            expect(validarFechaFutura(fechaAyer, "10:00")).toBe(false);
            expect(validarFechaFutura(fechaAyer, "15:30")).toBe(false);
        });

        test("maneja correctamente el día actual", () => {
            const hoy = new Date().toISOString().split('T')[0];
            const ahoraHora = new Date().getHours();
            const ahoraMinutos = new Date().getMinutes();
            
            // Hora futura del mismo día
            const horaFutura = `${(ahoraHora + 2).toString().padStart(2, '0')}:00`;
            
            // Si estamos antes de las 19:00, podemos testear una hora futura
            if (ahoraHora < 19) {
                expect(validarFechaFutura(hoy, horaFutura)).toBe(true);
            }
            
            // Hora pasada del mismo día
            if (ahoraHora > 10) {
                const horaPasada = `${(ahoraHora - 2).toString().padStart(2, '0')}:00`;
                expect(validarFechaFutura(hoy, horaPasada)).toBe(false);
            }
        });
    });

    /* ------------------------------------------------------------------
       4.  VALIDACIÓN DE CAMPOS OBLIGATORIOS
       ------------------------------------------------------------------ */
    describe("VALIDACIÓN DE CAMPOS OBLIGATORIOS", () => {

        const validarCamposObligatorios = (nombre, apellido, celular, email, fechaVal, horaVal) => {
            return !!(nombre && apellido && celular && email && fechaVal && horaVal);
        };

        test("acepta cuando todos los campos están completos", () => {
            expect(validarCamposObligatorios(
                "Juan", "Pérez", "091234567", "juan@test.com", "2025-12-01", "10:00"
            )).toBe(true);
        });

        test("rechaza cuando faltan campos", () => {
            // Falta nombre
            expect(validarCamposObligatorios(
                "", "Pérez", "091234567", "juan@test.com", "2025-12-01", "10:00"
            )).toBe(false);

            // Falta apellido
            expect(validarCamposObligatorios(
                "Juan", "", "091234567", "juan@test.com", "2025-12-01", "10:00"
            )).toBe(false);

            // Falta celular
            expect(validarCamposObligatorios(
                "Juan", "Pérez", "", "juan@test.com", "2025-12-01", "10:00"
            )).toBe(false);

            // Falta email
            expect(validarCamposObligatorios(
                "Juan", "Pérez", "091234567", "", "2025-12-01", "10:00"
            )).toBe(false);

            // Falta fecha
            expect(validarCamposObligatorios(
                "Juan", "Pérez", "091234567", "juan@test.com", "", "10:00"
            )).toBe(false);

            // Falta hora
            expect(validarCamposObligatorios(
                "Juan", "Pérez", "091234567", "juan@test.com", "2025-12-01", ""
            )).toBe(false);
        });

        test("rechaza valores null o undefined", () => {
            expect(validarCamposObligatorios(
                null, "Pérez", "091234567", "juan@test.com", "2025-12-01", "10:00"
            )).toBe(false);

            expect(validarCamposObligatorios(
                "Juan", undefined, "091234567", "juan@test.com", "2025-12-01", "10:00"
            )).toBe(false);
        });
    });
});
