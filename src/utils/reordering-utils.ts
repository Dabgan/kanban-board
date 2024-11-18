import type { Card } from '@/types/card';
import type { Column } from '@/types/column';
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

const updateColumnsOrder = (columns: Column[]): Column[] =>
    columns.map((column, index) => ({
        ...column,
        order: index + 1,
    }));

export const reorderColumns = (allColumns: Column[], sourceIndex: number, destinationIndex: number): Column[] => {
    const reorderedColumns = [...allColumns];
    const [movedColumn] = reorderedColumns.splice(sourceIndex, 1);

    if (!movedColumn) {
        throw new Error('Column not found at source index');
    }

    reorderedColumns.splice(destinationIndex, 0, movedColumn);
    return updateColumnsOrder(reorderedColumns);
};

export const reorderCards = (allCards: Card[], dragResult: DragResult): Card[] => {
    if (dragResult.sourceColumnId === dragResult.destinationColumnId) {
        return reorderSameColumn({
            allCards,
            columnId: dragResult.sourceColumnId,
            sourceIndex: dragResult.sourceIndex,
            destinationIndex: dragResult.destinationIndex,
        });
    }

    return reorderBetweenColumns({
        allCards,
        sourceColumnId: dragResult.sourceColumnId,
        destinationColumnId: dragResult.destinationColumnId,
        sourceIndex: dragResult.sourceIndex,
        destinationIndex: dragResult.destinationIndex,
    });
};
