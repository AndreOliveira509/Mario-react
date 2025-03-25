import React from "react";
import pipe from "./public/img/pipe.png";

export default function GameBoard(){
    return(
        <div className="game-board">
           <img src={pipe} className="pipe"></img>
        </div>
    )
}