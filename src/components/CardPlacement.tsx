import clsx from "clsx";
import { CardType, GameResult, getCardsSum } from "../utils";
import Card from "./Card";
import { useEffect } from "react";
import arrowDown from "../assets/down-arrow.png"
import { GiTwoCoins } from "react-icons/gi";

type Props = {
    className?: string;
    cards: CardType[];
    stand: () => void;
    turn: boolean;
    state: GameResult;
    bet: number;
    addBetToHand: () => void;
    variant?: "small" | "large"

};

const CardPlacement = ({
    className,
    cards,
    stand,
    turn,
    state,
    bet,
    variant = "large",
    addBetToHand
}: Props) => {

    const cardSum = cards && cards.length > 0 ? getCardsSum(cards)[0] : 0;

    useEffect(() => {
        if (turn && cardSum >= 21) {
            stand();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turn, cardSum]);

    return (
        <div
            onClick={addBetToHand}
            className={clsx(
                className,
                "w-52 h-52 select-none border border-dashed rounded-lg cursor-pointer relative p-2 flex items-center justify-start flex-col",
                cardSum > 21 && "border-red-500",
                variant === "small" && "w-40" 
            )}
        >
            {turn && (<div className="w-10 h-10 animate-bounce absolute -top-10">
                <img src={arrowDown} alt="Arrow down" className="w-full h-full"/>
            </div>)}
            <p className="text-white flex items-center gap-1 text-2xl mt-2 right-0 absolute -top-10">{bet}<GiTwoCoins className="text-yellow-500" /></p>

            <div className="relative h-full w-full left-0 mt-2">
                {cards &&
                    cards.length > 0 &&
                    cards.map((card, i) => (
                        <Card
                            index={i}
                            key={`${i}${card[0]}${card[1]}`}
                            className={`absolute`}
                            cardLabel={card[0]}
                            cardSuit={card[1]}
                        />
                    ))}
            </div>
            {
                cardSum === 21 && (
                    <div className="absolute w-full h-full top-0 rounded-lg flex items-center justify-center bg-black opacity-50">
                        <h1 className="text-5xl text-white twenty-one">21</h1>
                    </div>
                )
            }
            {state !== GameResult.NONE && (
                <div className="absolute bg-slate-400 opacity-75  w-full h-full top-0 left-0 flex justify-center items-center">
                    {state === GameResult.VICTORY ? (
                        <p>Victory</p>
                    ) : state === GameResult.LOST ? (
                        <p>Lost</p>
                    ) : (
                        <p>Push</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CardPlacement;

// TODO: Buttons split and double
// Split: If two same cards on one hand split button appears
// Double:
