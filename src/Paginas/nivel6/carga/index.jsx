
import BarraLAteral from "../../../components/nivel6/menuizq6";
import AgregarIcc from "../../../components/resumenes/carga";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export default function Legajos() {
  const navigate = useNavigate();
  const [logueado, setLogueado] = useState(true);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      "loggedNoteAppUser"
    );

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (user.nivel != 6) {
        window.localStorage.removeItem("loggedNoteAppUser");
        navigate("/login");
      } else {
        setLogueado(true);
      }
    }
  }, []);

  return (
    <div>
      {logueado ? (
        <>
          <CssBaseline />

          {/* 🔥 MANTENEMOS CHILDREN */}
          <BarraLAteral>
            <Box
              sx={{
                height: "100vh", // 🔥 ocupa toda la pantalla
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0, // 🔥 CLAVE (el bug real)
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  p: 1,
                }}
              >
                <AgregarIcc />
              </Box>
            </Box>
          </BarraLAteral>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}