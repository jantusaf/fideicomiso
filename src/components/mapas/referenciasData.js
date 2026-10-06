// Contenido del cuadro de referencias del visor de mapas (Nivel 5).
// Una entrada por mapa: "1" = IC3, "2" = Parque. El contenido se va cargando de a poco.
//
// Formato de cada sección:
//   { titulo: "ESTADOS", items: [ ...items ] }
// Formato de cada item (se usa lo que corresponda):
//   { texto: "Disponible", color: "#00ff00" }   -> cuadrado relleno de ese color
//   { texto: "Disponible", borde: "#00ff00" }   -> cuadrado con borde punteado de ese color
//   { texto: "Calle", linea: "#555555" }        -> línea de ese color
//   { texto: "Nota sin muestra de color" }      -> solo texto
//   { texto: "...", sub: true }                 -> igual que los anteriores pero con sangría (depende del item de arriba)
const REFERENCIAS = {
  "1": {
    titulo: "Referencias IC3",
    secciones: [
      {
        titulo: "ZONA HIPICO",
        items: [{ texto: "MENSURA 29640 - U" }],
      },
      {
        titulo: "FRACCION IC",
        items: [
          { texto: "IC3 - MENSURA" },
          { texto: "IC4 - MENSURA 31548 - U" },
          { texto: "ZONA SUR - MENSURA 33041 - U", sub: true },
          { texto: "UNIDAD EJECUTORA 1 - MENSURA 32861 - U", sub: true },
        ],
      },
      {
        titulo: "FRACCION IB",
        items: [
          { texto: "IB2 - MENSURA" },
          { texto: "IB3 - MENSURA" },
          { texto: "IB4 - MENSURA 27338 - U" },
          { texto: "IB5 - MENSURA 27339 - U" },
          { texto: "IB6 - MENSURA 29591 - U" },
        ],
      },
      {
        titulo: "FRACCION IG",
        items: [{ texto: "ZONA MUNICIPAL - MENSURA 28791 - U" }],
      },
    ],
  },
  "2": {
    titulo: "Referencias Parque",
    secciones: [],
  },
};

export default REFERENCIAS;
