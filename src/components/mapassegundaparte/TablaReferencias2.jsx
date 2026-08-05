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
          <div className="refSwatch" style={{ background: "transparent", border: "2.5px dashed #00ff00" }} />
          <div className="refText">Disponible</div>
        </div>

        <div className="refRow">
          <div className="refSwatch" style={{ background: "transparent", border: "2.5px dashed #ff0000" }} />
          <div className="refText">No disponible</div>
        </div>

        <div className="refRow">
          <div className="refSwatch" style={{ background: "transparent", border: "2.5px dashed #F227F5" }} />
          <div className="refText">Reserva municipal</div>
        </div>

        <div className="refRow">
          <div className="refSwatch" style={{ background: "transparent", border: "2.5px dashed #00eeff" }} />
          <div className="refText">Equipamiento público</div>
        </div>
      </div>
    </div>
  );
};

export default TablaReferencias2;