import type { Card } from '@/types/card';
import type { DragResult } from '@/types/dnd';

export const reorderCards = (
    allCards: Card[],
    { sourceColumnId, sourceIndex, destinationColumnId, destinationIndex }: DragResult,
): Card[] => {
    // Handle same column reordering
    if (sourceColumnId === destinationColumnId) {
        const columnCards = allCards
            .filter((card) => card.columnId === sourceColumnId)
            .sort((a, b) => a.order - b.order);

        const [movedCard] = columnCards.splice(sourceIndex, 1);
        if (!movedCard) {
            throw new Error('Card not found at source index');
        }

        columnCards.splice(destinationIndex, 0, movedCard);

        const updatedColumnCards = columnCards.map((card, index) => ({
            ...card,
            order: index + 1,
        }));

        return allCards.map((card) =>
            card.columnId === sourceColumnId
                ? (updatedColumnCards.find((updated) => updated.id === card.id) ?? card)
                : card,
        );
    }

    // Handle cross-column reordering
    const sourceCards = allCards.filter((card) => card.columnId === sourceColumnId).sort((a, b) => a.order - b.order);

    const destinationCards = allCards
        .filter((card) => card.columnId === destinationColumnId)
        .sort((a, b) => a.order - b.order);

    // Remove card from source
    const [movedCard] = sourceCards.splice(sourceIndex, 1);
    if (!movedCard) {
        throw new Error('Card not found at source index');
    }

    // Create updated card with new columnId and initial order
    const updatedMovedCard: Card = {
        ...movedCard,
        columnId: destinationColumnId,
        order: destinationIndex + 1, // Set initial order based on destination
    };

    // Insert into destination and update all orders
    const updatedDestinationCards = [
        ...destinationCards.slice(0, destinationIndex),
        updatedMovedCard,
        ...destinationCards.slice(destinationIndex),
    ].map((card, index) => ({
        ...card,
        order: index + 1,
    }));

    // Update orders in source column
    const updatedSourceCards = sourceCards.map((card, index) => ({
        ...card,
        order: index + 1,
    }));

    // Return updated cards array
    return allCards.map((card) => {
        if (card.id === movedCard.id) {
            return updatedMovedCard;
        }
        if (card.columnId === sourceColumnId) {
            return updatedSourceCards.find((updated) => updated.id === card.id) ?? card;
        }
        if (card.columnId === destinationColumnId) {
            return updatedDestinationCards.find((updated) => updated.id === card.id) ?? card;
        }
        return card;
    });
};
