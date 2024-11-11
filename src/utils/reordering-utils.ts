import type { Card } from '@/types/card';

import { getSortedColumnCards } from './get-sorted-column-cards';

export const reorderCards = (
    cards: Card[],
    sourceColumnId: string,
    sourceIndex: number,
    destinationColumnId: string,
    destinationIndex: number,
): Card[] => {
    const sourceCards = getSortedColumnCards(cards, sourceColumnId);
    const destinationCards =
        sourceColumnId === destinationColumnId ? sourceCards : getSortedColumnCards(cards, destinationColumnId);

    const movedCard = sourceCards[sourceIndex];
    if (!movedCard) {
        throw new Error('Card not found at source index');
    }

    sourceCards.splice(sourceIndex, 1);

    const updatedMovedCard: Card = {
        ...movedCard,
        columnId: destinationColumnId,
    };

    destinationCards.splice(destinationIndex, 0, updatedMovedCard);

    return cards.map((card) => {
        if (card.columnId !== sourceColumnId && card.columnId !== destinationColumnId) {
            return card;
        }

        const columnCards = card.columnId === sourceColumnId ? sourceCards : destinationCards;
        const cardIndex = columnCards.findIndex((columnCard) => columnCard.id === card.id);

        return {
            ...card,
            order: cardIndex + 1,
        };
    });
};
