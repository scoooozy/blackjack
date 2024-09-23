import clsx from "clsx";
import { CardType, getCardsSum } from "../utils";
import Card from "./Card";
import CardBack from "./CardBack";
import { useEffect, useRef } from "react";
type Props = {
    className?: string;
    cards: CardType[];
    hit: () => void;
    turn: boolean;
    end: () => void;
};

const CardPlacementDealer = ({ className, cards, turn, end, hit }: Props) => {
    const cardSum =
        cards && cards.length > 0
            ? getCardsSum(cards, cards.length - +!turn)[0]
            : 0;

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (turn && cardSum <= 17 && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
                hit();
            }, 1000);
        } else if (turn && cardSum > 17) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = null;
            setTimeout(() => end(), 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = null;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardSum, turn]);

    return (
        <div
            className={clsx(
                className,
                `w-52 h-52 p-2 flex border rounded-lg border-dashed items-center justify-start flex-col ${
                    cardSum > 21 ? "border-red-500" : ""
                }`
            )}
        >
            <div className="relative  w-full h-full mt-2">
                {cards &&
                    cards.length > 0 &&
                    cards.map((card, i, array) =>
                        array.length > 1 && i === array.length - +!turn ? (
                            <CardBack
                                index={i}
                                key={`${i}${card[0]}${card[1]}`}
                                className={`absolute z-${i + 1}`}
                            />
                        ) : (
                            <Card
                                index={i}
                                key={`${i}${card[0]}${card[1]}`}
                                className={`absolute z-${i + 1}`}
                                cardLabel={card[0]}
                                cardSuit={card[1]}
                            />
                        )
                    )}
            </div>
        </div>
    );
};

export default CardPlacementDealer;
