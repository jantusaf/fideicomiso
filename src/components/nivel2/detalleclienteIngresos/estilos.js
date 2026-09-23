// Sistema visual de la vista de detalle de cliente (mismo criterio que "Ver pagos"):
// tarjetas blancas con borde fino, sin degradés, botones sobrios y consistentes.
export const COLOR_TEXT = "#1a303e";
export const COLOR_ACCENT = "#0d3a49";
export const COLOR_BORDER = "#e2e6e9";
export const COLOR_MUTED = "#6b7a86";
export const COLOR_OK = "#2e7d32";
export const COLOR_ERROR = "#c62828";

export const sxCard = {
  borderRadius: 2.5,
  border: `1px solid ${COLOR_BORDER}`,
  backgroundColor: "#fff",
  boxShadow: "0 10px 30px rgba(15, 34, 48, 0.06)",
};

// Botón principal (sólido)
export const sxBtnPrimary = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  boxShadow: "none",
  backgroundColor: COLOR_TEXT,
  color: "#fff",
  "&:hover": { backgroundColor: COLOR_ACCENT, boxShadow: "none" },
};

// Botón secundario (contorno)
export const sxBtnOutlined = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  color: COLOR_TEXT,
  borderColor: "#c9d2d8",
  "&:hover": { borderColor: COLOR_ACCENT, backgroundColor: "rgba(13, 58, 73, 0.04)" },
};

// Botón secundario de acción delicada (contorno rojo)
export const sxBtnDangerOutlined = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  color: COLOR_ERROR,
  borderColor: "#e3b5b5",
  "&:hover": { borderColor: COLOR_ERROR, backgroundColor: "rgba(198, 40, 40, 0.04)" },
};

// Diálogos: papel redondeado, título sobrio, sin degradés ni cristal
export const slotPropsDialog = {
  paper: { sx: { borderRadius: 3 } },
  backdrop: { sx: { backgroundColor: "rgba(15, 34, 48, 0.45)" } },
};

export const sxDialogTitle = {
  fontWeight: 700,
  color: COLOR_TEXT,
  px: 3,
  py: 2,
  borderBottom: `1px solid ${COLOR_BORDER}`,
};

export const sxDialogActions = {
  px: 3,
  py: 2,
  borderTop: `1px solid ${COLOR_BORDER}`,
  gap: 1,
};

// Formato de moneda del cuadro de cuotas (mismo formato numérico que ya se usaba)
export const moneda = (n) => "$ " + new Intl.NumberFormat("de-DE").format(Number(n) || 0);
