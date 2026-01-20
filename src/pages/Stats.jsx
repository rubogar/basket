import React, { useState, useEffect } from "react";
import style from "../styles/Stats.module.css";
import Local from "../components/Local";
import Visitante from "./../components/Visitante";
import EquipoL from "./../components/EquipoL";
import EquipoV from "./../components/EquipoV";
import PanelControl from "./../components/PanelControl";
import { equiposDatabase } from "../data/Equipos";
import { useTheme } from "../context/ThemeContext";

function Stats() {
  const { isDark, toggleTheme } = useTheme();
  const [equipoActivo, setEquipoActivo] = useState("local");
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("");
  const [statsLocal, setStatsLocal] = useState({});
  const [statsVisitante, setStatsVisitante] = useState({});
  const [historial, setHistorial] = useState([]);
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);

  // Estados para los escudos
  const [escudoLocal, setEscudoLocal] = useState("");
  const [escudoVisitante, setEscudoVisitante] = useState("");

  // Estados para los equipos seleccionados
  const [equipoLocalSeleccionado, setEquipoLocalSeleccionado] = useState(null);
  const [equipoVisitanteSeleccionado, setEquipoVisitanteSeleccionado] =
    useState(null);
  const [urlLocal, setUrlLocal] = useState("");
  const [urlVisitante, setUrlVisitante] = useState("");

  // Estados para las ligas seleccionadas
  const [ligaLocalSeleccionada, setLigaLocalSeleccionada] = useState("");
  const [ligaVisitanteSeleccionada, setLigaVisitanteSeleccionada] =
    useState("");

  // Obtener lista única de ligas
  const ligas = [...new Set(equiposDatabase.map((equipo) => equipo.liga))];

  // Filtrar equipos por liga
  const equiposLocal = ligaLocalSeleccionada
    ? equiposDatabase.filter((equipo) => equipo.liga === ligaLocalSeleccionada)
    : [];

  const equiposVisitante = ligaVisitanteSeleccionada
    ? equiposDatabase.filter(
        (equipo) => equipo.liga === ligaVisitanteSeleccionada,
      )
    : [];

  // Función para crear estadísticas vacías
  const createEmptyStats = () => ({
    minutos: 0,
    t2Convertidos: 0,
    t2Intentados: 0,
    t3Convertidos: 0,
    t3Intentados: 0,
    tlConvertidos: 0,
    tlIntentados: 0,
    rebotesOfensivos: 0,
    rebotesDefensivos: 0,
    asistencias: 0,
    tapones: 0,
    perdidas: 0,
    recuperaciones: 0,
    faltasRecibidas: 0,
    faltasCometidas: 0,
  });

  // Inicializar stats cuando se cargan jugadores
  useEffect(() => {
    if (jugadoresLocal.length > 0 && Object.keys(statsLocal).length === 0) {
      const initialStats = {};
      jugadoresLocal.forEach((jugador) => {
        initialStats[jugador] = createEmptyStats();
      });
      setStatsLocal(initialStats);
    }
  }, [jugadoresLocal]);

  useEffect(() => {
    if (
      jugadoresVisitante.length > 0 &&
      Object.keys(statsVisitante).length === 0
    ) {
      const initialStats = {};
      jugadoresVisitante.forEach((jugador) => {
        initialStats[jugador] = createEmptyStats();
      });
      setStatsVisitante(initialStats);
    }
  }, [jugadoresVisitante]);

  // Manejar cambio de liga local
  const handleLigaLocalChange = (e) => {
    setLigaLocalSeleccionada(e.target.value);
    setEquipoLocalSeleccionado(null);
    setUrlLocal("");
    setStatsLocal({});
    setJugadoresLocal([]);
    setEscudoLocal("");
  };

  // Manejar cambio de liga visitante
  const handleLigaVisitanteChange = (e) => {
    setLigaVisitanteSeleccionada(e.target.value);
    setEquipoVisitanteSeleccionado(null);
    setUrlVisitante("");
    setStatsVisitante({});
    setJugadoresVisitante([]);
    setEscudoVisitante("");
  };

  // Manejar cambio de equipo local
  const handleEquipoLocalChange = (e) => {
    const equipoId = parseInt(e.target.value);
    const equipo = equiposDatabase.find((eq) => eq.id === equipoId);
    if (equipo) {
      setEquipoLocalSeleccionado(equipo);
      setUrlLocal(equipo.url);
      setStatsLocal({});
      setJugadoresLocal([]);
      setEscudoLocal("");
    }
  };

  // Manejar cambio de equipo visitante
  const handleEquipoVisitanteChange = (e) => {
    const equipoId = parseInt(e.target.value);
    const equipo = equiposDatabase.find((eq) => eq.id === equipoId);
    if (equipo) {
      setEquipoVisitanteSeleccionado(equipo);
      setUrlVisitante(equipo.url);
      setStatsVisitante({});
      setJugadoresVisitante([]);
      setEscudoVisitante("");
    }
  };

  // Función para calcular estadísticas derivadas
  const calcularStats = (stats) => {
    const puntos =
      stats.t2Convertidos * 2 + stats.t3Convertidos * 3 + stats.tlConvertidos;
    const tcConvertidos = stats.t2Convertidos + stats.t3Convertidos;
    const tcIntentados = stats.t2Intentados + stats.t3Intentados;
    const rebotesTotales = stats.rebotesOfensivos + stats.rebotesDefensivos;

    const valoracion =
      puntos +
      rebotesTotales +
      stats.asistencias +
      stats.tapones +
      stats.recuperaciones +
      stats.faltasRecibidas -
      (tcIntentados - tcConvertidos) -
      (stats.tlIntentados - stats.tlConvertidos) -
      stats.perdidas -
      stats.faltasCometidas;

    return {
      puntos,
      tcConvertidos,
      tcIntentados,
      rebotesTotales,
      valoracion,
    };
  };

  // Función para registrar acciones
  const registrarAccion = (tipo, valor = 1) => {
    if (!jugadorSeleccionado) return;

    const stats =
      equipoActivo === "local" ? { ...statsLocal } : { ...statsVisitante };
    const jugadorStats = { ...stats[jugadorSeleccionado] };

    // Guardar en historial para deshacer
    setHistorial([
      ...historial,
      {
        equipo: equipoActivo,
        jugador: jugadorSeleccionado,
        tipo,
        valor,
        timestamp: Date.now(),
      },
    ]);

    // Actualizar estadística
    switch (tipo) {
      case "t2Convertido":
        jugadorStats.t2Convertidos += valor;
        jugadorStats.t2Intentados += valor;
        break;
      case "t2Fallado":
        jugadorStats.t2Intentados += valor;
        break;
      case "t3Convertido":
        jugadorStats.t3Convertidos += valor;
        jugadorStats.t3Intentados += valor;
        break;
      case "t3Fallado":
        jugadorStats.t3Intentados += valor;
        break;
      case "tlConvertido":
        jugadorStats.tlConvertidos += valor;
        jugadorStats.tlIntentados += valor;
        break;
      case "tlFallado":
        jugadorStats.tlIntentados += valor;
        break;
      case "reboteOfensivo":
        jugadorStats.rebotesOfensivos += valor;
        break;
      case "reboteDefensivo":
        jugadorStats.rebotesDefensivos += valor;
        break;
      case "asistencia":
        jugadorStats.asistencias += valor;
        break;
      case "tapon":
        jugadorStats.tapones += valor;
        break;
      case "perdida":
        jugadorStats.perdidas += valor;
        break;
      case "recuperacion":
        jugadorStats.recuperaciones += valor;
        break;
      case "faltaRecibida":
        jugadorStats.faltasRecibidas += valor;
        break;
      case "faltaCometida":
        jugadorStats.faltasCometidas += valor;
        break;
    }

    stats[jugadorSeleccionado] = jugadorStats;

    if (equipoActivo === "local") {
      setStatsLocal(stats);
    } else {
      setStatsVisitante(stats);
    }
  };

  // Función para deshacer
  const deshacerAccion = () => {
    if (historial.length === 0) return;
    const ultimaAccion = historial[historial.length - 1];
    registrarAccion(ultimaAccion.tipo, -ultimaAccion.valor);
    setHistorial(historial.slice(0, -1));
  };

  // Calcular totales
  const calcularTotalesEquipo = (stats) => {
    let totales = { puntos: 0 };
    Object.values(stats).forEach((jugador) => {
      const calc = calcularStats(jugador);
      totales.puntos += calc.puntos;
    });
    return totales;
  };

  const totalesLocal = calcularTotalesEquipo(statsLocal);
  const totalesVisitante = calcularTotalesEquipo(statsVisitante);

  return (
    <>
      {/* Botón de cambio de tema - FUERA del container */}
      <button onClick={toggleTheme} className={style.themeToggle}>
        {isDark ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
      </button>

      <div className={style.container}>
        <div className={style.grid}>
          {/* Marcador con selectores */}
          <div className={style.marcadorWrapper}>
            <div className={style.marcador}>
              <div className={style.equipoScore}>
                {/* Selector de Liga Local */}
                <select
                  className={style.selectorLiga}
                  value={ligaLocalSeleccionada}
                  onChange={handleLigaLocalChange}
                >
                  <option value="">Seleccionar Liga</option>
                  {ligas.map((liga, index) => (
                    <option key={`liga-local-${index}`} value={liga}>
                      {liga}
                    </option>
                  ))}
                </select>

                {/* Selector de Equipo Local */}
                <select
                  className={style.selectorEquipo}
                  value={equipoLocalSeleccionado?.id || ""}
                  onChange={handleEquipoLocalChange}
                  disabled={!ligaLocalSeleccionada}
                >
                  <option value="">
                    {ligaLocalSeleccionada
                      ? "Seleccionar Equipo"
                      : "Selecciona liga primero"}
                  </option>
                  {equiposLocal.map((equipo) => (
                    <option key={`local-${equipo.id}`} value={equipo.id}>
                      {equipo.nombreCorto}
                    </option>
                  ))}
                </select>

                <h2>{equipoLocalSeleccionado?.nombreCorto || "LOCAL"}</h2>

                {/* Escudo Local */}
                <div className={style.escudo}>
                  {escudoLocal && (
                    <img
                      src={escudoLocal}
                      alt="Escudo Local"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                      className={style.escudo}
                    />
                  )}
                </div>
                <div className={style.puntos}>{totalesLocal.puntos}</div>
              </div>

              <div className={style.vs}>VS</div>

              <div className={style.equipoScore}>
                {/* Selector de Liga Visitante */}
                <select
                  className={style.selectorLiga}
                  value={ligaVisitanteSeleccionada}
                  onChange={handleLigaVisitanteChange}
                >
                  <option value="">Seleccionar Liga</option>
                  {ligas.map((liga, index) => (
                    <option key={`liga-visitante-${index}`} value={liga}>
                      {liga}
                    </option>
                  ))}
                </select>

                {/* Selector de Equipo Visitante */}
                <select
                  className={style.selectorEquipo}
                  value={equipoVisitanteSeleccionado?.id || ""}
                  onChange={handleEquipoVisitanteChange}
                  disabled={!ligaVisitanteSeleccionada}
                >
                  <option value="">
                    {ligaVisitanteSeleccionada
                      ? "Seleccionar Equipo"
                      : "Selecciona liga primero"}
                  </option>
                  {equiposVisitante.map((equipo) => (
                    <option key={`visitante-${equipo.id}`} value={equipo.id}>
                      {equipo.nombreCorto}
                    </option>
                  ))}
                </select>

                <h2>
                  {equipoVisitanteSeleccionado?.nombreCorto || "VISITANTE"}
                </h2>

                {/* Escudo Visitante */}
                <div className={style.escudo}>
                  {escudoVisitante && (
                    <img
                      src={escudoVisitante}
                      alt="Escudo Visitante"
                      style={{
                        width: "120px",
                        height: "120px",
                      }}
                    />
                  )}
                </div>

                <div className={style.puntos}>{totalesVisitante.puntos}</div>
              </div>
            </div>
          </div>
          {/* Panel de Control */}
          <div className={style.panelControlContainer}>
            <PanelControl
              equipoActivo={equipoActivo}
              setEquipoActivo={setEquipoActivo}
              jugadorSeleccionado={jugadorSeleccionado}
              setJugadorSeleccionado={setJugadorSeleccionado}
              jugadoresLocal={jugadoresLocal}
              jugadoresVisitante={jugadoresVisitante}
              registrarAccion={registrarAccion}
              deshacerAccion={deshacerAccion}
              historial={historial}
            />
          </div>

          {/* Tablas de Estadísticas */}
          <div className={style.tablasContainer}>
            <Local
              jugadores={jugadoresLocal}
              stats={statsLocal}
              calcularStats={calcularStats}
              nombreEquipo={equipoLocalSeleccionado?.nombre || "EQUIPO LOCAL"}
            />
            <Visitante
              jugadores={jugadoresVisitante}
              stats={statsVisitante}
              calcularStats={calcularStats}
              nombreEquipo={
                equipoVisitanteSeleccionado?.nombre || "EQUIPO VISITANTE"
              }
            />
          </div>
        </div>

        {/* Componentes ocultos para cargar jugadores */}
        <div style={{ display: "none" }}>
          {urlLocal && (
            <EquipoL
              setJugadores={setJugadoresLocal}
              setEscudo={setEscudoLocal}
              url={urlLocal}
            />
          )}
          {urlVisitante && (
            <EquipoV
              setJugadores={setJugadoresVisitante}
              setEscudo={setEscudoVisitante}
              url={urlVisitante}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Stats;
