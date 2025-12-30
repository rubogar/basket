import React, { useState, useEffect } from "react";
import style from "../styles/EquipoL.module.css";

function EquipoL({ setJugadores }) {
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerJugadores = async () => {
      try {
        setCargando(true);

        /* const targetUrl = "https://baloncestoenvivo.feb.es/equipo/981336"; */
        const targetUrl = "https://baloncestoenvivo.feb.es/equipo/981309";
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(
          targetUrl
        )}`;

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

        setJugadoresLocal(nombresJugadores);
        setJugadores(nombresJugadores); // Pasar al componente padre
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los jugadores");
      } finally {
        setCargando(false);
      }
    };

    obtenerJugadores();
  }, [setJugadores]);

  return (
    <div className={style.equipoLocal}>
      <h3>Equipo Local</h3>
      {cargando && <p>Cargando jugadores...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!cargando && !error && (
        <p className={style.info}>{jugadoresLocal.length} jugadores cargados</p>
      )}
    </div>
  );
}

export default EquipoL;
