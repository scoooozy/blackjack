export enum Suits {
  Clubs,
  Hearts,
  Spades,
  Diamonds,
}

export enum GameResult {
  NONE,
  VICTORY,
  LOST,
  PUSH,
}

export enum GameState {
  NONE, 
  BET, 
  DEAL,
  GAME,
  DEALER,
  END
}

export type CardType = [string | number, number];

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomCard = (): CardType => {
  const variants = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
  return [variants[getRandomNumber(0, variants.length)], getRandomNumber(0, 4)];
};

export const getCardsSum = (cards: CardType[], last: number = cards.length) => {
  let sum = 0;
  let sumWithAces = 0;
  const aces: string[] = [];
  const tempCards: CardType[] = cards.slice(0, last);
  tempCards.forEach((card) => {
    if (typeof card[0] === "string") {
      if (card[0] === "A") {
        aces.push(card[0]);
      } else {
        sum += 10;
      }
    } else {
      sum += card[0] as number;
    }
  });
  sumWithAces += sum;
  aces.forEach(() => {
    if (sum >= 11) {
      sum += 1;
    } else {
      sum += 11;
    }
    sumWithAces += 11;
  });

  return [sum, sumWithAces];
};
