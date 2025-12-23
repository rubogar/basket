import React, { useState, useEffect } from "react";
import style from "../styles/EquipoL.module.css";

function EquipoL() {
  const [jugadores, setJugadores] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerJugadores = async () => {
      try {
        setCargando(true);

        // Usando proxy (sin necesidad de backend)
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

        // Extraer los nombres
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

        setJugadores(nombresJugadores);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los jugadores");
      } finally {
        setCargando(false);
      }
    };

    obtenerJugadores();
  }, []);

  const handleChange = (event) => {
    setJugadorSeleccionado(event.target.value);
  };

  return (
    <div>
      <div className={style.equipoLocal}>
        <h1>Local</h1>

        {cargando && <p>Cargando jugadores...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!cargando && !error && (
          <select
            value={jugadorSeleccionado}
            onChange={handleChange}
            className={style.selectJugador}
          >
            <option value="">Selecciona un jugador</option>
            {jugadores.map((jugador, index) => (
              <option key={index} value={jugador}>
                {jugador}
              </option>
            ))}
          </select>
        )}

        {jugadorSeleccionado && (
          <p>Jugador seleccionado: {jugadorSeleccionado}</p>
        )}
      </div>
    </div>
  );
}

export default EquipoL;
