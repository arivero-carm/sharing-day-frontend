import { useState } from "react";
import { CalendarDays, Clock3, Search, UserRound } from "lucide-react";
import "../../styles/SharingDayPage.css";
import logo from "../../assets/dia-del-logro-logo.png";
import { buscarPadreFamilia, obtenerTurnos } from "../../services/SharingDayService";

const SECCIONES = [
  {
    descripcion: "A",
    id: 1
},
{
    descripcion: "B",
    id: 2
},
{
    descripcion: "C",
    id: 3
},
{
    descripcion: "D",
    id: 4
},
];

export default function SharingDayPage() {
  const [seccion, setSeccion] = useState<number>(1);
  const [documento, setDocumento] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"error" | "info" | "exito">(
    "info",
  );

  async function buscarPadre() {
    setMensaje("");

    if (!seccion) {
      setTipoMensaje("error");
      setMensaje("Selecciona la sección del estudiante.");
      return;
    }

    if (![8, 9].includes(documento.length)) {
      setTipoMensaje("error");
      setMensaje("Ingresa un documento válido de 8 o 9 dígitos.");
      return;
    }

    setBuscando(true);
  
    try {
      
      const response = await buscarPadreFamilia({
        codigoGrado: 6,
        codigoSeccion: SECCIONES.find(s => s.id === seccion)?.id || 0,
        codigoTipoDocumento: 2,
        numeroDocumento: documento,
      })
      
      setTipoMensaje("exito");
      setMensaje(
        response?.nombreCompleto ?? ''
      );

    } catch (error: any) {
      setTipoMensaje("error");
      setMensaje(
        error.message ?? "Los datos del padre de familia se consultarán cuando se integre el backend.",
      );
    } finally {
      setBuscando(false);
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
                value={seccion!}
                onChange={async (event) => {
                  setSeccion(Number(event.target.value));
                  setMensaje("");

                  try {
                    const turnos = await obtenerTurnos(6, Number(event.target.value));

                    console.log(`[TURNOS:]`, turnos)
                  } catch (error) {
                    console.log(error)
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
              Después de identificar al padre de familia, se mostrarán los
              cursos correspondientes a la sección seleccionada.
            </p>

            <div className="sharing-vacio">
              <CalendarDays size={28} aria-hidden="true" />

              <strong>Horarios pendientes de consulta</strong>

              <span>
                Los cursos, horarios y cupos se cargarán desde el backend.
              </span>
            </div>
          </section>

          <p className="sharing-nota">
            Los campos marcados con * son obligatorios.
          </p>
        </form>
      </section>
    </main>
  );
}