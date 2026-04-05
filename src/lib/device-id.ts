/**
 * Returns a stable anonymous device identifier stored in localStorage.
 * Generates a new one on first visit and reuses it forever.
 * Safe to call only on the client (window must exist).
 */
export function getDeviceId(): string {
  const KEY = 'ask-moaaz-device-id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
