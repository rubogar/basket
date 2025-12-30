import React, { useState, useEffect } from "react";
import style from "../styles/Stats.module.css";
import Local from "../components/Local";
import Visitante from "./../components/Visitante";
import EquipoL from "./../components/EquipoL";
import EquipoV from "./../components/EquipoV";
import PanelControl from "./../components/PanelControl";

function Stats() {
  const [equipoActivo, setEquipoActivo] = useState("local");
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("");
  const [statsLocal, setStatsLocal] = useState({});
  const [statsVisitante, setStatsVisitante] = useState({});
  const [historial, setHistorial] = useState([]);
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);

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
    recuperaciones: 0, // AÑADIDO
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
      stats.recuperaciones + // AÑADIDO a la valoración
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
      case "recuperacion": // AÑADIDO
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
    <div className={style.container}>
      {/* Marcador */}
      <div className={style.marcador}>
        <div className={style.equipoScore}>
          <h2>LOCAL</h2>
          <div className={style.puntos}>{totalesLocal.puntos}</div>
        </div>
        <div className={style.vs}>VS</div>
        <div className={style.equipoScore}>
          <h2>VISITANTE</h2>
          <div className={style.puntos}>{totalesVisitante.puntos}</div>
        </div>
      </div>

      <div className={style.grid}>
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
          />
          <Visitante
            jugadores={jugadoresVisitante}
            stats={statsVisitante}
            calcularStats={calcularStats}
          />
        </div>
      </div>

      {/* Componentes ocultos para cargar jugadores */}
      <div style={{ display: "none" }}>
        <EquipoL setJugadores={setJugadoresLocal} />
        <EquipoV setJugadores={setJugadoresVisitante} />
      </div>
    </div>
  );
}

export default Stats;
