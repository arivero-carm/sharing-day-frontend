import type {
  BuscarPadreRequest,
  PadreFamilia,
  RegistrarParticipacionRequest,
  Turno,
} from "../types/sharing-day.types";
import { api } from "./api";

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
  const response = await api<PadreFamilia>('/Sharingday/Persona', {
    method: 'POST',
    body: JSON.stringify(_datos),
  });

  return response;
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
  const response = await api<Turno[]>(
    `/Sharingday/Horario/${_codigoGrado}/${_codigoSeccion}`,
  );

  console.log("Respuesta completa de horarios:", response);
  console.log("¿Es un arreglo?", Array.isArray(response));

  return response;
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
  await api<void>('/Sharingday/Inscripcion', {
    method: 'POST',
    body: JSON.stringify({..._datos, codigoPariente: String(_datos.codigoPariente)}),
  });
}