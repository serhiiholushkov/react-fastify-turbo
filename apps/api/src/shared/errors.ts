/**
 * Application-level error helpers.
 *
 * Fastify reads `error.statusCode` in the error handler to set the HTTP
 * response status.  We create a small factory here so we never need an
 * external package just for this.
 */

interface HttpError extends Error {
  statusCode: number;
  code: string;
}

function createHttpError(
  statusCode: number,
  message: string,
  code: string,
): HttpError {
  const err = new Error(message) as HttpError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

// ── Typed HTTP error factories ────────────────────────────────────────────────

/** 404 Not Found — used when a resource doesn't exist in the DB */
export const notFound = (message: string) =>
  createHttpError(404, message, "NOT_FOUND");

/** 409 Conflict — e.g. duplicate email on registration */
export const conflict = (message: string) =>
  createHttpError(409, message, "CONFLICT");

/** 401 Unauthorized — missing or invalid credentials */
export const unauthorized = (message = "Unauthorized") =>
  createHttpError(401, message, "UNAUTHORIZED");

/** 403 Forbidden — authenticated but not allowed */
export const forbidden = (message = "Forbidden") =>
  createHttpError(403, message, "FORBIDDEN");

/** 400 Bad Request — generic validation / business-logic error */
export const badRequest = (message: string) =>
  createHttpError(400, message, "BAD_REQUEST");

/** 500 Internal Server Error — generic catch-all for unexpected errors */
export const internalServerError = (message = "Internal Server Error") =>
  createHttpError(500, message, "INTERNAL_SERVER_ERROR");
