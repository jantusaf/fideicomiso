// Datos FIJOS tomados tal cual de "FLUJO DE FONDOS PROYECTADO.xlsx" (hoja Proyectado).
// No se calculan: son los números del Excel. null = celda vacía, "-" = celda con guion, "—" = celda con error (#REF!) en el Excel.
const flujoProyectadoData = {
 "titulo": "Comparativo de ingresos y egresos",
 "generado": "Generado el 31/8/2026, 09:55:47",
 "meses": [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic"
 ],
 "ingresos": {
  "titulo": "Ingresos por concepto y mes — 2026",
  "filas": [
   {
    "concepto": "Cobranzas SC - Parque Industrial",
    "valores": [
     34010524.0,
     29330530.0,
     48400957.0,
     27501497.0,
     26144373.0,
     22146905.0,
     28084827.0,
     19159200.0,
     23381807.98,
     23433231.83,
     21817736.72,
     22225728.4
    ],
    "total": 325637317.9
   },
   {
    "concepto": "Fondo Municipal",
    "valores": [
     "-",
     30000000.0,
     "-",
     30000000.0,
     "-",
     30000000.0,
     "-",
     35000000.0,
     27000000.0,
     27000000.0,
     27000000.0,
     27000000.0
    ],
    "total": 233000000
   },
   {
    "concepto": "Ingresos PIT/IC3",
    "valores": [
     "-",
     "-",
     "-",
     "-",
     3344291.0,
     33749332.0,
     3275662.0,
     3275661.5,
     3275661.5,
     "-",
     "-",
     "-"
    ],
    "total": 46920608
   },
   {
    "concepto": "Cobranzas SC - Fracción IC3",
    "valores": [
     1362427.0,
     414674.0,
     689451.0,
     26953.0,
     "-",
     1498334.0,
     785000.0,
     "-",
     "-",
     "-",
     "-",
     "-"
    ],
    "total": 4776839
   },
   {
    "concepto": "No encontrado",
    "valores": [
     "-",
     "-",
     "-",
     "-",
     "-",
     1281000.0,
     "-",
     "-",
     "-",
     "-",
     "-",
     "-"
    ],
    "total": 1281000
   },
   {
    "concepto": "Reintegro de Sellos",
    "valores": [
     "-",
     16868.0,
     "-",
     "-",
     100296.0,
     "-",
     47489.0,
     54884.33333,
     54884.33333,
     "-",
     54884.33333,
     "-"
    ],
    "total": 329306
   }
  ],
  "total": {
   "concepto": "Total Ingresos",
   "valores": [
    35372951,
    59762072,
    49090408,
    57528450,
    29588960,
    88675571,
    32192978,
    57489745.83,
    53712353.81,
    50433231.83,
    48872621.05,
    49225728.4
   ],
   "total": 611945070.9
  }
 },
 "egresos": {
  "titulo": "Egresos por concepto y mes — 2026",
  "filas": [
   {
    "concepto": "Reintegro de sueldos y movilidad",
    "valores": [
     32000000.0,
     32000000.0,
     32000000.0,
     35200000,
     35200000.0,
     35200000.0,
     26000000.0,
     18822564.33,
     18822564.33,
     20704820.76,
     20704820.763,
     31057231.14
    ],
    "total": 106943047.0
   },
   {
    "concepto": "Seguridad - Empresa de Seguridad",
    "valores": [
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8,
     10270720.8
    ],
    "total": 76744066.0
   },
   {
    "concepto": "Seguridad - Adicional de Policias",
    "valores": [
     3360000,
     3360000,
     3360000,
     3360000,
     3360000,
     3360000,
     3360000,
     3360000,
     3360000,
     3360000,
     3360000,
     3360000.0
    ],
    "total": 50705040.0
   },
   {
    "concepto": "Honorarios Profesionales",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     null,
     null,
     5420000.0,
     5420000.0,
     5420000.0,
     5420000.0,
     5420000.0
    ],
    "total": 36210787.0
   },
   {
    "concepto": "Expensas SC",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     null,
     17000000.0,
     7000000.0,
     7000000.0,
     7000000.0,
     7000000.0,
     7000000.0
    ],
    "total": 29118447.0
   },
   {
    "concepto": "Mensuras",
    "valores": [
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0
    ],
    "total": 8091902.0
   },
   {
    "concepto": "Alquiler de casa",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     1250000.0,
     1375000.0,
     1375000.0,
     1375000.0,
     1375000.0,
     1375000.0,
     "-"
    ],
    "total": 7502400.0
   },
   {
    "concepto": "Asesoria / Consultoria",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     500000.0,
     500000.0,
     500000.0,
     null,
     null,
     null,
     null
    ],
    "total": 6257829.0
   },
   {
    "concepto": "Seguridad - Banos Quimicos",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     429743.4,
     571988.4654,
     571988.47,
     571988.47,
     571988.47,
     571988.47,
     571988.47
    ],
    "total": 3248830.0
   },
   {
    "concepto": "Varios",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0,
     1000000.0
    ],
    "total": 2445633.0
   },
   {
    "concepto": "Impuestos- DGR",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     null,
     null,
     "-",
     "-",
     "-",
     "-",
     "-"
    ],
    "total": 2089267.0
   },
   {
    "concepto": "Combustible",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     null,
     null,
     "-",
     2000000.0,
     "-",
     "-",
     "-"
    ],
    "total": 1968286.0
   },
   {
    "concepto": "Impuestos - AFIP",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     null,
     null,
     "-",
     "-",
     "-",
     "-",
     "-"
    ],
    "total": 1824973.0
   },
   {
    "concepto": "Serv. Luz y Agua",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     200000.0,
     200000.0,
     200000.0,
     240000,
     0,
     0,
     "-"
    ],
    "total": 1480094.0
   },
   {
    "concepto": "Serv. de Limpieza",
    "valores": [
     "-",
     "-",
     "-",
     "-",
     "-",
     "-",
     "-",
     "-",
     "-",
     "-",
     "-",
     "-"
    ],
    "total": 1419525.0
   },
   {
    "concepto": "No encontrado",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     null,
     null,
     "-",
     "-",
     "-",
     "-",
     "-"
    ],
    "total": 1258240.0
   },
   {
    "concepto": "Seguros",
    "valores": [
     null,
     null,
     null,
     null,
     null,
     null,
     null,
     "-",
     "-",
     "-",
     "-",
     "-"
    ],
    "total": 1240145.0
   },
   {
    "concepto": "Extraord. Cerramiento / Legales",
    "valores": [
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0,
     310000.0
    ],
    "total": 1173641.0
   }
  ],
  "total": {
   "concepto": "Total Egresos",
   "valores": [
    46940720.8,
    46940720.8,
    46940720.8,
    50140720.8,
    50140720.8,
    68673179.0,
    61587709.27,
    49830273.6,
    51370273.6,
    51012530.03,
    51012530.03,
    59989940.41
   ],
   "total": 634580039.9
  }
 },
 "flujoNeto": {
  "titulo": "Flujo Neto de Fondos — 2026",
  "concepto": "Flujo Neto",
  "valores": [
   -11567769.8,
   12821351.2,
   2149687.2,
   7387729.2,
   -20551760.8,
   20002392,
   -29394731.27,
   7659472.233,
   2342080.213,
   -579298.203,
   -2139908.98,
   -10764212.01
  ],
  "total": -22634969.02
 }
};

export default flujoProyectadoData;
