import React from "react";
import "./MapaConCapas.css";

const TablaReferencias2 = () => {
  return (
    <div className="refCard">
      <div className="refHeader">
        <div className="refHeaderLeft">
          <span className="refTitle">Referencias de disponibilidad</span>
         
        </div>
      </div>

      <div className="refBody">
        <div className="refSectionTitle">ESTADOS</div>

        <div className="refRow">
          <div className="refSwatch" style={{ background: "#61e268" }} />
          <div className="refText">Disponible</div>
        </div>

        <div className="refRow">
          <div className="refSwatch" style={{ background: "#f04e4e" }} />
          <div className="refText">No disponible</div>
        </div>

        <div className="refRow">
          <div className="refSwatch" style={{ background: "#f38c26" }} />
          <div className="refText">Reserva municipal</div>
        </div>

        <div className="refRow">
          <div className="refSwatch" style={{ background: "#faf63b" }} />
          <div className="refText">Equipamiento público</div>
        </div>
      </div>
    </div>
  );
};

export default TablaReferencias2;