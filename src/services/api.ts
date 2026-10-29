const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface RequestOptions extends RequestInit {
  token?: string;
}

export interface ApiError {
    code?: string;
    message?: string;
    contactEmail?: string;
}

export class ApiException extends Error {

    status: number;
    data?: ApiError;

    constructor(
        status: number,
        message: string,
        data?: ApiError
    ) {
        super(message);

        this.name = "ApiException";

        this.status = status;

        this.data = data;
    }
}

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,

    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...headers,
    },
  });
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : typeof body === "object" &&
      body !== null &&
      "mensaje" in body &&
      typeof body.mensaje === "string"
        ? body.mensaje : `No fue posible completar la solicitud. Por favor, inténtalo nuevamente en unos minutos.`;

    throw new Error(message, { cause: response.status });
  }

  return body as T;
}
