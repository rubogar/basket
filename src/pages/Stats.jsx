import React from "react";
import style from "../styles/Stats.module.css";
import Local from "../components/Local";
import Visitante from "./../components/Visitante";
import EquipoL from "./../components/EquipoL";
import EquipoV from "./../components/EquipoV";

function Stats() {
  return (
    <div className={style.grid}>
      <EquipoL />
      <EquipoV />
      <Local />
      <Visitante />
    </div>
  );
}

export default Stats;
