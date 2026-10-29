import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
  UserRound,
  BookOpen,
} from "lucide-react";

import "../../styles/SharingDayPage.css";
import { ModalSinCupos } from "../../components/ModalSinCupos";
import logo from "../../assets/dia-del-logro-logo.png";

import {
  buscarPadreFamilia,
  obtenerTurnos,
  registrarParticipacion,
} from "../../services/SharingDayService";

import type { Turno } from "../../types/sharing-day.types";

const SECCIONES = [
  { descripcion: "A", id: 1 },
  { descripcion: "B", id: 2 },
  { descripcion: "C", id: 3 },
  { descripcion: "D", id: 4 },
];

const TIPOS_DOCUMENTOS = [
  {
    id: 2,
    descripcion: 'DNI'
  },
  {
    id: 6,
    descripcion: 'C.E.'
  }
]

export default function SharingDayPage() {
  const params = new URLSearchParams(window.location.search);

  const [seccion, setSeccion] = useState<number>(Number(params.get("seccion")) ?? 0);

  const [readOnly] = useState<boolean>(!!params.get("seccion"));

  const [documento, setDocumento] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [codigoPariente, setCodigoPariente] = useState<number | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<
    "error" | "info" | "exito"
  >("info");
  

  const [mostrarModalSinCupos, setMostrarModalSinCupos] = useState(false);

  // Estados para los cursos y horarios
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);
  const [errorTurnos, setErrorTurnos] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<number | null>(null);

  const [registrando, setRegistrando] = useState(false);
  const [mensajeRegistro, setMensajeRegistro] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [mostrarHorarios, setMostrarHorarios] = useState(false);

  // Cargar los cursos y horarios cuando se selecciona una sección
    useEffect(() => {
        if (!mostrarHorarios || !seccion) {
            setTurnos([]);
            setErrorTurnos("");
            setCargandoTurnos(false);
            return;
        }

        let cancelado = false;

        async function cargarTurnos() {
            setCargandoTurnos(true);
            setErrorTurnos("");
            setTurnos([]);

            try {
            const resultado = await obtenerTurnos(6, seccion);

            if (!cancelado) {
                setTurnos(resultado);
            }
            } catch (error: unknown) {
            if (!cancelado) {
                setErrorTurnos(
                error instanceof Error
                    ? error.message
                    : "No se pudieron cargar los horarios.",
                );
            }
            } finally {
            if (!cancelado) {
                setCargandoTurnos(false);
            }
            }
        }

        void cargarTurnos();

        return () => {
            cancelado = true;
        };
    }, [mostrarHorarios, seccion]);

  // Buscar al padre o apoderado
    async function buscarPadre() {
        setMensaje("");
        setCodigoPariente(null);
        setMostrarHorarios(false);
        setTurnoSeleccionado(null);
        setMensajeRegistro("");
        setRegistroExitoso(false);
        setTurnos([]);

        if (!seccion) {
            setTipoMensaje("error");
            setMensaje("Selecciona la sección del estudiante.");
            return;
        }

        if (!/^\d{8,9}$/.test(documento.trim())) {
            setTipoMensaje("error");
            setMensaje("Ingresa un documento válido de 8 o 9 dígitos.");
            return;
        }

        setBuscando(true);

        try {
            const response = await buscarPadreFamilia({
            codigoGrado: 6,
            codigoSeccion: seccion,
            codigoTipoDocumento: 2,
            numeroDocumento: documento.trim(),
            });

            if (!response || !response.codigoPariente) {
            setTipoMensaje("error");
            setMensaje("No se encontraron los datos del padre de familia.");
            return;
            }

            setCodigoPariente(Number(response.codigoPariente));
            setTipoMensaje("exito");
            setMensaje(response.nombreCompleto ?? "");

            // Mostrar los horarios después de encontrar al padre.
            setMostrarHorarios(true);
        } catch (error: unknown) {
            setTipoMensaje("error");
            setMensaje(
            error instanceof Error
                ? error.message
                : "No se pudieron consultar los datos del padre de familia.",
            );
        } finally {
            setBuscando(false);
        }
        }

    async function registrarTurno() {
    setMensajeRegistro("");
    setRegistroExitoso(false);

    if (codigoPariente === null) {
        setMensajeRegistro("Primero busca el documento del padre de familia.");
        return;
    }

    if (turnoSeleccionado === null) {
        setMensajeRegistro("Selecciona un curso y horario.");
        return;
    }

    setRegistrando(true);

    try {
        await registrarParticipacion({
        codigoPariente,
        CodigoTurno: turnoSeleccionado,
        });

        // Mostrar confirmación de registro exitoso
        setRegistroExitoso(true);
        setMensajeRegistro("¡Tu participación se registró correctamente!");

        // Limpiar el formulario después de registrar
        setDocumento("");
        setSeccion(0);
        setCodigoPariente(null);
        setTurnoSeleccionado(null);
        setTurnos([]);
        setMostrarHorarios(false);
        setMensaje("");
        setErrorTurnos("");
        setMostrarModalSinCupos(false);

    } catch (error: unknown) {
        setMensajeRegistro(
        error instanceof Error
            ? error.message
            : "No se pudo registrar la participación."
        );
    } finally {
        setRegistrando(false);
    }
    }

  return (
    <main className="sharing-page">
      <section className="sharing-card">
        <header className="sharing-header">
        <img
        src={logo}
        alt="Día del Logro: Herramientas para pensar, momentos para compartir"
        className="sharing-logo"
        />

          <span className="sharing-etiqueta">EVENTO ESCOLAR · 2026</span>

          <h1>Registro de participación</h1>

          <p>
            Consulta los cursos y horarios disponibles para compartir esta
            experiencia con tu hijo o hija.
          </p>
        </header>

        <div className="sharing-separador" />

        <form
          className="sharing-form"
          onSubmit={(event) => {
            event.preventDefault();
            buscarPadre();
          }}
        >
          <h2>Datos de participación</h2>

          <div className="sharing-campos-grado">
            <div className="sharing-campo">
              <label htmlFor="grado">Grado</label>
              <input id="grado" value="6to." readOnly />
            </div>

            <div className="sharing-campo">
              <label htmlFor="seccion">Sección *</label>
              <select
                id="seccion"
                disabled={readOnly}
                value={seccion!}
                onChange={async (event) => {
                  setSeccion(Number(event.target.value));
                  setMensaje("");

                  try {
                    const turnos = await obtenerTurnos(6, Number(event.target.value));

                    console.log(`[TURNOS:]`, turnos)
                  } catch (error) {
                  }
                }}
                required
              >
                <option value="">Selecciona tu sección</option>
                {SECCIONES.map((opcion) => (
                  <option key={opcion.id} value={opcion.id}>
                    Sección {opcion.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sharing-campo">
            <label htmlFor="documento">
              <UserRound size={17} aria-hidden="true" />
              Documento del padre de familia *
            </label>

            <div className="sharing-documento">
              <input
                id="documento"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ingresa tu DNI o CE"
                value={documento}
                maxLength={9}
                onChange={(event) => {
                  setDocumento(
                    event.target.value.replace(/\D/g, "").slice(0, 9),
                  );
                  setMensaje("");
                }}
                required
                aria-describedby="documento-ayuda"
              />

              <button
                type="submit"
                className="sharing-boton-buscar"
                disabled={buscando}
              >
                <Search size={19} aria-hidden="true" />
                {buscando ? "Buscando..." : "Buscar"}
              </button>
            </div>

            <small id="documento-ayuda">
              Ingresa tu documento de 8 o 9 dígitos.
            </small>
          </div>

          {mensaje && (
            <div
              className={`sharing-mensaje sharing-mensaje-${tipoMensaje}`}
              role="status"
              aria-live="polite"
            >
              {mensaje}
            </div>
          )}
        
        <section className="sharing-turnos">
            <div className="sharing-turnos-titulo">
                <Clock3 size={20} aria-hidden="true" />
                <h2>Cursos y horarios disponibles</h2>
            </div>

            <p>
                Selecciona el curso y horario en el que deseas participar.
                Solo puedes elegir uno.
            </p>

            {cargandoTurnos ? (
                <div className="sharing-vacio" role="status">
                <strong>Cargando horarios...</strong>
                <span>Estamos consultando los cursos disponibles.</span>
                </div>
            ) : errorTurnos ? (
                <div
                className="sharing-mensaje sharing-mensaje-error"
                role="alert"
                >
                {errorTurnos}
                </div>
            ) : !seccion ? (
                <div className="sharing-vacio">
                <CalendarDays size={28} aria-hidden="true" />
                <strong>Selecciona una sección</strong>
                <span>Los cursos y horarios aparecerán aquí.</span>
                </div>
            ) : turnos.length === 0 ? (
                <div className="sharing-vacio">
                <CalendarDays size={28} aria-hidden="true" />
                <strong>No hay horarios disponibles</strong>
                <span>No se encontraron cursos para esta sección.</span>
                </div>
            ) : (
                <>
                <div className="sharing-lista-turnos">
                    {turnos.map((turno) => {
                    const seleccionado =
                        turnoSeleccionado === turno.codigoTurno;

                    return (
                        <button
                        type="button"
                        key={turno.codigoTurno}
                        className={`sharing-turno-card ${
                            seleccionado
                            ? "sharing-turno-card-seleccionado"
                            : ""
                        }`}
                        onClick={() =>
                            setTurnoSeleccionado(turno.codigoTurno)
                        }
                        aria-pressed={seleccionado}
                        >
                        <div className="sharing-turno-icono">
                            <BookOpen size={22} aria-hidden="true" />
                        </div>

                        <div className="sharing-turno-info">
                            <h3>{turno.curso}</h3>

                            <div className="sharing-turno-horario">
                            <Clock3 size={16} aria-hidden="true" />

                            <span>
                                {turno.horaInicio} - {turno.horaFin}
                            </span>
                            </div>

                            <span className="sharing-turno-accion">
                            {seleccionado
                                ? "Horario seleccionado"
                                : "Seleccionar este horario"}
                            </span>
                        </div>

                        <span
                            className={`sharing-turno-radio ${
                            seleccionado
                                ? "sharing-turno-radio-activo"
                                : ""
                            }`}
                            aria-hidden="true"
                        >
                            {seleccionado && <span />}
                        </span>
                        </button>
                    );
                    })}
                </div>

                {turnoSeleccionado !== null &&
                    turnos.some(
                    (turno) => turno.codigoTurno === turnoSeleccionado,
                    ) && (
                    <div className="sharing-turno-confirmacion" role="status">
                        <span className="sharing-turno-confirmacion-icono">
                        ✓
                        </span>

                        <div>
                        <strong>Horario seleccionado</strong>
                        <p>
                            {turnos.find(
                            (turno) =>
                                turno.codigoTurno === turnoSeleccionado,
                            )?.curso}
                            {" · "}
                            {turnos.find(
                            (turno) =>
                                turno.codigoTurno === turnoSeleccionado,
                            )?.horaInicio}
                            {" - "}
                            {turnos.find(
                            (turno) =>
                                turno.codigoTurno === turnoSeleccionado,
                            )?.horaFin}
                        </p>
                        </div>
                    </div>
                    )}
                </>
            )}
            </section>

        <div className="sharing-registro">
            <button
                type="button"
                className="sharing-btn-registrar"
                onClick={registrarTurno}
                disabled={
                registrando ||
                registroExitoso ||
                codigoPariente === null ||
                turnoSeleccionado === null
                }
            >
                {registrando ? "Registrando..." : "Registrar participación"}
            </button>

            {mensajeRegistro && (
                <div
                className={
                    registroExitoso
                    ? "sharing-mensaje sharing-mensaje-exito"
                    : "sharing-mensaje sharing-mensaje-error"
                }
                role="status"
                >
                {mensajeRegistro}
                </div>
            )}

            <p className="sharing-registro-ayuda">
                Selecciona un único curso y horario antes de registrar tu participación.
            </p>
        </div>

          <p className="sharing-nota">
            Los campos marcados con * son obligatorios.
          </p>
        </form>
        <ModalSinCupos
        isOpen={mostrarModalSinCupos}
        onClose={() => setMostrarModalSinCupos(false)}
        />
      </section>
    </main>
  );
}