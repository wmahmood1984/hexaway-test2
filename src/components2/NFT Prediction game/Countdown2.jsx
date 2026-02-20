import { useEffect, useState } from "react";
import { gameContractR } from "../../config";

export default function RoundCountdown({
  seconds, warningAt = 10, serverStatus
}) {


  return (
    <div className="round-container final-call" id="roundContainer">
        <span className="round-label">round</span>
        <span className="round-timer" id="mainCountdownTime">{seconds}s</span>
      </div>
  );
}
