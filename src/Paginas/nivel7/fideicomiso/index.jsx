
import BarraLAteral from "../../../components/movimientos2/menuizq7";
import Fideicomiso from "../../../components/movimientos2/fideicomiso";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export default function FideicomisoPage() {
  const navigate = useNavigate();
  const [logueado, setLogueado] = useState(true);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (user.nivel != 7) {
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
          <BarraLAteral>
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  p: 1,
                }}
              >
                <Fideicomiso />
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
