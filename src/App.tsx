import "./App.css";
import { useCallback, useEffect, useState } from "react";
import CardPlacement from "./components/CardPlacement";
import {
    CardType,
    GameResult,
    GameState,
    getCardsSum,
    getRandomCard,
} from "./utils";
import CardPlacementDealer from "./components/CardPlacementDealer";
import Nav from "./components/Nav";
import { GiTwoCoins } from "react-icons/gi";
const defaultPlayerCards = [GameResult.NONE, GameResult.NONE, GameResult.NONE];
const defaultPlayerBets = [0, 0, 0];

function App() {
    const [cards, setCards] = useState<CardType[][]>([]);
    const [turn, setTurn] = useState(1);
    const [playerCardsState, setPlayerCardsState] =
        useState<GameResult[]>(defaultPlayerCards);
    const [playerCardsBets, setPlayerCardsBets] =
        useState<number[]>(defaultPlayerBets);
    const [points, setPoints] = useState(1000);
    const [currentBet, setCurrentBet] = useState(0);
    const [gameState, setGameState] = useState(GameState.BET);

    const restartGame = () => {
        setCards([]);
        setTurn(1);
        setPlayerCardsState([...defaultPlayerCards]);
        setGameState(GameState.BET);
    };

    const updateGameResult = useCallback(() => {
        const cardsSum = cards.map(
            (cardPlacement) => getCardsSum(cardPlacement)[0]
        );
        const dealerSum = cardsSum[0];
        let playerGameState: GameResult[];
        if (dealerSum > 21) {
            playerGameState = cardsSum.slice(1).map((sum) => {
                if (sum > 21) return GameResult.LOST;
                else return GameResult.VICTORY;
            });
        } else {
            playerGameState = cardsSum.slice(1).map((sum) => {
                if (sum == 21) return GameResult.VICTORY;
                else if (sum < dealerSum || sum > 21) return GameResult.LOST;
                else if (sum == dealerSum) return GameResult.PUSH;
                else return GameResult.VICTORY;
            });
        }

        setPlayerCardsState([...playerGameState]);
        const amounts = playerGameState.map((state, index) => {
            if (state === GameResult.VICTORY) {
                return playerCardsBets[index] * 2;
            } else if (state === GameResult.PUSH) {
                return playerCardsBets[index];
            }
            console.log("COUNTING AS LOST");
            return 0;
        });
        setPoints(
            (old) => old + amounts.reduce((prev, curr) => prev + curr, 0)
        );
        setPlayerCardsBets([0, 0, 0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards]);

    useEffect(() => {
        if (gameState === GameState.END) {
            updateGameResult();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);

    const dealCards = () => {
        setGameState(GameState.DEAL);
        let i = 0;
        let rounds = 0;
        const interval = setInterval(() => {
            hit(i);
            i++;
            if (i == 4) {
                i = 0;
                rounds++;
                if (rounds > 1) {
                    clearInterval(interval);
                    setGameState(GameState.GAME);
                }
            }
        }, 300);
    };

    const hit = (index: number) => {
        const card = getRandomCard();
        setCards((prev) => {
            let temp;
            if (!prev[index]) {
                temp = [card];
            } else {
                temp = [...prev[index], card];
            }
            return [...prev.slice(0, index), temp, ...prev.slice(index + 1)];
        });
    };

    const stand = (index: number) => {
        const nextTurn = index + 1 >= cards.length ? 0 : index + 1;
        setTurn(nextTurn);
        if (nextTurn === 0) {
            setGameState(GameState.DEALER);
        }
    };

    const addBetToHand = (index: number) => {
        if (gameState !== GameState.BET) return;
        if (points >= currentBet) {
            const bets = [...playerCardsBets];
            const newPoints = points - currentBet
            setPoints(newPoints);
            if (newPoints < currentBet) {
                setCurrentBet(newPoints)
            }
            bets[index] += currentBet;
            setPlayerCardsBets(bets);

        }
    };

    const returnBets = () => {
        const bets = playerCardsBets.reduce((prev, curr) => prev + curr, 0);
        setPoints((old) => old + bets);
        setPlayerCardsBets([0, 0, 0]);
    };

    const doubleHand = (index: number) => {
        const bet = playerCardsBets[index - 1];
        if (bet * 2 <= points) {
            setPlayerCardsBets([
                ...playerCardsBets.slice(0, index - 1),
                bet * 2,
                ...playerCardsBets.slice(index - 1),
            ]);
            setPoints((old) => old - bet * 2);
            hit(index);
            stand(index);
        }
    };

    return (
        <div className="h-screen  overflow-hidden" id="game">
            <Nav points={points} />
            <div className="grid grid-cols-3 p-2 grid-rows-3 place-items-center">
                <CardPlacementDealer
                    turn={turn == 0}
                    cards={cards[0]}
                    className="col-start-2"
                    hit={() => hit(0)}
                    end={() => setGameState(GameState.END)}
                />
                <div className="col-start-1">
                    <CardPlacement
                        bet={playerCardsBets[0]}
                        state={playerCardsState[0]}
                        turn={turn == 1}
                        stand={() => stand(1)}
                        cards={cards[1]}
                        addBetToHand={() => addBetToHand(0)}
                        variant="large"
                    />
                </div>
                <div className="row-start-3 col-start-2">
                    <CardPlacement
                        bet={playerCardsBets[1]}
                        state={playerCardsState[1]}
                        stand={() => stand(2)}
                        turn={turn == 2}
                        cards={cards[2]}
                        addBetToHand={() => addBetToHand(1)}
                    />
                </div>
                <div className="col-start-3 ">
                    <CardPlacement
                        bet={playerCardsBets[2]}
                        state={playerCardsState[2]}
                        turn={turn == 3}
                        stand={() => stand(3)}
                        cards={cards[3]}
                        addBetToHand={() => addBetToHand(2)}
                    />
                </div>
            </div>
            <div className="game-panel">
                <button
                    onClick={dealCards}
                    disabled={
                        cards.length > 0 ||
                        playerCardsBets.some((bet) => bet === 0)
                    }
                    className="btn-black"
                >
                    Deal
                </button>
                <button
                    onClick={restartGame}
                    disabled={gameState !== GameState.END}
                    className="btn-black"
                >
                    Restart
                </button>
                {gameState === GameState.BET && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentBet((old) => old - 25)}
                            disabled={points === 0 || currentBet === 0}
                            className="btn-black"
                        >
                            -
                        </button>
                        <p className="text-black gap-1 flex items-center">{currentBet}<GiTwoCoins className="text-yellow-500" /></p>
                        <button
                            disabled={points === 0 || currentBet === points}
                            onClick={() => setCurrentBet((old) => old + 25)}
                            className="btn-black bg-red-500"
                        >
                            +
                        </button>
                        <button onClick={returnBets} className="btn-black">
                            Return
                        </button>
                    </div>
                )}
                {gameState === GameState.GAME && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => doubleHand(turn)}
                            className="btn-black"
                            disabled={
                                playerCardsBets[turn - 1] * 2 > points
                            }
                        >
                            Double
                        </button>
                        <button className="btn-black"
                            disabled={
                                playerCardsBets[turn - 1] * 2 > points
                            }>Split</button>
                        <button
                            disabled={!cards || cards.length < 2}
                            onClick={() => {
                                hit(turn);
                            }}
                            className="btn-black bg-red-500"
                        >
                            Hit
                        </button>
                        <button
                            disabled={!cards || cards.length < 2}
                            onClick={() => stand(turn)}
                            className="btn-black bg-red-500"
                        >
                            Stand
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

// TODO: Button split
// TODO: Mobile version
