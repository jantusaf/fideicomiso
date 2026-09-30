// Sistema visual de la vista de detalle de cliente (mismo criterio que "Ver pagos"):
// tarjetas blancas con borde fino, sin degradés, botones sobrios y consistentes.
export const COLOR_TEXT = "#1a303e";
export const COLOR_ACCENT = "#0d3a49";
export const COLOR_BORDER = "#e2e6e9";
export const COLOR_MUTED = "#6b7a86";
export const COLOR_OK = "#2e7d32";
export const COLOR_ERROR = "#c62828";

// Color de marca (el celeste/azul de las letras del logo). Se usa como
// acento puntual —encabezados de tabla, chips de cantidad, botón Pagar—
// para que la interfaz no sea 100% gris/blanco.
export const COLOR_BRAND = "#2e6999";
export const COLOR_BRAND_SOFT = "#eef3f7";

// Variante cálida del acento (amarillo/naranja), para los chips de cantidad
// —distinta del celeste de marca, que queda para el encabezado y el botón Ver.
export const COLOR_BRAND_WARM = "#c9791a";
// Relleno suave del mismo tono (amarillo pastel), para el fondo del chip.
export const COLOR_BRAND_WARM_SOFT = "#f0deac";
export const COLOR_BRAND_WARM_BORDER = "#e0c583";

// Línea de acento arriba de la tarjeta: marca dónde empieza cada sección,
// sin oscurecer el fondo de la página (que sigue blanco).
export const sxCard = {
  borderRadius: 2.5,
  border: `1px solid ${COLOR_BORDER}`,
  borderTop: `3px solid ${COLOR_ACCENT}`,
  backgroundColor: "#fff",
  boxShadow: "0 10px 30px rgba(15, 34, 48, 0.06)",
};

// Botón principal (sólido). Al pasar el mouse se "vacía": queda con fondo
// blanco y borde/texto del color, para que el hover se note bien claro.
export const sxBtnPrimary = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  boxShadow: "none",
  backgroundColor: COLOR_TEXT,
  color: "#fff",
  border: "1px solid transparent",
  transition: "background-color .15s ease, color .15s ease, border-color .15s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: COLOR_TEXT,
    borderColor: COLOR_TEXT,
    boxShadow: "none",
  },
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

// Botón de acción delicada (relleno rojo). Mismo criterio de hover "vacío".
export const sxBtnDanger = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  boxShadow: "none",
  backgroundColor: COLOR_ERROR,
  color: "#fff",
  border: "1px solid transparent",
  transition: "background-color .15s ease, color .15s ease, border-color .15s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: COLOR_ERROR,
    borderColor: COLOR_ERROR,
    boxShadow: "none",
  },
};

// Botón "Pagar" (relleno, en el celeste de marca). Mismo criterio de hover
// "vacío" que sxBtnPrimary/sxBtnDanger.
export const sxBtnBrand = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  boxShadow: "none",
  backgroundColor: COLOR_BRAND,
  color: "#fff",
  border: "1px solid transparent",
  transition: "background-color .15s ease, color .15s ease, border-color .15s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: COLOR_BRAND,
    borderColor: COLOR_BRAND,
    boxShadow: "none",
  },
};

// Botón secundario en el naranja/amarillo de marca (contorno), del mismo
// tono que los chips de cantidad. Mismo ancho mínimo que sxBtnBrand para que
// "Editar" y "Ver" queden del mismo tamaño aunque el texto sea más corto.
export const sxBtnWarmOutlined = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  minWidth: 92,
  color: COLOR_BRAND_WARM,
  borderColor: COLOR_BRAND_WARM,
  "&:hover": { borderColor: COLOR_BRAND_WARM, backgroundColor: "rgba(201, 121, 26, 0.06)" },
};

// Botón "Editar" (relleno, en el naranja/amarillo de marca). Mismo criterio
// de hover "vacío" que sxBtnPrimary/sxBtnBrand/sxBtnDanger.
export const sxBtnWarm = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  boxShadow: "none",
  backgroundColor: COLOR_BRAND_WARM,
  color: "#fff",
  border: "1px solid transparent",
  transition: "background-color .15s ease, color .15s ease, border-color .15s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: COLOR_BRAND_WARM,
    borderColor: COLOR_BRAND_WARM,
    boxShadow: "none",
  },
};

// Botón "Editar" (relleno, verde). Mismo criterio de hover "vacío".
export const sxBtnGreen = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  boxShadow: "none",
  backgroundColor: COLOR_OK,
  color: "#fff",
  border: "1px solid transparent",
  transition: "background-color .15s ease, color .15s ease, border-color .15s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: COLOR_OK,
    borderColor: COLOR_OK,
    boxShadow: "none",
  },
};

// Botón "Editar" (relleno, amarillo medio). Texto oscuro en vez de blanco
// porque un amarillo claro con letras blancas no se lee bien; se mantiene
// oscuro también en el hover (el amarillo como texto casi no se ve).
export const COLOR_YELLOW = "#e0b64a";
export const sxBtnYellow = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  px: 2.25,
  boxShadow: "none",
  backgroundColor: COLOR_YELLOW,
  color: COLOR_TEXT,
  border: "1px solid transparent",
  transition: "background-color .15s ease, border-color .15s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: COLOR_TEXT,
    borderColor: COLOR_YELLOW,
    boxShadow: "none",
  },
};

// Barra de búsqueda: pill redondeada, fondo suave y borde visible, con foco
// en el celeste de marca —reemplaza el input outline plano de antes por
// algo más moderno sin perder el contorno.
export const sxSearchField = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 999,
    backgroundColor: "#f6f8f9",
    transition: "background-color .15s ease, box-shadow .15s ease, border-color .15s ease",
    "& fieldset": { borderColor: COLOR_BORDER },
    "&:hover fieldset": { borderColor: "#c9d2d8" },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 3px rgba(46, 105, 153, 0.14)",
    },
    "&.Mui-focused fieldset": { borderColor: COLOR_BRAND, borderWidth: "1.5px" },
  },
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
