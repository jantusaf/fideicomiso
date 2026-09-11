// Decodifica el payload de un JWT sin librerías externas y valida su expiración.
// El token del backend se firma con { id, cuil_cuit, nivel, razon } + exp.

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// true solo si el token es decodificable y todavía no expiró.
export function tokenVigente(token) {
  if (!token) return false;
  const data = decodeJwt(token);
  if (!data || !data.exp) return false;
  return data.exp * 1000 > Date.now();
}
