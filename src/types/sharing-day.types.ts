/** Grados proporcionados por el backend. */
export interface Grado {
  CodigoGrado: number;
  DescripcionGrado: string;
  NombreCorto: string;
  SwActivo: number;
}

/** Secciones proporcionadas por el backend. */
export interface Seccion {
  CodigoSeccion: number;
  Descripcion: string;
  swActivo: number;
}

/** Datos enviados para buscar al padre de familia. */
export interface BuscarPadreRequest {
  codigoTipoDocumento: number;
  numeroDocumento: string;
  codigoGrado: number;
  codigoSeccion: number;
}

/** Respuesta de ejemplo de la búsqueda del padre. */
export interface PadreFamilia {
  nombreCompleto: string;
  numeroDocumento: string;
}

/** Turnos disponibles para un grado y una sección. */
export interface Turno {
  codigoTurno: number;
  curso: string;
  horaInicio: string;
  horaFin: string;
}

/** Datos enviados para registrar la participación. */
export interface RegistrarParticipacionRequest {
  codigoPariente: number;
  CodigoTurno: number;
}

export interface PadreFamilia {
  nombreCompleto: string;
  numeroDocumento: string;
  codigoPariente: number;
  codigoAlumno?: number;
  nombreAlumno?: string;
}