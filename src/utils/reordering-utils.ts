import type { Card } from '@/types/card';
import type { DragResult } from '@/types/dnd';

type BaseReorderArgs = {
    allCards: Card[];
    sourceIndex: number;
    destinationIndex: number;
};

type SameColumnReorderArgs = BaseReorderArgs & {
    columnId: string;
};

type CrossColumnReorderArgs = BaseReorderArgs & {
    sourceColumnId: string;
    destinationColumnId: string;
};

const updateCardsOrder = (cards: Card[]): Card[] =>
    cards.map((card, index) => ({
        ...card,
        order: index + 1,
    }));

const reorderSameColumn = ({ allCards, columnId, sourceIndex, destinationIndex }: SameColumnReorderArgs): Card[] => {
    const columnCards = allCards.filter((card) => card.columnId === columnId).sort((a, b) => a.order - b.order);

    const [movedCard] = columnCards.splice(sourceIndex, 1);
    if (!movedCard) {
        throw new Error('Card not found at source index');
    }

    columnCards.splice(destinationIndex, 0, movedCard);
    const updatedColumnCards = updateCardsOrder(columnCards);

    return allCards.map((card) =>
        card.columnId === columnId ? (updatedColumnCards.find((updated) => updated.id === card.id) ?? card) : card,
    );
};

const reorderBetweenColumns = ({
    allCards,
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex,
}: CrossColumnReorderArgs): Card[] => {
    const sourceCards = allCards.filter((card) => card.columnId === sourceColumnId).sort((a, b) => a.order - b.order);

    const destinationCards = allCards
        .filter((card) => card.columnId === destinationColumnId)
        .sort((a, b) => a.order - b.order);

    const [movedCard] = sourceCards.splice(sourceIndex, 1);
    if (!movedCard) {
        throw new Error('Card not found at source index');
    }

    const updatedMovedCard: Card = {
        ...movedCard,
        columnId: destinationColumnId,
        order: destinationIndex + 1,
    };

    const updatedDestinationCards = [
        ...destinationCards.slice(0, destinationIndex),
        updatedMovedCard,
        ...destinationCards.slice(destinationIndex),
    ];

    const updatedSourceCards = updateCardsOrder(sourceCards);
    const updatedDestCards = updateCardsOrder(updatedDestinationCards);

    return allCards.map((card) => {
        if (card.id === movedCard.id) {
            return updatedMovedCard;
        }
        if (card.columnId === sourceColumnId) {
            return updatedSourceCards.find((updated) => updated.id === card.id) ?? card;
        }
        if (card.columnId === destinationColumnId) {
            return updatedDestCards.find((updated) => updated.id === card.id) ?? card;
        }
        return card;
    });
};

export const reorderCards = (
    allCards: Card[],
    { sourceColumnId, sourceIndex, destinationColumnId, destinationIndex }: DragResult,
): Card[] => {
    if (sourceColumnId === destinationColumnId) {
        return reorderSameColumn({
            allCards,
            columnId: sourceColumnId,
            sourceIndex,
            destinationIndex,
        });
    }

    return reorderBetweenColumns({
        allCards,
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
    });
};
