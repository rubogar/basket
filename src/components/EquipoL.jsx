import React, { useState, useEffect } from "react";
import style from "../styles/EquipoL.module.css";

function EquipoL({ setJugadores, setEscudo, url }) {
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const obtenerJugadores = async () => {
      try {
        setCargando(true);
        setError(null);

        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const celdasNombre = doc.querySelectorAll("td.nombre.jugador");
        const nombresJugadores = [];

        celdasNombre.forEach((celda) => {
          const enlace = celda.querySelector("a");
          if (enlace) {
            const nombre = enlace.textContent.trim();
            if (nombre) {
              nombresJugadores.push(nombre);
            }
          }
        });

        // Obtener escudo
        const wrapperLogo = doc.querySelector(".wrapper-logo");
        let urlEscudo = "";
        if (wrapperLogo) {
          const img = wrapperLogo.querySelector("img");
          if (img && img.src) {
            urlEscudo = img.src;
          }
        }

        setJugadoresLocal(nombresJugadores);
        setJugadores(nombresJugadores);
        setEscudo(urlEscudo);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los jugadores");
        setJugadores([]);
        setEscudo("");
      } finally {
        setCargando(false);
      }
    };

    obtenerJugadores();
  }, [url, setJugadores, setEscudo]);

  return (
    <div className={style.equipoLocal}>
      <h3>Equipo Local</h3>
      {cargando && <p>Cargando jugadores...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!cargando && !error && jugadoresLocal.length > 0 && (
        <p className={style.info}>{jugadoresLocal.length} jugadores cargados</p>
      )}
    </div>
  );
}

export default EquipoL;
