import { type DropResult } from '@hello-pangea/dnd';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useCards } from '@/hooks/use-cards';
import { reorderCards } from '@/utils/reordering-utils';
import type { DragResult } from '@/types/dnd';

export const useDragAndDrop = () => {
    const {
        state: { cards },
        updateCard,
    } = useCards();

    const handleDragEnd = useCallback(
        async (dropResult: DropResult) => {
            if (!dropResult.destination) return;

            const dragResult: DragResult = {
                sourceColumnId: dropResult.source.droppableId,
                sourceIndex: dropResult.source.index,
                destinationColumnId: dropResult.destination.droppableId,
                destinationIndex: dropResult.destination.index,
                draggedCardId: dropResult.draggableId,
            };

            try {
                const reorderedCards = reorderCards(
                    cards,
                    dragResult.sourceColumnId,
                    dragResult.sourceIndex,
                    dragResult.destinationColumnId,
                    dragResult.destinationIndex,
                );

                const updatedCard = reorderedCards.find((card) => card.id === dragResult.draggedCardId);
                if (!updatedCard) {
                    throw new Error('Failed to find updated card');
                }

                await updateCard(dragResult.draggedCardId, updatedCard);
            } catch (error) {
                toast.error('Failed to move card');
            }
        },
        [cards, updateCard],
    );

    return { handleDragEnd };
};
