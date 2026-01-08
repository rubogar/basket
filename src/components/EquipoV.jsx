import React, { useState, useEffect } from "react";
import style from "../styles/EquipoV.module.css";

function EquipoV({ setJugadores, url }) {
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
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

        setJugadoresVisitante(nombresJugadores);
        setJugadores(nombresJugadores);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los jugadores");
        setJugadores([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerJugadores();
  }, [url, setJugadores]);

  return (
    <div className={style.equipoVisitante}>
      <h3>Equipo Visitante</h3>
      {cargando && <p>Cargando jugadores...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!cargando && !error && jugadoresVisitante.length > 0 && (
        <p className={style.info}>
          {jugadoresVisitante.length} jugadores cargados
        </p>
      )}
    </div>
  );
}

export default EquipoV;
