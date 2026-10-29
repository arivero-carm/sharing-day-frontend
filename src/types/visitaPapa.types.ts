/**
 * Datos de una persona obtenidos mediante la consulta por DNI.
 */
export interface Personal {
  codigoPersonal: number;
  nombreCompleto: string;
  numeroDocumento: string;
  correo: string;
  edad?: number;
  fechaNacimiento?: string;
}

/**
 * Solicitud para consultar una persona mediante su DNI.
 */
export interface BuscarPersonalRequest {
  tipoDocumento: number;
  numeroDocumento: string;
}

/**
 * Evento disponible para la visita del Papa León XIV al Perú.
 */
export interface EventoPapa {
  codigoEvento: number;
  descripcion: string;
  fecha: string;
  hora: string;
  cantidadCupos: number;
  order: number;
}

/**
 * Solicitud para registrar la participación en un evento.
 */
export interface RegistrarParticipacionRequest {
  codigoEvento: number;
  codigoPersonal: number;
  correo: string;
  telefono: string;
}

/**
 * Estructura posible de una respuesta de error de la API.
 */
export interface ErrorGuardadoResponse {
  mensaje?: string;
  message?: string;
  code?: string;
  contactEmail?: string;
}