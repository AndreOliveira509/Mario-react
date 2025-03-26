import React, { useEffect, useRef } from "react";
import pipe from "./img/pipe.png";
import mario from "./img/mario.gif";

export default function GameBoard() {
    const marioRef = useRef(null);

    useEffect(() => {
        const jump = () => {
            if (marioRef.current) {
                marioRef.current.classList.add("jump");

                setTimeout(() => {
                    marioRef.current.classList.remove("jump");
                }, 500); // Remove a classe após 500ms (tempo da animação)
            }
        };

        document.addEventListener("keydown", jump);

        return () => {
            document.removeEventListener("keydown", jump);
        };
    }, []);

    return (
        <div className="game-board">
            <img ref={marioRef} src={mario} className="mario" alt="Mario" />
            <img src={pipe} className="pipe" alt="Pipe" />
        </div>
    );
}
