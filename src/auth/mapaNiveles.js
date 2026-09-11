// Mapa de niveles -> ruta "home" de cada perfil.
// Niveles en uso hoy:
//   2  = empleados            -> /usuario2/*  (+ /mapasegundaparte)
//   3  = gerencia             -> /nivel3/*
//   5  = visor de mapas       -> /usuariomapas/inicio
//   6  = flujo de fondos      -> /nivel6/*
//   7  = control de IC4       -> /mov2/*
// Niveles 1, 4 y 10 no se usan por ahora (se ignoran).

export const HOME_POR_NIVEL = {
  2: '/usuario2/clientes',
  3: '/nivel3/',
  5: '/mapasegundaparte',
  6: '/nivel6/carga',
  7: '/mov2/remax',
};

// Devuelve la ruta inicial del nivel. Si el nivel no está mapeado,
// manda al login (caso niveles 1/4/10 o valores raros).
export const homeDe = (nivel) => HOME_POR_NIVEL[Number(nivel)] || '/login';
