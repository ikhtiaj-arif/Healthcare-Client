const GENERIC_MESSAGES = new Set(["Internal Server Error"]);

/**
 * Pulls the human-readable message out of an API error.
 *
 * The raw `error.message` from ofetch is a technical string like
 * `[POST] "http://localhost:5000/api/v1/...": 409 Conflict`, so the server's
 * message has to be read from `error.data.message` instead. The server masks
 * that message as "Internal Server Error" outside development, in which case
 * the caller-supplied fallback is used.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { data?: { message?: string } } | undefined)?.data
    ?.message;

  if (typeof message === "string") {
    const trimmed = message.trim();
    if (trimmed && !GENERIC_MESSAGES.has(trimmed)) {
      return trimmed;
    }
  }

  return fallback;
}
