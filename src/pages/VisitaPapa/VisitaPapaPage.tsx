import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  Clock3,
  IdCard,
  LoaderCircle,
  Mail,
  Phone,
  Search,
  UserRound,
} from "lucide-react";

import logoVisitaPapa from "../../assets/visita-papa-logo.png";

import "../../styles/VisitaPapaPage.css";

import { guardarRegistro, buscarPersonalPorDni } from "../../services/VisitaPapaService";

import { ModalSuccess } from "../../components/ModalSuccess";
import { ModalCupoCompleto } from "../../components/ModalCupoCompleto";

import eventosPapa from "../../const/EventosPapa.json";

interface Personal {
  codigoPersonal: number;
  nombreCompleto: string;
  numeroDocumento: string;
  correo: string;
  edad?: number;
  fechaNacimiento?: string;
}

interface Evento {
  codigoEvento: number;
  descripcion: string;
  fecha: string;
  hora: string;
  cantidadCupos: number;
  order: number;
}

const eventos: Evento[] = eventosPapa;

export default function VisitaPapaPage() {
  const [dni, setDni] = useState("");
  const [personal, setPersonal] = useState<Personal | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");

  const [edad, setEdad] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [buscando, setBuscando] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCupoOpen, setIsModalCupoOpen] = useState(false);

  const ultimaBusqueda = useRef("");

  useEffect(() => {
    if (dni.length !== 8) {
      setPersonal(null);
      setEdad("");
      ultimaBusqueda.current = "";
      return;
    }

    if (ultimaBusqueda.current === dni) return;

    const buscar = async () => {
      ultimaBusqueda.current = dni;
      setBuscando(true);
      setMensaje("");
      setPersonal(null);
      setEdad("");

      try {
        const respuesta = await buscarPersonalPorDni(dni);

        if (!respuesta) {
          setMensaje("No se encontraron datos asociados a este DNI.");
          return;
        }

        setPersonal(respuesta);
        setCorreo(respuesta.correo ?? "");

        if (respuesta.edad !== undefined && respuesta.edad !== null) {
          setEdad(String(respuesta.edad));
        }
      } catch (error: unknown) {
        setMensaje(
          error instanceof Error
            ? error.message
            : "No fue posible consultar el DNI. Inténtalo nuevamente."
        );
      } finally {
        setBuscando(false);
      }
    };

    void buscar();
  }, [dni]);

  function cambiarDni(valor: string) {
    const nuevoDni = valor.replace(/\D/g, "").slice(0, 8);

    setDni(nuevoDni);
    setPersonal(null);
    setEdad("");
    setCorreo("");
    setTelefono("");
    setMensaje("");
    setEventoSeleccionado("");
    ultimaBusqueda.current = "";
  }

  function reiniciarFormulario() {
    setDni("");
    setPersonal(null);
    setEdad("");
    setCorreo("");
    setTelefono("");
    setEventoSeleccionado("");
    setMensaje("");
    ultimaBusqueda.current = "";

    // Limpiar validaciones visuales del navegador
    const formulario = document.querySelector<HTMLFormElement>(".registro-form");
    formulario?.reset();
  }

  async function registrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensaje("");

    if (dni.length !== 8) {
      setMensaje("Ingresa un DNI válido de 8 dígitos.");
      return;
    }

    if (!personal) {
      setMensaje("Primero debes consultar y validar tu DNI.");
      return;
    }

    if (!eventoSeleccionado) {
      setMensaje("Selecciona el día de participación.");
      return;
    }

    setRegistrando(true);

    try {
      await guardarRegistro({
        codigoEvento: Number(eventoSeleccionado),
        codigoPersonal: personal.codigoPersonal,
        correo: correo.trim(),
        telefono: telefono.trim(),
      });

      reiniciarFormulario();
      setIsModalOpen(true);
    } catch (error: unknown) {
      const mensajeError =
        error instanceof Error
          ? error.message
          : "Ocurrió un problema al registrar tu participación.";

      if (
        /cupo|aforo|inscripciones cerradas|sin vacantes|sin cupos/i.test(
          mensajeError
        )
      ) {
        setIsModalCupoOpen(true);
      } else {
        setMensaje(mensajeError);
      }
    } finally {
      setRegistrando(false);
    }
  }

  const eventoActual = eventos.find(
    (evento) => String(evento.codigoEvento) === eventoSeleccionado
  );

  return (
    <main className="registro-page">
      <section className="registro-card">
        <header className="registro-header">
          <img
            src={logoVisitaPapa}
            alt="Visita del Papa León XIV al Perú"
            className="registro-logo"
          />
        </header>

        <h1 className="registro-titulo">
          Participación en la
          <br />
          Visita de Su Santidad
          <br />
          el Papa León XIV al Perú
        </h1>

        <div className="registro-separador" />

        <p className="registro-descripcion">
          Complete la siguiente información para registrar su participación.
          Ingrese su DNI para consultar y autocompletar sus datos.
        </p>

        <form className="registro-form" onSubmit={registrar}>
          {/* DNI */}
          <div className="campo">
            <label htmlFor="dni">
              <IdCard aria-hidden="true" />
              <span className="campo-texto">
                1. Documento Nacional de Identidad (DNI o CE){" "}
                <strong>*</strong>
              </span>
            </label>

            <div className="dni-contenedor">
              <input
                id="dni"
                name="dni"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ingresa tu DNI"
                value={dni}
                onChange={(event) => cambiarDni(event.target.value)}
                maxLength={8}
                pattern="[0-9]{8}"
                required
                aria-describedby="dni-ayuda"
              />

              <span className="dni-estado" aria-live="polite">
                {buscando ? (
                  <LoaderCircle className="icono-cargando" />
                ) : dni.length === 8 && personal ? (
                  <Search aria-hidden="true" />
                ) : null}
              </span>
            </div>

            <small id="dni-ayuda">
              Ingresa los 8 dígitos de tu DNI. La búsqueda se realizará
              automáticamente.
            </small>
          </div>

          {/* Nombre completo */}
          <div className="campo">
            <label htmlFor="nombreCompleto">
              <UserRound aria-hidden="true" />
              <span className="campo-texto">
                2. Nombre completo <strong>*</strong>
              </span>
            </label>

            <input
              id="nombreCompleto"
              name="nombreCompleto"
              type="text"
              value={
                personal
                  ? `${personal.nombreCompleto}`
                  : ""
              }
              placeholder="Se completará al consultar tu DNI"
              readOnly
              required
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div className="campo">
            <label htmlFor="fechaNacimiento">
              <Calendar aria-hidden="true" />
              <span className="campo-texto">
                3. Fecha de Nacimiento <strong>*</strong>
              </span>
            </label>

            <input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="text"
              value={
                personal
                  ? `${personal.fechaNacimiento}`
                  : ""
              }
              placeholder="Se completará al consultar tu DNI"
              readOnly
              required
            />
          </div>

          {/* Edad */}
          <div className="campo">
            <label htmlFor="edad">
              <UserRound aria-hidden="true" />
              <span className="campo-texto">
                4. Edad <strong>*</strong>
              </span>
            </label>

            <input
              id="edad"
              name="edad"
              type="number"
              value={edad}
              placeholder="Se completará al consultar tu DNI"
              readOnly
              required
              min={1}
              max={120}
            />

            <small>
              La edad se completará cuando esté disponible en la respuesta
              del servicio de consulta.
            </small>
          </div>

          {/* Correo electrónico */}
          <div className="campo">
            <label htmlFor="correo">
              <Mail aria-hidden="true" />
              <span className="campo-texto">
                5. Correo electrónico <strong>*</strong>
              </span>
            </label>

            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
              style={{
                borderColor:
                  correo.length === 0
                    ? undefined
                    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
                      ? "#16a34a"
                      : "#dc2626",
              }}
            />

            {correo.length > 0 && (
              <small
                style={{
                  color: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
                    ? "#16a34a"
                    : "#dc2626",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
                  ? "✓ Correo electrónico válido"
                  : "✗ Ingresa un correo válido (ejemplo@dominio.com)"}
              </small>
            )}
          </div>
          
          {/* Teléfono */}
          <div className="campo">
            <label htmlFor="telefono">
              <Phone aria-hidden="true" />
              <span className="campo-texto">
                6. Número de teléfono <strong>*</strong>
              </span>
            </label>

            <input
              id="telefono"
              name="telefono"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Ingresa tu número de 9 dígitos"
              value={telefono}
              onChange={(event) =>
                setTelefono(event.target.value.replace(/\D/g, "").slice(0, 9))
              }
              required
              minLength={9}
              maxLength={9}
              pattern="9[0-9]{8}"
              title="El teléfono debe tener exactamente 9 dígitos y comenzar con 9."
              style={{
                borderColor:
                  telefono.length === 0
                    ? undefined
                    : /^9\d{8}$/.test(telefono)
                      ? "#16a34a"
                      : "#dc2626",
              }}
            />

            {telefono.length > 0 && (
              <small
                style={{
                  color: /^9\d{8}$/.test(telefono) ? "#16a34a" : "#dc2626",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {/^9\d{8}$/.test(telefono)
                  ? "✓ Número de teléfono válido"
                  : telefono[0] !== "9"
                    ? "✗ El número debe comenzar con 9"
                    : `✗ Ingresa 9 dígitos (${telefono.length}/9)`}
              </small>
            )}
          </div>

          {/* Evento */}
          <div className="campo">
            <label htmlFor="evento">
              <CalendarDays aria-hidden="true" />
              <span className="campo-texto">
                7. Día de participación <strong>*</strong>
              </span>
            </label>

            <select
              id="evento"
              name="evento"
              value={eventoSeleccionado}
              onChange={(event) => {
                setEventoSeleccionado(event.target.value);
                setMensaje("");
              }}
              disabled={!personal || buscando}
              required
            >
              <option value="" disabled>
                {!personal
                  ? "Eliga la opción después de consultar tu DNI"
                  : "Selecciona el evento"}
              </option>

              {eventos
                .sort((a, b) => a.order - b.order)
                .map((evento) => (
                  <option
                    key={evento.codigoEvento}
                    value={evento.codigoEvento}
                  >
                    {evento.descripcion}
                  </option>
                ))}
            </select>

            {eventoActual && (
              <div className="horario">
                <Clock3 aria-hidden="true" />

                <span>
                  {eventoActual.fecha} · {eventoActual.hora}
                </span>
              </div>
            )}
          </div>

          {mensaje && (
            <div className="registro-mensaje" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{mensaje}</span>
            </div>
          )}

          <button
            className="registro-boton"
            type="submit"
            disabled={buscando || registrando || !personal}
          >
            {registrando ? (
              <>
                <LoaderCircle className="icono-cargando" />
                Registrando...
              </>
            ) : (
              "Registrar participación"
            )}
          </button>

          <p className="registro-nota">
            Los campos marcados con * son obligatorios.
          </p>
        </form>

        <ModalSuccess
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="¡Registro exitoso!"
          message={
            <>
              Tu participación en la visita de{" "}
              <strong>Su Santidad el Papa León XIV al Perú</strong> ha sido
              registrada correctamente.
            </>
          }
        />

        <ModalCupoCompleto
          isOpen={isModalCupoOpen}
          onClose={() => setIsModalCupoOpen(false)}
          title="¡Inscripciones cerradas!"
          message={
            <>
              Se ha alcanzado el cupo máximo
              {eventoActual ? ` para ${eventoActual.descripcion}` : ""}.
              Actualmente no es posible registrar nuevas inscripciones.
            </>
          }
        />
      </section>
    </main>
  );
}