import React from "react";
import style from "../styles/Local.module.css";

function Local({ jugadores, stats, calcularStats }) {
  const createEmptyStats = () => ({
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

  // Calcular totales del equipo
  const calcularTotales = () => {
    let totales = {
      puntos: 0,
      t2Conv: 0,
      t2Int: 0,
      t3Conv: 0,
      t3Int: 0,
      tlConv: 0,
      tlInt: 0,
      ro: 0,
      rd: 0,
      as: 0,
      ta: 0,
      mt: 0,
      br: 0,
      fc: 0,
      fr: 0,
    };

    jugadores.forEach((jugador) => {
      const jugadorStats = stats[jugador] || createEmptyStats();
      const calc = calcularStats(jugadorStats);

      totales.puntos += calc.puntos;
      totales.t2Conv += jugadorStats.t2Convertidos;
      totales.t2Int += jugadorStats.t2Intentados;
      totales.t3Conv += jugadorStats.t3Convertidos;
      totales.t3Int += jugadorStats.t3Intentados;
      totales.tlConv += jugadorStats.tlConvertidos;
      totales.tlInt += jugadorStats.tlIntentados;
      totales.ro += jugadorStats.rebotesOfensivos;
      totales.rd += jugadorStats.rebotesDefensivos;
      totales.as += jugadorStats.asistencias;
      totales.ta += jugadorStats.tapones;
      totales.mt += jugadorStats.perdidas;
      totales.br += jugadorStats.recuperaciones;
      totales.fc += jugadorStats.faltasCometidas;
      totales.fr += jugadorStats.faltasRecibidas;
    });

    return totales;
  };

  const totales = calcularTotales();

  return (
    <div className={style.contenedor}>
      <h2 className={style.titulo}>EQUIPO LOCAL</h2>
      <div className={style.tablaWrapper}>
        <table className={style.local} border="1">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Min.</th>
              <th>PT.</th>
              <th>T2.</th>
              <th>T3.</th>
              <th>TC.</th>
              <th>TL.</th>
              <th>RO.</th>
              <th>RD.</th>
              <th>RT.</th>
              <th>AS.</th>
              <th>TA.</th>
              <th>BP.</th>
              <th>BR.</th>
              <th>FC.</th>
              <th>FR.</th>
              <th>VA.</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((jugador, index) => {
              const jugadorStats = stats[jugador] || createEmptyStats();
              const calc = calcularStats(jugadorStats);

              return (
                <tr key={index}>
                  <td className={style.nombreJugador}>{jugador}</td>
                  <td>{jugadorStats.minutos}</td>
                  <td className={style.destacado}>{calc.puntos}</td>
                  <td>
                    {jugadorStats.t2Convertidos}/{jugadorStats.t2Intentados}
                  </td>
                  <td>
                    {jugadorStats.t3Convertidos}/{jugadorStats.t3Intentados}
                  </td>
                  <td>
                    {calc.tcConvertidos}/{calc.tcIntentados}
                  </td>
                  <td>
                    {jugadorStats.tlConvertidos}/{jugadorStats.tlIntentados}
                  </td>
                  <td>{jugadorStats.rebotesOfensivos}</td>
                  <td>{jugadorStats.rebotesDefensivos}</td>
                  <td>{calc.rebotesTotales}</td>
                  <td>{jugadorStats.asistencias}</td>
                  <td>{jugadorStats.tapones}</td>
                  <td>{jugadorStats.perdidas}</td>
                  <td>{jugadorStats.recuperaciones}</td>
                  <td>{jugadorStats.faltasCometidas}</td>
                  <td>{jugadorStats.faltasRecibidas}</td>
                  <td className={style.valoracion}>{calc.valoracion}</td>
                </tr>
              );
            })}
            <tr className={style.totales}>
              <td className={style.nombreJugador}>TOTAL</td>
              <td>-</td>
              <td className={style.destacado}>{totales.puntos}</td>
              <td>
                {totales.t2Conv}/{totales.t2Int}
              </td>
              <td>
                {totales.t3Conv}/{totales.t3Int}
              </td>
              <td>
                {totales.t2Conv + totales.t3Conv}/
                {totales.t2Int + totales.t3Int}
              </td>
              <td>
                {totales.tlConv}/{totales.tlInt}
              </td>
              <td>{totales.ro}</td>
              <td>{totales.rd}</td>
              <td>{totales.ro + totales.rd}</td>
              <td>{totales.as}</td>
              <td>{totales.ta}</td>
              <td>{totales.mt}</td>
              <td>{totales.br}</td>
              <td>{totales.fc}</td>
              <td>{totales.fr}</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Local;
