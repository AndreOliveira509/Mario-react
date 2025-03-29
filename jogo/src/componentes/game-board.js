import React, { useEffect, useRef, useState } from "react";
import pipeImg from "./img/pipe.png";
import marioImg from "./img/mario.gif";
import cloudsImg from "./img/clouds.png";
import gameOverImg from "./img/game-over.png";

export default function GameBoard() {
    const marioRef = useRef(null);
    const pipeRef = useRef(null);
    const [vidas, setVidas] = useState(3); // Contador de vidas
    const [invencivel, setInvencivel] = useState(false); // Estado de invencibilidade
    const [gameOver, setGameOver] = useState(false); // Estado de fim de jogo

    useEffect(() => {
        const jump = () => {
            if (marioRef.current) {
                marioRef.current.classList.add("jump");

                setTimeout(() => {
                    if (marioRef.current) {
                        marioRef.current.classList.remove("jump");
                    }
                }, 500);
            }
        };

        document.addEventListener("keydown", jump);

        const loop = setInterval(() => {
            if (pipeRef.current && marioRef.current) {
                const pipePosition = pipeRef.current.offsetLeft;
                const marioPosition = parseInt(
                    window.getComputedStyle(marioRef.current).bottom.replace("px", "")
                );

                if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
                    if (!invencivel) {
                        setVidas((prevVidas) => {
                            const novasVidas = prevVidas - 1;

                            if (novasVidas <= 0) {
                                // GAME OVER
                                setGameOver(true);
                                pipeRef.current.style.animation = "none";
                                pipeRef.current.style.left = `${pipePosition}px`;

                                marioRef.current.style.animation = "none";
                                marioRef.current.style.bottom = `${marioPosition}px`;

                                marioRef.current.src = gameOverImg;
                                marioRef.current.style.width = "75px";
                                marioRef.current.style.marginLeft = "50px";

                                setVidas(false);

                                clearInterval(loop);
                            }

                            return novasVidas;
                        });

                        // Ativar invencibilidade por 1 segundo
                        setInvencivel(true);
                        setTimeout(() => setInvencivel(false), 1000);
                    }
                }
            }
        }, 10);

        return () => {
            document.removeEventListener("keydown", jump);
            clearInterval(loop);
        };
    }, [invencivel]); // O efeito roda novamente quando a invencibilidade muda

    // 🔄 Função para reiniciar o jogo
    const reiniciarJogo = () => {
        setVidas(2);
        setGameOver(false);

        if (marioRef.current && pipeRef.current) {
            marioRef.current.src = marioImg; // Restaurar Mario
            marioRef.current.style.width = "auto";
            marioRef.current.style.marginLeft = "0px";

            pipeRef.current.style.animation = "pipe-animation 1.5s infinite linear";
            pipeRef.current.style.left = "initial"; // Resetar a posição do cano
        }
    };

    return (
        <div className="game-board">
            <h2>Vidas: {vidas}</h2> {/* Mostra a quantidade de vidas */}
            
            {gameOver && (
                <button onClick={reiniciarJogo} className="restart-button">
                    Reiniciar Jogo
                </button>
            )}

            <img src={cloudsImg} className="clouds" alt="clouds" />
            <img ref={marioRef} src={marioImg} className="mario" alt="Mario" />
            <img ref={pipeRef} src={pipeImg} className="pipe" alt="Pipe" />
        </div>
    );
}
