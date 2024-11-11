import type { Card } from '@/types/card';

export const getSortedColumnCards = (cards: Card[], columnId: string): Card[] =>
    cards
        .filter((columnCard) => columnCard.columnId === columnId)
        .sort((firstCard, secondCard) => firstCard.order - secondCard.order);
