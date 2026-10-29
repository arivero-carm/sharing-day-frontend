import type {
  BuscarPadreRequest,
  PadreFamilia,
  RegistrarParticipacionRequest,
  Turno,
} from "../types/sharing-day.types";

/**
 * Busca al padre de familia por su documento.
 *
 * Pendiente de confirmar con el backend:
 * - Endpoint.
 * - Método HTTP.
 * - Estructura de la respuesta.
 */
export async function buscarPadreFamilia(
  _datos: BuscarPadreRequest,
): Promise<PadreFamilia | null> {
  throw new Error(
    "La búsqueda del padre de familia está pendiente de integración con el backend.",
  );
}

/**
 * Obtiene los turnos de un grado y una sección.
 *
 * Referencia proporcionada:
 * api.formularios.com/SharingDay/Turnos/{codigoGrado}/{codigoSeccion}
 *
 * Pendiente de confirmar:
 * - URL base definitiva.
 * - Configuración del cliente API.
 * - Estructura de disponibilidad y cupos.
 */
export async function obtenerTurnos(
  _codigoGrado: number,
  _codigoSeccion: number,
): Promise<Turno[]> {
  throw new Error(
    "La consulta de turnos está pendiente de integración con el backend.",
  );
}

/**
 * Registra la participación del padre de familia.
 *
 * Ejemplo de payload proporcionado:
 * {
 *   codigoPariente: 18,
 *   CodigoTurno: 1
 * }
 *
 * Pendiente de confirmar:
 * - Endpoint.
 * - Método HTTP.
 * - Respuesta del registro.
 * - Validación de duplicados y cupos.
 */
export async function registrarParticipacion(
  _datos: RegistrarParticipacionRequest,
): Promise<void> {
  throw new Error(
    "El registro de participación está pendiente de integración con el backend.",
  );
}