import React from 'react'

import style from "../styles/Local.module.css";


function Local() {
  return (
    <div>
      <table className={style.local} border="1">
        <tbody>
          <tr>
            <th>Dorsal</th>
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
            <th>MT.</th>
            <th>FC.</th>
            <th>FR.</th>
            <th>VA.</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Local
