import { api } from "./api";

import type {
  Personal,
  BuscarPersonalRequest,
  RegistrarParticipacionRequest,
} from "../types/visitaPapa.types";

/**
 * Consulta los datos de una persona utilizando su DNI.
 */
export async function buscarPersonalPorDni(
  dni: string
): Promise<Personal | null> {
  const solicitud: BuscarPersonalRequest = {
    tipoDocumento: 1,
    numeroDocumento: dni,
  };

  const respuesta = await api<Personal | null>(
    `/EventoPapa/Personal/${solicitud.tipoDocumento}/${solicitud.numeroDocumento}`
  );

  if (respuesta === null) {
    return null;
  }

  if (
    typeof respuesta !== "object" ||
    typeof respuesta.codigoPersonal !== "number"
  ) {
    throw new Error(
      "La respuesta del servicio no contiene los datos esperados de la persona."
    );
  }

  return respuesta;
}

/**
 * Registra la participación de una persona en un evento.
 */
export async function guardarRegistro(
  datos: RegistrarParticipacionRequest
): Promise<unknown> {
  if (
    !Number.isInteger(datos.codigoEvento) ||
    datos.codigoEvento <= 0
  ) {
    throw new Error("El evento seleccionado no es válido.");
  }

  if (
    !Number.isInteger(datos.codigoPersonal) ||
    datos.codigoPersonal <= 0
  ) {
    throw new Error("No se ha identificado correctamente a la persona.");
  }

  return api<unknown>("/EventoPapa/Inscripcion", {
    method: "POST",
    body: JSON.stringify({
      codigoEvento: datos.codigoEvento,
      codigoPersonal: datos.codigoPersonal,
      correo: datos.correo,
      celular: datos.telefono,
    }),
  });
}