import React from "react";
import style from "../styles/PanelControl.module.css";

function PanelControl({
  equipoActivo,
  setEquipoActivo,
  jugadorSeleccionado,
  setJugadorSeleccionado,
  jugadoresLocal,
  jugadoresVisitante,
  registrarAccion,
  deshacerAccion,
  historial,
}) {
  const jugadoresActivos =
    equipoActivo === "local" ? jugadoresLocal : jugadoresVisitante;

  return (
    <div className={style.panelControl}>
      <h3 className={style.titulo}>Panel de Control</h3>

      {/* Selector de Equipo */}
      <div className={style.selectorEquipo}>
        <label>Equipo</label>
        <div className={style.botonesEquipo}>
          <button
            onClick={() => {
              setEquipoActivo("local");
              setJugadorSeleccionado("");
            }}
            className={equipoActivo === "local" ? style.activo : ""}
          >
            Local
          </button>
          <button
            onClick={() => {
              setEquipoActivo("visitante");
              setJugadorSeleccionado("");
            }}
            className={equipoActivo === "visitante" ? style.activo : ""}
          >
            Visitante
          </button>
        </div>
      </div>

      {/* Selector de Jugador */}
      <div className={style.selectorJugador}>
        <label>Jugador</label>
        <select
          value={jugadorSeleccionado}
          onChange={(e) => setJugadorSeleccionado(e.target.value)}
        >
          <option value="">Seleccionar jugador</option>
          {jugadoresActivos.map((jugador, index) => (
            <option key={index} value={jugador}>
              {jugador}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de Acciones */}
      {jugadorSeleccionado && (
        <div className={style.acciones}>
          {/* Tiros de 2 */}
          <div className={style.grupoAccion}>
            <label>TIRO DE 2 PUNTOS</label>
            <div className={style.botones}>
              <button
                onClick={() => registrarAccion("t2Convertido")}
                className={style.convertido}
              >
                ✓ Convertido
              </button>
              <button
                onClick={() => registrarAccion("t2Fallado")}
                className={style.fallado}
              >
                ✗ Fallado
              </button>
            </div>
          </div>

          {/* Tiros de 3 */}
          <div className={style.grupoAccion}>
            <label>TIRO DE 3 PUNTOS</label>
            <div className={style.botones}>
              <button
                onClick={() => registrarAccion("t3Convertido")}
                className={style.convertido}
              >
                ✓ Convertido
              </button>
              <button
                onClick={() => registrarAccion("t3Fallado")}
                className={style.fallado}
              >
                ✗ Fallado
              </button>
            </div>
          </div>

          {/* Tiros Libres */}
          <div className={style.grupoAccion}>
            <label>TIRO LIBRE</label>
            <div className={style.botones}>
              <button
                onClick={() => registrarAccion("tlConvertido")}
                className={style.convertido}
              >
                ✓ Convertido
              </button>
              <button
                onClick={() => registrarAccion("tlFallado")}
                className={style.fallado}
              >
                ✗ Fallado
              </button>
            </div>
          </div>

          {/* Rebotes */}
          <div className={style.grupoAccion}>
            <label>REBOTES</label>
            <div className={style.botones}>
              <button
                onClick={() => registrarAccion("reboteOfensivo")}
                className={style.rebote}
              >
                Ofensivo
              </button>
              <button
                onClick={() => registrarAccion("reboteDefensivo")}
                className={style.rebote}
              >
                Defensivo
              </button>
            </div>
          </div>

          {/* Otras acciones */}
          <div className={style.grupoAccion}>
            <div className={style.botonesOtras}>
              <button
                onClick={() => registrarAccion("asistencia")}
                className={style.asistencia}
              >
                Asistencia
              </button>
              <button
                onClick={() => registrarAccion("tapon")}
                className={style.tapon}
              >
                Tapón
              </button>
              <button
                onClick={() => registrarAccion("perdida")}
                className={style.perdida}
              >
                Pérdida
              </button>
              <button
                onClick={() => registrarAccion("recuperacion")}
                className={style.recuperacion}
              >
                Recuperación
              </button>
              <button
                onClick={() => registrarAccion("faltaCometida")}
                className={style.falta}
              >
                Falta Com.
              </button>
              <button
                onClick={() => registrarAccion("faltaRecibida")}
                className={style.falta}
              >
                Falta Rec.
              </button>
            </div>
          </div>

          {/* Botón deshacer */}
          <button
            onClick={deshacerAccion}
            disabled={historial.length === 0}
            className={style.deshacer}
          >
            ↶ Deshacer última acción
          </button>
        </div>
      )}
    </div>
  );
}

export default PanelControl;
