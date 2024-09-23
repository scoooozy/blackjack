// 10 ---> 4 2 4
// 9 ---> 4 1 4
// 8 ---> 3 2 3 
// 7 ---> 3 1 3 
// 6 ---> 3 0 3
// 5 ---> 2 1 2 
// 4 ---> 2 0 2 
// 3 ---> 0 3 0
// 2 ---> 0 2 0
// 1 ---> 0 1 0  
import clubs from "../assets/images/cards/clubs.png"
import diamonds from "../assets/images/cards/diamonds.svg"
import hearts from "../assets/images/cards/hearts.png"
import spades from "../assets/images/cards/spades.png"
import clsx from "clsx"
import { Suits } from "../utils";
import {gsap} from "gsap"
import { useEffect } from "react"
import { useRef } from "react"

interface ICardProps {
    cardLabel: string | number;
    cardSuit: Suits; 
    className ? : string,
    index: number
}

const getCardImageBasedOnSuit = (suit: Suits) => {
    switch(suit) {
        case Suits.Clubs:
            return clubs; 
        case Suits.Diamonds: 
            return diamonds;
        case Suits.Hearts:
            return hearts;
        default: 
            return spades;
    } 
}


const Card = ({ cardSuit, cardLabel,className, index}: ICardProps) => {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if(ref.current) {
                gsap.fromTo(
                    ref.current, 
                    {
                        opacity: 0,
                        y: 500,
                        x: -100, 
                        rotateZ: 180
                    }, 
                    {
                        opacity: 1,
                        x: index % 4 * 30,
                        y: index > 3 ? 60 : 0 ,
                        rotateZ: 0,
                        duration: 1,
                        ease: "elastic.out(0.5, 0.5)"
                    }
                )
            }
        })

        return () => ctx.revert()
    }, [index])

    return (
        <div ref={ref} className={clsx( className , `flex translate-y-[500px] bg-white border rounded-md w-24 h-32 p-2 ${cardSuit == Suits.Diamonds || cardSuit == Suits.Hearts ? "text-red-600" : "text-black" }`) }>
            <div className={`flex justify-start items-center flex-col`} >
                <h3 className="font-bold text-2xl">{cardLabel}</h3>
                <p><img className="w-4 h-4 object-contain" src={getCardImageBasedOnSuit(cardSuit)} alt="Card suit" /></p>
            </div>
            <div className="grow flex items-center justify-center">
                <div>
                    <img className="w-10 h-10 object-contain" src={getCardImageBasedOnSuit(cardSuit)} alt="Card suit" />
                </div>
            </div>
            <div className="flex rotate-180 justify-start items-center flex-col">
                <h3 className="font-bold text-2xl">{cardLabel}</h3>
                <p><img className="w-4 h-4 object-contain" src={getCardImageBasedOnSuit(cardSuit)} alt="Card suit" /></p>
            </div>
        </div>
    )
}

export default Card