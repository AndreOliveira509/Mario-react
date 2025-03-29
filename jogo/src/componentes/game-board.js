import React, { useEffect, useRef, useState } from "react";
import pipeImg from "./img/pipe.png";
import marioImg from "./img/mario.gif";
import cloudsImg from "./img/clouds.png";
import gameOverImg from "./img/game-over.png";

export default function GameBoard() {
    const marioRef = useRef(null);
    const pipeRef = useRef(null);
    const [vidas, setVidas] = useState(3);
    const [invencivel, setInvencivel] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(
        localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0
    );

    useEffect(() => {
        let scoreInterval;

        if (!gameOver) {
            scoreInterval = setInterval(() => {
                setScore((prevScore) => prevScore + 1);
            }, 100);
        }

        const jump = () => {
            if (marioRef.current) {
                marioRef.current.classList.add("jump");
                setTimeout(() => {
                    marioRef.current?.classList.remove("jump");
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
                                setHighScore((prevHighScore) => {
                                    const newHighScore = Math.max(prevHighScore, score);
                                    localStorage.setItem("highScore", newHighScore);
                                    return newHighScore;
                                });

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

                        // Ativar invencibilidade e piscar
                        setInvencivel(true);
                        setIsBlinking(true);
                        setTimeout(() => {
                            setInvencivel(false);
                            setIsBlinking(false);
                        }, 1000);
                    }
                }
            }
        }, 10);

        return () => {
            document.removeEventListener("keydown", jump);
            clearInterval(loop);
            clearInterval(scoreInterval);
        };
    }, [invencivel, gameOver, score]);

    return (
        <div className="game-board">
            <h2>Vidas: 0{vidas}</h2>
            <h2>Pontuação: {score}</h2>
            <h2>High Score: {highScore}</h2>
            {gameOver && (
                <h2 style={{ color: "red" }}>
                    Clique F5 para tentar novamente!
                </h2>
            )}

            <img src={cloudsImg} className="clouds" alt="clouds" />
            <img
                ref={marioRef}
                src={marioImg}
                className="mario"
                alt="Mario"
                style={{
                    opacity: isBlinking ? (Math.floor(Date.now() / 100) % 2 ? 0.3 : 1) : 1
                }}
            />
            <img ref={pipeRef} src={pipeImg} className="pipe" alt="Pipe" />
        </div>
    );
}
