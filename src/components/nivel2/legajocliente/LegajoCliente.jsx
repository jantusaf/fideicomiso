import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

import servicioCliente from "../../../services/clientes";
import serviciousuario1 from "../../../services/usuario1";
import serviciousuarios from "../../../services/usuarios";
import "../detalleclienteIngresos/profile.css";
import Modalveronline from "./Modalveronline";
import Modalveronlinecbu from "../pagarcuota/verpdfcbu";
import ModalLegajo from "./Modalegajo";
import { useNavigate, useParams } from "react-router-dom";
import Habilitar from "./ModalHabiulitar";
import Deshabilitar from "./ModalDeshabilitar";
import Estadisticas from "./Estadisticas";
import ModalSeguro from "./Modalseguroborrar";
import ModalEditarDescripcion from "./modaleditarc";
const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};
const LegajoCliente = (props) => {
  const navigate = useNavigate();
  let params = useParams();
  let cuil_cuit = params.cuil_cuit;

  const [products, setProducts] = useState();
  const [user, setUser] = useState(null);
  const [refreshStats, setRefreshStats] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const actualizarEstadisticas = () => {
    setRefreshStats((prev) => !prev);
  };

  const traer = async () => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    const user = JSON.parse(loggedUserJSON);
    const notis = await serviciousuarios.traerusuario(user.cuil_cuit);
    setUser(notis[0]);
  };

  const getData = async () => {
    const data = await servicioCliente.traerLejagos(cuil_cuit);
    setProducts(data);
  };

  useEffect(() => {
    getData();
    traer();
  }, []);

  const handleOpenModal = (data) => {
    setSelectedData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedData(null);
  };

  const volver = () => {
    navigate("/usuario2/detallecliente/" + cuil_cuit);
  };

  const verFile = (index) => {
    return (
      <>
        {[
          "Cbu personal",
          "Cbu familiar",
          "Socio/Gerente/Apoderado",
          "Propio",
        ].includes(products[0][index]?.tipo) ? (
          <Modalveronlinecbu id={products[0][index].id} />
        ) : (
          <Modalveronline id={products[0][index].id} />
        )}
      </>
    );
  };

  const columns = [
    { name: "tipo", label: "Tipo" },
    { name: "descripcion", label: "Descripción" },
    { name: "fecha", label: "Fecha" },
    {
      name: "estado",
      label: "Estado",
      options: {
        customBodyRender: (value) => {
          const activo = value === "Activo";
          return (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
               
                color:  "#2e7d32" ,
              }}
            >
              {value}
            </span>
          );
        },
      },
    },
    {
      name: "Editar",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = products[0][dataIndex];
          return (
            <Button
              onClick={() => handleOpenModal(rowData)}
              style={{
                background: "#1f7a8c",
                color: "white",
                borderRadius: "20px",
                padding: "6px 16px",
                textTransform: "none",
              }}
            >
              Editar
            </Button>
          );
        },
      },
    },
    {
      name: "Ver",
      options: {
        customBodyRenderLite: (dataIndex) => verFile(dataIndex),
      },
    },
    {
      name: "Borrar",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const item = products[0][dataIndex];
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <ModalSeguro
                id={item.id}
                getData={getData}
              />
              {item.comprobanteok === "No" && (
                <span
                  style={{
                    background: "#ffebee",
                    color: "#c62828",
                    padding: "4px 8px",
                    borderRadius: "50%",
                    fontWeight: "bold",
                  }}
                >
                  !
                </span>
              )}
            </div>
          );
        },
      },
    },
  ];

  const optionss = {
    selectableRows: false,
    elevation: 0,
    rowsPerPage: 5,
    responsive: "standard",

    setTableProps: () => ({
      style: {
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      },
    }),

    setRowProps: (row, dataIndex) => ({
      style: {
        background: dataIndex % 2 === 0 ? "#fff" : "#f8fafc",
      },
    }),

    textLabels: {
      body: {
        noMatch: "No hay documentación cargada",
      },
    },
  };

  return (
    <div style={{ padding: "20px", background: "#f5f7fa" }}>
      <ModalEditarDescripcion
        open={openModal}
        handleClose={handleCloseModal}
        data={selectedData}
        getData={getData}
      />

      {/* HEADER + KPI */}
      <div
  style={{
    background: "linear-gradient(135deg, #0f4c5c, #1f7a8c)",
    borderRadius: "16px",
    padding: "18px 22px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  }}
>
  {/* IZQUIERDA */}
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    
    <div style={{
      background: "rgba(255,255,255,0.15)",
      borderRadius: "10px",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      📁
    </div>

    <div>
      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
        Legajo del Cliente
      </div>
      <div style={{ fontSize: "13px", opacity: 0.8 }}>
        Gestión y administración de documentación
      </div>
    </div>
  </div>

  {/* DERECHA */}
  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    
    {/* KPI */}
    <div style={{
      background: "rgba(255,255,255,0.15)",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "13px"
    }}>
      Documentos: {products ? products[0].length : 0}
    </div>

  </div>
</div>

      {/* ACCIONES */}
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px"
  }}
>
  {/* IZQUIERDA */}
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    
    <Button
      onClick={volver}
      startIcon={<ArrowBackIcon />}
      style={{
        borderRadius: "25px",
        background: "#e0f2f1",
        color: "#0f4c5c",
        fontWeight: "bold"
      }}
    >
      Volver
    </Button>

    {products && (
      <ModalLegajo
        razon={products[1][0].razon}
        tiposExistentes={products[0].map((l) => l.tipo)}
        getData={getData}
        getData2={actualizarEstadisticas}
      />
    )}
  </div>

  {/* DERECHA */}
  {products && (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      
      {/* BOTON HABILITAR / DESHABILITAR */}
      {products[1][0].habilitado === "Si" ? (
        <Deshabilitar
          cuil_cuit_user={props.cuil_cuit_user}
          getData={getData}
        />
      ) : (
        <Habilitar
          cuil_cuit_user={props.cuil_cuit_user}
          getData={getData}
        />
      )}

      {/* BADGE ESTADO */}
      <div
        style={{
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold",
          background:
            products[1][0].habilitado === "Si"
              ? "#e6f4ea"
              : "#fdecea",
          color:
            products[1][0].habilitado === "Si"
              ? "#2e7d32"
              : "#c62828"
        }}
      >
        {products[1][0].habilitado === "Si"
          ? "Habilitado"
          : "Deshabilitado"}
      </div>

    </div>
  )}
</div>
        

      {/* TABLA */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
     {products && (
  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          <th style={thStyle}>Tipo</th>
          <th style={thStyle}>Descripción</th>
          <th style={thStyle}>Fecha</th>
          <th style={thStyle}>Estado</th>
          <th style={thStyle}>Editar</th>
          <th style={thStyle}>Ver</th>
          <th style={thStyle}>Borrar</th>
        </tr>
      </thead>

      <tbody>
        {products[0].map((item, index) => (
          <tr
            key={item.id}
            style={{
              backgroundColor: index % 2 === 0 ? "#fff" : "#f8fafc",
            }}
          >
            <td style={tdStyle}>{item.tipo}</td>

            <td style={tdStyle}>{item.descripcion}</td>

            <td style={tdStyle}>{item.fecha}</td>

            <td style={tdStyle}>
              <span
                style={{
                  color: "#2e7d32",
                  fontWeight: "bold",
                }}
              >
                {item.estado}
              </span>
            </td>

            <td style={tdStyle}>
              <Button
                onClick={() => handleOpenModal(item)}
                style={{
                  background: "#1f7a8c",
                  color: "#fff",
                  borderRadius: "20px",
                  textTransform: "none",
                }}
              >
                Editar
              </Button>
            </td>

            <td style={tdStyle}>
              {[
                "Cbu personal",
                "Cbu familiar",
                "Socio/Gerente/Apoderado",
                "Propio",
              ].includes(item.tipo) ? (
                <Modalveronlinecbu id={item.id} />
              ) : (
                <Modalveronline id={item.id} />
              )}
            </td>

            <td style={tdStyle}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <ModalSeguro id={item.id} getData={getData} />

                {item.comprobanteok === "No" && (
                  <span
                    style={{
                      background: "#ffebee",
                      color: "#c62828",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    !
                  </span>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    </div>
  );
};

export default LegajoCliente;